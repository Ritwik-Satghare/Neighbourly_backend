// "use client";

// import React from "react";

// const AddListing = () => {
//   return (
//     <div className="h-screen bg-gradient-to-b from-[#7F86EC] to-[#9CA5E8] relative overflow-hidden flex flex-col justify-center font-sans">

//       <div className="absolute w-[380px] h-[380px] bg-[#5F6EE5] rounded-full bottom-[-140px] left-[-140px] opacity-50" />
//       <div className="absolute w-[420px] h-[300px] bg-[#C6CEF5] rounded-[60%_40%_60%_40%] top-[-100px] right-[-100px] opacity-70" />

//       <div className="max-w-[1000px] mx-auto w-full px-5">

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

//         <div className="bg-white/60 rounded-[20px] p-8 backdrop-blur-md">

//           <h2 className="text-center text-lg font-medium mb-6">
//             Add Listing
//           </h2>

//           <div className="flex gap-6">

//             <div className="w-[40%]">

//               <div className="bg-white rounded-[20px] p-6 shadow-md text-center mb-4">
//                 <div className="text-4xl mb-2">📷</div>
//                 <p className="font-semibold">Add photos of your item</p>
//                 <p className="text-xs text-gray-500">
//                   Upload 3–4 clear images
//                 </p>
//               </div>

//               <div className="grid grid-cols-3 gap-2">
//                 <div className="h-[80px] bg-white/70 rounded-md border" />
//                 <div className="h-[80px] bg-white/70 rounded-md border" />
//                 <div className="h-[80px] bg-white/70 rounded-md border" />
//               </div>

//             </div>

//             <div className="flex-1 bg-white rounded-[20px] p-6 shadow-md">

//               <div className="space-y-3">

//                 <div>
//                   <label className="text-sm">Item Name</label>
//                   <input
//                     placeholder="Enter item name"
//                     className="w-full mt-1 px-3 py-2 rounded-md border outline-none text-sm"
//                   />
//                 </div>

//                 <div>
//                   <label className="text-sm">Category</label>
//                   <input
//                     placeholder="Select a category"
//                     className="w-full mt-1 px-3 py-2 rounded-md border outline-none text-sm"
//                   />
//                 </div>

//                 <div>
//                   <label className="text-sm">Description</label>
//                   <textarea
//                     placeholder="Tell renters about condition, features, etc."
//                     className="w-full mt-1 px-3 py-2 rounded-md border outline-none text-sm h-[70px] resize-none"
//                   />
//                 </div>

//                 <div>
//                   <label className="text-sm">Enter amount</label>

//                   <div className="flex gap-2 mt-1">
//                     <select className="px-2 py-2 rounded-md border text-sm">
//                       <option>Price per day</option>
//                       <option>Price per week</option>
//                       <option>Price per month</option>
//                     </select>

//                     <input
//                       placeholder="Enter amount"
//                       className="flex-1 px-3 py-2 rounded-md border outline-none text-sm"
//                     />
//                   </div>

//                   <p className="text-xs text-gray-500 mt-1">
//                     This is the base price renters will see
//                   </p>
//                 </div>

//                 <div>
//                   <label className="text-sm">Location</label>
//                   <input
//                     placeholder="Enter pickup location"
//                     className="w-full mt-1 px-3 py-2 rounded-md border outline-none text-sm"
//                   />
//                 </div>

//                 <button className="w-full mt-4 py-2 rounded-full bg-gradient-to-r from-[#7F86EC] to-[#5F9EEB] text-white font-semibold">
//                   Add Listing
//                 </button>

//               </div>

//             </div>
//           </div>

//         </div>
//       </div>
//     </div>
//   );
// };

// export default AddListing;

"use client";

import { useState } from "react";

