"use client";
import React from "react";
import Head from "next/head";
import { FiChevronLeft } from "react-icons/fi";

const OTPPage: React.FC = () => {
  const OTPForm = (
    <>
      <div className="w-full flex justify-center mb-10">
        <h1 className="text-5xl font-semibold text-[#8B8CF7] tracking-wide">OTP</h1>
      </div>

      <div className="flex flex-col gap-8 w-full">
        <div className="flex flex-col gap-2 w-full">
          <label className="text-gray-600 font-bold text-lg">Phone Number</label>
          <input
            type="tel"
            placeholder="+1 234 567 890"
            className="w-full h-16 px-6 bg-white border border-[#F2F2F2] rounded-full text-lg shadow-inner outline-none focus:ring-2 focus:ring-[#8B8CF7]"
          />
        </div>

        <div className="flex flex-col gap-2 w-full">
          <label className="text-gray-600 font-bold text-lg">OTP</label>
          <div className="flex justify-between gap-3">
            {[1, 2, 3, 4, 5,6].map((index) => (
              <input
                key={index}
                type="text"
                maxLength={1}
                className="w-full aspect-square text-center text-2xl font-bold bg-white border border-[#F2F2F2] rounded-2xl shadow-inner outline-none focus:ring-2 focus:ring-[#8B8CF7]"
              />
            ))}
          </div>
          <div className="w-full flex justify-end mt-2">
            <button className="text-[#8B8CF7] font-semibold text-lg hover:underline">
              Get OTP
            </button>
          </div>
        </div>
      </div>

      <button className="w-full mt-12 bg-gradient-to-r from-[#8B8CF7] to-[#5B8EE6] text-white py-5 rounded-full text-2xl font-semibold shadow-lg hover:opacity-90 transition">
        Continue
      </button>
    </>
  );

  return (
    <div className="min-h-screen bg-[#F6F7FB] overflow-hidden relative font-sans">
      <Head><title>Proximi | OTP Verification</title></Head>

      <div className="hidden lg:flex items-center justify-end pr-24 w-full h-screen">
              <div className="hidden sm:block absolute inset-0 pointer-events-none overflow-hidden">
        <svg
          className="absolute w-full h-full"
          viewBox="0 0 1440 900"
          preserveAspectRatio="xMidYMid slice"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient
              id="purpleGradient"
              x1="0%"
              y1="0%"
              x2="0%"
              y2="100%"
            >
              <stop offset="0%" stopColor="#7F86EC" />
              <stop offset="100%" stopColor="#9CA5E8" />
            </linearGradient>
            <linearGradient
              id="purpleGradient2"
              x1="0%"
              y1="0%"
              x2="0%"
              y2="100%"
            >
              <stop offset="0%" stopColor="#8F96F0" />
              <stop offset="100%" stopColor="#A8ADE6" />
            </linearGradient>
            <linearGradient
              id="purpleGradient3"
              x1="0%"
              y1="0%"
              x2="0%"
              y2="100%"
            >
              <stop offset="0%" stopColor="#9FA6F4" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#B2B7E4" stopOpacity="0.8" />
            </linearGradient>
          </defs>

          <rect
            x="0"
            y="0"
            width="550"
            height="900"
            fill="url(#purpleGradient)"
          />

          <path
            d="M 550 0 Q 600 120 620 250 Q 640 400 620 550 Q 600 700 550 900 L 0 900 L 0 0 Z"
            fill="url(#purpleGradient)"
          />

          <path
            d="M 500 0 Q 560 180 540 350 Q 520 550 480 900 L 550 900 Q 600 700 620 550 Q 640 400 620 250 Q 600 120 550 0 Z"
            fill="url(#purpleGradient2)"
          />

          <path
            d="M 450 0 Q 520 220 500 450 Q 480 700 440 900 L 500 900 Q 520 550 540 350 Q 560 180 500 0 Z"
            fill="url(#purpleGradient3)"
          />

          <path
            d="M 420 0 Q 480 150 470 400 Q 460 650 420 900 L 450 900 Q 480 700 500 450 Q 520 220 450 0 Z"
            fill="#ddd6fe"
            opacity="0.6"
          />

          <path
            d="M 380 100 Q 450 250 440 500 Q 430 750 380 900 L 420 900 Q 460 650 470 400 Q 480 150 420 0 L 380 0 Z"
            fill="#e9d5ff"
            opacity="0.5"
          />
        </svg>
      </div>
        <div className="relative z-10 w-[900px] h-[650px] bg-white/5 backdrop-blur-xl rounded-[40px] shadow-2xl flex flex-col items-center justify-center p-10 border border-white/20">
          <button className="absolute top-10 left-10 p-4 bg-white rounded-xl shadow-md"><FiChevronLeft className="text-2xl"/></button>
          <div className="w-[500px]">{OTPForm}</div>
        </div>
      </div>

      <div className="flex lg:hidden flex-col w-full min-h-screen pt-12 px-6">
        <button className="w-fit p-4 bg-white rounded-xl shadow-md mb-10"><FiChevronLeft className="text-2xl"/></button>
        {OTPForm}
      </div>
    </div>
  );
};

export default OTPPage;