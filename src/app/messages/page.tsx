"use client";

import React from "react";

const Messages = () => {
  const chats = [1, 2, 3];

  return (
    <div className="h-screen bg-gradient-to-b from-[#7F86EC] to-[#9CA5E8] relative overflow-hidden flex flex-col justify-center font-sans">

      <div className="absolute w-[380px] h-[380px] bg-[#5F6EE5] rounded-full bottom-[-140px] left-[-140px] opacity-50" />

      <div className="absolute w-[420px] h-[300px] bg-[#C6CEF5] rounded-[60%_40%_60%_40%] top-[-100px] right-[-100px] opacity-70" />

      <div className="max-w-[950px] mx-auto w-full px-5">

        <div className="bg-[#ECECEC] rounded-[30px] px-6 py-3 flex justify-between items-center mb-6">
          <h3 className="font-semibold">PROXIMI</h3>

          <div className="flex gap-6 items-center text-sm">
            <span>How it works</span>
            <span>List Your Item</span>
            <span>Messages</span>
            <span>🔔</span>

            <img
              src="https://i.pravatar.cc/40"
              className="rounded-full"
              alt="profile"
            />
          </div>
        </div>

        <div className="bg-white/60 rounded-[20px] p-6 backdrop-blur-md">

          <div className="border border-[#8E8CFF] rounded-[16px] flex h-[420px] overflow-hidden">

            <div className="w-[35%] border-r border-[#8E8CFF] p-4">

              <h3 className="mb-3 font-medium">Messages</h3>

              <input
                placeholder="Search"
                className="w-full px-3 py-2 rounded-full border border-gray-300 text-sm mb-4 outline-none"
              />

              {chats.map((_, i) => (
                <div
                  key={i}
                  className="flex gap-3 p-3 border border-[#8E8CFF] rounded-[10px] mb-3 cursor-pointer hover:bg-white/60"
                >
                  <img
                    src="https://i.pravatar.cc/40"
                    className="rounded-full"
                  />

                  <div>
                    <p className="font-semibold text-sm">XYZ</p>
                    <p className="text-xs text-gray-500">
                      Hello! we are accepting your offer
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex-1 relative p-4">

              <div className="flex items-center gap-3 border-b border-[#8E8CFF] pb-3 mb-2">
                <img
                  src="https://i.pravatar.cc/40"
                  className="rounded-full"
                />

                <div>
                  <p className="font-semibold text-sm">XYZ</p>
                  <p className="text-xs text-green-500">Active now</p>
                </div>
              </div>

              <div className="absolute bottom-4 left-4 right-4 flex items-center bg-[#F3F3F3] rounded-full px-4 py-2">
                <input
                  placeholder="Type a message"
                  className="flex-1 bg-transparent outline-none text-sm"
                />

                <span className="cursor-pointer text-lg">➤</span>
              </div>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Messages;