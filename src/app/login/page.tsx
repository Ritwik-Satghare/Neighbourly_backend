"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  FiMail, 
  FiLock, 
  FiEye, 
  FiEyeOff, 
  FiArrowRight 
} from 'react-icons/fi';
import { MdOutlineVerifiedUser, MdHandshake } from 'react-icons/md';
import { FcGoogle } from 'react-icons/fc';
import { FaFacebook } from 'react-icons/fa';
import { FaLeaf } from 'react-icons/fa';

export default function LoginPage() {
  const [formData, setFormData] = useState({
    emailOrPhone: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      // >>> API INTEGRATION POINT: AUTHENTICATE LOGIN USER <<<
      // Replace with: await fetch('/your-api-endpoint/login', { method: 'POST', body: JSON.stringify(formData) })
      await new Promise(resolve => setTimeout(resolve, 1500));
      console.log('Login credentials verified:', formData);
      alert('Login successful! Manage cookies/redirect your user here.');
    } catch (error) {
      console.error('Error during login:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-[100dvh] lg:min-h-screen flex flex-col lg:flex-row bg-gradient-to-br from-[#eafaf1] to-[#ffffff] lg:bg-none font-sans overflow-hidden">
      
      {/* =========================================================
          DESKTOP LEFT SECTION (Brand Design)
          Hidden on mobile, covers exactly 1/2 of screen on desktop
          ========================================================= */}
      <div className="hidden lg:flex w-1/2 p-20 flex-col justify-between relative bg-[#126b52] text-white overflow-hidden">
        {/* Background image & Overlay */}
        <div 
          className="absolute inset-0 z-0 bg-cover bg-center mix-blend-overlay opacity-30"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1543269865-cbf427effbad?auto=format&fit=crop&w=1000&q=80')" }}
        ></div>
        <div className="absolute inset-0 z-0 bg-gradient-to-t from-[#0e523f] to-transparent opacity-80 mix-blend-multiply"></div>
        
        <div className="relative z-10 w-full max-w-[500px]">
          {/* Logo */}
          <div className="mb-16">
            <span className="text-2xl font-bold relative inline-block">
              Proximi
              <span className="absolute bottom-0 left-0 w-8 h-[3px] bg-[#6ce3ad] rounded-full"></span>
            </span>
          </div>

          <h1 className="text-[3.2rem] font-bold leading-[1.15] mb-8">
            Trust starts with<br/>
            <span className="text-[#6ce3ad]">your neighbors.</span>
          </h1>

          <div className="space-y-6">
            <div className="flex items-center space-x-3">
              <MdOutlineVerifiedUser className="text-[1.35rem] text-[#6ce3ad] flex-shrink-0" />
              <span className="text-white/90 text-[1.05rem] font-medium">Verified local identity for everyone</span>
            </div>
            <div className="flex items-center space-x-3">
              <MdHandshake className="text-[1.35rem] text-[#6ce3ad] flex-shrink-0" />
              <span className="text-white/90 text-[1.05rem] font-medium">Peer-reviewed community rentals</span>
            </div>
          </div>
        </div>

        <div className="relative z-10 mt-auto">
          <div className="flex -space-x-3 mb-5">
            <img src="https://i.pravatar.cc/100?img=33" alt="User 1" className="w-10 h-10 rounded-full border-2 border-[#126b52] object-cover" />
            <img src="https://i.pravatar.cc/100?img=47" alt="User 2" className="w-10 h-10 rounded-full border-2 border-[#126b52] object-cover" />
            <img src="https://i.pravatar.cc/100?img=12" alt="User 3" className="w-10 h-10 rounded-full border-2 border-[#126b52] object-cover" />
          </div>
          <p className="text-[0.95rem] text-white/80 italic font-medium leading-relaxed pr-6 max-w-[400px]">
            &quot;The most secure way to borrow what you need, right next door.&quot;
          </p>
        </div>
      </div>

      {/* =========================================================
          RIGHT SECTION / MOBILE MAIN VIEW (Login Form)
          Takes 1/2 screen on desktop, full screen on mobile.
          Tightly packed on mobile so it doesn't scroll.
          ========================================================= */}
      <div className="w-full h-full lg:w-1/2 flex flex-col justify-center px-5 py-4 sm:px-10 lg:bg-white lg:p-20 relative">
        <div className="w-full h-full max-w-[420px] lg:max-w-[480px] mx-auto flex flex-col lg:h-auto justify-evenly lg:justify-center lg:space-y-6">
          
          {/* Mobile Only Logo */}
          <div className="lg:hidden flex justify-center items-center gap-1.5 pt-2 mb-2">
            <FaLeaf className="text-xl text-[#126b52]" />
            <span className="text-xl font-bold text-gray-900 tracking-tight">Proximi</span>
          </div>

          {/* Form Header */}
          <div className="text-center lg:text-left">
            <h2 className="text-[1.8rem] sm:text-[2.2rem] lg:text-[2.8rem] font-bold text-gray-900 mb-1 lg:mb-2 leading-tight">
              Sign In to Proximi
            </h2>
            <p className="text-gray-500 font-medium text-sm sm:text-[1.05rem] lg:text-[1.15rem] mb-4 lg:mb-8">
              Welcome back! Please enter your details.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4 lg:gap-5 flex-shrink-0">
            {/* Email or Phone field */}
            <div>
              <label className="block text-[11px] lg:text-[0.85rem] font-semibold text-gray-700 mb-1 lg:mb-1.5 ml-1 lg:ml-0">
                Email or Phone
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 lg:pl-5 flex items-center pointer-events-none">
                  <FiMail className="text-gray-400 text-sm lg:text-[1.3rem]" />
                </div>
                <input 
                  type="text" 
                  name="emailOrPhone"
                  value={formData.emailOrPhone}
                  onChange={handleChange}
                  placeholder="hello@example.com"
                  className="w-full pl-9 lg:pl-14 pr-4 py-3 lg:py-[1.1rem] bg-[#f5f6f8] text-gray-900 rounded-xl lg:rounded-2xl flex-shrink-0 focus:outline-none focus:ring-2 focus:ring-[#126b52]/50 transition-all font-medium text-sm lg:text-[1.05rem] placeholder:text-gray-400 placeholder:font-normal"
                  required
                />
              </div>
            </div>

            {/* Password field */}
            <div>
              <div className="flex justify-between items-center mb-1 lg:mb-1.5 ml-1 lg:ml-0">
                <label className="block text-[11px] lg:text-[0.85rem] font-semibold text-gray-700">
                  Password
                </label>
                <Link href="#" className="text-[10px] lg:text-[0.85rem] font-semibold text-[#126b52] hover:text-[#0d4f3c] transition-colors pr-1 lg:pr-0">
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 lg:pl-5 flex items-center pointer-events-none">
                  <FiLock className="text-gray-400 text-sm lg:text-[1.3rem]" />
                </div>
                <input 
                  type={showPassword ? "text" : "password"} 
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="w-full pl-9 lg:pl-14 pr-10 lg:pr-14 py-3 lg:py-[1.1rem] bg-[#f5f6f8] text-gray-900 rounded-xl lg:rounded-2xl flex-shrink-0 focus:outline-none focus:ring-2 focus:ring-[#126b52]/50 transition-all font-medium text-sm lg:text-[1.05rem] tracking-widest placeholder:tracking-widest placeholder:text-gray-400"
                  required
                />
                <button 
                  type="button" 
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 lg:pr-5 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? <FiEyeOff className="text-sm lg:text-[1.3rem]" /> : <FiEye className="text-sm lg:text-[1.3rem]" />}
                </button>
              </div>
            </div>

            {/* Sign In Button */}
            <button 
              type="submit"
              disabled={isLoading}
              className="w-full py-3 lg:py-[1.15rem] mt-2 lg:mt-4 bg-[#126b52] hover:bg-[#0e5440] disabled:bg-[#126b52]/70 text-white rounded-xl lg:rounded-2xl font-bold flex justify-center items-center gap-2 text-sm lg:text-[1.1rem] transition-colors duration-200 shadow-md flex-shrink-0"
            >
              {isLoading ? 'Signing In...' : 'Sign In'}
              {!isLoading && <FiArrowRight className="text-base lg:text-[1.3rem]" />}
            </button>
          </form>

          {/* Social Logins */}
          <div className="flex w-full flex-col mt-4 lg:mt-6 flex-shrink-0">
            <div className="my-3 lg:my-6 flex items-center">
              <div className="flex-1 border-t border-gray-200"></div>
              <span className="px-3 lg:px-4 text-[9px] lg:text-[0.7rem] font-bold text-gray-400 tracking-widest uppercase">Or continue with</span>
              <div className="flex-1 border-t border-gray-200"></div>
            </div>

            <div className="flex gap-3 lg:gap-4 w-full">
              <button 
                type="button" 
                className="flex-1 flex justify-center items-center gap-2 py-2.5 lg:py-[1.1rem] bg-[#f5f6f8] hover:bg-[#ebedf1] text-gray-700 rounded-xl lg:rounded-2xl font-bold text-sm lg:text-[1.05rem] transition-colors duration-200"
              >
                <FcGoogle className="text-[1.1rem] lg:text-[1.5rem]" />
                Google
              </button>
              <button 
                type="button" 
                className="flex-1 flex justify-center items-center gap-2 py-2.5 lg:py-[1.1rem] bg-[#f5f6f8] hover:bg-[#ebedf1] text-gray-700 rounded-xl lg:rounded-2xl font-bold text-sm lg:text-[1.05rem] transition-colors duration-200"
              >
                <FaFacebook className="text-[1.1rem] lg:text-[1.5rem] text-[#1877F2]" />
                Facebook
              </button>
            </div>
          </div>

          <div className="flex-shrink-0 mt-4 pb-4 lg:pb-0">
            {/* Sign Up Link */}
            <div className="text-center text-xs lg:text-[1.05rem] font-medium text-gray-600">
              Don&apos;t have an account? <Link href="/signup" className="text-[#126b52] font-semibold hover:underline">Sign up for free</Link>
            </div>
          </div>
          
        </div>
      </div>
      
    </div>
  );
}
