"use client";
import React, { useState, useEffect } from "react";
import Head from "next/head";
import {
  FiSearch, FiMapPin, FiFilter,
  FiMessageSquare, FiBell, FiPlus, FiHome,
} from "react-icons/fi";
import PageHeader from "../../components/pageHeader";

interface Item {
  id: number;
  name: string;
  price: number;
  dist: string;
  area: string;
  img: string;
}

interface LocationInfo {
  label: string;
  fullAddr: string;
}

async function reverseGeocode(lat: number, lon: number): Promise<LocationInfo> {
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lon}`
    );
    const data = await res.json();
    const addr = data.address || {};
    const label = addr.suburb || addr.neighbourhood || addr.village || addr.town || addr.city || "Home";
    const postcode = addr.postcode || "";
    const city = addr.city || addr.town || addr.state_district || "";
    const houseNo = addr.house_number ? addr.house_number + " " : "";
    const road = addr.road || "";
    const fullAddr = `${houseNo}${road}${road ? ", " : ""}${label}${city && city !== label ? ", " + city : ""}${postcode ? " " + postcode : ""}`;
    return { label, fullAddr };
  } catch {
    return { label: "Home", fullAddr: "Mumbai, Maharashtra" };
  }
}

const Wireframe5: React.FC = () => {
  const [recommendations, setRecommendations] = useState<Item[]>([]);
  const [activeNav, setActiveNav] = useState("home");
  const [location, setLocation] = useState<LocationInfo>({
    label: "Home",
    fullAddr: "Fetching location…",
  });
  const [desktopSearch, setDesktopSearch] = useState("");
  const [desktopLocation, setDesktopLocation] = useState("");

  useEffect(() => {
    if (!navigator.geolocation) {
      setLocation({ label: "Mumbai", fullAddr: "Bandra West, Mumbai 400050" });
      return;
    }
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const info = await reverseGeocode(pos.coords.latitude, pos.coords.longitude);
        setLocation(info);
        setDesktopLocation(info.fullAddr);
      },
      () => {
        setLocation({ label: "Mumbai", fullAddr: "Bandra West, Mumbai 400050" });
        setDesktopLocation("Bandra West, Mumbai 400050");
      }
    );
  }, []);

  useEffect(() => {
    setRecommendations([
      { id: 1, name: "Polished Chair", price: 400, dist: "1.5 km away", area: "Andheri West", img: "https://images.unsplash.com/photo-1592078615290-033ee584e267?w=400" },
      { id: 2, name: "Wooden Chair",   price: 350, dist: "2.1 km away", area: "Bandra East",  img: "https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?w=400" },
      { id: 3, name: "Lounge Chair",   price: 500, dist: "3.0 km away", area: "Juhu",         img: "https://images.unsplash.com/photo-1503602642458-232111445657?w=400" },
    ]);
  }, []);

  const navItems = [
    { id: "home",     Icon: FiHome,          label: "Home" },
    { id: "bell",     Icon: FiBell,          label: "Alerts" },
    { id: "messages", Icon: FiMessageSquare, label: "Messages" },
  ];

  return (
    <div className="relative min-h-screen font-sans">
      <Head><title>Proximi | Explore</title></Head>

      {/* ── DESKTOP ── */}
      <div
        className="hidden md:block"
        style={{
          minHeight: "100vh",
          background: "linear-gradient(180deg, #7F86EC, #9CA5E8)",
          position: "relative",
        }}
      >
        {/* Same fixed blobs as previous pages */}
        <div
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

        {/* Sticky header */}
        <div
          style={{
            position: "sticky",
            top: 0,
            zIndex: 50,
            WebkitBackdropFilter: "blur(16px)",
          }}
        >
          <PageHeader />
        </div>

        {/* Hero */}
        <section className="relative z-10 max-w-5xl mx-auto px-8 pt-16 pb-24">
          <h1
            className="text-4xl font-black text-gray-900 leading-tight mb-10"
            style={{ maxWidth: "340px" }}
          >
            Rent Items From<br />People Nearby
          </h1>

          {/* Search bar */}
          <div
            className="flex items-center gap-0 bg-white rounded-full shadow-lg overflow-hidden"
            style={{ maxWidth: "480px" }}
          >
            <div className="flex items-center gap-2 px-4 py-3 flex-1 border-r border-gray-100">
              <FiSearch className="text-gray-400 text-[16px] shrink-0" />
              <input
                type="text"
                value={desktopSearch}
                onChange={(e) => setDesktopSearch(e.target.value)}
                placeholder="Search items..."
                className="bg-transparent outline-none text-sm text-gray-700 placeholder:text-gray-400 w-full"
              />
            </div>
            <div className="flex items-center gap-2 px-4 py-3 flex-1">
              <FiMapPin className="text-gray-400 text-[16px] shrink-0" />
              <input
                type="text"
                value={desktopLocation}
                onChange={(e) => setDesktopLocation(e.target.value)}
                placeholder="Location"
                className="bg-transparent outline-none text-sm text-gray-700 placeholder:text-gray-400 w-full"
              />
            </div>
            <button
              className="px-6 py-3 text-white text-sm font-bold rounded-full m-1 shrink-0"
              style={{ background: "linear-gradient(135deg,#8B8CF7,#6366F1)" }}
            >
              Search
            </button>
          </div>
        </section>

        {/* Recommended section — white/glass card over the same gradient */}
        <section className="relative z-10 max-w-5xl mx-auto px-8 pb-16">
          <h2 className="text-2xl font-black text-gray-900 mb-6">Recommended for you</h2>
          <div className="grid grid-cols-3 gap-6">
            {recommendations.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-200 cursor-pointer"
              >
                <div className="w-full bg-gray-50" style={{ height: "190px" }}>
                  <img src={item.img} alt={item.name} className="w-full h-full object-cover" />
                </div>
                <div className="px-4 py-3">
                  <p className="font-extrabold text-gray-900 text-[15px]">{item.name}</p>
                  <p className="text-gray-700 font-semibold text-sm mt-0.5">₹{item.price} / day</p>
                  <p className="text-gray-400 text-xs mt-0.5">{item.dist}</p>
                  <div className="flex items-center gap-1 mt-1">
                    <FiMapPin className="text-gray-400 text-[11px]" />
                    <span className="text-gray-400 text-xs">{item.area}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Why Trust Us — same gradient continues, just a centered heading */}
        <section className="relative z-10 max-w-5xl mx-auto px-8 py-24 flex items-center justify-center">
          <h2 className="text-3xl font-black text-gray-900">Why Trust US</h2>
        </section>
      </div>

      {/* ── MOBILE (completely unchanged) ── */}
      <div className="flex flex-col min-h-screen md:hidden" style={{ background: "#f0f2f8" }}>

        {/* STICKY TOP HEADER */}
        <div
          className="sticky top-0 z-50 rounded-b-[28px] px-[18px] pt-[28px] pb-10 shadow-lg"
          style={{ background: "linear-gradient(160deg,#7F86EC 0%,#9CA5E8 100%)" }}
        >
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
                  {location.label},
                </span>
              </div>
              <p className="text-white/80 text-[11.5px] font-semibold mt-1 leading-snug">
                {location.fullAddr}
              </p>
            </div>
          </div>

          <div className="flex items-center bg-white rounded-full px-4 py-[13px] shadow-xl mt-8">
            <FiSearch className="text-[#8B8CF7] text-[18px] mr-3 shrink-0" />
            <input
              type="text"
              placeholder="Search items near you"
              className="flex-1 bg-transparent outline-none text-[13.5px] font-semibold placeholder:text-gray-400 text-gray-700"
            />
            <FiFilter className="text-[#8B8CF7] text-[18px]" />
          </div>
        </div>

        {/* SCROLLABLE AREA */}
        <div className="flex-1 overflow-y-auto pb-[80px]">
          <div className="px-4 pt-[14px] pb-[6px]">
            <div className="flex gap-3 overflow-x-auto pb-1 scrollbar-hide">
              {recommendations.map((item) => (
                <div key={item.id} className="flex flex-col items-center shrink-0">
                  <div className="w-[95px] h-[85px] bg-[#e8eaf6] rounded-[18px] overflow-hidden shadow-md shadow-indigo-100">
                    <img src={item.img} alt={item.name} className="w-full h-full object-cover" />
                  </div>
                  <div
                    className="w-[65px] h-[7px] rounded-full"
                    style={{ background: "radial-gradient(ellipse,rgba(99,102,241,0.22) 0%,transparent 70%)" }}
                  />
                </div>
              ))}
            </div>
          </div>

          <h2 className="text-[17px] font-black text-[#1a1a2e] px-4 pt-3 pb-2">
            Recommended for you
          </h2>

          <div className="flex flex-col gap-3 px-[14px] pb-4">
            {recommendations.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-[22px] p-3 flex items-center gap-3 shadow shadow-indigo-100 active:scale-[0.98] transition-transform"
              >
                <div className="w-[85px] h-[76px] rounded-[16px] overflow-hidden shrink-0 bg-[#f0f2f8]">
                  <img src={item.img} alt={item.name} className="w-full h-full object-cover" />
                </div>
                <div>
                  <p className="font-extrabold text-[14.5px] text-[#1a1a2e]">{item.name}</p>
                  <p className="font-black text-[14px] text-[#6366F1] mt-[1px]">₹{item.price} / day</p>
                  <p className="text-[11.5px] font-semibold text-gray-400 mt-[1px]">{item.dist}</p>
                  <div className="flex items-center gap-1 mt-[3px]">
                    <FiMapPin className="text-[#8B8CF7] text-[11px]" />
                    <span className="text-[11.5px] font-semibold text-gray-400">{item.area}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* STICKY BOTTOM NAV */}
        <div className="sticky bottom-0 z-50 bg-white rounded-t-[24px] shadow-[0_-4px_24px_rgba(99,102,241,0.12)] flex justify-around items-center px-2 pt-3 pb-4">
          {navItems.slice(0, 2).map(({ id, Icon, label }) => (
            <button key={id} onClick={() => setActiveNav(id)} className="flex flex-col items-center gap-1 px-4 py-1">
              <Icon className={`text-[22px] transition-colors ${activeNav === id ? "text-[#6366F1]" : "text-gray-300"}`} />
              {activeNav === id && <div className="w-[5px] h-[5px] rounded-full bg-[#6366F1]" />}
            </button>
          ))}
          <button className="w-[52px] h-[52px] rounded-full flex items-center justify-center -mt-[18px]">
            <FiPlus className="text-black text-[24px]" strokeWidth={2.5} />
          </button>
          {navItems.slice(2).map(({ id, Icon, label }) => (
            <button key={id} onClick={() => setActiveNav(id)} className="flex flex-col items-center gap-1 px-4 py-1">
              <Icon className={`text-[22px] transition-colors ${activeNav === id ? "text-[#6366F1]" : "text-gray-300"}`} />
              {activeNav === id && <div className="w-[5px] h-[5px] rounded-full bg-[#6366F1]" />}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Wireframe5;