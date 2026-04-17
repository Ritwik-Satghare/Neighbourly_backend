"use client";

import Link from "next/link";

const getAvatar = (id: number) =>
  `https://i.pravatar.cc/150?img=${id}`;

export default function Navbar() {
  return (
    <header className="bg-green-700 text-white px-8 py-3 flex items-center justify-between shadow-md">
      {/* Logo */}
      <Link href="/" className="font-bold text-lg">
        Neighbourly
      </Link>

      {/* Nav Links */}
      <nav className="flex gap-8 text-sm">
        <Link href="/" className="hover:underline">
          Marketplace
        </Link>
        <Link href="/community" className="hover:underline">
          Community
        </Link>
        <Link href="/messages" className="hover:underline">
          Messages
        </Link>
      </nav>

      {/* Right Side */}
      <div className="flex items-center gap-4">
        <span className="cursor-pointer">🔔</span>
        <span className="cursor-pointer">💬</span>
        <img
          src={getAvatar(2)}
          className="w-8 h-8 rounded-full border-2 border-white"
          alt="user"
        />
      </div>
    </header>
  );
}