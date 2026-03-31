"use client";

import React from "react";

const ReviewOffer = () => {
  return (
    <div className="h-screen bg-gradient-to-b from-[#7F86EC] to-[#9CA5E8] flex items-center justify-center font-sans">

      <div className="w-[420px] bg-white/70 backdrop-blur-md rounded-[20px] shadow-lg overflow-hidden">

        <div className="text-center px-6 py-5 border-b">
          <h2 className="text-xl font-semibold">Review Offer</h2>
          <p className="text-sm text-gray-600 mt-1">
            Someone has made an offer on your item.
          </p>
        </div>

        <div className="p-6 space-y-4">

          <div className="flex items-center gap-4">
            <img
              src="https://i.pravatar.cc/50"
              className="rounded-full"
              alt="user"
            />

            <div>
              <p className="font-semibold text-sm">₹ 350 / day</p>
              <p className="text-xs text-gray-500">Rental Dates</p>
              <p className="text-xs text-gray-600 flex items-center gap-1">
                📅 May 15 – May 18
              </p>
            </div>
          </div>

          <input
            placeholder="Renter's Note"
            className="w-full px-4 py-2 rounded-full bg-white border outline-none text-sm"
          />

          <div className="flex gap-4 pt-2">
            <button className="flex-1 py-2 rounded-full bg-gradient-to-r from-[#7F86EC] to-[#5F9EEB] text-white font-semibold">
              Accept
            </button>

            <button className="flex-1 py-2 rounded-full bg-gray-200 text-gray-700 font-semibold">
              Reject
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default ReviewOffer;