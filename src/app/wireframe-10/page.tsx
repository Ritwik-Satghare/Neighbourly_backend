// app/messages/page.tsx
"use client";

import { useState } from "react";
import PageHeader from "../../components/pageHeader";
import { FiChevronLeft, FiCamera } from "react-icons/fi";

interface Message {
  id: number;
  sender: string;
  avatar?: string;
  preview: string;
  time: string;
  hasTitle?: boolean;
  title?: string;
}

const mockMessages: Message[] = [
  {
    id: 1,
    sender: "XYZ",
    preview: "Capture item condition before pickup",
    time: "Today",
    hasTitle: true,
    title: "Before Photos Needed",
  },
  {
    id: 2,
    sender: "XYZ",
    preview: "Hello! we are accepting your offer",
    time: "Today",
    hasTitle: false,
  },
  {
    id: 3,
    sender: "XYZ",
    preview: "Capture item condition before pickup",
    time: "Today",
    hasTitle: true,
    title: "Before Photos Needed",
  },
  {
    id: 4,
    sender: "XYZ",
    preview: "Capture item condition before pickup",
    time: "Today",
    hasTitle: true,
    title: "Before Photos Needed",
  },
];

export default function MessagesPage() {
  const [search, setSearch] = useState("");

  const filtered = mockMessages.filter(
    (m) =>
      m.sender.toLowerCase().includes(search.toLowerCase()) ||
      m.preview.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(180deg, #7F86EC, #9CA5E8)",
        position: "relative",
        fontFamily: "Arial",
      }}
    >
      {/* Background blobs — desktop only */}
      <div
        className="hidden md:block"
        style={{
          position: "fixed",
          width: "380px",
          height: "380px",
          background: "#5F6EE5",
          borderRadius: "50%",
          bottom: "-140px",
          left: "-140px",
          opacity: 0.5,
          pointerEvents: "none",
          zIndex: 0,
        }}
      />
      <div
        className="hidden md:block"
        style={{
          position: "fixed",
          width: "420px",
          height: "300px",
          background: "#C6CEF5",
          borderRadius: "60% 40% 60% 40%",
          top: "-100px",
          right: "-100px",
          opacity: 0.7,
          pointerEvents: "none",
          zIndex: 0,
        }}
      />

      {/* ── DESKTOP ── */}
      <div className="hidden md:block">
        {/* Sticky header */}
        <div
          style={{
            position: "sticky",
            top: 0,
            zIndex: 50,
            // WebkitBackdropFilter: "blur(16px)",
            // background: "rgba(127, 134, 236, 0.55)",
          }}
        >
          <PageHeader />
        </div>

        {/* Desktop content */}
        <main className="relative z-10 max-w-6xl mx-auto px-6 py-10 flex gap-6 items-start">
          {/* Left: logout dropdown */}
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden w-48 flex-shrink-0">
            <button className="w-full text-left px-6 py-4 text-base font-semibold text-gray-800 border-b border-gray-100 hover:bg-gray-50 transition-colors">
              Log out
            </button>
            <button className="w-full text-left px-6 py-4 text-base font-semibold text-gray-800 hover:bg-gray-50 transition-colors">
              Sign out
            </button>
          </div>

          {/* Right: notifications panel */}
          <div className="flex-1 bg-white/60 backdrop-blur-md rounded-3xl border border-white/70 shadow-xl p-4 flex flex-col gap-3">
            {filtered.map((msg) => (
              <div
                key={msg.id}
                className="flex items-center gap-4 bg-white/80 rounded-2xl border border-indigo-100 px-4 py-3 hover:shadow-md transition-shadow cursor-pointer"
              >
                {/* Camera icon avatar */}
                <div className="w-12 h-12 rounded-xl bg-indigo-50 flex items-center justify-center flex-shrink-0">
                  <FiCamera className="text-indigo-400 text-xl" />
                </div>

                <div className="flex flex-col min-w-0">
                  <span className="text-xs text-gray-400 font-medium mb-0.5">
                    {msg.time}
                  </span>
                  {msg.hasTitle && (
                    <p className="font-bold text-gray-900 text-sm leading-tight">
                      {msg.title}
                    </p>
                  )}
                  <p className="text-sm text-gray-500 line-clamp-1">
                    {msg.preview}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>

      {/* ── MOBILE ── */}
      <div className="flex flex-col min-h-screen md:hidden">
        {/* Sticky top header */}
        <div
          className="sticky top-0 z-50 rounded-b-[28px] px-[18px] pt-[28px] pb-6 shadow-lg"
          style={{
            background: "linear-gradient(160deg,#7F86EC 0%,#9CA5E8 100%)",
          }}
        >
          <div className="flex items-center justify-center relative">
            <button className="absolute left-0 text-white">
              <FiChevronLeft className="text-[22px]" />
            </button>
            <h1 className="text-white font-bold text-[18px]">Messages</h1>
          </div>
        </div>

        {/* Scrollable content */}
        <div
          className="flex-1 overflow-y-auto pb-6"
          style={{ background: "#F4F5FF" }}
        >
          {/* Outer bordered container */}
          <div className="mx-3 mt-4 rounded-2xl border-2 border-indigo-200 overflow-hidden bg-white">
            {/* Search */}
            <div className="px-4 py-3 border-b-2 border-indigo-200">
              <div className="bg-gray-100 rounded-full px-4 py-2">
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search"
                  className="w-full bg-transparent outline-none text-sm text-gray-500 text-center placeholder:text-gray-400"
                />
              </div>
            </div>

            {/* Message rows */}
            {filtered.map((msg, i) => (
              <div
                key={msg.id}
                className={`flex items-center gap-3 px-4 py-4 cursor-pointer active:bg-gray-100 transition-colors ${
                  i < filtered.length - 1 ? "border-b border-indigo-100" : ""
                } ${i === 0 ? "bg-gray-50" : "bg-gray-50"}`}
              >
                {/* Avatar — only show on first */}
                {i === 0 ? (
                  <div className="w-11 h-11 rounded-full overflow-hidden flex-shrink-0 bg-green-200 flex items-center justify-center">
                    <span className="text-2xl">🐑</span>
                  </div>
                ) : (
                  <div className="w-11 h-11 flex-shrink-0" />
                )}

                <div className="flex flex-col min-w-0">
                  {i === 0 && (
                    <p className="font-extrabold text-gray-900 text-[15px]">
                      {msg.sender}
                    </p>
                  )}
                  <p className="text-sm text-gray-500 leading-snug">
                    {msg.preview}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}