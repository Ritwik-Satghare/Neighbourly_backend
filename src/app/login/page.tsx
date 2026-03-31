"use client";
import React, { useState } from "react";
import Head from "next/head";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { FiChevronLeft } from "react-icons/fi";

const LoginPage: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);

  const LoginForm = (
    <>
      <div className="w-full flex justify-center mb-10">
        <h1 className="text-5xl font-semibold text-[#8B8CF7] tracking-wide">Login</h1>
      </div>

      <div className="flex flex-col gap-8 w-full">
        <div className="flex flex-col gap-2 w-full">
          <label className="text-gray-600 font-bold text-lg">Email</label>
          <input
            type="email"
            placeholder="User@gmail.com"
            className="w-full h-16 px-6 bg-white border border-[#F2F2F2] rounded-full text-lg shadow-inner focus:ring-2 focus:ring-[#8B8CF7] outline-none transition"
          />
        </div>

        <div className="flex flex-col gap-2 w-full">
          <label className="text-gray-600 font-bold text-lg">Password</label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="...................."
              className="w-full h-16 px-6 bg-white border border-[#F2F2F2] rounded-full text-lg shadow-inner focus:ring-2 focus:ring-[#8B8CF7] outline-none transition"
            />
            <button
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-400 text-2xl"
            >
              {showPassword ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
            </button>
          </div>
        </div>
      </div>

      <button className="w-full mt-16 bg-gradient-to-r from-[#8B8CF7] to-[#5B8EE6] text-white py-5 rounded-full text-2xl font-semibold shadow-lg hover:opacity-90 transition">
        Login
      </button>
    </>
  );

  return (
    <div className="min-h-screen bg-[#F6F7FB] overflow-hidden relative font-sans">
      <Head><title>Proximi | Login</title></Head>

      <div className="hidden lg:flex items-center justify-end pr-24 w-full h-screen">
        <div className="absolute left-0 top-0 h-full w-[65%] pointer-events-none">
          <svg viewBox="0 0 600 1000" preserveAspectRatio="none" className="w-full h-full">
            <path d="M0,0 L250,0 C500,250 300,250 590,600 C540,800 320,800 480,1000 L0,1000 Z" fill="url(#waveGradient)" />
            <defs><linearGradient id="waveGradient"><stop offset="0%" stopColor="#A78BFA"/><stop offset="100%" stopColor="#6366F1"/></linearGradient></defs>
          </svg>
        </div>
        <div className="relative z-10 w-[900px] h-[600px] bg-white/5 backdrop-blur-xl rounded-[40px] shadow-2xl flex flex-col items-center justify-center p-10 border border-white/20">
          <button className="absolute top-10 left-10 p-4 bg-white rounded-xl shadow-md"><FiChevronLeft className="text-2xl"/></button>
          <div className="w-[500px]">{LoginForm}</div>
        </div>
      </div>

      <div className="flex lg:hidden flex-col w-full min-h-screen pt-12 px-6">
        <button className="w-fit p-4 bg-white rounded-xl shadow-md mb-10"><FiChevronLeft className="text-2xl"/></button>
        {LoginForm}
      </div>
    </div>
  );
};

export default LoginPage;