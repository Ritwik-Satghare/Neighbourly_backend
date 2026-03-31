"use client";
import React from 'react';
import { FiMenu, FiBell } from 'react-icons/fi';

const PageHeader: React.FC = () => {
  return (

    <div className="sticky top-0 z-50 w-full px-6 py-6 md:px-10">
      <header className="mx-auto max-w-7xl h-24 bg-white rounded-full flex items-center justify-between px-15 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.2)] border border-gray-50">

        <div className="flex items-center">
          <button className="text-[#9CA3AF] hover:text-gray-600 transition-colors">
            <FiMenu className="text-4xl" strokeWidth={1.5} />
          </button>
        </div>

        <nav className="hidden md:flex items-center gap-15 lg:gap-16">
          <a href="#" className="text-[#4B5563] text-xl font-medium hover:text-black transition-colors">
            How it works
          </a>
          <a href="#" className="text-[#4B5563] text-xl font-medium hover:text-black transition-colors">
            List Your Item
          </a>
          <a href="#" className="text-[#4B5563] text-xl font-medium hover:text-black transition-colors">
            Messages
          </a>
        </nav>

        <div className="flex items-center gap-10">
          <button className="text-[#9CA3AF] hover:text-gray-600 transition-colors">
            <FiBell className="text-4xl" strokeWidth={1.5} />
          </button>

          <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-white shadow-md flex items-center justify-center bg-[#E5E7EB]">
            <img 
              src="https://api.dicebear.com/7.x/avataaars/svg?seed=Shaun" 
              alt="User Profile" 
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </header>
    </div>
  );
};

export default PageHeader;