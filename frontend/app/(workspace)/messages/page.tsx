"use client";

import { useEffect, useState, useRef, useCallback, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/page-header";
import { getCurrentUserId, getValidAuthToken } from "@/lib/auth";
import { connectSocket, disconnectSocket } from "@/lib/socket";
import {
  getConversations,
  getMessages,
  createConversation,
  getOtherParticipant,
  isOwnMessage,
  type Conversation,
  type Message,
} from "@/services/chat";

export default function MessagesPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-ink-soft">Loading messages...</div>}>
      <MessagesContent />
    </Suspense>
  );
}

function MessagesContent() {
  const searchParams = useSearchParams();
  const openWithUser = searchParams.get("userId");

  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConv, setActiveConv] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [draft, setDraft] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [typingUser, setTypingUser] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const typingTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const currentUserId = getCurrentUserId();

  // ── Scroll to bottom ────────────────────────────────────────────────
  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  // ── Load conversations ──────────────────────────────────────────────
  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const convs = await getConversations();
        if (cancelled) return;
        setConversations(convs);

        // If deeplinked with ?userId=..., auto-open/create that conversation
        if (openWithUser && currentUserId && openWithUser !== currentUserId) {
          const existing = convs.find((c) => {
            const p1Id =
              typeof c.participant1ID === "string"
                ? c.participant1ID
                : c.participant1ID._id;
            const p2Id =
              typeof c.participant2ID === "string"
                ? c.participant2ID
                : c.participant2ID._id;
            return (
              (p1Id === openWithUser && p2Id === currentUserId) ||
              (p2Id === openWithUser && p1Id === currentUserId)
            );
          });

          if (existing) {
            setActiveConv(existing);
          } else {
            try {
              const newConv = await createConversation(openWithUser);
              if (!cancelled) {
                setConversations((prev) => [newConv, ...prev]);
                setActiveConv(newConv);
              }
            } catch (err) {
              console.error("Failed to create conversation:", err);
            }
          }
        } else if (convs.length > 0 && !activeConv) {
          setActiveConv(convs[0]);
        }
      } catch (err) {
        console.error("Failed to load conversations:", err);
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Load messages when active conversation changes ──────────────────
  useEffect(() => {
    if (!activeConv) {
      setMessages([]);
      return;
    }

    let cancelled = false;

    async function loadMessages() {
      try {
        const result = await getMessages(activeConv!._id);
        if (!cancelled) {
          setMessages(result.messages);
        }
      } catch (err) {
        console.error("Failed to load messages:", err);
      }
    }

    loadMessages();
    return () => {
      cancelled = true;
    };
  }, [activeConv]);

  // ── Socket.io real-time ─────────────────────────────────────────────
  useEffect(() => {
    if (!activeConv || !currentUserId) return;

    const socket = connectSocket();

    // Join the conversation room
    socket.emit("joinConversation", activeConv._id);

    // Listen for incoming messages
    const handleReceive = (msg: any) => {
      setMessages((prev) => {
        // Deduplicate
        if (prev.some((m) => m._id === msg._id)) return prev;
        return [...prev, msg];
      });
      setTypingUser(null);
    };

    // Listen for typing
    const handleTyping = (data: { userID: string }) => {
      if (data.userID !== currentUserId) {
        setTypingUser(data.userID);
        // Clear after 2 seconds
        if (typingTimeout.current) clearTimeout(typingTimeout.current);
        typingTimeout.current = setTimeout(() => setTypingUser(null), 2000);
      }
    };

    socket.on("receiveMessage", handleReceive);
    socket.on("typing", handleTyping);

    return () => {
      socket.off("receiveMessage", handleReceive);
      socket.off("typing", handleTyping);
      if (typingTimeout.current) clearTimeout(typingTimeout.current);
    };
  }, [activeConv, currentUserId]);

  // ── Cleanup socket on unmount ───────────────────────────────────────
  useEffect(() => {
    return () => disconnectSocket();
  }, []);

  // ── Send message ────────────────────────────────────────────────────
  const handleSend = async () => {
    if (!draft.trim() || !activeConv || !currentUserId) return;

    const content = draft.trim();
    setDraft("");
    setIsSending(true);

    try {
      const socket = connectSocket();
      socket.emit("sendMessage", {
        conversationID: activeConv._id,
        senderID: currentUserId,
        content,
      });
    } catch (err) {
      console.error("Failed to send message:", err);
      setDraft(content); // Restore draft on failure
    } finally {
      setIsSending(false);
      inputRef.current?.focus();
    }
  };

  // ── Typing indicator ───────────────────────────────────────────────
  const handleInputChange = (value: string) => {
    setDraft(value);
    if (activeConv && currentUserId) {
      const socket = connectSocket();
      socket.emit("typing", {
        conversationID: activeConv._id,
        userID: currentUserId,
      });
    }
  };

  // ── Helper: format time ────────────────────────────────────────────
  const formatTime = (dateStr: string) => {
    try {
      return new Date(dateStr).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return "";
    }
  };

  // ── Helper: get initials ───────────────────────────────────────────
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };


  if (!getValidAuthToken()) {
    return (
      <div className="grid gap-8">
        <PageHeader
          eyebrow="Messages"
          title="Real-time Chat"
          description="Sign in to start messaging."
        />
        <div className="rounded-[2rem] bg-surface-card p-12 text-center shadow-ambient">
          <p className="text-ink-soft">Please log in to access messages.</p>
          <Button className="mt-4" href="/login">
            Sign In
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="grid gap-6">
      <PageHeader
        eyebrow="Inbox"
        title="Messages"
        description="Chat with neighbors about rentals in real-time."
      />

      <div className="grid overflow-hidden rounded-[2rem] bg-surface-card shadow-ambient lg:grid-cols-[340px_1fr] min-h-[600px]">
        {/* ── Conversation sidebar ──────────────────────────────── */}
        <section className="border-b border-outline/20 lg:border-b-0 lg:border-r overflow-y-auto max-h-[700px]">
          {/* Header */}
          <div className="sticky top-0 z-10 bg-surface-card border-b border-outline/10 p-4 flex items-center justify-between">
            <h3 className="font-headline text-sm font-bold text-ink-strong uppercase tracking-widest">
              Conversations
            </h3>
          </div>

          {/* Conversation list */}
          <div className="p-2">
            {isLoading ? (
              <div className="p-6 text-center">
                <div className="inline-block h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                <p className="mt-2 text-sm text-ink-soft">Loading...</p>
              </div>
            ) : conversations.length === 0 ? (
              <div className="p-8 text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-surface-low">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="28"
                    height="28"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    className="text-ink-soft"
                  >
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                  </svg>
                </div>
                <p className="text-sm font-medium text-ink-soft">
                  No conversations yet
                </p>
                <p className="mt-1 text-xs text-ink-soft/70">
                  Request to rent an item to start chatting!
                </p>
              </div>
            ) : (
              conversations.map((conv) => {
                const other = getOtherParticipant(conv);
                const isActive = activeConv?._id === conv._id;

                return (
                  <button
                    key={conv._id}
                    onClick={() => setActiveConv(conv)}
                    className={`w-full text-left rounded-2xl p-4 mb-1 transition-all ${
                      isActive
                        ? "bg-primary/8 ring-1 ring-primary/20 shadow-sm"
                        : "hover:bg-surface-low"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      {/* Avatar */}
                      <div
                        className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-sm font-bold ${
                          isActive
                            ? "bg-primary text-white"
                            : "bg-surface-high text-ink-soft"
                        }`}
                      >
                        {getInitials(other.fullName)}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p
                          className={`font-semibold truncate ${
                            isActive ? "text-primary" : "text-ink-strong"
                          }`}
                        >
                          {other.fullName}
                        </p>
                        <p className="mt-0.5 text-xs text-ink-soft truncate">
                          {new Date(conv.updatedAt).toLocaleDateString([], {
                            month: "short",
                            day: "numeric",
                          })}
                        </p>
                      </div>
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </section>

        {/* ── Chat area ────────────────────────────────────────── */}
        <section className="flex flex-col min-h-0">
          {!activeConv ? (
            <div className="flex flex-1 items-center justify-center p-8">
              <div className="text-center">
                <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-surface-low">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="36"
                    height="36"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    className="text-primary/60"
                  >
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                  </svg>
                </div>
                <p className="text-lg font-semibold text-ink-strong">
                  Select a conversation
                </p>
                <p className="mt-1 text-sm text-ink-soft">
                  Choose a conversation from the sidebar to start chatting
                </p>
              </div>
            </div>
          ) : (
            <>
              {/* Chat header */}
              <div className="flex items-center gap-4 border-b border-outline/10 px-6 py-4 bg-surface-card">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-sm font-bold text-white">
                  {getInitials(getOtherParticipant(activeConv).fullName)}
                </div>
                <div>
                  <h2 className="font-headline text-lg font-bold text-ink-strong">
                    {getOtherParticipant(activeConv).fullName}
                  </h2>
                  {typingUser && (
                    <p className="text-xs text-primary animate-pulse">
                      typing...
                    </p>
                  )}
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto px-6 py-4 space-y-3 bg-gradient-to-b from-surface-low/30 to-transparent">
                {messages.length === 0 ? (
                  <div className="flex h-full items-center justify-center">
                    <div className="text-center">
                      <p className="text-sm text-ink-soft">
                        No messages yet — say hello! 👋
                      </p>
                    </div>
                  </div>
                ) : (
                  messages.map((msg) => {
                    const own = isOwnMessage(msg);
                    return (
                      <div
                        key={msg._id}
                        className={`flex ${own ? "justify-end" : "justify-start"}`}
                      >
                        <div
                          className={`max-w-[75%] rounded-2xl px-4 py-3 ${
                            own
                              ? "rounded-br-md bg-primary text-white"
                              : "rounded-bl-md bg-surface-card text-ink-strong shadow-sm"
                          }`}
                        >
                          <p className="text-sm leading-relaxed whitespace-pre-wrap">
                            {msg.content}
                          </p>
                          <p
                            className={`mt-1 text-[10px] ${
                              own ? "text-white/60" : "text-ink-soft/60"
                            }`}
                          >
                            {formatTime(msg.sentTime)}
                          </p>
                        </div>
                      </div>
                    );
                  })
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Input area */}
              <div className="border-t border-outline/10 bg-surface-card p-4">
                <div className="flex items-center gap-3">
                  <input
                    ref={inputRef}
                    className="flex-1 rounded-2xl border border-outline/20 bg-surface-low px-5 py-3 text-sm text-ink-strong placeholder:text-ink-soft/50 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/30 transition-all"
                    placeholder="Type a message..."
                    value={draft}
                    onChange={(e) => handleInputChange(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        handleSend();
                      }
                    }}
                    disabled={isSending}
                  />
                  <button
                    onClick={handleSend}
                    disabled={!draft.trim() || isSending}
                    className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary text-white shadow-md hover:bg-primary-container disabled:opacity-40 disabled:cursor-not-allowed transition-all hover:shadow-lg active:scale-95"
                    title="Send message"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <line x1="22" y1="2" x2="11" y2="13" />
                      <polygon points="22 2 15 22 11 13 2 9 22 2" />
                    </svg>
                  </button>
                </div>
              </div>
            </>
          )}
        </section>
      </div>
    </div>
  );
}
