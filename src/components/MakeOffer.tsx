"use client";

import React from "react";

const MakeOffer = () => {
  return (
    <div className="h-screen bg-gradient-to-b from-[#7F86EC] to-[#9CA5E8] flex items-center justify-center font-sans">

      <div className="w-[420px] bg-white/70 backdrop-blur-md rounded-[20px] shadow-lg overflow-hidden">

        <div className="text-center px-6 py-5 border-b">
          <h2 className="text-xl font-semibold">Make Your Offer</h2>
          <p className="text-sm text-gray-600 mt-1">
            Negotiate a better price for your rental period.
          </p>
        </div>

        <div className="p-6 space-y-4">

          <div>
            <label className="text-sm font-medium">Your Offer</label>
            <input
              placeholder="₹ Enter amount"
              className="w-full mt-1 px-4 py-2 rounded-full bg-white border outline-none text-sm"
            />
          </div>

          <div>
            <label className="text-sm font-medium">Select Rental Dates</label>

            <div className="flex gap-3 mt-2">
              <div className="flex-1 relative">
                <input
                  placeholder="Start date"
                  className="w-full px-4 py-2 rounded-full bg-white border outline-none text-sm"
                />
                <span className="absolute right-3 top-2 text-gray-500">📅</span>
              </div>

              <div className="flex-1 relative">
                <input
                  placeholder="End date"
                  className="w-full px-4 py-2 rounded-full bg-white border outline-none text-sm"
                />
                <span className="absolute right-3 top-2 text-gray-500">📅</span>
              </div>
            </div>
          </div>

          <div>
            <label className="text-sm font-medium">
              Add a Note (optional)
            </label>
            <input
              placeholder="Add any details for the owner..."
              className="w-full mt-1 px-4 py-2 rounded-full bg-white border outline-none text-sm"
            />
          </div>

          <button className="w-full mt-4 py-2 rounded-full bg-gradient-to-r from-[#7F86EC] to-[#5F9EEB] text-white font-semibold">
            Make Offer
          </button>

        </div>
      </div>
    </div>
  );
};

export default MakeOffer;