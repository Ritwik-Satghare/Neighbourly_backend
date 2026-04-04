"use client";

export default function Home() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-slate-50 via-slate-50 to-slate-100">
      {/* ================= DESKTOP ================= */}
      <div className="hidden lg:flex items-center justify-center min-h-screen">
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <svg
            className="absolute w-full h-full"
            viewBox="0 0 1440 900"
            preserveAspectRatio="xMidYMid slice"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <linearGradient
                id="purpleGradient"
                x1="0%"
                y1="0%"
                x2="0%"
                y2="100%"
              >
                <stop offset="0%" stopColor="#7F86EC" />
                <stop offset="100%" stopColor="#9CA5E8" />
              </linearGradient>
              <linearGradient
                id="purpleGradient2"
                x1="0%"
                y1="0%"
                x2="0%"
                y2="100%"
              >
                <stop offset="0%" stopColor="#8F96F0" />
                <stop offset="100%" stopColor="#A8ADE6" />
              </linearGradient>
              <linearGradient
                id="purpleGradient3"
                x1="0%"
                y1="0%"
                x2="0%"
                y2="100%"
              >
                <stop offset="0%" stopColor="#9FA6F4" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#B2B7E4" stopOpacity="0.8" />
              </linearGradient>
            </defs>

            <rect
              x="0"
              y="0"
              width="550"
              height="900"
              fill="url(#purpleGradient)"
            />

            <path
              d="M 550 0 Q 600 120 620 250 Q 640 400 620 550 Q 600 700 550 900 L 0 900 L 0 0 Z"
              fill="url(#purpleGradient)"
            />

            <path
              d="M 500 0 Q 560 180 540 350 Q 520 550 480 900 L 550 900 Q 600 700 620 550 Q 640 400 620 250 Q 600 120 550 0 Z"
              fill="url(#purpleGradient2)"
            />

            <path
              d="M 450 0 Q 520 220 500 450 Q 480 700 440 900 L 500 900 Q 520 550 540 350 Q 560 180 500 0 Z"
              fill="url(#purpleGradient3)"
            />

            <path
              d="M 420 0 Q 480 150 470 400 Q 460 650 420 900 L 450 900 Q 480 700 500 450 Q 520 220 450 0 Z"
              fill="#ddd6fe"
              opacity="0.6"
            />

            <path
              d="M 380 100 Q 450 250 440 500 Q 430 750 380 900 L 420 900 Q 460 650 470 400 Q 480 150 420 0 L 380 0 Z"
              fill="#e9d5ff"
              opacity="0.5"
            />
          </svg>
        </div>

        {/* Desktop Card */}
        <div className="w-[850px] h-[500px] ml-auto mr-50 backdrop-blur-8xl bg-white/30 rounded-3xl p-16 shadow-2xl border border-white/50">
          <div className="mb-16">
            <p className="text-2xl text-slate-400 font-light tracking-wide">
              tagline
            </p>
          </div>

          <div className="space-y-4 flex flex-col items-center">
            <button
              className="w-[50%] bg-gradient-to-r from-[#9B8CFF] to-[#6CA8FF] text-white font-semibold py-7 rounded-full text-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 active:scale-95"
              onClick={() => console.log("Sign up clicked")}
            >
              Sign up
            </button>

            <button
              className="w-[50%] bg-white/70 text-slate-700 font-semibold py-7 rounded-full text-lg border-2 border-white/60 transition-all duration-300 active:scale-95"
              onClick={() => console.log("Login clicked")}
            >
              login
            </button>
          </div>
        </div>
      </div>

      {/* ================= MOBILE ================= */}
      <div className="lg:hidden flex flex-col min-h-screen bg-slate-100">
        {/* Top Gradient */}
        {/* Top Gradient */}
        <div className="relative w-full h-[28rem] overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-[#4F7CFF] to-[#9B8CFF] rounded-b-[140px]" />
        </div>

        {/* Circle */}
        <div className="flex justify-center -mt-12 z-10 relative">
          <div className="w-24 h-24 bg-gray-300 rounded-full shadow-xl border-4 border-white" />
        </div>

        {/* Content */}
        <div className="flex flex-col items-center pt-20 px-6">
          <h1 className="text-3xl font-bold text-black">PROXIMI</h1>

          <p className="text-gray-400 mt-2 mb-12">tagline</p>

          <div className="w-full max-w-xs space-y-4">
            <button
              className="w-full py-6 rounded-full text-lg font-semibold bg-gradient-to-r from-[#9B8CFF] to-[#6CA8FF] text-white shadow-lg active:scale-95 transition"
              onClick={() => console.log("Sign up clicked")}
            >
              Sign up
            </button>

            <button
              className="w-full py-6 rounded-full text-lg font-semibold border border-gray-300 text-gray-700 bg-white active:scale-95 transition"
              onClick={() => console.log("Login clicked")}
            >
              login
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
