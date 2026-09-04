import React, { useState, useEffect } from 'react';
import { Share2, Heart } from 'lucide-react';

export default function Header({ onOpenShare, onOpenDonate }) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? 'backdrop-blur-md bg-[#07182E]/75 border-b border-[#F4B942]/15 py-3.5 shadow-[0_10px_30px_rgba(7,24,46,0.6)]'
          : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-6xl mx-auto px-5 sm:px-8 flex items-center justify-between">
        {/* Left: Sacred Brand Logo */}
        <a
          href="#"
          className="group flex items-center text-decoration-none focus:outline-none focus-visible:ring-2 focus-visible:ring-[#F4B942] rounded-xl transition-transform duration-300 active:scale-95 py-0.5"
          aria-label="श्री कृष्ण - MR. M"
        >
          <img
            src="/images/logo.png"
            alt="श्री कृष्ण MR. M Logo"
            className="h-11 sm:h-13 md:h-14 w-auto object-contain drop-shadow-[0_2px_14px_rgba(0,0,0,0.65)] transition-all duration-300 group-hover:scale-105 group-hover:drop-shadow-[0_0_20px_rgba(244,185,66,0.5)]"
          />
        </a>

        {/* Right: Minimal Share & Donate Actions */}
        <div className="flex items-center gap-3 sm:gap-4">
          <button
            onClick={onOpenShare}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs sm:text-sm font-medium text-[#FFF5DF]/90 hover:text-[#FFF5DF] bg-white/5 hover:bg-white/10 border border-white/10 hover:border-[#F4B942]/40 transition-all backdrop-blur-sm cursor-pointer active:scale-95"
            aria-label="Share Janmashtami greeting"
          >
            <Share2 className="w-3.5 h-3.5 text-[#F4B942]" />
            <span>Share</span>
          </button>

          <button
            onClick={onOpenDonate}
            className="flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs sm:text-sm font-medium text-[#07182E] bg-gradient-to-r from-[#FDE68A] via-[#F4B942] to-[#E5A93C] hover:brightness-110 shadow-[0_0_20px_rgba(244,185,66,0.35)] transition-all cursor-pointer active:scale-95 font-semibold"
            aria-label="Make a devotional contribution"
          >
            <Heart className="w-3.5 h-3.5 text-[#07182E] fill-[#07182E]" />
            <span>Donate</span>
          </button>
        </div>
      </div>
    </header>
  );
}
