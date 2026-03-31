"use client";
import React from "react";
import Head from "next/head";

const WelcomePage: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#F6F7FB] overflow-hidden relative font-sans">
      <Head>
        <title>Proximi | Welcome</title>
      </Head>

      <div className="hidden lg:flex items-center justify-end pr-24 w-full h-screen">
        <div className="absolute left-0 top-0 h-full w-[65%] pointer-events-none">
          <svg
            viewBox="0 0 600 1000"
            preserveAspectRatio="none"
            className="w-full h-full"
          >
            <defs>
              <linearGradient id="waveGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#A78BFA" />
                <stop offset="100%" stopColor="#6366F1" />
              </linearGradient>
            </defs>
            <path
              d="M0,0 L250,0 C500,250 300,250 590,600 C540,800 320,800 480,1000 L0,1000 Z"
              fill="url(#waveGradient)"
            />
          </svg>
        </div>

        <div className="relative z-10 w-[900px] h-[520px] bg-white/5 backdrop-blur-xl rounded-[40px] shadow-2xl flex flex-col items-center justify-center p-10 border border-white/20">
          <h2 className="text-gray-500 text-2xl mb-10 tracking-wide">tagline</h2>
          <div className="flex flex-col gap-5 w-64">
            <button className="bg-gradient-to-r from-[#8B8CF7] to-[#5B8EE6] text-white py-4 rounded-2xl text-lg font-semibold shadow-md hover:opacity-90 transition">
              Sign up
            </button>
            <button className="bg-white border border-[#DDE3FF] text-gray-600 py-4 rounded-2xl text-lg font-semibold hover:bg-gray-50 transition">
              login
            </button>
          </div>
        </div>
      </div>

      <div className="flex lg:hidden flex-col items-center w-full min-h-screen">
        <div className="relative w-full h-[45vh] bg-gradient-to-b from-[#A78BFA] to-[#6366F1] rounded-b-[150px] flex items-end justify-center">
          <div className="absolute -bottom-12 w-32 h-32 bg-[#D1D5DB] rounded-full border-8 border-[#F6F7FB] shadow-sm"></div>
        </div>

        <div className="mt-20 flex flex-col items-center text-center px-6 w-full max-w-sm">
          <h1 className="text-4xl font-black text-black tracking-wider uppercase mb-2">
            PROXIMI
          </h1>
          <p className="text-gray-500 text-xl font-medium mb-12">tagline</p>

          <div className="flex flex-col gap-5 w-full">
            <button className="bg-gradient-to-r from-[#A78BFA] to-[#818CF8] text-white py-4 rounded-2xl text-2xl font-semibold shadow-lg active:scale-95 transition-transform">
              Sign up
            </button>
            <button className="bg-white border-2 border-[#E0E7FF] text-gray-600 py-4 rounded-2xl text-2xl font-semibold active:scale-95 transition-transform">
              login
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WelcomePage;