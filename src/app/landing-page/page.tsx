"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  FiSearch, FiMenu, FiBell, FiHome, FiMap, FiMessageSquare, 
  FiUser, FiPlus, FiChevronDown, FiArrowRight, FiHeart
} from 'react-icons/fi';
import { MdOutlineVerifiedUser } from 'react-icons/md';
import { BiWrench, BiGridAlt } from 'react-icons/bi';
import { FaLaptop, FaCampground } from 'react-icons/fa';
import { RiMoneyDollarCircleLine } from 'react-icons/ri';

export default function LandingPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoaded, setIsLoaded] = useState(false);
  const [data, setData] = useState<any>(null);

  // >>> API INTEGRATION POINT <<<
  // Simulate fetching consolidated dashboard data from backend on mount.
  useEffect(() => {
    async function fetchLandingData() {
      try {
        // REPLACE WITH: const res = await fetch('/api/landing'); const json = await res.json();
        await new Promise(resolve => setTimeout(resolve, 800)); // Network delay emulation
        
        setData({
          activeNeighbors: 1243,
          trustScore: 92
        });
        
        setIsLoaded(true);
      } catch (error) {
        console.error("Failed to load landing API data", error);
      }
    }
    fetchLandingData();
  }, []);

  if (!isLoaded || !data) {
    return (
      <div className="w-full h-screen flex flex-col items-center justify-center bg-[#fafbfc]">
        <div className="w-12 h-12 border-4 border-[#0D5B46]/20 border-t-[#0D5B46] rounded-full animate-spin mb-4"></div>
        <p className="text-[#0D5B46] font-semibold tracking-widest uppercase text-sm animate-pulse">Loading API...</p>
      </div>
    );
  }

  return (
    <div className="w-full bg-[#fafbfc] font-sans text-gray-900 overflow-x-hidden min-h-screen">
      
      {/* =========================================================
          DESKTOP LAYOUT (Hidden on mobile)
          ========================================================= */}
      <div className="hidden lg:flex w-full flex-col min-h-screen">
        
        {/* Navbar */}
        <header className="h-[90px] flex items-center justify-between px-16 bg-[#fafbfc] sticky top-0 z-50">
          <div className="flex items-center gap-16">
            <span className="text-[1.8rem] font-extrabold text-[#0D5B46] tracking-tight">Neighbourly</span>
            <nav className="flex items-center gap-10 text-[1.05rem] font-semibold text-gray-400">
              <Link href="#" className="text-[#0D5B46] font-bold border-b-2 border-[#0D5B46] pb-1">Browse</Link>
              <Link href="#" className="hover:text-[#0D5B46] transition-colors">How it Works</Link>
              <Link href="#" className="hover:text-[#0D5B46] transition-colors">Community</Link>
            </nav>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/login" className="text-gray-600 font-bold hover:text-[#0D5B46] px-4 py-2 transition-colors">
              Login
            </Link>
            <Link href="/signup" className="bg-[#0D5B46] hover:bg-[#094736] text-white px-6 py-2.5 rounded-xl font-bold transition-colors shadow-m">
              Sign up
            </Link>
          </div>
        </header>

        {/* Hero Section */}
        <section className="px-16 pt-10 pb-20 flex justify-between items-center max-w-[1400px] mx-auto w-full">
          <div className="w-[45%] flex flex-col pt-10">
            <h1 className="text-[4.5rem] font-extrabold text-[#111814] leading-[1.05] tracking-tight mb-8">
              Rent anything from<br/>your neighborhood
            </h1>
            <p className="text-gray-500 text-[1.1rem] leading-relaxed mb-10 max-w-[90%] font-medium">
              Access high-quality tools, tech, and gear right next door. Save money, reduce waste, and meet your neighbors.
            </p>

            {/* Search Bar */}
            <div className="bg-white rounded-2xl p-3 shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-gray-100 flex items-center mb-10 w-[95%]">
              <div className="flex items-center flex-1 px-4 border-r border-gray-200">
                <FiSearch className="text-gray-400 text-xl mr-3" />
                <input 
                  type="text" 
                  placeholder="What are you looking for?" 
                  className="w-full py-3 focus:outline-none text-[1rem] font-medium text-gray-900 placeholder:text-gray-400"
                />
              </div>
              <div className="flex items-center px-4">
                <FiMap className="text-gray-400 text-xl mr-2" />
                <span className="font-semibold text-gray-500 mr-2">5km radius</span>
                <FiChevronDown className="text-gray-400" />
              </div>
              <button className="bg-[#0D5B46] hover:bg-[#094736] text-white px-8 py-4 rounded-xl font-bold transition-colors">
                Search Local
              </button>
            </div>

            {/* Social Proof */}
            <div className="flex items-center gap-4">
              <div className="flex -space-x-3">
                <img src="https://i.pravatar.cc/100?img=1" className="w-10 h-10 rounded-full border-2 border-white shadow-sm" alt="User" />
                <img src="https://i.pravatar.cc/100?img=2" className="w-10 h-10 rounded-full border-2 border-white shadow-sm" alt="User" />
                <img src="https://i.pravatar.cc/100?img=3" className="w-10 h-10 rounded-full border-2 border-white shadow-sm" alt="User" />
              </div>
              <span className="text-sm font-bold text-[#0D5B46]">1,200+ <span className="text-gray-500 font-medium tracking-wide">neighbors active today</span></span>
            </div>
          </div>

          <div className="w-[50%] relative flex justify-end">
            <div className="w-[90%] h-[550px] bg-[#f9e9cd] rounded-[2.5rem] relative overflow-hidden flex items-end justify-center shadow-inner">
               {/* Illustration Placeholder - Using generic shapes to mimic the illustration */}
               <div className="absolute inset-0 bg-gradient-to-t from-[#f5d9aa] to-transparent opacity-50"></div>
               <div className="relative z-10 w-full h-full flex items-center justify-center pt-20">
                 <FaCampground className="text-[12rem] text-[#e0a852] opacity-80 mix-blend-multiply" />
               </div>
            </div>
            
            {/* Trust Score Card Overlay */}
            <div className="absolute -left-10 bottom-20 bg-white p-8 rounded-[2rem] shadow-[0_20px_50px_rgba(13,91,70,0.1)] border border-gray-50 flex flex-col items-center justify-center">
               <div className="w-[120px] h-[120px] rounded-full border-[6px] border-gray-100 relative flex items-center justify-center mb-4">
                  <div className="absolute inset-0 rounded-full border-[6px] border-[#0D5B46]" style={{clipPath: 'polygon(0 0, 100% 0, 100% 90%, 0 90%)'}}></div>
                  <span className="text-4xl font-extrabold text-[#0D5B46]">92%</span>
               </div>
               <span className="bg-[#e4f2ee] text-[#0D5B46] text-[10px] font-extrabold px-3 py-1 rounded-full uppercase tracking-widest mb-2">Excellent</span>
               <p className="font-bold text-gray-900">Rentability Score</p>
               <p className="text-xs text-gray-400 font-medium">Top 5% in your area</p>
            </div>
          </div>
        </section>

        {/* Explore Library Category Section */}
        <section className="px-16 py-16 bg-[#fafbfc]">
           <div className="max-w-[1400px] mx-auto">
             <div className="flex justify-between items-end mb-10">
                <div>
                   <h2 className="text-3xl font-extrabold text-gray-900 mb-2">Explore our library</h2>
                   <p className="text-gray-500 font-medium">From garden tools to high-tech drones, find exactly what you need.</p>
                </div>
                <a href="#" className="font-bold text-[#0D5B46] text-sm flex items-center hover:underline">View all categories <FiArrowRight className="ml-1" /></a>
             </div>

             <div className="grid grid-cols-4 gap-6">
                <div className="bg-[#f2f4f3] rounded-3xl p-8 hover:shadow-md transition-shadow cursor-pointer border border-transparent hover:border-gray-200">
                   <div className="w-14 h-14 bg-[#d8f0e6] rounded-2xl flex items-center justify-center mb-6">
                      <BiWrench className="text-2xl text-[#0D5B46]" />
                   </div>
                   <h3 className="text-xl font-bold text-gray-900 mb-2">Tools</h3>
                   <p className="text-sm text-gray-500">Drills, ladders, and saws.</p>
                </div>
                <div className="bg-[#f2f4f3] rounded-3xl p-8 hover:shadow-md transition-shadow cursor-pointer border border-transparent hover:border-gray-200">
                   <div className="w-14 h-14 bg-[#e6eedd] rounded-2xl flex items-center justify-center mb-6">
                      <FaCampground className="text-2xl text-[#4a6b22]" />
                   </div>
                   <h3 className="text-xl font-bold text-gray-900 mb-2">Outdoor</h3>
                   <p className="text-sm text-gray-500">Camping, grills, and garden gear.</p>
                </div>
                <div className="bg-[#f2f4f3] rounded-3xl p-8 hover:shadow-md transition-shadow cursor-pointer border border-transparent hover:border-gray-200">
                   <div className="w-14 h-14 bg-[#fae8e5] rounded-2xl flex items-center justify-center mb-6">
                      <BiGridAlt className="text-2xl text-[#c45a49]" />
                   </div>
                   <h3 className="text-xl font-bold text-gray-900 mb-2">Kitchen</h3>
                   <p className="text-sm text-gray-500">Mixers, air fryers, and pans.</p>
                </div>
                <div className="bg-[#f2f4f3] rounded-3xl p-8 hover:shadow-md transition-shadow cursor-pointer border border-transparent hover:border-gray-200">
                   <div className="w-14 h-14 bg-[#dff0f5] rounded-2xl flex items-center justify-center mb-6">
                      <FaLaptop className="text-2xl text-[#2a7b93]" />
                   </div>
                   <h3 className="text-xl font-bold text-gray-900 mb-2">Tech</h3>
                   <p className="text-sm text-gray-500">Projectors, cameras, and drones.</p>
                </div>
             </div>
           </div>
        </section>

        {/* How it Works */}
        <section className="px-16 py-24 bg-[#f2f4f3]">
           <div className="max-w-[1400px] mx-auto">
             <div className="text-center mb-16">
               <h2 className="text-4xl font-extrabold text-gray-900 mb-3">How It Works</h2>
               <p className="text-gray-500 font-medium">Your journey to a more connected neighborhood starts here.</p>
             </div>

             <div className="grid grid-cols-3 gap-8">
               <div className="bg-white rounded-[2rem] p-10 shadow-sm relative overflow-hidden group">
                  <span className="text-[6rem] font-bold text-gray-100 absolute -top-4 -left-2 leading-none group-hover:text-[#d8f0e6] transition-colors">01</span>
                  <div className="relative z-10 pt-16">
                     <h3 className="text-2xl font-bold text-gray-900 mb-4">Browse</h3>
                     <p className="text-gray-500 text-sm leading-relaxed mb-8">Search for the items you need in your specific neighborhood. Filter by distance, price, and availability.</p>
                     <div className="h-40 bg-gray-900 rounded-2xl w-full flex items-center justify-center">
                        <FiSearch className="text-4xl text-white opacity-20" />
                     </div>
                  </div>
               </div>
               <div className="bg-white rounded-[2rem] p-10 shadow-sm relative overflow-hidden group">
                  <span className="text-[6rem] font-bold text-gray-100 absolute -top-4 -left-2 leading-none group-hover:text-[#d8f0e6] transition-colors">02</span>
                  <div className="relative z-10 pt-16">
                     <h3 className="text-2xl font-bold text-gray-900 mb-4">Book</h3>
                     <p className="text-gray-500 text-sm leading-relaxed mb-8">Secure your rental with our safe payment system. All transactions are insured for up to $1,000.</p>
                     <div className="h-40 bg-[#e4f2ee] rounded-2xl w-full flex items-center justify-between px-6">
                        <div>
                          <p className="text-[#0D5B46] text-[10px] font-bold mb-1 uppercase tracking-wider">Status</p>
                          <p className="font-extrabold text-gray-900">Payment Verified</p>
                        </div>
                        <div className="w-8 h-8 rounded-full bg-[#0D5B46] flex items-center justify-center"><MdOutlineVerifiedUser className="text-white"/></div>
                     </div>
                  </div>
               </div>
               <div className="bg-white rounded-[2rem] p-10 shadow-sm relative overflow-hidden group">
                  <span className="text-[6rem] font-bold text-gray-100 absolute -top-4 -left-2 leading-none group-hover:text-[#d8f0e6] transition-colors">03</span>
                  <div className="relative z-10 pt-16">
                     <h3 className="text-2xl font-bold text-gray-900 mb-4">Pickup</h3>
                     <p className="text-gray-500 text-sm leading-relaxed mb-8">Meet your neighbor at a convenient time and pick up your item. Easy, social, and local.</p>
                     <div className="h-40 flex items-center gap-4">
                        <img src="https://i.pravatar.cc/100?img=4" className="w-12 h-12 rounded-full ring-4 ring-white shadow-md z-10" />
                        <div className="flex-1 h-[2px] bg-gray-200 relative">
                           <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-white border-2 border-gray-300 rounded-full"></div>
                        </div>
                        <img src="https://i.pravatar.cc/100?img=5" className="w-12 h-12 rounded-full ring-4 ring-white shadow-md z-10" />
                     </div>
                  </div>
               </div>
             </div>
           </div>
        </section>

        {/* Testimonials */}
        <section className="px-16 py-24 bg-[#fafbfc]">
           <div className="max-w-[1400px] mx-auto text-center">
             <h2 className="text-4xl font-extrabold text-gray-900 mb-16">Stories from the Block</h2>
             <div className="grid grid-cols-2 gap-8 text-left">
                <div className="bg-white rounded-[2.5rem] p-12 shadow-[0_10px_40px_rgba(0,0,0,0.03)] border border-gray-100 relative">
                   <span className="absolute top-10 right-10 text-[6rem] text-[#f2f4f3] font-serif leading-none italic">&ldquo;</span>
                   <p className="text-xl text-gray-700 font-medium leading-relaxed italic mb-8 relative z-10">
                     &quot;Needed a pressure washer for my deck but didn't want to buy one for just one day. Found Sarah two blocks away. The machine was perfect and I made a new friend!&quot;
                   </p>
                   <div className="flex items-center gap-4">
                      <img src="https://i.pravatar.cc/100?img=9" className="w-12 h-12 rounded-full object-cover" />
                      <div>
                         <p className="font-bold text-gray-900">Emma Richardson</p>
                         <p className="text-xs text-gray-500 font-medium">5.0 Renter in Green Valley</p>
                      </div>
                   </div>
                </div>
                <div className="bg-[#0D5B46] rounded-[2.5rem] p-12 shadow-[0_10px_40px_rgba(13,91,70,0.2)] relative text-white">
                   <span className="absolute top-10 right-10 text-[6rem] text-white/10 font-serif leading-none italic">&ldquo;</span>
                   <p className="text-xl font-medium leading-relaxed italic mb-8 relative z-10 text-emerald-50">
                     &quot;Neighbourly has turned my garage 'dust-gatherers' into a monthly income of about $200. It's safe, the insurance gives me peace of mind, and it's just so easy.&quot;
                   </p>
                   <div className="flex items-center gap-4">
                      <img src="https://i.pravatar.cc/100?img=11" className="w-12 h-12 rounded-full object-cover border-2 border-white/20" />
                      <div>
                         <p className="font-bold">David Miller</p>
                         <p className="text-xs text-emerald-200 font-medium">Local Legend Host</p>
                      </div>
                   </div>
                </div>
             </div>
           </div>
        </section>

        {/* Footer Minimal */}
        <footer className="px-16 py-10 border-t border-gray-200 flex justify-between items-center bg-[#fafbfc]">
           <div className="text-gray-500 text-sm font-medium">
             <span className="text-[#0D5B46] font-extrabold text-lg tracking-tight mr-4 block mb-2">Neighbourly</span>
             © 2024 Neighbourly. Built for the Modern Common.
           </div>
           <div className="flex gap-8 text-sm font-medium text-gray-500">
             <a href="#" className="hover:text-gray-900 transition-colors">Privacy Policy</a>
             <a href="#" className="hover:text-gray-900 transition-colors">Terms of Service</a>
             <a href="#" className="hover:text-gray-900 transition-colors">Safety Guide</a>
             <a href="#" className="hover:text-gray-900 transition-colors">Support</a>
           </div>
           <div className="flex gap-4">
             <div className="w-8 h-8 rounded-full bg-[#d8f0e6] flex items-center justify-center text-[#0D5B46] cursor-pointer hover:bg-[#c2e8da]"><FiHeart className="text-sm"/></div>
             <div className="w-8 h-8 rounded-full bg-[#d8f0e6] flex items-center justify-center text-[#0D5B46] cursor-pointer hover:bg-[#c2e8da]"><FiMap className="text-sm"/></div>
           </div>
        </footer>
      </div>

      {/* =========================================================
          MOBILE LAYOUT (Hidden on desktop)
          ========================================================= */}
      <div className="flex flex-col lg:hidden w-full min-h-screen bg-[#f9faf9] pb-[80px]">
        
        {/* Mobile Header */}
        <header className="flex justify-between items-center px-5 py-4 bg-[#eaf4ef] border-b border-transparent shadow-sm">
          <div className="flex items-center gap-3">
             <FiMenu className="text-[1.5rem] text-[#0D5B46] cursor-pointer" />
             <span className="text-[1.35rem] font-extrabold text-[#0d1611] tracking-tight">Neighbourly</span>
          </div>
          <div className="relative">
             <img src="https://i.pravatar.cc/100?img=32" alt="Profile" className="w-[36px] h-[36px] rounded-full object-cover border-2 border-[#126b52] ring-1 ring-offset-1 ring-[#eaf4ef]" />
          </div>
        </header>

        {/* Mobile Main Content */}
        <main className="flex flex-col">
          
          {/* Top Greenish Section */}
          <div className="bg-[#eaf4ef] px-6 pt-10 pb-8 rounded-b-[2.5rem] mb-6">
            <h1 className="text-[3.5rem] font-extrabold text-gray-900 leading-[1] tracking-tighter mb-8">
              Rent what you <span className="text-[#0D5B46]">need</span>, from who you <span className="text-[#0D5B46]">trust</span>.
            </h1>

            <div className="relative mb-6">
              <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg" />
              <input 
                type="text" 
                placeholder="Search for tools, camping gear..." 
                className="w-full bg-white rounded-2xl py-4 pl-12 pr-4 text-[0.95rem] font-medium placeholder:text-gray-400 shadow-sm focus:outline-none focus:ring-2 focus:ring-[#0D5B46]/30"
              />
            </div>

            <div className="flex items-center gap-3 mb-8">
              <div className="flex -space-x-2">
                <img src="https://i.pravatar.cc/100?img=12" className="w-7 h-7 rounded-full border-2 border-[#eaf4ef]" />
                <img src="https://i.pravatar.cc/100?img=13" className="w-7 h-7 rounded-full border-2 border-[#eaf4ef]" />
                <img src="https://i.pravatar.cc/100?img=14" className="w-7 h-7 rounded-full border-2 border-[#eaf4ef]" />
              </div>
              <p className="text-[11px] font-bold text-[#0D5B46]">1.2k+ <span className="text-gray-600 font-medium">verified locals nearby </span><MdOutlineVerifiedUser className="inline text-sm"/></p>
            </div>

            {/* Trust Score Card */}
            <div className="bg-[#0D5B46] rounded-3xl p-5 shadow-[0_10px_30px_rgba(13,91,70,0.3)] relative overflow-hidden flex justify-between items-center">
               <div className="relative z-10 w-[70%]">
                 <h3 className="text-white font-bold text-lg mb-0.5">Your Trust Score</h3>
                 <p className="text-emerald-100 text-xs mb-3">Alex Rivera • Verified Local</p>
                 <span className="bg-[#b3f0db] text-[#0D5B46] text-[9px] font-extrabold px-3 py-1.5 rounded-full uppercase tracking-widest leading-none">Excellent Resident</span>
               </div>
               <div className="relative z-10">
                 <div className="w-[55px] h-[55px] rounded-full border-4 border-emerald-400/30 flex items-center justify-center relative">
                    <div className="absolute inset-0 rounded-full border-4 border-[#b3f0db]" style={{clipPath: 'polygon(0 0, 100% 0, 100% 90%, 0 90%)'}}></div>
                    <span className="text-white font-extrabold text-sm">98%</span>
                 </div>
               </div>
            </div>
          </div>

          <div className="px-5">
            {/* Browse Local Section */}
            <div className="mb-8">
              <div className="flex justify-between items-end mb-4">
                <h2 className="text-xl font-extrabold text-gray-900">Browse Local</h2>
                <a href="#" className="text-sm font-bold text-[#0D5B46]">See All</a>
              </div>
              
              <div className="flex gap-4 overflow-x-auto pb-4 hide-scrollbar">
                 <div className="flex flex-col items-center flex-shrink-0">
                    <div className="w-24 h-24 rounded-3xl bg-gray-200 mb-2 overflow-hidden relative shadow-sm border border-gray-100 flex items-center justify-center">
                       {/* Mock Image Placeholder */}
                       <div className="absolute inset-0 bg-gradient-to-tr from-gray-800/40 to-transparent"></div>
                       <BiWrench className="text-white text-3xl relative z-10 drop-shadow-md" />
                    </div>
                    <span className="text-xs font-bold text-gray-800">Tools</span>
                 </div>
                 <div className="flex flex-col items-center flex-shrink-0">
                    <div className="w-24 h-24 rounded-3xl bg-gray-200 mb-2 overflow-hidden relative shadow-sm border border-gray-100 flex items-center justify-center">
                       {/* Mock Image Placeholder */}
                       <div className="absolute inset-0 bg-[#e0e1e3]"></div>
                       <BiGridAlt className="text-gray-500 text-3xl relative z-10 drop-shadow-sm" />
                    </div>
                    <span className="text-xs font-bold text-gray-800">Kitchen</span>
                 </div>
                 <div className="flex flex-col items-center flex-shrink-0">
                    <div className="w-24 h-24 rounded-3xl bg-gray-200 mb-2 overflow-hidden relative shadow-sm border border-gray-100 flex items-center justify-center">
                       {/* Mock Image Placeholder */}
                       <div className="absolute inset-0 bg-[#425232] opacity-80"></div>
                       <FaCampground className="text-white text-3xl relative z-10 drop-shadow-md" />
                    </div>
                    <span className="text-xs font-bold text-gray-800">Outdoor</span>
                 </div>
                 <div className="w-6 flex-shrink-0"></div>
              </div>
            </div>

            {/* How it works Section */}
            <div className="bg-[#f2f4f3] rounded-3xl p-6 mb-8 shadow-sm">
               <h2 className="text-lg font-extrabold text-gray-900 mb-6">How it works</h2>
               
               <div className="flex gap-4 mb-6 relative">
                  <div className="w-8 h-8 rounded-full bg-[#b3f0db] text-[#0D5B46] flex items-center justify-center font-bold text-sm flex-shrink-0 z-10">1</div>
                  <div>
                    <h3 className="font-bold text-sm text-gray-900 mb-1">Find your item</h3>
                    <p className="text-gray-500 text-[11px] leading-relaxed">Browse thousands of items from neighbors in your immediate area.</p>
                  </div>
               </div>
               
               <div className="flex gap-4 mb-6 relative">
                  <div className="w-8 h-8 rounded-full bg-[#c3eadc] text-[#0D5B46] flex items-center justify-center font-bold text-sm flex-shrink-0 z-10">2</div>
                  <div>
                    <h3 className="font-bold text-sm text-gray-900 mb-1">Check the Score</h3>
                    <p className="text-gray-500 text-[11px] leading-relaxed">Our Trust Engine verifies every user so you can rent with confidence.</p>
                  </div>
               </div>

               <div className="flex gap-4 mb-8 relative">
                  <div className="w-8 h-8 rounded-full bg-[#fbd4cd] text-[#c45a49] flex items-center justify-center font-bold text-sm flex-shrink-0 z-10">3</div>
                  <div>
                    <h3 className="font-bold text-sm text-gray-900 mb-1">Exchange locally</h3>
                    <p className="text-gray-500 text-[11px] leading-relaxed">Meet up, get your gear, and return it when you're done. No shipping required.</p>
                  </div>
               </div>

               <Link href="/signup" className="w-full block text-center bg-[#0D5B46] text-white font-bold py-4 rounded-2xl shadow-lg shadow-[#0D5B46]/20 transition-transform active:scale-95">
                  Get Started
               </Link>
            </div>

            {/* Nearby Today Section */}
            <div className="mb-8">
              <h2 className="text-lg font-extrabold text-gray-900 mb-4">Nearby Today</h2>
              <div className="bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-sm relative">
                 <div className="h-40 bg-[#e3d1b6] relative">
                    {/* Placeholder for Tripod image */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                    <div className="absolute top-3 right-3 bg-white px-2 py-1 rounded-lg flex items-center gap-1 shadow-md">
                       <span className="text-[#0D5B46]">★</span>
                       <span className="text-[10px] font-bold text-gray-900">4.9</span>
                    </div>
                    <div className="absolute bottom-3 left-3 bg-[#0D5B46] text-white px-3 py-1.5 rounded-lg text-xs font-extrabold shadow-md">
                       $15/day
                    </div>
                 </div>
                 <div className="p-4 relative">
                    <button className="absolute right-4 top-4 text-gray-400 hover:text-red-500"><FiHeart className="text-lg"/></button>
                    <h3 className="font-bold text-gray-900 mb-1">Pro Photography Tripod</h3>
                    <div className="flex items-center text-gray-400 text-[10px] font-medium mb-3">
                       <FiMap className="mr-1" />
                       <span>0.4 miles away • East Village</span>
                    </div>
                    <div className="flex items-center gap-2 pt-3 border-t border-gray-50">
                       <img src="https://i.pravatar.cc/100?img=15" className="w-5 h-5 rounded-full" />
                       <span className="text-[10px] text-gray-500 font-medium">Lent by Marcus G.</span>
                    </div>
                 </div>
              </div>
            </div>

          </div>
        </main>

        {/* Floating Action Button */}
        <div className="fixed bottom-24 right-5 w-14 h-14 bg-[#0D5B46] rounded-full shadow-lg shadow-[#0D5B46]/30 flex items-center justify-center z-50 transition-transform active:scale-95">
           <FiPlus className="text-white text-3xl" />
        </div>

        {/* Fixed Mobile Nav Bar */}
        <nav className="fixed bottom-4 left-4 right-4 bg-white/95 backdrop-blur-xl border border-gray-100/50 rounded-3xl flex justify-around items-center h-[70px] z-50 shadow-xl shadow-gray-200/50">
           <div className="flex flex-col items-center gap-1 text-[#0D5B46] bg-[#eaf4ef] w-14 py-2 rounded-2xl cursor-pointer">
             <FiHome className="text-[1.2rem]" />
             <span className="text-[9px] font-bold">Home</span>
           </div>
           <div className="flex flex-col items-center gap-1 text-gray-400 cursor-pointer hover:text-gray-600 transition-colors">
             <FiMap className="text-[1.2rem]" />
             <span className="text-[9px] font-medium">Map</span>
           </div>
           <div className="flex flex-col items-center gap-1 text-gray-400 cursor-pointer hover:text-gray-600 transition-colors">
             <FiMessageSquare className="text-[1.2rem]" />
             <span className="text-[9px] font-medium">Chat</span>
           </div>
           <div className="flex flex-col items-center gap-1 text-gray-400 cursor-pointer hover:text-gray-600 transition-colors">
             <FiUser className="text-[1.2rem]" />
             <span className="text-[9px] font-medium">Profile</span>
           </div>
        </nav>
      </div>

    </div>
  );
}
