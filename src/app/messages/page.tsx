// "use client";

// import React from "react";

// const Messages = () => {
//   const chats = [1, 2, 3];

//   return (
//     <div className="h-screen bg-gradient-to-b from-[#7F86EC] to-[#9CA5E8] relative overflow-hidden flex flex-col justify-center font-sans">

//       <div className="absolute w-[380px] h-[380px] bg-[#5F6EE5] rounded-full bottom-[-140px] left-[-140px] opacity-50" />

//       <div className="absolute w-[420px] h-[300px] bg-[#C6CEF5] rounded-[60%_40%_60%_40%] top-[-100px] right-[-100px] opacity-70" />

//       <div className="max-w-[950px] mx-auto w-full px-5">

//         <div className="bg-[#ECECEC] rounded-[30px] px-6 py-3 flex justify-between items-center mb-6">
//           <h3 className="font-semibold">PROXIMI</h3>

//           <div className="flex gap-6 items-center text-sm">
//             <span>How it works</span>
//             <span>List Your Item</span>
//             <span>Messages</span>
//             <span>🔔</span>

//             <img
//               src="https://i.pravatar.cc/40"
//               className="rounded-full"
//               alt="profile"
//             />
//           </div>
//         </div>

//         <div className="bg-white/60 rounded-[20px] p-6 backdrop-blur-md">

//           <div className="border border-[#8E8CFF] rounded-[16px] flex h-[420px] overflow-hidden">

//             <div className="w-[35%] border-r border-[#8E8CFF] p-4">

//               <h3 className="mb-3 font-medium">Messages</h3>

//               <input
//                 placeholder="Search"
//                 className="w-full px-3 py-2 rounded-full border border-gray-300 text-sm mb-4 outline-none"
//               />

//               {chats.map((_, i) => (
//                 <div
//                   key={i}
//                   className="flex gap-3 p-3 border border-[#8E8CFF] rounded-[10px] mb-3 cursor-pointer hover:bg-white/60"
//                 >
//                   <img
//                     src="https://i.pravatar.cc/40"
//                     className="rounded-full"
//                   />

//                   <div>
//                     <p className="font-semibold text-sm">XYZ</p>
//                     <p className="text-xs text-gray-500">
//                       Hello! we are accepting your offer
//                     </p>
//                   </div>
//                 </div>
//               ))}
//             </div>

//             <div className="flex-1 relative p-4">

//               <div className="flex items-center gap-3 border-b border-[#8E8CFF] pb-3 mb-2">
//                 <img
//                   src="https://i.pravatar.cc/40"
//                   className="rounded-full"
//                 />

//                 <div>
//                   <p className="font-semibold text-sm">XYZ</p>
//                   <p className="text-xs text-green-500">Active now</p>
//                 </div>
//               </div>

//               <div className="absolute bottom-4 left-4 right-4 flex items-center bg-[#F3F3F3] rounded-full px-4 py-2">
//                 <input
//                   placeholder="Type a message"
//                   className="flex-1 bg-transparent outline-none text-sm"
//                 />

//                 <span className="cursor-pointer text-lg">➤</span>
//               </div>

//             </div>
//           </div>

//         </div>
//       </div>
//     </div>
//   );
// };

// export default Messages;

"use client";

import { useState } from "react";
import Navbar from "../../components/Navbar";

/* Helpers */
const getAvatar = (id: number) =>
  `https://i.pravatar.cc/150?img=${id}`;

const getImage = (seed: string) =>
  `https://picsum.photos/seed/${seed}/200/150`;

type Message = {
  text: string;
  sender: "me" | "other";
};

