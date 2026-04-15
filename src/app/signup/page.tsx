"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { FiEye, FiEyeOff } from 'react-icons/fi';
import { MdOutlineVerifiedUser } from 'react-icons/md';
import { FaLeaf } from 'react-icons/fa';

export default function SignupPage() {
  const [formData, setFormData] = useState({
    fullName: '',
    emailOrPhone: '',
    zipCode: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showOtpPopup, setShowOtpPopup] = useState(false);
  const [otpValue, setOtpValue] = useState('');
  const [isOtpLoading, setIsOtpLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      // >>> API INTEGRATION POINT 1: SEND OTP <<<
      // Replace with: await fetch('/your-api-endpoint/send-otp', { method: 'POST', body: JSON.stringify({ contact: formData.emailOrPhone }) })
      await new Promise(resolve => setTimeout(resolve, 1500));
      console.log('OTP requested for:', formData.emailOrPhone);
      setShowOtpPopup(true);
    } catch (error) {
      console.error('Error getting OTP:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsOtpLoading(true);
    try {
      // >>> API INTEGRATION POINT 2: VERIFY OTP AND CREATE ACCOUNT <<<
      // Replace with: await fetch('/your-api-endpoint/verify-otp', { method: 'POST', body: JSON.stringify({ ...formData, otp: otpValue }) })
      await new Promise(resolve => setTimeout(resolve, 1500));
      console.log('OTP Verified!', otpValue);
      alert('Signup successful! Finalize and redirect user here.');
      setShowOtpPopup(false);
    } catch (error) {
      console.error('Error verifying OTP:', error);
    } finally {
      setIsOtpLoading(false);
    }
  };

  return (
    <div className="h-[100dvh] lg:min-h-screen flex flex-col lg:flex-row bg-[#fafcfa] lg:bg-white font-sans overflow-hidden">

      {/* =========================================================
          LEFT SECTION (Form Side on Desktop)
          On mobile, this is the only visible section, tightly packed.
          ========================================================= */}
      <div className="w-full h-full lg:w-1/2 flex flex-col justify-center px-5 py-4 sm:px-10 lg:p-20 relative order-2 lg:order-1 lg:bg-white z-10 lg:shadow-[10px_0_30px_rgba(0,0,0,0.02)]">
        <div className="w-full h-full max-w-[420px] lg:max-w-[480px] mx-auto flex flex-col lg:h-auto justify-evenly lg:justify-center lg:space-y-6">

          {/* Logo & Progress Bar */}
          <div className="flex flex-col flex-shrink-0 pt-2 lg:pt-0">
            {/* Mobile Logo */}
            <div className="lg:hidden flex justify-center items-center gap-1.5 mb-2">
              <FaLeaf className="text-xl text-[#126b52]" />
              <span className="text-xl font-bold text-gray-900 tracking-tight">Proximi</span>
            </div>

            {/* Desktop Logo & Progress Line */}
            <div className="hidden lg:flex flex-col">
              <span className="text-[1.8rem] font-bold text-[#0c6b4e] mb-4 tracking-tight">Proximi</span>
              <div className="flex gap-2 w-[60%]">
                <div className="h-[3px] bg-[#0c6b4e] rounded-full flex-1"></div>
                <div className="h-[3px] bg-gray-200 rounded-full flex-1"></div>
                <div className="h-[3px] bg-gray-200 rounded-full flex-1"></div>
              </div>
            </div>
          </div>

          {/* Form Header */}
          <div className="text-center lg:text-left mb-1 lg:mb-2 flex-shrink-0">
            <h2 className="text-[1.8rem] sm:text-[2.2rem] lg:text-[2.6rem] font-extrabold text-gray-900 leading-[1.1] mb-1 lg:mb-2 tracking-tight">
              Join your neighborhood
            </h2>
            <p className="text-gray-500 font-medium text-[12px] sm:text-[14px] lg:text-[1.05rem]">
              Step 1: Account Info
            </p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-3 sm:gap-4 lg:gap-5 flex-shrink-0">
            {/* Full Name */}
            <div>
              <label className="block text-[10.5px] sm:text-[11.5px] lg:text-[0.75rem] font-bold text-gray-700 mb-1 lg:mb-2 tracking-widest uppercase ml-1 lg:ml-0">
                Full Name
              </label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                placeholder="Julianne Smith"
                className="w-full px-3.5 lg:px-5 py-3 lg:py-[1.1rem] bg-[#f5f7f6] text-gray-900 rounded-xl lg:rounded-2xl flex-shrink-0 focus:outline-none focus:ring-2 focus:ring-[#126b52]/50 transition-all font-medium text-[13px] sm:text-[14px] lg:text-[1.05rem] placeholder:text-gray-400 placeholder:font-normal"
                required
              />
            </div>

            {/* Email and Zip horizontally */}
            <div className="flex gap-3 lg:gap-4">
              {/* Email or Phone */}
              <div className="flex-[3]">
                <label className="block text-[10.5px] sm:text-[11.5px] lg:text-[0.75rem] font-bold text-gray-700 mb-1 lg:mb-2 tracking-widest uppercase ml-1 lg:ml-0 whitespace-nowrap">
                  Email or Phone
                </label>
                <input
                  type="text"
                  name="emailOrPhone"
                  value={formData.emailOrPhone}
                  onChange={handleChange}
                  placeholder="hello@example.com / 1234567890"
                  className="w-full px-3.5 lg:px-5 py-3 lg:py-[1.1rem] bg-[#f5f7f6] text-gray-900 rounded-xl lg:rounded-2xl flex-shrink-0 focus:outline-none focus:ring-2 focus:ring-[#126b52]/50 transition-all font-medium text-[13px] sm:text-[14px] lg:text-[1.05rem] placeholder:text-gray-400 placeholder:font-normal"
                  required
                />
              </div>

              {/* Zip Code */}
              <div className="flex-[2]">
                <label className="block text-[10.5px] sm:text-[11.5px] lg:text-[0.75rem] font-bold text-gray-700 mb-1 lg:mb-2 tracking-widest uppercase ml-1 lg:ml-0 whitespace-nowrap">
                  Zip Code
                </label>
                <input
                  type="text"
                  name="zipCode"
                  value={formData.zipCode}
                  onChange={handleChange}
                  placeholder="10001"
                  className="w-full px-3.5 lg:px-5 py-3 lg:py-[1.1rem] bg-[#f5f7f6] text-gray-900 rounded-xl lg:rounded-2xl flex-shrink-0 focus:outline-none focus:ring-2 focus:ring-[#126b52]/50 transition-all font-medium text-[13px] sm:text-[14px] lg:text-[1.05rem] placeholder:text-gray-400 placeholder:font-normal"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-[10.5px] sm:text-[11.5px] lg:text-[0.75rem] font-bold text-gray-700 mb-1 lg:mb-2 tracking-widest uppercase ml-1 lg:ml-0">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="w-full pl-3.5 lg:pl-5 pr-10 lg:pr-14 py-3 lg:py-[1.1rem] bg-[#f5f7f6] text-gray-900 rounded-xl lg:rounded-2xl flex-shrink-0 focus:outline-none focus:ring-2 focus:ring-[#126b52]/50 transition-all font-medium text-[13px] sm:text-[14px] lg:text-[1.05rem] tracking-widest placeholder:tracking-widest placeholder:text-gray-400"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 lg:pr-5 flex items-center text-gray-500 hover:text-gray-700 transition-colors"
                >
                  {showPassword ? <FiEyeOff className="text-sm lg:text-[1.3rem]" /> : <FiEye className="text-sm lg:text-[1.3rem]" />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 lg:py-[1.15rem] mt-1 lg:mt-3 bg-[#0a6549] hover:bg-[#08523b] disabled:bg-[#0a6549]/70 text-white rounded-xl lg:rounded-2xl font-bold flex justify-center items-center text-[14px] sm:text-[15px] lg:text-[1.1rem] transition-colors duration-200 shadow-md flex-shrink-0"
            >
              {isLoading ? 'Processing...' : 'Continue'}
            </button>
          </form>

          {/* Identity Verified Badge */}
          <div className="flex items-center gap-3 lg:gap-4 bg-[#f4f7f5] rounded-xl lg:rounded-2xl p-3 sm:p-3.5 lg:p-4 my-1 lg:my-0 flex-shrink-0 border border-[#e8efe9]">
            <div className="w-[2rem] h-[2rem] lg:w-[2.5rem] lg:h-[2.5rem] rounded-full bg-[#cbeaeb] flex items-center justify-center flex-shrink-0 shadow-sm">
              <MdOutlineVerifiedUser className="text-[#0a6549] text-sm lg:text-[1.1rem]" />
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-gray-900 text-[11px] sm:text-[12px] lg:text-[0.95rem] leading-tight">Identity Verified</span>
              <span className="text-gray-500 text-[10px] sm:text-[11px] lg:text-[0.85rem] leading-tight mt-0.5">We ensure all neighbors are real people for your safety.</span>
            </div>
          </div>

          <div className="flex-shrink-0 pt-1 pb-2 lg:pb-0">
            {/* Login Link */}
            <div className="text-center text-[12px] sm:text-[13px] lg:text-[0.95rem] font-medium text-gray-600">
              Already a neighbor? <Link href="/login" className="text-[#0a6549] font-bold hover:underline">Log In</Link>
            </div>
          </div>

        </div>
      </div>

      {/* =========================================================
          RIGHT SECTION (Image View)
          Hidden on mobile, covers exactly 1/2 of screen on desktop
          ========================================================= */}
      <div className="hidden lg:flex w-1/2 relative bg-gray-100 overflow-hidden order-1 lg:order-2">
        <div
          className="w-full h-full bg-cover bg-center shadow-inner relative flex flex-col justify-end p-12 lg:p-20"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1573497620053-ea5300f94f21?auto=format&fit=crop&w=1200&q=80')" }}
        >
          {/* Glassy detail box on image */}
          <div className="bg-[#e4ece8]/95 backdrop-blur-md border border-white/20 p-8 rounded-3xl w-full max-w-[500px] shadow-2xl mb-4">

            <div className="flex items-center gap-4 mb-4">
              {/* 3 mini avatars */}
              <div className="flex -space-x-2">
                <img src="https://i.pravatar.cc/100?img=11" alt="Neighbor" className="w-8 h-8 rounded-full border-2 border-[#e4ece8] object-cover" />
                <img src="https://i.pravatar.cc/100?img=47" alt="Neighbor" className="w-8 h-8 rounded-full border-2 border-[#e4ece8] object-cover" />
                <img src="https://i.pravatar.cc/100?img=12" alt="Neighbor" className="w-8 h-8 rounded-full border-2 border-[#e4ece8] object-cover" />
              </div>
              <span className="text-[#3c544a] text-sm font-semibold">Join 400+ neighbors in your area</span>
            </div>

            <h3 className="text-[#132c21] text-[1.6rem] leading-[1.25] font-semibold mb-6">
              "The easiest way to share tools, help, and local tips with the people next door."
            </h3>

            <div className="flex items-center gap-2">
              <div className="text-[#0a6549] text-lg tracking-widest">★★★★★</div>
              <span className="text-[#3c544a] text-xs font-bold tracking-wider uppercase ml-2 pt-0.5">Trusted Community</span>
            </div>

          </div>
        </div>
      </div>

      {/* =========================================================
          OTP MODAL POPUP
          ========================================================= */}
      {showOtpPopup && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 p-4 transition-opacity">
          <div className="bg-white rounded-[1.2rem] p-7 md:p-8 w-full max-w-[360px] shadow-2xl relative">
            <h3 className="text-[1.3rem] font-extrabold mb-1.5 text-gray-900 text-center tracking-tight">Enter Verification Code</h3>
            <p className="text-[0.9rem] text-gray-500 mb-6 text-center font-medium leading-snug px-1">
              A 6-digit code has been sent to your email address.
            </p>
            <form onSubmit={handleVerifyOtp} className="flex flex-col gap-4">
              <input
                type="text"
                maxLength={6}
                value={otpValue}
                onChange={(e) => setOtpValue(e.target.value.replace(/\D/g, ''))}
                placeholder="000000"
                className="w-full text-center tracking-[0.5em] text-2xl py-3.5 bg-[#f5f7f6] text-gray-900 font-bold rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0a6549]/50 transition-all placeholder:text-gray-300"
                required
              />
              <button
                type="submit"
                disabled={isOtpLoading || otpValue.length !== 6}
                className="w-full py-3.5 bg-[#0a6549] hover:bg-[#08523b] disabled:bg-[#0a6549]/50 text-white font-bold rounded-xl transition-colors duration-200 shadow-md text-[1.05rem]"
              >
                {isOtpLoading ? 'Verifying...' : 'Verify Code'}
              </button>
              <button
                type="button"
                onClick={() => setShowOtpPopup(false)}
                className="text-sm font-semibold text-gray-400 mt-1 hover:text-gray-600 transition-colors"
                disabled={isOtpLoading}
              >
                Go Back
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
