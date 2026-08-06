import React from 'react';
export default function HeroSection({ userName = "Julian Gold", loyaltyPoints = 2450 }) {
  return (
    <section className="w-full px-4 md:px-6 lg:px-8 pt-8 pb-4">
      <div className="max-w-[1440px] mx-auto flex items-center justify-between">
        
        {/* Left Side: Greeting */}
        <div className="flex flex-col">
          <span className="text-xs md:text-sm font-extrabold tracking-wider text-[#B41B00] uppercase mb-1">
            Premium Experience
          </span>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-[#2D2F2F] tracking-tight leading-tight">
            {userName === "Guest" ? "Welcome," : "Welcome back,"}<br />
            <span className="bg-gradient-to-r from-[#B41B00] to-[#FF775D] bg-clip-text text-transparent">
              {userName}
            </span>
          </h1>
        </div>
        {/* Right Side: Loyalty Card (Hidden on Mobile) */}
        <div className="hidden md:block">
          <div className="border-l-[4px] border-l-[#B41B00] bg-white rounded-[24px] shadow-[0_10px_30px_rgba(0,0,0,0.08)] py-5 px-8 flex flex-col items-start min-w-[200px] transition-all duration-300 hover:shadow-[0_15px_35px_rgba(0,0,0,0.12)]">
            <span className="text-[10px] font-extrabold text-gray-400 tracking-widest uppercase">
              Loyalty Points
            </span>
            <div className="flex items-center gap-1.5 mt-1">
              <span className="text-3xl font-black text-[#2D2F2F]">
                {loyaltyPoints.toLocaleString()}
              </span>
              <span className="text-[#B41B00] text-xl font-bold">★</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