export default function MessagesPage() {
  const users = [
    { id: 1, name: "Elena Vance", avatar: 5 },
    { id: 2, name: "Marcus Thorne", avatar: 12 },
    { id: 3, name: "Sarah Jenks", avatar: 8 },
    { id: 4, name: "David Chen", avatar: 15 },
  ];

  /* 🔥 Messages per user */
  const [chats, setChats] = useState<Record<number, Message[]>>({
    1: [
      { text: "Hi there! Is it still available?", sender: "other" },
      { text: "Yes, it's available and ready.", sender: "me" },
    ],
    2: [{ text: "Thanks for the ladder!", sender: "other" }],
    3: [{ text: "Projector available?", sender: "other" }],
    4: [{ text: "Dropping off drill.", sender: "other" }],
  });

  const [activeUser, setActiveUser] = useState(users[0]);
  const [input, setInput] = useState("");

  /* Send message */
  const handleSend = () => {
    if (!input.trim()) return;

    setChats((prev) => ({
      ...prev,
      [activeUser.id]: [
        ...(prev[activeUser.id] || []),
        { text: input, sender: "me" },
      ],
    }));

    setInput("");
  };

  return (
    <div className="h-screen flex flex-col bg-[#f9fafb]">
      <Navbar />

      {/* 🔥 MAIN */}
      <div className="flex flex-1 overflow-hidden">
        {/* ✅ SIDEBAR */}
        <aside className="w-80 bg-white p-4 flex flex-col">
          <h2 className="text-lg font-semibold mb-4">Inbox</h2>

          <input
            placeholder="Search..."
            className="p-2 border rounded-lg mb-4"
          />

          <div className="space-y-2 overflow-y-auto">
            {users.map((user) => (
              <div
                key={user.id}
                onClick={() => setActiveUser(user)}
                className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition ${
                  activeUser.id === user.id
                    ? "bg-green-50"
                    : "hover:bg-gray-100"
                }`}
              >
                <img
                  src={getAvatar(user.avatar)}
                  className="w-10 h-10 rounded-full"
                />
                <p className="font-medium text-sm">
                  {user.name}
                </p>
              </div>
            ))}
          </div>
        </aside>

        {/* ✅ CHAT AREA */}
        <main className="flex-1 flex flex-col bg-[#f6f7f9]">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 bg-white shadow-sm">
            <div className="flex items-center gap-3">
              <img
                src={getAvatar(activeUser.avatar)}
                className="w-10 h-10 rounded-full"
              />
              <div>
                <p className="font-medium">
                  {activeUser.name}
                </p>
                <p className="text-xs text-green-600">
                  ● Verified Neighbour
                </p>
              </div>
            </div>

            <span className="text-gray-500">📞</span>
          </div>

          {/* Messages */}
          <div className="flex-1 p-6 overflow-y-auto space-y-4">
            {/* Product Card (only for first user demo) */}
            {activeUser.id === 1 && (
              <div className="bg-white p-4 rounded-xl shadow-sm flex gap-4 w-fit">
                <img
                  src={getImage("mower")}
                  className="w-24 h-16 rounded-lg object-cover"
                />
                <div>
                  <p className="font-medium">
                    Pro-Grade Electric Mower
                  </p>
                  <p className="text-sm text-gray-500">
                    $25/day
                  </p>
                </div>
              </div>
            )}

            {/* Chat Messages */}
            {(chats[activeUser.id] || []).map((msg, i) => (
              <div
                key={i}
                className={`max-w-xs px-4 py-2 rounded-2xl text-sm ${
                  msg.sender === "me"
                    ? "bg-green-700 text-white ml-auto"
                    : "bg-gray-200 text-gray-700"
                }`}
              >
                {msg.text}
              </div>
            ))}

            {/* Offer Box */}
            {activeUser.id === 1 && (
              <div className="bg-green-50 border border-green-200 p-4 rounded-xl w-fit">
                <p className="text-green-700 font-medium">
                  Bargain Corner
                </p>
                <p className="text-2xl font-bold text-green-700">
                  $22.00
                </p>
                <div className="flex gap-2 mt-2">
                  <button className="border px-3 py-1 rounded">
                    Counter
                  </button>
                  <button className="bg-green-700 text-white px-3 py-1 rounded">
                    Accept
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Input */}
          <div className="p-4 bg-white flex gap-3 shadow-inner">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) =>
                e.key === "Enter" && handleSend()
              }
              placeholder="Type your message..."
              className="flex-1 p-3 border rounded-full"
            />

            <button
              onClick={handleSend}
              className="bg-green-700 text-white px-5 rounded-full"
            >
              ➤
            </button>
          </div>
        </main>
      </div>
    </div>
  );
}