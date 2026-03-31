"use client";
import React, { useState, useEffect } from "react";
import Head from "next/head";
import { FiSearch, FiMapPin, FiFilter } from "react-icons/fi";
import PageHeader from '../../components/pageHeader'; 

const Wireframe5: React.FC = () => {
  const [recommendations, setRecommendations] = useState<any[]>([]);

  useEffect(() => {
    // Simulated API call for recommendations
    setRecommendations([
      { id: 1, name: "Polished Chair", price: 400, img: "https://images.unsplash.com/photo-1592078615290-033ee584e267?w=800" },
      { id: 2, name: "Polished Chair", price: 400, img: "https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?w=800" },
      { id: 3, name: "Polished Chair", price: 400, img: "https://images.unsplash.com/photo-1503602642458-232111445657?w=800" },
    ]);
  }, []);

  return (
    <div className="min-h-screen bg-[#FBFBFF] no-scrollbar overflow-y-auto relative font-sans text-[#1A1A1A]">
      <Head>
        <title>Proximi | Explore</title>
      </Head>

      {/* 1. ADD YOUR HEADER COMPONENT HERE */}
      <PageHeader />

      {/* --- ORIGINAL WAVE COLOR PATTERN --- */}
      <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
        <svg className="absolute top-0 left-0 w-[65%] h-full opacity-100" viewBox="0 0 500 1000" preserveAspectRatio="none">
          <defs>
            <linearGradient id="waveGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#A78BFA" />
              <stop offset="100%" stopColor="#6366F1" />
            </linearGradient>
          </defs>
          <path d="M0,0 L280,0 C420,200 280,450 480,700 C440,880 300,920 380,1000 L0,1000 Z" fill="url(#waveGrad)" />
        </svg>
        
        {/* Subtle secondary wave for depth */}
        <div className="absolute bottom-[-10%] right-[-5%] w-[50%] h-[50%] bg-[#8B8CF7]/10 rounded-full blur-[120px]" />
      </div>

      <main className="max-w-7xl mx-auto px-6 md:px-10 pt-16 md:pt-24">
        
        {/* SECTION 1: HERO TEXT & SEARCH (Merged as per request) */}
        <section className="mb-24 flex flex-col items-start">
          <h1 className="text-4xl md:text-6xl font-extrabold mb-8 max-w-2xl leading-[1.1] tracking-tight">
            Rent Items From People Nearby
          </h1>
          <pre className="font-extrabold mb-8 max-w-2xl leading-[1.1] tracking-tight">
            Find unique items for rent with 
            safety and reliability.
          </pre>

          <div className="flex items-center bg-white rounded-full p-2 shadow-[0_20px_50px_-15px_rgba(99,102,241,0.15)] border border-white w-full max-w-3xl group transition-all hover:shadow-[0_25px_60px_-15px_rgba(99,102,241,0.2)]">
            <div className="flex items-center flex-1 px-5 gap-4">
              <FiSearch className="text-[#8B8CF7] text-2xl" />
              <input 
                type="text" 
                placeholder="Search items near you" 
                className="w-full bg-transparent outline-none py-4 text-lg font-medium placeholder:text-gray-400" 
              />
            </div>
            <button className="bg-gradient-to-r from-[#8B8CF7] to-[#6366F1] text-white px-10 py-4 rounded-full font-bold shadow-lg hover:brightness-110 active:scale-95 transition-all">
              <span className="hidden md:inline">Search</span>
              <FiFilter className="md:hidden text-2xl" />
            </button>
          </div>
        </section>

        {/* SECTION 2: RECOMMENDED (Large Cards) */}
        <section className="mb-32">
          <h2 className="text-2xl md:text-3xl font-bold mb-12 tracking-tight">Recommended for you</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 lg:gap-14">
            {recommendations.map((item) => (
              <div key={item.id} className="bg-white rounded-[50px] p-6 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.04)] border border-gray-50 flex flex-row md:flex-col gap-8 transition-all hover:-translate-y-2 hover:shadow-2xl">
                {/* Increased Image Size */}
                <div className="w-40 h-40 md:w-full md:h-80 bg-[#F9FAFB] rounded-[40px] overflow-hidden flex items-center justify-center shrink-0">
                  <img src={item.img} alt={item.name} className="w-full h-full object-cover" />
                </div>
                {/* Text Content */}
                <div className="flex flex-col justify-center gap-2">
                  <h3 className="text-2xl font-bold">{item.name}</h3>
                  <div className="flex flex-col">
                    <span className="text-[#6366F1] font-black text-2xl">₹{item.price} / day</span>
                    <span className="text-gray-400 font-semibold mt-1">1.5 km away</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-gray-400 text-sm mt-2">
                    <FiMapPin className="text-[#8B8CF7]" />
                    <span>Andheri West</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* SECTION 3: WHY TRUST US + 3 CONTAINERS */}
        <section className="pb-40">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold tracking-tight">Why Trust US</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 lg:gap-14">
            {[1, 2, 3].map((i) => (
              <div 
                key={i} 
                className="h-80 bg-white/40 backdrop-blur-xl rounded-[50px] border border-white shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex flex-col items-center justify-center p-10 text-center transition-all hover:bg-white/60"
              >
                {/* Placeholder for Trust Content */}
                <div className="w-16 h-16 bg-[#8B8CF7]/10 rounded-3xl mb-6" />
                <div className="h-4 w-3/4 bg-gray-200 rounded-full mb-3" />
                <div className="h-4 w-1/2 bg-gray-100 rounded-full" />
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
};

export default Wireframe5;