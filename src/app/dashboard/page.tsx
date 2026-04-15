"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  FiSearch, FiBell, FiMessageSquare, FiMenu,
  FiHome, FiMap, FiUser, FiPlusCircle,
  FiGrid, FiCalendar, FiBox, FiTrendingUp, FiAward,
  FiCheckCircle, FiChevronRight, FiHelpCircle
} from 'react-icons/fi';
import { MdOutlineVerifiedUser, MdOutlinePhotoCamera, MdStars } from 'react-icons/md';
import { BiWrench, BiCycling } from 'react-icons/bi';
import { FaLaptop, FaCampground } from 'react-icons/fa';
import { RiMoneyDollarCircleLine, RiSecurePaymentLine } from 'react-icons/ri';

export default function DashboardPage() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [data, setData] = useState<any>(null);

  // >>> API INTEGRATION POINT <<<
  // Simulate fetching consolidated dashboard data from backend on mount.
  useEffect(() => {
    async function fetchDashboardData() {
      try {
        // REPLACE WITH: const res = await fetch('/api/dashboard'); const json = await res.json();
        await new Promise(resolve => setTimeout(resolve, 800)); // Network delay emulation

        setData({
          user: { name: "Alex Smith", level: "Local Legend (Level 5)", isPlus: true },
          // Mock data matching the design constraints
          desktopKpis: { earnings: 1200.00, activeRentals: 3, trustScore: 98.5, totalListings: 14 },
          mobileKpis: { earnings: 450, itemsRented: 12, trustScore: 98 },
        });

        setIsLoaded(true);
      } catch (error) {
        console.error("Failed to load generic dashboard API data", error);
      }
    }
    fetchDashboardData();
  }, []);

  if (!isLoaded || !data) {
    return (
      <div className="w-full h-screen flex flex-col items-center justify-center bg-[#fafbfc]">
        <div className="w-12 h-12 border-4 border-[#126b52]/20 border-t-[#126b52] rounded-full animate-spin mb-4"></div>
        <p className="text-[#126b52] font-semibold tracking-widest uppercase text-sm animate-pulse">Loading API...</p>
      </div>
    );
  }

  return (
    <div className="w-full bg-white font-sans text-gray-900 overflow-x-hidden">

      {/* =========================================================
          DESKTOP LAYOUT (Hidden on mobile)
          Matches large screen screenshot exactly.
          ========================================================= */}
      <div className="hidden lg:flex w-full h-screen overflow-hidden flex-col bg-white">
        {/* Desktop Header */}
        <header className="h-[90px] flex items-center justify-between px-10 bg-[#fafbfc] sticky top-0 z-50 flex-shrink-0">
          <div className="flex items-center gap-12">
            <span className="text-[1.8rem] font-extrabold text-[#126b52] tracking-tight">Proximi</span>
            <nav className="flex items-center gap-8 text-[1.1rem] font-semibold text-gray-500">
              <Link href="#" className="text-[#126b52] font-bold">Browse</Link>
              <Link href="#" className="hover:text-[#126b52] transition-colors">How it Works</Link>
              <Link href="#" className="hover:text-[#126b52] transition-colors">List an Item</Link>
              <Link href="#" className="hover:text-[#126b52] transition-colors">Community</Link>
            </nav>
          </div>
          <div className="flex items-center gap-8">
            <div className="relative">
              <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg" />
              <input type="text" placeholder="Search neighborhood..." className="bg-[#f0f4f2] text-gray-900 placeholder:text-gray-500 rounded-full py-3 pl-12 pr-6 text-[1rem] w-[320px] focus:outline-none focus:ring-2 focus:ring-[#126b52]/50 font-medium" />
            </div>
            <div className="flex items-center gap-6 text-gray-500 text-2xl">
              <FiBell className="hover:text-[#126b52] cursor-pointer" />
              <FiMessageSquare className="hover:text-[#126b52] cursor-pointer" />
              <img src="https://i.pravatar.cc/100?img=33" alt="Profile" className="w-12 h-12 rounded-full object-cover border-2 border-white ring-2 ring-[#126b52] cursor-pointer shadow-sm" />
            </div>
          </div>
        </header>

        {/* Desktop Main Grid */}
        <div className="flex flex-1 overflow-hidden h-[calc(100vh-90px)]">
          {/* Desktop Left Sidebar */}
          <aside className="w-[300px] 2xl:w-[340px] flex flex-col bg-[#fafbfc] border-r border-[#fafbfc] p-8 2xl:p-10 flex-shrink-0">
            <div className="mb-12">
              <p className="text-[#126b52] text-[11px] font-bold tracking-widest uppercase mb-1.5 opacity-80">Welcome back</p>
              <h2 className="text-gray-900 font-extrabold text-[1.15rem] leading-tight flex items-center gap-2">
                {data.user.level}
              </h2>
            </div>

            <nav className="flex flex-col gap-3 font-bold text-[1.1rem]">
              <div className="flex items-center gap-4 bg-white text-[#126b52] px-5 py-4 rounded-2xl shadow-[0_2px_10px_rgba(18,107,82,0.08)] cursor-pointer border border-[#126b52]/10">
                <FiGrid className="text-xl" /> Overview
              </div>
              <div className="flex items-center gap-4 text-gray-500 hover:text-gray-900 hover:bg-gray-100 px-5 py-4 rounded-2xl cursor-pointer transition-colors">
                <FiCalendar className="text-xl" /> My Bookings
              </div>
              <div className="flex items-center gap-4 text-gray-500 hover:text-gray-900 hover:bg-gray-100 px-5 py-4 rounded-2xl cursor-pointer transition-colors">
                <FiBox className="text-xl" /> My Listings
              </div>
              <div className="flex items-center gap-4 text-gray-500 hover:text-gray-900 hover:bg-gray-100 px-5 py-4 rounded-2xl cursor-pointer transition-colors">
                <FiTrendingUp className="text-xl" /> Earnings
              </div>
              <div className="flex items-center gap-4 text-gray-500 hover:text-gray-900 hover:bg-gray-100 px-5 py-4 rounded-2xl cursor-pointer transition-colors">
                <FiAward className="text-xl" /> Badges
              </div>
            </nav>

            <button className="mt-auto bg-[#126b52] hover:bg-[#0e523f] text-white py-4 2xl:py-5 rounded-2xl text-[1.1rem] font-extrabold flex items-center justify-center gap-3 shadow-lg shadow-[#126b52]/20 transition-all">
              <FiPlusCircle className="text-xl" /> List New Item
            </button>
          </aside>

          {/* Desktop Dashboard Area */}
          <main className="flex-1 bg-white p-10 2xl:p-14 overflow-y-auto h-full rounded-tl-2xl shadow-sm border-t border-l border-gray-100/50">
            <div className="w-full flex flex-col max-w-none pb-20">

              {/* Header */}
              <div className="flex justify-between items-end mb-8 flex-shrink-0">
                <div>
                  <h1 className="text-[2.8rem] 2xl:text-[3.2rem] font-extrabold text-gray-900 tracking-tight leading-none mb-3">Dashboard</h1>
                  <p className="text-gray-500 font-medium text-[1.1rem] 2xl:text-[1.2rem]">Manage your local impact and earnings at a glance.</p>
                </div>
                <div className="flex items-center gap-3 bg-[#f0f4f2] text-[#126b52] font-bold px-5 py-3 rounded-2xl text-[1rem]">
                  <FiCalendar className="text-xl" /> April 2024
                </div>
              </div>

              {/* 4 KPI Cards Grid */}
              <div className="grid grid-cols-4 gap-6 2xl:gap-8 mb-10 flex-shrink-0">
                {/* Total Earnings */}
                <div className="bg-white border-2 border-gray-100 rounded-[2rem] p-6 2xl:p-8 shadow-sm flex flex-col justify-between">
                  <div className="flex justify-between items-start mb-6">
                    <span className="text-gray-500 font-bold text-[0.9rem] 2xl:text-[1rem]">Total Earnings</span>
                    <div className="bg-[#eafaf1] p-2.5 rounded-xl"><RiMoneyDollarCircleLine className="text-[#126b52] text-2xl" /></div>
                  </div>
                  <div>
                    <div className="text-[2.5rem] 2xl:text-[3rem] font-extrabold text-[#126b52] leading-none mb-3">
                      ${data.desktopKpis.earnings.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </div>
                    <span className="text-[#126b52] font-extrabold text-[11px] 2xl:text-[13px] bg-[#eafaf1] px-3 py-1.5 rounded-lg flex items-center inline-flex w-fit"><FiTrendingUp className="mr-1.5" /> +12% from last month</span>
                  </div>
                </div>

                {/* Active Rentals */}
                <div className="bg-white border-2 border-gray-100 rounded-[2rem] p-6 2xl:p-8 shadow-sm flex flex-col justify-between">
                  <div className="flex justify-between items-start mb-6">
                    <span className="text-gray-500 font-bold text-[0.9rem] 2xl:text-[1rem]">Active Rentals</span>
                    <div className="bg-[#eafaf1] p-2.5 rounded-xl"><FiGrid className="text-[#126b52] text-2xl" /></div>
                  </div>
                  <div>
                    <div className="text-[2.5rem] 2xl:text-[3rem] font-extrabold text-gray-900 leading-none mb-3">{data.desktopKpis.activeRentals}</div>
                    <span className="text-gray-400 font-bold text-[12px] 2xl:text-[14px]">2 due this week</span>
                  </div>
                </div>

                {/* Trust Score */}
                <div className="bg-white border-[3px] border-[#126b52]/10 rounded-[2rem] p-6 2xl:p-8 shadow-[0_8px_30px_rgba(18,107,82,0.06)] flex flex-col items-center justify-center relative overflow-hidden">
                  <span className="text-gray-500 font-bold text-[0.9rem] 2xl:text-[1rem] absolute top-6 left-6 2xl:left-8">Trust Score</span>
                  <div className="relative w-[100px] h-[100px] 2xl:w-[130px] 2xl:h-[130px] flex items-center justify-center mt-6">
                    <div className="absolute inset-0 rounded-full border-[6px] border-gray-100"></div>
                    <div className="absolute inset-0 rounded-full border-[6px] border-[#126b52] border-t-transparent" style={{ transform: 'rotate(-45deg)' }}></div>
                    <div className="flex flex-col items-center">
                      <span className="text-[2.2rem] 2xl:text-[3rem] font-extrabold text-gray-900 leading-none">{data.desktopKpis.trustScore}</span>
                    </div>
                  </div>
                  <span className="bg-[#126b52] text-white text-[11px] 2xl:text-[12px] font-extrabold px-4 py-1.5 rounded-full uppercase tracking-widest mt-4">Excellent</span>
                </div>

                {/* Total Listings */}
                <div className="bg-white border-2 border-gray-100 rounded-[2rem] p-6 2xl:p-8 shadow-sm flex flex-col justify-between">
                  <div className="flex justify-between items-start mb-6">
                    <span className="text-gray-500 font-bold text-[0.9rem] 2xl:text-[1rem]">Total Listings</span>
                    <div className="bg-[#fff0ed] p-2.5 rounded-xl"><FiBox className="text-[#e25c3d] text-2xl" /></div>
                  </div>
                  <div>
                    <div className="text-[2.5rem] 2xl:text-[3rem] font-extrabold text-gray-900 leading-none mb-3">{data.desktopKpis.totalListings}</div>
                    <span className="text-gray-400 font-bold text-[12px] 2xl:text-[14px]">8 currently available</span>
                  </div>
                </div>
              </div>

              {/* My Bookings Section */}
              <div className="mb-10">
                <div className="flex justify-between items-end mb-4">
                  <h3 className="text-xl font-bold text-gray-900">My Bookings</h3>
                  <span className="text-[#126b52] font-semibold text-xs cursor-pointer hover:underline">View all</span>
                </div>

                <div className="grid grid-cols-3 gap-5">
                  {/* Card 1 */}
                  <div className="bg-white border border-gray-100 rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                    <div className="h-[140px] bg-[#f8f9fa] relative p-4 flex items-center justify-center">
                      <span className="absolute top-3 left-3 bg-white text-[#126b52] text-[9px] font-bold px-2 py-1 rounded-md uppercase tracking-wider shadow-sm z-10">IN USE</span>
                      <FaLaptop className="text-[5rem] text-gray-300 drop-shadow-lg" />
                    </div>
                    <div className="p-4">
                      <h4 className="font-bold text-[0.95rem] text-gray-900 mb-1">4K Home Theater Projector</h4>
                      <p className="text-gray-400 text-xs font-semibold mb-4 flex items-center"><FiCalendar className="mr-1.5" /> Apr 18 - Apr 21</p>
                      <div className="flex justify-between items-center pt-3 border-t border-gray-100">
                        <div className="flex items-center gap-2">
                          <img src="https://i.pravatar.cc/100?img=5" alt="User" className="w-5 h-5 rounded-full" />
                          <span className="text-xs text-gray-500 font-medium">Lent by Sarah J.</span>
                        </div>
                        <span className="font-bold text-[#126b52]">$45.00</span>
                      </div>
                    </div>
                  </div>
                  {/* Card 2 */}
                  <div className="bg-white border border-gray-100 rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                    <div className="h-[140px] bg-[#126b52]/10 relative p-4 flex items-center justify-center">
                      <span className="absolute top-3 left-3 bg-[#126b52] text-white text-[9px] font-bold px-2 py-1 rounded-md uppercase tracking-wider shadow-sm z-10">UPCOMING</span>
                      <FaCampground className="text-[5rem] text-[#126b52] drop-shadow-lg" />
                    </div>
                    <div className="p-4">
                      <h4 className="font-bold text-[0.95rem] text-gray-900 mb-1">4-Person All-Weather Tent</h4>
                      <p className="text-gray-400 text-xs font-semibold mb-4 flex items-center"><FiCalendar className="mr-1.5" /> May 02 - May 05</p>
                      <div className="flex justify-between items-center pt-3 border-t border-gray-100">
                        <div className="flex items-center gap-2">
                          <img src="https://i.pravatar.cc/100?img=8" alt="User" className="w-5 h-5 rounded-full" />
                          <span className="text-xs text-gray-500 font-medium">Lent by Mike R.</span>
                        </div>
                        <span className="font-bold text-[#126b52]">$30.00</span>
                      </div>
                    </div>
                  </div>
                  {/* Card 3 */}
                  <div className="bg-white border border-gray-100 rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                    <div className="h-[140px] bg-[#fcf8e3] relative p-4 flex items-center justify-center">
                      <span className="absolute top-3 left-3 bg-white text-gray-600 text-[9px] font-bold px-2 py-1 rounded-md uppercase tracking-wider shadow-sm z-10">RETURNED</span>
                      <BiWrench className="text-[5rem] text-[#eab308] drop-shadow-lg" />
                    </div>
                    <div className="p-4">
                      <h4 className="font-bold text-[0.95rem] text-gray-900 mb-1">High-Power Pressure Washer</h4>
                      <p className="text-gray-400 text-xs font-semibold mb-4 flex items-center"><FiCalendar className="mr-1.5" /> Apr 05 - Apr 06</p>
                      <div className="flex justify-between items-center pt-3 border-t border-gray-100">
                        <div className="flex items-center gap-2">
                          <img src="https://i.pravatar.cc/100?img=1" alt="User" className="w-5 h-5 rounded-full" />
                          <span className="text-xs text-gray-500 font-medium">Lent by Anna W.</span>
                        </div>
                        <span className="font-bold text-[#126b52]">$20.00</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* My Listings Section */}
              <div className="mb-10">
                <div className="flex justify-between items-end mb-4">
                  <h3 className="text-xl font-bold text-gray-900">My Listings</h3>
                  <div className="flex gap-2 text-gray-400">
                    <FiGrid className="text-lg text-[#126b52] bg-[#eafaf1] p-1 rounded-md cursor-pointer" />
                    <FiMenu className="text-lg cursor-pointer hover:text-gray-600" />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-5">
                  {/* Card 1 */}
                  <div className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm flex items-center gap-4">
                    <div className="w-[70px] h-[70px] rounded-xl bg-gradient-to-br from-[#126b52] to-[#0a4d3a] flex items-center justify-center shadow-inner flex-shrink-0">
                      <BiWrench className="text-3xl text-white opacity-80" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h5 className="font-bold text-sm text-gray-900 truncate">Professional Power Drill</h5>
                      <p className="text-[#126b52] text-[10px] font-bold mb-1">Available Now</p>
                      <div className="flex justify-between items-center mt-2">
                        <span className="text-xs text-gray-400 font-medium">12 Rentals</span>
                        <span className="text-sm font-bold text-[#126b52]">$25/day</span>
                      </div>
                    </div>
                  </div>
                  {/* Card 2 */}
                  <div className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm flex items-center gap-4">
                    <div className="w-[70px] h-[70px] rounded-xl bg-[#e6f1ef] flex items-center justify-center shadow-inner flex-shrink-0">
                      <BiCycling className="text-3xl text-[#126b52]" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h5 className="font-bold text-sm text-gray-900 truncate">All-Terrain Mountain Bike</h5>
                      <p className="text-[#e25c3d] text-[10px] font-bold mb-1">Rented until Apr 25</p>
                      <div className="flex justify-between items-center mt-2">
                        <span className="text-xs text-gray-400 font-medium">45 Rentals</span>
                        <span className="text-sm font-bold text-[#126b52]">$40/day</span>
                      </div>
                    </div>
                  </div>
                  {/* Add New Card */}
                  <div className="border border-dashed border-gray-300 rounded-2xl p-4 flex items-center gap-4 hover:bg-gray-50 cursor-pointer transition-colors group">
                    <div className="w-[70px] h-[70px] rounded-xl bg-gray-100 flex items-center justify-center flex-shrink-0 group-hover:bg-[#126b52]/10 transition-colors">
                      <FiPlusCircle className="text-2xl text-gray-400 group-hover:text-[#126b52]" />
                    </div>
                    <div className="flex-1 text-xs text-gray-500 font-medium pr-4">
                      Have something sitting around? List it and start earning!
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom Structure: Chart & Activity */}
              <div className="grid grid-cols-3 gap-6 2xl:gap-8 flex-1 min-h-[220px]">
                {/* Chart */}
                <div className="col-span-2 bg-[#f4f7f6] rounded-[2rem] p-6 2xl:p-8 flex flex-col relative shadow-inner border border-gray-100">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h4 className="text-lg 2xl:text-xl font-extrabold text-gray-900">Performance Chart</h4>
                      <p className="text-[13px] text-gray-500 font-semibold mt-1">Earnings growth over the last 6 months</p>
                    </div>
                    <div className="flex bg-white rounded-xl p-1.5 shadow-sm border border-gray-100">
                      <button className="px-5 py-1.5 text-xs font-extrabold text-[#126b52] bg-[#f0f4f2] rounded-lg">Monthly</button>
                      <button className="px-5 py-1.5 text-xs font-bold text-gray-400 hover:text-gray-600">Weekly</button>
                    </div>
                  </div>
                  {/* Fake Chart Bars */}
                  <div className="flex items-end justify-between flex-1 gap-5 mt-4 min-h-[140px]">
                    <div className="w-full bg-[#e2ebe7] rounded-md h-[40%] relative"><span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[10px] font-bold text-gray-400">NOV</span></div>
                    <div className="w-full bg-[#e2ebe7] rounded-md h-[45%] relative"><span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[9px] font-bold text-gray-400">DEC</span></div>
                    <div className="w-full bg-[#e2ebe7] rounded-md h-[35%] relative"><span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[9px] font-bold text-gray-400">JAN</span></div>
                    <div className="w-full bg-[#e2ebe7] rounded-md h-[60%] relative"><span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[9px] font-bold text-gray-400">FEB</span></div>
                    <div className="w-full bg-[#126b52] rounded-md h-[75%] shadow-[0_5px_15px_rgba(18,107,82,0.3)] relative"><span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[9px] font-bold text-gray-900">MAR</span></div>
                    <div className="w-full bg-[#e2ebe7] rounded-md h-[85%] relative"><span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[9px] font-bold text-gray-400">APR</span></div>
                  </div>
                </div>

                {/* Recent Activity */}
                <div className="bg-white rounded-[2rem] p-6 2xl:p-8 flex flex-col border border-gray-100 shadow-sm">
                  <h4 className="text-lg 2xl:text-xl font-extrabold text-gray-900 mb-6">Recent Activity</h4>
                  <div className="flex flex-col gap-6 2xl:gap-8 flex-1 justify-center">
                    {/* Activity 1 */}
                    <div className="flex gap-4">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#126b52] to-[#0a4d3a] flex items-center justify-center flex-shrink-0 shadow-sm border-2 border-[#126b52]/20"><BiWrench className="text-white text-lg" /></div>
                      <div>
                        <p className="text-sm font-bold text-gray-900 leading-tight">Power Drill rented by Sarah M.</p>
                        <p className="text-[10px] font-medium text-gray-400 mt-1">2 hours ago • <span className="text-[#126b52] font-bold">+$25.00</span></p>
                      </div>
                    </div>
                    {/* Activity 2 */}
                    <div className="flex gap-4">
                      <div className="w-10 h-10 rounded-full bg-[#eafaf1] flex items-center justify-center flex-shrink-0"><MdStars className="text-[#126b52] text-xl" /></div>
                      <div>
                        <p className="text-sm font-bold text-gray-900 leading-tight">New 5-star review received</p>
                        <p className="text-[10px] font-medium text-gray-400 mt-1 italic">&quot;Yesterday • Great communication!&quot;</p>
                      </div>
                    </div>
                    {/* Activity 3 */}
                    <div className="flex gap-4">
                      <div className="w-10 h-10 rounded-full bg-[#fff0ed] flex items-center justify-center flex-shrink-0"><FiAward className="text-[#e25c3d] text-lg" /></div>
                      <div>
                        <p className="text-sm font-bold text-gray-900 leading-tight">Earned &quot;Reliable Host&quot; badge</p>
                        <p className="text-[10px] font-medium text-gray-400 mt-1">Apr 10 • 100% On-time</p>
                      </div>
                    </div>
                  </div>
                  <button className="w-full mt-8 py-3.5 border-2 border-gray-100 text-[#126b52] font-extrabold text-[13px] rounded-xl hover:bg-gray-50 transition-colors tracking-wide">View Full History</button>
                </div>
              </div>

              {/* End Screen Boundary */}
            </div>
          </main>
        </div>
      </div>

      {/* =========================================================
          MOBILE LAYOUT (Hidden on desktop)
          Matches structural mobile screenshot with explicit flex columns.
          ========================================================= */}
      <div className="flex flex-col lg:hidden w-full min-h-[100dvh] bg-[#f9faf9] pb-[80px]">

        {/* Mobile Header */}
        <header className="flex justify-between items-center px-5 py-4 bg-white sticky top-0 z-40 border-b border-gray-100 shadow-sm">
          <div className="flex items-center gap-3">
            <FiMenu className="text-[1.4rem] text-[#126b52] cursor-pointer" />
            <span className="text-xl font-bold text-[#126b52] tracking-tight">Proximi</span>
          </div>
          <div className="relative">
            <img src="https://i.pravatar.cc/100?img=33" alt="Profile" className="w-[34px] h-[34px] rounded-full object-cover border border-gray-200 ring-2 ring-offset-1 ring-[#126b52]" />
            <span className="absolute -bottom-1 -right-1 bg-[#126b52] text-white text-[8px] font-bold w-4 h-4 rounded-full flex items-center justify-center border border-white">5</span>
          </div>
        </header>

        {/* Mobile Content Canvas */}
        <main className="flex flex-col px-5 py-6">

          {/* Profile Name & Badge */}
          <div className="flex justify-between items-start mb-6">
            <div className="flex flex-col">
              <h1 className="text-[2.2rem] font-extrabold text-[#0d1611] leading-none mb-1 tracking-tight">{data.user.name}</h1>
              <div className="flex items-center gap-1.5 text-[#126b52]">
                <MdOutlineVerifiedUser className="text-sm" />
                <span className="text-sm font-semibold">{data.user.level}</span>
              </div>
            </div>
            {data.user.isPlus && (
              <span className="bg-[#126b52] text-white px-3 py-1.5 rounded-full text-[9px] font-extrabold tracking-widest uppercase shadow-md flex-shrink-0">
                Proximi Plus
              </span>
            )}
          </div>

          {/* Big Green KPI Card */}
          <div className="bg-[#188e6e] bg-gradient-to-br from-[#126b52] to-[#188e6e] rounded-3xl p-5 mb-4 relative overflow-hidden shadow-[0_10px_30px_rgba(18,107,82,0.3)]">
            <p className="text-emerald-100 font-medium text-sm mb-0.5 z-10 relative">Total Earnings</p>
            <h2 className="text-[2.6rem] font-extrabold text-white leading-none tracking-tight z-10 relative">
              ${data.mobileKpis.earnings}
            </h2>
            {/* Watermark icon replicating the screenshot aesthetic */}
            <RiMoneyDollarCircleLine className="absolute -right-8 -bottom-8 text-[9rem] text-white opacity-10" />
          </div>

          {/* 2 Square KPIs */}
          <div className="grid grid-cols-2 gap-4 mb-8">
            {/* Items Rented */}
            <div className="bg-[#f2f6f4] rounded-2xl p-4 flex flex-col justify-between h-[100px]">
              <FiBox className="text-xl text-[#126b52]" />
              <div>
                <p className="text-gray-500 font-semibold text-xs mb-0.5">Items Rented</p>
                <span className="text-2xl font-extrabold text-gray-900 leading-none">{data.mobileKpis.itemsRented}</span>
              </div>
            </div>
            {/* Trust Score */}
            <div className="bg-[#f2f6f4] rounded-2xl p-4 flex flex-col justify-between h-[100px] relative">
              <div className="flex justify-between items-start">
                <MdOutlineVerifiedUser className="text-xl text-[#c74c3e]" />
                <div className="w-5 h-5 rounded-full border-[3px] border-[#126b52] border-t-transparent flex-shrink-0" style={{ transform: 'rotate(45deg)' }}></div>
              </div>
              <div>
                <p className="text-gray-500 font-semibold text-xs mb-0.5">Trust Score</p>
                <span className="text-2xl font-extrabold text-gray-900 leading-none">{data.mobileKpis.trustScore}%</span>
              </div>
            </div>
          </div>

          {/* My Bookings Title */}
          <div className="flex justify-between items-end mb-4">
            <h3 className="text-lg font-bold text-gray-900">My Bookings</h3>
            <span className="text-[#126b52] font-semibold text-xs cursor-pointer">See all</span>
          </div>

          {/* Mobile Bookings Grid */}
          <div className="grid grid-cols-2 gap-4 mb-8">
            <div className="bg-white rounded-2xl p-3 border border-gray-100 shadow-sm shadow-gray-200/50">
              <div className="h-[90px] rounded-xl bg-[#f8f9f8] mb-3 flex justify-center items-center overflow-hidden">
                <BiWrench className="text-[#155a8a] text-[4rem]" />
              </div>
              <h4 className="font-bold text-sm text-gray-900 leading-tight mb-1.5">Cordless Drill</h4>
              <div className="flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 rounded-full bg-[#126b52]"></div>
                <span className="text-gray-500 text-[10px] font-semibold">Active</span>
              </div>
            </div>
            <div className="bg-white rounded-2xl p-3 border border-gray-100 shadow-sm shadow-gray-200/50">
              <div className="h-[90px] rounded-xl bg-[#e9eced] mb-3 flex justify-center items-center overflow-hidden">
                <MdOutlinePhotoCamera className="text-[#3c4043] text-[4rem]" />
              </div>
              <h4 className="font-bold text-sm text-gray-900 leading-tight mb-1.5">DSLR Camera</h4>
              <div className="flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 rounded-full bg-gray-400"></div>
                <span className="text-gray-500 text-[10px] font-semibold">Completed</span>
              </div>
            </div>
          </div>

          {/* My Listings Title */}
          <div className="flex justify-between items-end mb-4">
            <h3 className="text-lg font-bold text-gray-900">My Listings</h3>
            <span className="text-[#126b52] font-semibold text-xs cursor-pointer">Manage</span>
          </div>

          {/* Mobile Listings Grid */}
          <div className="grid grid-cols-2 gap-4 mb-8">
            <div className="bg-white rounded-2xl p-3 border border-gray-100 shadow-sm shadow-gray-200/50">
              <div className="h-[90px] rounded-xl bg-[#f8f9f8] mb-3 flex justify-center items-center">
                <FaLaptop className="text-gray-400 text-[3.5rem]" />
              </div>
              <h4 className="font-bold text-sm text-gray-900 leading-tight mb-1.5">4K Projector</h4>
              <div className="flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 rounded-full bg-[#126b52]"></div>
                <span className="text-gray-500 text-[10px] font-semibold">Active</span>
              </div>
            </div>
            <div className="bg-white rounded-2xl p-3 border border-gray-100 shadow-sm shadow-gray-200/50">
              <div className="h-[90px] rounded-xl bg-[#f8f9f8] mb-3 flex justify-center items-center">
                <BiCycling className="text-gray-600 text-[4rem]" />
              </div>
              <h4 className="font-bold text-sm text-gray-900 leading-tight mb-1.5">Road Bike</h4>
              <div className="flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 rounded-full bg-[#126b52]"></div>
                <span className="text-gray-500 text-[10px] font-semibold">Active</span>
              </div>
            </div>
          </div>

          {/* Safety Guide Banner */}
          <div className="bg-[#218b6e] rounded-3xl p-5 mb-4 flex items-center justify-between shadow-lg shadow-[#126b52]/10">
            <div className="w-[70%]">
              <h3 className="font-bold text-white text-[1.1rem] tracking-tight mb-1">Safety Guide</h3>
              <p className="text-emerald-50 text-[11px] leading-snug">How we protect your items and community trust.</p>
            </div>
            <div className="w-[45px] h-[45px] rounded-full bg-white/20 flex items-center justify-center backdrop-blur-md text-white">
              <RiSecurePaymentLine className="text-xl" />
            </div>
          </div>

          {/* Support & FAQ */}
          <div className="bg-[#f0f3f1] rounded-2xl p-4 mb-8 flex items-center justify-between cursor-pointer">
            <div className="flex items-center gap-3">
              <div className="w-7 h-7 rounded-full bg-gray-200 flex items-center justify-center text-gray-500">
                <FiHelpCircle className="text-sm" />
              </div>
              <span className="font-bold text-gray-900 text-sm">Support & FAQ</span>
            </div>
            <FiChevronRight className="text-gray-400 text-lg" />
          </div>

          {/* Invite a Neighbour */}
          <div className="border-[2px] border-dashed border-[#e6dcc8] bg-[#fdfcf5] rounded-3xl p-5 relative overflow-hidden mb-safe">
            <div className="flex items-start gap-4 mb-5 relative z-10">
              <div className="text-[#a46843] text-2xl mt-1"><FiBox /></div>
              <div>
                <h3 className="font-bold text-[#a46843] text-[1.05rem] mb-1 tracking-tight">Invite a Neighbour</h3>
                <p className="text-gray-600 text-xs leading-snug">Earn $10 credit for every friend who lists their first item.</p>
              </div>
            </div>
            <button className="w-full bg-[#a1773a] hover:bg-[#8a6530] text-white font-bold py-3.5 rounded-xl text-sm transition-colors relative z-10 shadow-md">
              Get My Link
            </button>
          </div>

        </main>

        {/* Fixed Mobile Nav Bar */}
        <nav className="fixed bottom-0 left-0 w-full bg-white/95 backdrop-blur-lg border-t border-gray-100 flex justify-around items-center h-[75px] z-50 pb-2 px-2 shadow-[0_-5px_20px_rgba(0,0,0,0.03)]">
          <div className="flex flex-col items-center gap-1 text-gray-400 cursor-pointer">
            <FiHome className="text-xl" />
            <span className="text-[10px] font-semibold">Home</span>
          </div>
          <div className="flex flex-col items-center gap-1 text-gray-400 cursor-pointer">
            <FiMap className="text-xl" />
            <span className="text-[10px] font-semibold">Map</span>
          </div>
          <div className="flex flex-col items-center gap-1 text-gray-400 cursor-pointer">
            <FiMessageSquare className="text-xl" />
            <span className="text-[10px] font-semibold">Chat</span>
          </div>
          <div className="flex flex-col items-center gap-1 text-[#126b52] bg-[#eafaf1] px-5 py-2 rounded-xl cursor-pointer">
            <FiUser className="text-lg" />
            <span className="text-[10px] font-bold">Profile</span>
          </div>
        </nav>
      </div>

    </div>
  );
}