// app/page.tsx
"use client";

import { useEffect, useState } from "react";
import PageHeader from "../../components/pageHeader";
import {
  FiMapPin,
  FiSearch,
  FiFilter,
  FiPlus,
  FiHome,
  FiMessageSquare,
  FiBell,
  FiUser,
} from "react-icons/fi";

interface Item {
  id: number;
  title: string;
  price: number;
  rating: number;
  brand: string;
  category: string;
  stock: number;
  thumbnail: string;
  description: string;
  location: string;
}

function StarsDisplay({ rating }: { rating: number }) {
  const full = Math.round(rating);
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <span
          key={i}
          className={`text-base ${i <= full ? "text-yellow-400" : "text-gray-200"}`}
        >
          ★
        </span>
      ))}
    </div>
  );
}

const navItems = [
  { id: "home", Icon: FiHome, label: "Home" },
  { id: "messages", Icon: FiMessageSquare, label: "Messages" },
  { id: "notifications", Icon: FiBell, label: "Alerts" },
  { id: "profile", Icon: FiUser, label: "Profile" },
];

export default function Home() {
  const [items, setItems] = useState<Item[]>([]);
  const [search, setSearch] = useState("");
  const [mobileSearch, setMobileSearch] = useState("");
  const [activeNav, setActiveNav] = useState("home");

  const userLocation = {
    label: "Andheri West",
    fullAddr: "Mumbai, Maharashtra",
  };

  useEffect(() => {
    const fetchData = async () => {
      const [productsRes, usersRes] = await Promise.all([
        fetch("https://dummyjson.com/products"),
        fetch("https://dummyjson.com/users"),
      ]);

      const productsData = await productsRes.json();
      const usersData = await usersRes.json();
      const users = usersData.users;

      const mapped = productsData.products.map((item: any, index: number) => {
        const user = users[index % users.length];
        return {
          id: item.id,
          title: item.title,
          price: item.price,
          rating: item.rating,
          brand: item.brand,
          category: item.category,
          stock: item.stock,
          thumbnail: item.thumbnail,
          description: item.description,
          location: `${user.address.city}, ${user.address.state}`,
        };
      });

      setItems(mapped);
    };

    fetchData();
  }, []);

  const filtered = items.filter((item) =>
    item.title.toLowerCase().includes(search.toLowerCase())
  );

  const mobileFiltered = items.filter((item) =>
    item.title.toLowerCase().includes(mobileSearch.toLowerCase())
  );

  // First 8 items as "recommendations" for the horizontal scroll
  const recommendations = items.slice(0, 8).map((item) => ({
    id: item.id,
    name: item.title,
    img: item.thumbnail,
    price: item.price,
    dist: "1.5 km away",
    area: item.location.split(",")[0],
  }));

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(180deg, #7F86EC, #9CA5E8)",
        position: "relative",
        fontFamily: "Arial",
      }}
    >
      {/* Background blobs — desktop only */}
      <div
        className="hidden md:block"
        style={{
          position: "fixed",
          width: "380px",
          height: "380px",
          background: "#5F6EE5",
          borderRadius: "50%",
          bottom: "-140px",
          left: "-140px",
          opacity: 0.5,
          pointerEvents: "none",
          zIndex: 0,
        }}
      />
      <div
        className="hidden md:block"
        style={{
          position: "fixed",
          width: "420px",
          height: "300px",
          background: "#C6CEF5",
          borderRadius: "60% 40% 60% 40%",
          top: "-100px",
          right: "-100px",
          opacity: 0.7,
          pointerEvents: "none",
          zIndex: 0,
        }}
      />

      {/* ── DESKTOP ── */}
      <div className="hidden md:block">
        {/* Sticky header + search */}
        <div
          style={{
            position: "sticky",
            top: 0,
            zIndex: 50,
            WebkitBackdropFilter: "blur(16px)",
            background: "rgba(127, 134, 236, 0.55)",
          }}
        >
          <PageHeader />
          <div className="max-w-6xl mx-auto px-6 py-3">
            <div className="flex items-center gap-3 bg-white/75 backdrop-blur-md border border-white/80 rounded-full px-5 py-2 shadow-lg">
              <span className="text-gray-400 text-sm">🔍</span>
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="flex-1 bg-transparent outline-none text-gray-700 placeholder-gray-400 font-medium text-sm"
                placeholder="Search products..."
              />
              <button className="flex items-center gap-1.5 border border-gray-200 rounded-full px-5 py-2 text-sm font-bold text-gray-500 bg-white hover:border-indigo-400 hover:text-indigo-500 transition-colors whitespace-nowrap">
                <span>▾</span> Filter
              </button>
              <button className="bg-gradient-to-r from-indigo-400 to-indigo-600 text-white rounded-full px-7 py-2 text-sm font-extrabold shadow-md shadow-indigo-300 hover:shadow-lg hover:-translate-y-0.5 transition-all whitespace-nowrap">
                Search
              </button>
            </div>
          </div>
        </div>

        {/* Desktop grid */}
        <main className="relative z-10 max-w-6xl mx-auto px-6 py-8">
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-3xl overflow-hidden shadow-md shadow-indigo-100 hover:-translate-y-1 hover:shadow-xl hover:shadow-indigo-200 transition-all duration-200 cursor-pointer"
              >
                <div className="w-full h-52 bg-gray-50 flex items-center justify-center">
                  <img
                    src={item.thumbnail}
                    alt={item.title}
                    className="w-full h-full object-contain p-3"
                  />
                </div>
                <div className="px-5 pt-4 pb-5">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <h2 className="font-extrabold text-gray-900 text-base leading-tight line-clamp-1">
                      {item.title}
                    </h2>
                    <StarsDisplay rating={item.rating} />
                  </div>
                  <p className="font-bold text-gray-900 text-sm mb-0.5">
                    ₹{item.price} / day
                  </p>
                  <p className="text-xs text-gray-400 font-semibold mb-4">
                    1.5 km away
                  </p>
                  <div className="flex items-center justify-between border-t border-gray-100 pt-3">
                    <span className="text-xs text-gray-400 font-semibold">
                      {item.location.split(",")[0]}
                    </span>
                    <button className="w-8 h-8 rounded-full bg-indigo-50 flex items-center justify-center text-base hover:bg-indigo-100 transition-colors">
                      📍
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>

      {/* ── MOBILE ── */}
      <div className="flex flex-col min-h-screen md:hidden">

        {/* Sticky top header */}
        <div
          className="sticky top-0 z-50 rounded-b-[28px] px-[18px] pt-[28px] pb-10 shadow-lg"
          style={{ background: "linear-gradient(160deg,#7F86EC 0%,#9CA5E8 100%)" }}
        >
          {/* Hamburger + Location */}
          <div className="flex items-start gap-3 mb-3">
            <button className="mt-1 flex flex-col gap-[5px]">
              <span className="block w-[22px] h-[2.5px] bg-white rounded-full" />
              <span className="block w-[22px] h-[2.5px] bg-white rounded-full" />
              <span className="block w-[22px] h-[2.5px] bg-white rounded-full" />
            </button>
            <div>
              <div className="flex items-center gap-1">
                <FiMapPin className="text-[#FF4D6D] text-[14px]" />
                <span className="text-white font-extrabold text-[17px] leading-none">
                  {userLocation.label},
                </span>
              </div>
              <p className="text-white/80 text-[11.5px] font-semibold mt-1 leading-snug">
                {userLocation.fullAddr}
              </p>
            </div>
          </div>

          {/* Search */}
          <div className="flex items-center bg-white rounded-full px-4 py-[13px] shadow-xl mt-8">
            <FiSearch className="text-[#8B8CF7] text-[18px] mr-3 shrink-0" />
            <input
              type="text"
              value={mobileSearch}
              onChange={(e) => setMobileSearch(e.target.value)}
              placeholder="Search items near you"
              className="flex-1 bg-transparent outline-none text-[13.5px] font-semibold placeholder:text-gray-400 text-gray-700"
            />
            <FiFilter className="text-[#8B8CF7] text-[18px]" />
          </div>
        </div>

        {/* Scrollable area */}
        <div className="flex-1 overflow-y-auto pb-[80px]" style={{ background: "#F4F5FF" }}>

          {/* Featured horizontal scroll */}
          <div className="px-4 pt-[14px] pb-[6px]">
            <div className="flex gap-3 overflow-x-auto pb-1 scrollbar-hide">
              {recommendations.map((item) => (
                <div key={item.id} className="flex flex-col items-center shrink-0">
                  <div className="w-[95px] h-[85px] bg-[#e8eaf6] rounded-[18px] overflow-hidden shadow-md shadow-indigo-100">
                    <img
                      src={item.img}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div
                    className="w-[65px] h-[7px] rounded-full mt-1"
                    style={{
                      background:
                        "radial-gradient(ellipse,rgba(99,102,241,0.22) 0%,transparent 70%)",
                    }}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Section title */}
          <h2 className="text-[17px] font-black text-[#1a1a2e] px-4 pt-3 pb-2">
            Recommended for you
          </h2>

          {/* Cards */}
          <div className="flex flex-col gap-3 px-[14px] pb-4">
            {mobileFiltered.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-[22px] p-3 flex items-center gap-3 shadow shadow-indigo-100 active:scale-[0.98] transition-transform"
              >
                <div className="w-[85px] h-[76px] rounded-[16px] overflow-hidden shrink-0 bg-[#f0f2f8]">
                  <img
                    src={item.thumbnail}
                    alt={item.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <p className="font-extrabold text-[14.5px] text-[#1a1a2e]">
                    {item.title}
                  </p>
                  <p className="font-black text-[14px] text-[#6366F1] mt-[1px]">
                    ₹{item.price} / day
                  </p>
                  <p className="text-[11.5px] font-semibold text-gray-400 mt-[1px]">
                    1.5 km away
                  </p>
                  <div className="flex items-center gap-1 mt-[3px]">
                    <FiMapPin className="text-[#8B8CF7] text-[11px]" />
                    <span className="text-[11.5px] font-semibold text-gray-400">
                      {item.location.split(",")[0]}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Sticky bottom nav */}
        <div className="sticky bottom-0 z-50 bg-white rounded-t-[24px] shadow-[0_-4px_24px_rgba(99,102,241,0.12)] flex justify-around items-center px-2 pt-3 pb-4">
          {navItems.slice(0, 2).map(({ id, Icon, label }) => (
            <button
              key={id}
              onClick={() => setActiveNav(id)}
              className="flex flex-col items-center gap-1 px-4 py-1"
            >
              <Icon
                className={`text-[22px] transition-colors ${
                  activeNav === id ? "text-[#6366F1]" : "text-gray-300"
                }`}
              />
              {activeNav === id && (
                <div className="w-[5px] h-[5px] rounded-full bg-[#6366F1]" />
              )}
            </button>
          ))}

          {/* Plus button */}
          <button className="w-[52px] h-[52px] rounded-full flex items-center justify-center -mt-[18px]">
            <FiPlus className="text-black text-[24px]" strokeWidth={2.5} />
          </button>

          {navItems.slice(2).map(({ id, Icon, label }) => (
            <button
              key={id}
              onClick={() => setActiveNav(id)}
              className="flex flex-col items-center gap-1 px-4 py-1"
            >
              <Icon
                className={`text-[22px] transition-colors ${
                  activeNav === id ? "text-[#6366F1]" : "text-gray-300"
                }`}
              />
              {activeNav === id && (
                <div className="w-[5px] h-[5px] rounded-full bg-[#6366F1]" />
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}