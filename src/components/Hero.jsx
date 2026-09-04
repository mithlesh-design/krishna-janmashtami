import React, { useState, useEffect } from 'react';
import { Sparkles, ChevronLeft, ChevronRight, Image as ImageIcon } from 'lucide-react';
import MusicPlayer from './MusicPlayer';
import { HERO_IMAGES, HERO_IMAGES_MOBILE } from '../constants/heroImages';

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
  const [isDesktop, setIsDesktop] = useState(true);

  // Viewport detection: < 1024px is mobile/tablet, >= 1024px is desktop
  useEffect(() => {
    const checkViewport = () => {
      setIsDesktop(window.innerWidth >= 1024);
    };
    checkViewport();
    window.addEventListener('resize', checkViewport);
    return () => window.removeEventListener('resize', checkViewport);
  }, []);

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
    <section className="relative min-h-screen w-full flex items-center justify-center pt-20 pb-16 lg:pt-24 lg:pb-12 px-4 sm:px-8 lg:px-16 z-10 select-none">
      
      {/* =========================================================================
          1. MOBILE EXPERIENCE (< 1024px)
          - Krishna image is in the background (no box/card container)
          - Text appears over the natural gradient/faded area of the background image
          - Music player sits directly below
          - Handshot / darshan tab is small, compact, and sleek
          ========================================================================= */}
      {!isDesktop ? (
        <div className="flex flex-col items-center justify-end w-full max-w-sm sm:max-w-md mx-auto space-y-3 pt-32 sm:pt-40 pb-6 px-1">
          
          {/* A. TEXT OVER NATURAL GRADIENT / FADED AREA (Clear, readable with subtle text shadow, no box) */}
          <div className="text-center space-y-1 w-full px-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full border border-white/20 bg-black/40 backdrop-blur-md shadow-md">
              <Sparkles className="w-3 h-3 text-[#F4B942]" />
              <span className="text-[11px] font-semibold text-[#FDE68A] font-serif-dev tracking-wide">
                श्री कृष्ण जन्माष्टमी
              </span>
            </div>
            
            <h1 className="devanagari-hero-title text-3xl sm:text-4xl font-bold gold-gradient-text tracking-tight hero-text-shadow pt-0.5">
              Happy Krishna Janmashtami
            </h1>
            
            <p className="devanagari-text text-sm sm:text-base text-[#FDE68A] font-medium hero-text-shadow">
              नंद के आनंद भयो, जय कन्हैया लाल की! 🍯✨
            </p>

            {/* Rotating Devotional Couplet with subtle shadow */}
            <div className="min-h-[24px] flex items-center justify-center pt-0.5">
              <p
                key={rotatingIndex}
                className="devanagari-text text-xs sm:text-sm text-[#FFF5DF] font-medium tracking-wide hero-text-shadow transition-all duration-500 animate-[shimmer-gold_0.8s_ease-out]"
              >
                {ROTATING_DEVOTIONAL_LINES[rotatingIndex]}
              </p>
            </div>
          </div>

          {/* B. COMPACT MUSIC PLAYER DIRECTLY BELOW */}
          <div className="w-full mx-auto pt-0.5">
            <MusicPlayer
              tracks={tracks}
              currentIndex={currentTrackIndex}
              onSelectTrack={onSelectTrack}
              isPlaying={isPlaying}
              setIsPlaying={setIsPlaying}
              isCompact={true}
            />
          </div>

        </div>
      ) : (
        /* =========================================================================
            2. DESKTOP EXPERIENCE (>= 1024px)
            Exact Senior Product Designer Layout:
            - Left: Unobstructed background artwork view
            - Right: Text & Liquid Glass Player over the naturally faded gradient area
            - Bottom-Left: Compact, reduced-size Handshot / Darshan Tab
            ========================================================================= */
        <>
          <div className="w-full max-w-7xl mx-auto grid grid-cols-12 gap-12 items-center">
            
            {/* ================= LEFT SIDE: Full Unobstructed View of Hero Imagery ================= */}
            <div className="col-span-6 pointer-events-none" />

            {/* ================= RIGHT SIDE: Content & Player Over Faded Gradient Area ================= */}
            <div className="col-span-6 flex flex-col justify-center space-y-8 w-full max-w-lg ml-auto">
              
              {/* 1. HERO CONTENT AREA (Directly over the background gradient - NO background box) */}
              <div className="text-left space-y-4">
                {/* "Radhe Radhe" Greeting */}
                <div className="flex items-center gap-2.5">
                  <span className="font-serif-dev text-2xl font-bold gold-gradient-text tracking-wide drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)]">
                    “Radhe Radhe”
                  </span>
                  <span className="text-xs px-2.5 py-0.5 rounded-full border border-white/20 text-[#FDE68A] font-serif-dev bg-white/5 backdrop-blur-sm">
                    राधे राधे ✨
                  </span>
                </div>

                {/* Krishna Janmashtami Heading (Unclipped, majestic Devanagari) */}
                <div>
                  <h1 className="devanagari-hero-title text-5xl lg:text-6xl font-bold gold-gradient-text tracking-tight drop-shadow-[0_4px_25px_rgba(0,0,0,0.9)]">
                    श्री कृष्ण जन्माष्टमी
                  </h1>

                  {/* Tagline / Caption */}
                  <p className="devanagari-text text-xl text-[#FDE68A] font-semibold drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)] mt-1">
                    नंद के आनंद भयो, जय कन्हैया लाल की! 🍯✨
                  </p>
                </div>

                {/* Rotating Devotional Text (Dynamic, sitting directly over the composition, NO container) */}
                <div className="min-h-[32px] flex items-center pt-0.5">
                  <p
                    key={rotatingIndex}
                    className="devanagari-text text-lg text-[#FFF5DF]/90 font-medium tracking-wide drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)] transition-all duration-500 animate-[shimmer-gold_0.8s_ease-out]"
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

          {/* ================= BOTTOM-LEFT: Compact Handshot / Darshan Tab (Desktop) ================= */}
          <div className="absolute bottom-6 left-8 z-30 pointer-events-auto">
            <div className="glass-player-container rounded-xl p-2 space-y-1.5 shadow-xl border border-white/15 bg-[#07182E]/80 backdrop-blur-md">
              
              {/* Header row: Compact Title & Auto-Slide Toggle */}
              <div className="flex items-center justify-between gap-3 text-[10px] text-[#FFF5DF]/75 px-1">
                <span className="font-mono flex items-center gap-1.5 text-[#FDE68A]">
                  <ImageIcon className="w-3 h-3 text-[#F4B942]" />
                  <span>दर्शन ({activeImageIndex + 1}/6)</span>
                </span>

                <button
                  onClick={() => setIsAutoSlide(!isAutoSlide)}
                  className={`text-[9px] px-2 py-0.5 rounded-full border transition-all cursor-pointer ${
                    isAutoSlide
                      ? 'bg-[#F4B942]/25 border-[#F4B942]/60 text-[#FDE68A] font-medium'
                      : 'bg-white/5 border-white/10 text-[#FFF5DF]/50 hover:text-[#FFF5DF]'
                  }`}
                >
                  {isAutoSlide ? 'Auto: On' : 'Paused'}
                </button>
              </div>

              {/* 6 Compact Thumbnails + Prev/Next Buttons */}
              <div className="flex items-center gap-1">
                {/* Prev Button */}
                <button
                  onClick={handlePrevImage}
                  className="p-1.5 rounded-lg bg-white/5 hover:bg-white/15 border border-white/10 text-[#FFF5DF] hover:text-[#F4B942] transition-colors cursor-pointer shrink-0 active:scale-95"
                  aria-label="Previous image"
                  title="Previous Image"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                </button>

                {/* 6 Image Thumbnails (Compact size) */}
                <div className="flex items-center gap-1">
                  {HERO_IMAGES.map((img, idx) => {
                    const isImgActive = idx === activeImageIndex;
                    return (
                      <button
                        key={img.id}
                        onClick={() => onSelectImage(idx)}
                        className={`group relative rounded-lg overflow-hidden shrink-0 transition-all cursor-pointer border ${
                          isImgActive
                            ? 'w-8 h-8 sm:w-9 sm:h-9 border-[#F4B942] ring-1 ring-[#F4B942]/80 scale-105 shadow-[0_0_8px_rgba(244,185,66,0.6)]'
                            : 'w-7 h-7 sm:w-8 sm:h-8 border-white/10 opacity-60 hover:opacity-100 hover:border-[#F4B942]/50'
                        }`}
                        title={img.title}
                      >
                        <img
                          src={img.src}
                          alt={img.title}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors" />
                        <span className="absolute bottom-0.5 right-0.5 text-[8px] font-mono text-white/95 drop-shadow">
                          {idx + 1}
                        </span>
                      </button>
                    );
                  })}
                </div>

                {/* Next Button */}
                <button
                  onClick={handleNextImage}
                  className="p-1.5 rounded-xl bg-white/5 hover:bg-white/15 border border-white/10 text-[#FFF5DF] hover:text-[#F4B942] transition-colors cursor-pointer shrink-0 active:scale-95"
                  aria-label="Next image"
                  title="Next Image"
                >
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>

            </div>
          </div>
        </>
      )}

    </section>
  );
}