export default function ItemDetailsPage() {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [subCategory, setSubCategory] = useState("");
  const [description, setDescription] = useState("");

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-[#f3f4f6] p-6 flex flex-col justify-between">
        <div>
          <h2 className="text-green-700 font-semibold mb-6">Neighbourly</h2>

          <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
            <p className="text-sm text-gray-500">WELCOME BACK</p>
            <p className="font-semibold text-gray-700">Local Legend Status</p>
          </div>

          <nav className="space-y-4 text-gray-600">
            <p>Overview</p>
            <p className="text-green-600 font-medium">My Rentals</p>
            <p>Earnings</p>
            <p>Community Badges</p>
            <p>Settings</p>
          </nav>
        </div>

        <button className="bg-green-600 text-white py-2 rounded-lg">
          + List New Item
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8">
        {/* Steps */}
        <div className="flex items-center gap-6 mb-8">
          <Step number={1} title="Details" active />
          <Step number={2} title="Photos" />
          <Step number={3} title="Pricing" />
          <Step number={4} title="Review" />
        </div>

        <div className="grid grid-cols-3 gap-8">
          {/* Left Form */}
          <div className="col-span-2 bg-white p-6 rounded-xl shadow-sm">
            <h2 className="text-lg font-semibold mb-4">Item Details</h2>

            {/* Title */}
            <div className="mb-4">
              <label className="text-sm text-gray-600">Listing Title</label>
              <input
                type="text"
                placeholder="e.g. Heavy Duty DeWalt Hammer Drill"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full mt-1 p-2 border rounded-lg"
              />
            </div>

            {/* Category */}
            <div className="grid grid-cols-2 gap-4 mb-4">
              <select
                className="p-2 border rounded-lg"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                <option value="">Power Tools</option>
              </select>

              <select
                className="p-2 border rounded-lg"
                value={subCategory}
                onChange={(e) => setSubCategory(e.target.value)}
              >
                <option value="">Drills & Drivers</option>
              </select>
            </div>

            {/* Description */}
            <div>
              <label className="text-sm text-gray-600">Description</label>
              <textarea
                rows={4}
                placeholder="Describe the item's condition, included accessories..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full mt-1 p-2 border rounded-lg"
              />
            </div>

            {/* Tip Box */}
            <div className="mt-4 bg-green-50 text-green-700 p-3 rounded-lg text-sm">
              ✔ Trust hint: Items with better descriptions get 40% more rentals.
            </div>
          </div>

          {/* Right Panel */}
          <div className="space-y-6">
            {/* Upload Box */}
            <div className="border-2 border-dashed p-6 rounded-xl text-center bg-white">
              <p className="text-gray-600 mb-2">Upload Photos</p>
              <p className="text-sm text-gray-400 mb-4">
                Drag and drop images
              </p>
              <button className="bg-green-600 text-white px-4 py-2 rounded-lg">
                Browse Files
              </button>
            </div>

            {/* Pricing Card */}
            <div className="bg-white p-5 rounded-xl shadow-sm border">
              <h3 className="font-semibold mb-2">⚡ Smart Pricing Engine</h3>

              <p className="text-2xl font-bold text-green-700">$15/day</p>

              <p className="text-sm text-gray-500 mt-2">
                Based on similar listings nearby
              </p>

              <div className="flex justify-between text-xs mt-3 text-gray-500">
                <span>Low</span>
                <span>High</span>
              </div>

              <button className="mt-4 w-full bg-green-600 text-white py-2 rounded-lg">
                Apply Recommendation
              </button>

              <button className="mt-2 w-full border py-2 rounded-lg">
                Set Custom
              </button>
            </div>
          </div>
        </div>

        {/* Footer Buttons */}
        <div className="flex justify-end gap-4 mt-8">
          <button className="border px-6 py-2 rounded-lg">Save Draft</button>
          <button className="bg-green-700 text-white px-6 py-2 rounded-lg">
            Next: Set Pricing
          </button>
        </div>
      </main>
    </div>
  );
}

/* Step Component */
function Step({
  number,
  title,
  active = false,
}: {
  number: number;
  title: string;
  active?: boolean;
}) {
  return (
    <div
      className={`flex items-center gap-2 ${
        active ? "text-green-700 font-semibold" : "text-gray-400"
      }`}
    >
      <div
        className={`w-6 h-6 flex items-center justify-center rounded-full text-sm ${
          active ? "bg-green-700 text-white" : "bg-gray-200"
        }`}
      >
        {number}
      </div>
      <span>{title}</span>
    </div>
  );
}