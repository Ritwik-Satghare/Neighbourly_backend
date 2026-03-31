"use client";

import React from "react";

const AddListing = () => {
  return (
    <div className="h-screen bg-gradient-to-b from-[#7F86EC] to-[#9CA5E8] relative overflow-hidden flex flex-col justify-center font-sans">

      <div className="absolute w-[380px] h-[380px] bg-[#5F6EE5] rounded-full bottom-[-140px] left-[-140px] opacity-50" />
      <div className="absolute w-[420px] h-[300px] bg-[#C6CEF5] rounded-[60%_40%_60%_40%] top-[-100px] right-[-100px] opacity-70" />

      <div className="max-w-[1000px] mx-auto w-full px-5">

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

        <div className="bg-white/60 rounded-[20px] p-8 backdrop-blur-md">

          <h2 className="text-center text-lg font-medium mb-6">
            Add Listing
          </h2>

          <div className="flex gap-6">

            <div className="w-[40%]">

              <div className="bg-white rounded-[20px] p-6 shadow-md text-center mb-4">
                <div className="text-4xl mb-2">📷</div>
                <p className="font-semibold">Add photos of your item</p>
                <p className="text-xs text-gray-500">
                  Upload 3–4 clear images
                </p>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div className="h-[80px] bg-white/70 rounded-md border" />
                <div className="h-[80px] bg-white/70 rounded-md border" />
                <div className="h-[80px] bg-white/70 rounded-md border" />
              </div>

            </div>

            <div className="flex-1 bg-white rounded-[20px] p-6 shadow-md">

              <div className="space-y-3">

                <div>
                  <label className="text-sm">Item Name</label>
                  <input
                    placeholder="Enter item name"
                    className="w-full mt-1 px-3 py-2 rounded-md border outline-none text-sm"
                  />
                </div>

                <div>
                  <label className="text-sm">Category</label>
                  <input
                    placeholder="Select a category"
                    className="w-full mt-1 px-3 py-2 rounded-md border outline-none text-sm"
                  />
                </div>

                <div>
                  <label className="text-sm">Description</label>
                  <textarea
                    placeholder="Tell renters about condition, features, etc."
                    className="w-full mt-1 px-3 py-2 rounded-md border outline-none text-sm h-[70px] resize-none"
                  />
                </div>

                <div>
                  <label className="text-sm">Enter amount</label>

                  <div className="flex gap-2 mt-1">
                    <select className="px-2 py-2 rounded-md border text-sm">
                      <option>Price per day</option>
                      <option>Price per week</option>
                      <option>Price per month</option>
                    </select>

                    <input
                      placeholder="Enter amount"
                      className="flex-1 px-3 py-2 rounded-md border outline-none text-sm"
                    />
                  </div>

                  <p className="text-xs text-gray-500 mt-1">
                    This is the base price renters will see
                  </p>
                </div>

                <div>
                  <label className="text-sm">Location</label>
                  <input
                    placeholder="Enter pickup location"
                    className="w-full mt-1 px-3 py-2 rounded-md border outline-none text-sm"
                  />
                </div>

                <button className="w-full mt-4 py-2 rounded-full bg-gradient-to-r from-[#7F86EC] to-[#5F9EEB] text-white font-semibold">
                  Add Listing
                </button>

              </div>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default AddListing;