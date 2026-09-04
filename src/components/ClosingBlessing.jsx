import React from 'react';

export default function ClosingBlessing() {
  return (
    <footer className="relative z-10 py-24 px-4 text-center select-none overflow-hidden">
      {/* Soft background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#F4B942]/10 filter blur-3xl rounded-full pointer-events-none" />

      <div className="relative max-w-md mx-auto space-y-6">
        {/* Subtle Sacred Lotus Icon */}
        <div className="flex justify-center">
          <div className="w-14 h-14 rounded-full bg-[#123A68]/40 border border-[#F4B942]/30 flex items-center justify-center shadow-[0_0_25px_rgba(244,185,66,0.3)] animate-float-slow">
            <svg
              viewBox="0 0 100 100"
              className="w-8 h-8 text-[#E879A9]"
              fill="currentColor"
            >
              {/* Sacred Lotus */}
              <path
                d="M50 20 C 30 50, 20 80, 50 90 C 80 80, 70 50, 50 20 Z"
                fill="#FFF5DF"
                opacity="0.9"
              />
              <path
                d="M50 35 C 20 55, 10 75, 40 85 C 45 75, 50 55, 50 35 Z"
                fill="#FBCFE8"
                opacity="0.8"
              />
              <path
                d="M50 35 C 80 55, 90 75, 60 85 C 55 75, 50 55, 50 35 Z"
                fill="#FBCFE8"
                opacity="0.8"
              />
              <circle cx="50" cy="85" r="4" fill="#F4B942" />
            </svg>
          </div>
        </div>

        {/* Sacred Closing Words */}
        <div className="space-y-2">
          <h3 className="font-serif-dev text-3xl sm:text-4xl font-bold gold-gradient-text tracking-wider">
            राधे राधे 🙏
          </h3>
          <p className="font-serif-dev text-lg sm:text-xl text-[#FDE68A]/80 font-medium">
            जय श्री कृष्ण
          </p>
          <p className="text-xs sm:text-sm text-[#FFF5DF]/50 font-light max-w-xs mx-auto pt-1">
            समस्त सृष्टि पर भगवान श्री कृष्ण की कृपा, शांति और प्रेम सदा बना रहे।
          </p>
        </div>
      </div>
    </footer>
  );
}
