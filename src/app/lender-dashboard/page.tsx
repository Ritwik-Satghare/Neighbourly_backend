"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
   FiSearch, FiMenu, FiBell, FiHome, FiMap, FiMessageSquare,
   FiUser, FiPlus, FiSettings, FiHelpCircle, FiChevronDown, FiDownload,
   FiMoreVertical, FiArrowRight   // ✅ add this
} from 'react-icons/fi';
import { MdOutlineVerifiedUser, MdOutlineDashboard, MdOutlineMessage } from 'react-icons/md';
import { BiBox, BiTrendingUp, BiBarChartAlt2, BiWrench } from 'react-icons/bi';
import { FaLaptop, FaCampground } from 'react-icons/fa';
import { RiMoneyDollarCircleLine } from 'react-icons/ri';

export default function LenderDashboard() {
   const [isLoaded, setIsLoaded] = useState(false);
   const [data, setData] = useState<any>(null);

   // >>> API INTEGRATION POINT <<<
   useEffect(() => {
      async function fetchLenderDashboard() {
         try {
            // REPLACE WITH: const res = await fetch('/api/lender-dashboard'); const json = await res.json();
            await new Promise(resolve => setTimeout(resolve, 800)); // Network delay emulation

            setData({
               user: { name: "Alex", tier: "PREMIER TIER" },
               kpis: { revenue: 1240, revenueGrowth: "+12%", activeListings: 14, pendingRequests: 3, impactScore: 98 },
               rentabilityScore: 90,
               listings: [
                  { id: 1, name: "Rad Power Bike+", category: "Mobility", status: "Live", earnings: 480.00, subtext: "Last rented 2 days ago", image: "https://i.pravatar.cc/150?img=50" },
                  { id: 2, name: "Expedition 4-Person Tent", category: "Outdoors", status: "Rented", earnings: 220.00, subtext: "Last rented 1 week ago", image: "https://i.pravatar.cc/150?img=51" },
                  { id: 3, name: "Pro-Grade Cordless Drill", category: "Home Tools", status: "Paused", earnings: 85.00, subtext: "Paused by owner", image: "https://i.pravatar.cc/150?img=52" }
               ]
            });

            setIsLoaded(true);
         } catch (error) {
            console.error("Failed to load dashboard API data", error);
         }
      }
      fetchLenderDashboard();
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
      <div className="w-full bg-[#fafbfc] min-h-screen font-sans text-gray-900 overflow-x-hidden flex flex-col lg:flex-row">

         {/* =========================================================
          DESKTOP SIDEBAR (Hidden on mobile)
          ========================================================= */}
         <aside className="hidden lg:flex flex-col w-[280px] bg-[#fafbfc] border-r border-gray-100 h-screen sticky top-0 flex-shrink-0">
            <div className="p-8">
               <h1 className="text-2xl font-extrabold tracking-tight text-gray-900 mb-8">
                  <span className="text-xl">The </span>Modern<br />Common
               </h1>

               <div className="flex items-center gap-3 mb-10 pb-6 border-b border-gray-100">
                  <div className="w-1 h-10 bg-[#0D5B46] rounded-full"></div>
                  <div>
                     <h2 className="font-bold text-gray-900 text-sm">Lender Hub</h2>
                     <span className="text-[#0D5B46] font-extrabold text-[10px] tracking-widest uppercase">{data.user.tier}</span>
                  </div>
               </div>

               <nav className="flex flex-col gap-2">
                  <div className="flex items-center gap-4 bg-white text-[#0D5B46] px-5 py-3.5 rounded-xl shadow-sm border border-gray-100 font-bold cursor-pointer">
                     <MdOutlineDashboard className="text-xl" /> Dashboard
                  </div>
                  <div className="flex items-center gap-4 text-gray-400 hover:text-gray-900 hover:bg-white px-5 py-3.5 rounded-xl font-semibold cursor-pointer transition-colors">
                     <BiBox className="text-xl" /> My Listings
                  </div>
                  <div className="flex items-center gap-4 text-gray-400 hover:text-gray-900 hover:bg-white px-5 py-3.5 rounded-xl font-semibold cursor-pointer transition-colors">
                     <FiMap className="text-xl" /> Rentals
                  </div>
                  <div className="flex items-center gap-4 text-gray-400 hover:text-gray-900 hover:bg-white px-5 py-3.5 rounded-xl font-semibold cursor-pointer transition-colors">
                     <RiMoneyDollarCircleLine className="text-xl" /> Earnings
                  </div>
                  <div className="flex items-center gap-4 text-gray-400 hover:text-gray-900 hover:bg-white px-5 py-3.5 rounded-xl font-semibold cursor-pointer transition-colors">
                     <BiBarChartAlt2 className="text-xl" /> Analytics
                  </div>
                  <div className="flex items-center gap-4 text-gray-400 hover:text-gray-900 hover:bg-white px-5 py-3.5 rounded-xl font-semibold cursor-pointer transition-colors">
                     <MdOutlineMessage className="text-xl" /> Messages
                  </div>
               </nav>
            </div>

            <div className="mt-auto p-8 border-t border-gray-100">
               <div className="flex flex-col gap-2 mb-6">
                  <div className="flex items-center gap-4 text-gray-400 hover:text-gray-900 cursor-pointer font-semibold px-2">
                     <FiSettings className="text-xl" /> Settings
                  </div>
                  <div className="flex items-center gap-4 text-gray-400 hover:text-gray-900 cursor-pointer font-semibold px-2">
                     <FiHelpCircle className="text-xl" /> Support
                  </div>
               </div>
               <button className="w-full py-3 border border-gray-200 text-[#0D5B46] font-bold text-sm rounded-xl hover:bg-[#e4f2ee] transition-colors">
                  View Public Profile
               </button>
            </div>
         </aside>

         {/* =========================================================
          DESKTOP & MOBILE MAIN CONTENT
          ========================================================= */}
         <main className="flex-1 flex flex-col bg-[#fdfdfd] min-h-screen">

            {/* Desktop Header */}
            <header className="hidden lg:flex items-center justify-between px-12 py-6 sticky top-0 bg-[#fdfdfd]/90 backdrop-blur-md z-40">
               <div className="relative w-96">
                  <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg" />
                  <input
                     type="text"
                     placeholder="Search your tools..."
                     className="w-full bg-[#f4f7f6] rounded-full py-2.5 pl-12 pr-4 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#0D5B46]/30"
                  />
               </div>
               <div className="flex items-center gap-6">
                  <FiBell className="text-gray-400 text-xl hover:text-gray-900 cursor-pointer" />
                  <FiHelpCircle className="text-gray-400 text-xl hover:text-gray-900 cursor-pointer" />
                  <button className="bg-[#0D5B46] hover:bg-[#094736] text-white px-6 py-2 rounded-full font-bold text-sm transition-colors shadow-sm">
                     List an Item
                  </button>
                  <img src="https://i.pravatar.cc/150?img=32" alt="Profile" className="w-10 h-10 rounded-full border-2 border-white ring-2 ring-[#0D5B46] object-cover cursor-pointer" />
               </div>
            </header>

            {/* Mobile Header (Hidden on Desktop) */}
            <header className="lg:hidden flex justify-between items-center px-5 py-4 bg-white sticky top-0 z-40 border-b border-gray-100 shadow-sm">
               <div className="flex items-center gap-3">
                  <FiMenu className="text-[1.5rem] text-[#0D5B46] cursor-pointer" />
                  <span className="text-[1.2rem] font-extrabold text-[#0D5B46] tracking-tight">The Modern Common</span>
               </div>
               <div className="relative">
                  <img src="https://i.pravatar.cc/100?img=32" alt="Profile" className="w-8 h-8 rounded-full object-cover border-2 border-[#126b52]" />
               </div>
            </header>

            <div className="px-5 lg:px-12 py-8 lg:py-6 flex-1 max-w-[1400px]">

               {/* Welcome Section */}
               <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end mb-10 w-full gap-4">
                  <div>
                     <h2 className="text-3xl lg:text-4xl font-extrabold text-gray-900 tracking-tight mb-2">Welcome back, {data.user.name}.</h2>
                     <p className="text-gray-500 font-medium text-sm lg:text-base flex items-center flex-wrap gap-2">
                        Your community footprint is growing. You've reached
                        <span className="bg-[#b3f0db] text-[#0D5B46] text-[10px] font-extrabold px-2.5 py-1 rounded-full uppercase tracking-widest leading-none">{data.user.tier}</span>
                        this month.
                     </p>
                  </div>
                  <button className="hidden lg:flex items-center gap-2 bg-[#f4f7f6] hover:bg-gray-200 text-gray-700 font-bold px-4 py-2.5 rounded-lg text-sm transition-colors border border-gray-200">
                     <FiDownload className="text-lg" /> Export Report
                  </button>
               </div>

               {/* KPIs Grid */}
               <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-10">
                  {/* KPI 1 */}
                  <div className="bg-white border border-gray-100 rounded-2xl p-5 lg:p-6 shadow-sm hover:shadow-md transition-shadow relative">
                     <span className="absolute top-5 right-5 text-[#0D5B46] font-bold text-xs">{data.kpis.revenueGrowth}</span>
                     <div className="w-10 h-10 bg-[#eef7f4] rounded-xl flex items-center justify-center mb-4">
                        <RiMoneyDollarCircleLine className="text-[#0D5B46] text-xl" />
                     </div>
                     <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Weekly Revenue</p>
                     <p className="text-2xl lg:text-3xl font-extrabold text-gray-900">${data.kpis.revenue.toLocaleString()}</p>
                  </div>
                  {/* KPI 2 */}
                  <div className="bg-white border border-gray-100 rounded-2xl p-5 lg:p-6 shadow-sm hover:shadow-md transition-shadow relative">
                     <div className="w-10 h-10 bg-[#f4f7f6] rounded-xl flex items-center justify-center mb-4">
                        <BiBox className="text-[#5a7168] text-xl" />
                     </div>
                     <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Active Listings</p>
                     <p className="text-2xl lg:text-3xl font-extrabold text-gray-900">{data.kpis.activeListings}</p>
                  </div>
                  {/* KPI 3 */}
                  <div className="bg-white border border-gray-100 rounded-2xl p-5 lg:p-6 shadow-sm hover:shadow-md transition-shadow relative">
                     <span className="absolute top-5 right-5 bg-[#c45a49] text-white font-bold text-[9px] px-2 py-0.5 rounded uppercase tracking-wider">Urgent</span>
                     <div className="w-10 h-10 bg-[#fae8e5] rounded-xl flex items-center justify-center mb-4">
                        <FiBell className="text-[#c45a49] text-xl" />
                     </div>
                     <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Pending Requests</p>
                     <p className="text-2xl lg:text-3xl font-extrabold text-gray-900">{data.kpis.pendingRequests}</p>
                  </div>
                  {/* KPI 4 */}
                  <div className="bg-white border border-gray-100 rounded-2xl p-5 lg:p-6 shadow-sm hover:shadow-md transition-shadow relative">
                     <div className="w-10 h-10 bg-[#e4f9f3] rounded-xl flex items-center justify-center mb-4">
                        <MdOutlineVerifiedUser className="text-[#0D5B46] text-xl" />
                     </div>
                     <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Impact Score</p>
                     <p className="text-2xl lg:text-3xl font-extrabold text-gray-900">{data.kpis.impactScore}%</p>
                  </div>
               </div>

               {/* Charts Section */}
               <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10">
                  {/* Chart 1 */}
                  <div className="lg:col-span-2 bg-[#f6f8f7] rounded-[2rem] p-6 lg:p-8 flex flex-col shadow-inner relative border border-gray-100">
                     <div className="flex justify-between items-start mb-6">
                        <div>
                           <h3 className="text-xl font-extrabold text-gray-900 mb-1">Earnings Performance</h3>
                           <p className="text-sm text-gray-500 font-medium">Daily breakdown for the last 7 days</p>
                        </div>
                        <div className="flex bg-white rounded-lg p-1 border border-gray-200">
                           <button className="px-4 py-1 text-xs font-bold text-gray-800 bg-gray-100 rounded-md">Daily</button>
                           <button className="px-4 py-1 text-xs font-bold text-gray-400 hover:text-gray-800">Weekly</button>
                        </div>
                     </div>

                     {/* Fake Bar Chart */}
                     <div className="flex-1 flex items-end justify-between gap-2 lg:gap-4 mt-8 min-h-[200px]">
                        <div className="w-full bg-[#dce6e1] rounded-t-md h-[40%] relative"><span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[10px] font-bold text-gray-500">MON</span></div>
                        <div className="w-full bg-[#dce6e1] rounded-t-md h-[60%] relative"><span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[10px] font-bold text-gray-500">TUE</span></div>
                        <div className="w-full bg-[#dce6e1] rounded-t-md h-[30%] relative"><span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[10px] font-bold text-gray-500">WED</span></div>
                        <div className="w-full bg-[#0D5B46] rounded-t-md h-[80%] relative shadow-lg z-10">
                           <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-[10px] font-bold py-1.5 px-3 rounded-lg whitespace-nowrap after:content-[''] after:absolute after:-bottom-1 after:left-1/2 after:-translate-x-1/2 after:border-4 after:border-transparent after:border-t-gray-900">
                              Today: $320
                           </div>
                           <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[10px] font-extrabold text-gray-900">THU</span>
                        </div>
                        <div className="w-full bg-[#dce6e1] rounded-t-md h-[55%] relative"><span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[10px] font-bold text-gray-500">FRI</span></div>
                        <div className="w-full bg-[#dce6e1] rounded-t-md h-[45%] relative"><span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[10px] font-bold text-gray-500">SAT</span></div>
                        <div className="w-full bg-[#dce6e1] rounded-t-md h-[50%] relative"><span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[10px] font-bold text-gray-500">SUN</span></div>
                     </div>
                  </div>

                  {/* Chart 2 */}
                  <div className="bg-white rounded-[2rem] p-6 lg:p-8 shadow-[0_10px_30px_rgba(0,0,0,0.03)] border border-gray-100 flex flex-col items-center text-center relative overflow-hidden">
                     <h3 className="text-lg font-extrabold text-gray-900 mb-8 w-full text-center">Rentability Score</h3>

                     <div className="relative w-[150px] h-[150px] mb-6">
                        <div className="absolute inset-0 rounded-full border-[8px] border-gray-100"></div>
                        <div className="absolute inset-0 rounded-full border-[8px] border-[#0D5B46] border-t-transparent" style={{ transform: 'rotate(-45deg)' }}></div>
                        <div className="absolute inset-0 flex items-center justify-center flex-col">
                           <span className="text-[2.5rem] font-extrabold text-gray-900 leading-none">90%</span>
                        </div>
                        <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-[#b3f0db] text-[#0D5B46] text-[9px] font-extrabold px-3 py-1 rounded-full uppercase tracking-widest z-10 shadow-sm border border-white">
                           Excellent
                        </div>
                     </div>

                     <p className="text-gray-500 text-sm font-medium mb-8 leading-relaxed max-w-[220px]">
                        Your items are 40% more likely to be rented compared to last month. Keep it up!
                     </p>

                     <button className="w-full bg-[#0D5B46] hover:bg-[#094736] text-white font-bold py-3.5 rounded-xl transition-colors shadow-md mt-auto">
                        Improve Score
                     </button>
                  </div>
               </div>

               {/* Listing Management */}
               <div>
                  <div className="flex justify-between items-end mb-6">
                     <h2 className="text-2xl font-extrabold text-gray-900 tracking-tight">Listing Management</h2>
                     <a href="#" className="font-bold text-[#0D5B46] text-sm flex items-center hover:underline">View All <FiArrowRight className="ml-1" /></a>
                  </div>

                  <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 overflow-x-auto">
                     <table className="w-full min-w-[700px]">
                        <thead>
                           <tr className="border-b border-gray-100">
                              <th className="text-left text-[10px] font-extrabold text-gray-400 uppercase tracking-widest pb-4 pl-2">Item Detail</th>
                              <th className="text-left text-[10px] font-extrabold text-gray-400 uppercase tracking-widest pb-4">Category</th>
                              <th className="text-left text-[10px] font-extrabold text-gray-400 uppercase tracking-widest pb-4">Status</th>
                              <th className="text-right text-[10px] font-extrabold text-gray-400 uppercase tracking-widest pb-4">Total Earnings</th>
                              <th className="text-center text-[10px] font-extrabold text-gray-400 uppercase tracking-widest pb-4 w-20">Actions</th>
                           </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                           {data.listings.map((item: any) => (
                              <tr key={item.id} className="hover:bg-gray-50/50 transition-colors group">
                                 <td className="py-4 pl-2">
                                    <div className="flex items-center gap-4">
                                       <div className="w-12 h-12 rounded-xl bg-gray-100 border border-gray-200 overflow-hidden flex items-center justify-center flex-shrink-0">
                                          {/* Mocking generic icons based on category */}
                                          {item.category === "Mobility" && <BiTrendingUp className="text-2xl text-gray-400" />}
                                          {item.category === "Outdoors" && <FaCampground className="text-2xl text-gray-400" />}
                                          {item.category === "Home Tools" && <BiWrench className="text-2xl text-gray-400" />}
                                       </div>
                                       <div>
                                          <h4 className="font-bold text-gray-900 text-sm mb-0.5">{item.name}</h4>
                                          <p className="text-xs text-gray-400 font-medium">{item.subtext}</p>
                                       </div>
                                    </div>
                                 </td>
                                 <td className="py-4">
                                    <span className="bg-[#f0f4f2] text-gray-600 text-[11px] font-bold px-3 py-1.5 rounded-lg border border-gray-100">{item.category}</span>
                                 </td>
                                 <td className="py-4">
                                    <div className="flex items-center gap-2">
                                       <div className={`w-2 h-2 rounded-full ${item.status === 'Live' ? 'bg-[#0D5B46]' : item.status === 'Rented' ? 'bg-[#c45a49]' : 'bg-gray-300'}`}></div>
                                       <span className="text-sm font-bold text-gray-700">{item.status}</span>
                                    </div>
                                 </td>
                                 <td className="py-4 text-right">
                                    <span className="text-sm font-extrabold text-gray-900">${item.earnings.toFixed(2)}</span>
                                 </td>
                                 <td className="py-4 text-center">
                                    <button className="text-gray-400 hover:text-gray-900 p-2 rounded-lg hover:bg-gray-100 transition-colors">
                                       <FiMoreVertical className="text-lg" />
                                    </button>
                                 </td>
                              </tr>
                           ))}
                        </tbody>
                     </table>
                  </div>
               </div>

            </div>
         </main>

         {/* =========================================================
          MOBILE BOTTOM NAV (Hidden on desktop)
          ========================================================= */}
         <nav className="lg:hidden fixed bottom-4 left-4 right-4 bg-white/95 backdrop-blur-xl border border-gray-100/50 rounded-3xl flex justify-around items-center h-[70px] z-50 shadow-xl shadow-gray-200/50">
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
   );
}
