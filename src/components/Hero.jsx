import React, { useState, useEffect } from 'react';
import { Sparkles, ChevronLeft, ChevronRight, Image as ImageIcon } from 'lucide-react';
import MusicPlayer from './MusicPlayer';
import { HERO_IMAGES } from './KrishnaMotionScene';

// Rotating devotional lines
const ROTATING_DEVOTIONAL_LINES = [
  "यशोदा के नंदन, ब्रज के दुलारे 🌸",
  "माखन के लोभी, सबके प्यारे कन्हैया 🍯",
  "गोपियों के प्राण, सुरभि के रखवारे 🐮",
  "अधर धरी मुरली, बाजे मधुर तान 🪈",
  "राधे के श्याम, जगत के पालनहारे ✨",
  "बंशी की धुन पे नाचे सारा संसार 🙏",
];

export default function Hero({
  activeImageIndex = 0,
  onSelectImage,
  tracks = [],
  currentTrackIndex = 0,
  onSelectTrack,
  isPlaying,
  setIsPlaying,
  isAutoSlide,
  setIsAutoSlide
}) {
  const [rotatingIndex, setRotatingIndex] = useState(0);

  // Rotate line dynamically every 3.5 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setRotatingIndex((prev) => (prev + 1) % ROTATING_DEVOTIONAL_LINES.length);
    }, 3500);
    return () => clearInterval(timer);
  }, []);

  const handlePrevImage = () => {
    onSelectImage((activeImageIndex - 1 + HERO_IMAGES.length) % HERO_IMAGES.length);
  };

  const handleNextImage = () => {
    onSelectImage((activeImageIndex + 1) % HERO_IMAGES.length);
  };

  return (
    <section className="relative min-h-screen w-full flex items-center justify-between pt-24 pb-24 lg:pb-12 px-6 sm:px-12 lg:px-16 z-10 select-none">
      <div className="w-full max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
        
        {/* ================= LEFT SIDE: Full Unobstructed View of Hero Imagery ================= */}
        <div className="hidden lg:block lg:col-span-6 pointer-events-none" />

        {/* ================= RIGHT SIDE: Clear Separation of Content and Player ================= */}
        <div className="lg:col-span-6 flex flex-col justify-center space-y-6 sm:space-y-8 w-full max-w-lg ml-auto">
          
          {/* 1. HERO CONTENT AREA (Directly over the background composition - NO background box) */}
          <div className="text-left space-y-3 sm:space-y-4">
            {/* "Radhe Radhe" Greeting */}
            <div className="flex items-center gap-2.5">
              <span className="font-serif-dev text-xl sm:text-2xl font-bold gold-gradient-text tracking-wide drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)]">
                “Radhe Radhe”
              </span>
              <span className="text-xs px-2.5 py-0.5 rounded-full border border-white/20 text-[#FDE68A] font-serif-dev bg-white/5 backdrop-blur-sm">
                राधे राधे ✨
              </span>
            </div>

            {/* Krishna Janmashtami Heading (Unclipped, majestic Devanagari) */}
            <div>
              <h1 className="devanagari-hero-title text-4xl sm:text-5xl lg:text-6xl font-bold gold-gradient-text tracking-tight drop-shadow-[0_4px_25px_rgba(0,0,0,0.9)]">
                श्री कृष्ण जन्माष्टमी
              </h1>

              {/* Tagline / Caption */}
              <p className="devanagari-text text-lg sm:text-xl text-[#FDE68A] font-semibold drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)] mt-1">
                नंद के आनंद भयो, जय कन्हैया लाल की! 🍯✨
              </p>
            </div>

            {/* Rotating Devotional Text (Dynamic, sitting directly over the composition, NO container) */}
            <div className="min-h-[32px] flex items-center pt-0.5">
              <p
                key={rotatingIndex}
                className="devanagari-text text-base sm:text-lg text-[#FFF5DF]/90 font-medium tracking-wide drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)] transition-all duration-500 animate-[shimmer-gold_0.8s_ease-out]"
              >
                {ROTATING_DEVOTIONAL_LINES[rotatingIndex]}
              </p>
            </div>
          </div>

          {/* 2. SEPARATE PLAYER COMPONENT (Distinct Liquid-Glass Container) */}
          <div className="w-full">
            <MusicPlayer
              tracks={tracks}
              currentIndex={currentTrackIndex}
              onSelectTrack={onSelectTrack}
              isPlaying={isPlaying}
              setIsPlaying={setIsPlaying}
            />
          </div>

        </div>

      </div>

      {/* ================= BOTTOM-LEFT: Image Navigation Controls ================= */}
      <div className="fixed sm:absolute bottom-5 left-5 sm:bottom-7 sm:left-10 z-30 pointer-events-auto">
        <div className="glass-player-container rounded-2xl p-2.5 sm:p-3 space-y-2">
          
          {/* Header row: Title & Auto-Slide Toggle */}
          <div className="flex items-center justify-between gap-4 text-xs text-[#FFF5DF]/80 px-1">
            <span className="font-mono flex items-center gap-1.5 text-[#FDE68A] text-[11px] sm:text-xs">
              <ImageIcon className="w-3.5 h-3.5 text-[#F4B942]" />
              <span>दर्शन ({activeImageIndex + 1}/6)</span>
            </span>

            <button
              onClick={() => setIsAutoSlide(!isAutoSlide)}
              className={`text-[10px] sm:text-[11px] px-2.5 py-0.5 rounded-full border transition-all cursor-pointer ${
                isAutoSlide
                  ? 'bg-[#F4B942]/25 border-[#F4B942]/60 text-[#FDE68A] font-medium'
                  : 'bg-white/5 border-white/10 text-[#FFF5DF]/50 hover:text-[#FFF5DF]'
              }`}
            >
              {isAutoSlide ? 'Auto-Slide: On' : 'Paused'}
            </button>
          </div>

          {/* 6 Thumbnails + Prev/Next Buttons */}
          <div className="flex items-center gap-2">
            {/* Prev Button */}
            <button
              onClick={handlePrevImage}
              className="p-2 sm:p-2.5 rounded-xl bg-white/5 hover:bg-white/15 border border-white/10 text-[#FFF5DF] hover:text-[#F4B942] transition-colors cursor-pointer shrink-0 active:scale-95"
              aria-label="Previous image"
              title="Previous Image"
            >
              <ChevronLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </button>

            {/* 6 Image Thumbnails */}
            <div className="flex items-center gap-1.5">
              {HERO_IMAGES.map((img, idx) => {
                const isImgActive = idx === activeImageIndex;
                return (
                  <button
                    key={img.id}
                    onClick={() => onSelectImage(idx)}
                    className={`group relative rounded-xl overflow-hidden shrink-0 transition-all cursor-pointer border ${
                      isImgActive
                        ? 'w-10 h-10 sm:w-12 sm:h-12 border-[#F4B942] ring-2 ring-[#F4B942]/70 scale-105 shadow-[0_0_12px_rgba(244,185,66,0.6)]'
                        : 'w-8 h-8 sm:w-10 sm:h-10 border-white/15 opacity-60 hover:opacity-100 hover:border-[#F4B942]/50'
                    }`}
                    title={img.title}
                  >
                    <img
                      src={img.src}
                      alt={img.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors" />
                    <span className="absolute bottom-0.5 right-1 text-[8px] sm:text-[9px] font-mono text-white/95 drop-shadow">
                      {idx + 1}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Next Button */}
            <button
              onClick={handleNextImage}
              className="p-2 sm:p-2.5 rounded-xl bg-white/5 hover:bg-white/15 border border-white/10 text-[#FFF5DF] hover:text-[#F4B942] transition-colors cursor-pointer shrink-0 active:scale-95"
              aria-label="Next image"
              title="Next Image"
            >
              <ChevronRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </button>
          </div>

        </div>
      </div>
    </section>
  );
}
