import { getValidAuthToken, getCurrentUserId } from "@/lib/auth";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/$/, "") ?? "/api";

async function authFetch(path: string, options: RequestInit = {}) {
  const token = getValidAuthToken();
  const headers = new Headers(options.headers);
  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }
  if (!headers.has("Content-Type") && !(options.body instanceof FormData)) {
    headers.set("Content-Type", "application/json");
  }

  const res = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers,
    cache: "no-store",
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.message ?? data.error ?? "API request failed");
  }
  return data;
}

// ─── Types ────────────────────────────────────────────────────────────────────

export interface Conversation {
  _id: string;
  participant1ID: { _id: string; fullName: string; avatarUrl?: string } | string;
  participant2ID: { _id: string; fullName: string; avatarUrl?: string } | string;
  createdAt: string;
  updatedAt: string;
}

export interface Message {
  _id: string;
  conversationID: string;
  senderID: { _id: string; fullName: string; avatarUrl?: string } | string;
  content: string;
  sentTime: string;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** Get the "other" participant from a conversation */
export function getOtherParticipant(conv: Conversation): {
  _id: string;
  fullName: string;
  avatarUrl?: string;
} {
  const myId = getCurrentUserId();
  const p1 = conv.participant1ID;
  const p2 = conv.participant2ID;

  const p1Id = typeof p1 === "string" ? p1 : p1._id;
  const p2Id = typeof p2 === "string" ? p2 : p2._id;

  if (p1Id === myId) {
    return typeof p2 === "string"
      ? { _id: p2, fullName: "User" }
      : p2;
  }
  return typeof p1 === "string"
    ? { _id: p1, fullName: "User" }
    : p1;
}

/** Check if a message was sent by the current user */
export function isOwnMessage(msg: Message): boolean {
  const myId = getCurrentUserId();
  const senderId = typeof msg.senderID === "string" ? msg.senderID : msg.senderID._id;
  return senderId === myId;
}

// ─── API calls ────────────────────────────────────────────────────────────────

/** Create or get existing conversation with another user */
export async function createConversation(participantID: string): Promise<Conversation> {
  const res = await authFetch("/conversation/create", {
    method: "POST",
    body: JSON.stringify({ participantID }),
  });
  return res.data ?? res;
}

/** Get all conversations for the current user */
export async function getConversations(): Promise<Conversation[]> {
  const res = await authFetch("/conversation/list");
  return res.data ?? res ?? [];
}

/** Get messages for a conversation */
export async function getMessages(
  conversationID: string,
  page = 1,
  limit = 50
): Promise<{ messages: Message[]; total: number }> {
  const res = await authFetch(
    `/message/${conversationID}?page=${page}&limit=${limit}`
  );
  const data = res.data ?? res;
  return {
    messages: data.messages ?? [],
    total: data.total ?? 0,
  };
}

/** Send a message via REST (fallback if socket is down) */
export async function sendMessageRest(
  conversationID: string,
  content: string
): Promise<Message> {
  const res = await authFetch("/message/send", {
    method: "POST",
    body: JSON.stringify({ conversationID, content }),
  });
  return res.data ?? res;
}
