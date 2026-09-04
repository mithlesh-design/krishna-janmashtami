import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import KrishnaMotionScene, { HERO_IMAGES } from './components/KrishnaMotionScene';
import Hero from './components/Hero';
import DonateModal from './components/DonateModal';
import ShareModal from './components/ShareModal';
import SplashCursor from './components/SplashCursor';
import { loadPlaylistFromCSV, DEFAULT_TRACKS } from './utils/csvParser';

export default function App() {
  const [tracks, setTracks] = useState(DEFAULT_TRACKS);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isAutoSlide, setIsAutoSlide] = useState(true);

  const [isDonateOpen, setIsDonateOpen] = useState(false);
  const [isShareOpen, setIsShareOpen] = useState(false);

  // Dynamic CSV loading
  useEffect(() => {
    async function fetchPlaylist() {
      const parsedTracks = await loadPlaylistFromCSV('/data/playlist.csv');
      if (parsedTracks && parsedTracks.length > 0) {
        setTracks(parsedTracks);
      }
    }
    fetchPlaylist();
  }, []);

  // Auto-slideshow for the 6 images
  useEffect(() => {
    if (!isAutoSlide) return;
    const timer = setInterval(() => {
      setActiveImageIndex((prev) => (prev + 1) % HERO_IMAGES.length);
    }, 7000);
    return () => clearInterval(timer);
  }, [isAutoSlide]);

  // When track is selected from player, also sync background scene with that track
  const handleSelectTrack = (idx) => {
    setCurrentTrackIndex(idx);
    setActiveImageIndex(idx % HERO_IMAGES.length);
  };

  // Manual image selection from hero thumbnails
  const handleSelectImage = (idx) => {
    setActiveImageIndex(idx);
  };

  // Handle Share: Web Share API with Modal fallback
  const handleShare = async () => {
    const shareData = {
      title: 'श्री कृष्ण जन्माष्टमी | Krishna Janmashtami',
      text: 'माखन की मटकी, फूलों का हार, मुरली की मधुर तान, खुशियों की फुहार। जन्माष्टमी के इस पावन उत्सव पर आप सभी को राधे राधे! 🙏✨',
      url: window.location.href,
    };

    if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        if (err.name !== 'AbortError') {
          setIsShareOpen(true);
        }
      }
    } else {
      setIsShareOpen(true);
    }
  };

  return (
    <div className="relative min-h-screen lg:h-screen lg:overflow-hidden bg-[#07182E] text-[#FFF5DF] selection:bg-[#F4B942]/30 selection:text-[#FFF5DF] font-sans flex flex-col justify-between">
      {/* 1. React Bits Interactive WebGL Splash Cursor Effect */}
      <SplashCursor
        SIM_RESOLUTION={128}
        DYE_RESOLUTION={1024}
        DENSITY_DISSIPATION={3.8}
        VELOCITY_DISSIPATION={2}
        PRESSURE={0.1}
        CURL={4}
        SPLAT_RADIUS={0.22}
        SPLAT_FORCE={5500}
        SHADING={true}
        COLOR_UPDATE_SPEED={12}
        RAINBOW_MODE={true}
      />

      {/* 2. 6 Images Hero Motion Graphics Backdrop & Canvas Particles */}
      <KrishnaMotionScene activeImageIndex={activeImageIndex} />

      {/* 3. Minimal Header (Top) */}
      <Header
        onOpenShare={handleShare}
        onOpenDonate={() => setIsDonateOpen(true)}
      />

      {/* 4. The Single Unified Hero Section */}
      <main className="relative z-10 w-full my-auto">
        <Hero
          activeImageIndex={activeImageIndex}
          onSelectImage={handleSelectImage}
          tracks={tracks}
          currentTrackIndex={currentTrackIndex}
          onSelectTrack={handleSelectTrack}
          isPlaying={isPlaying}
          setIsPlaying={setIsPlaying}
          isAutoSlide={isAutoSlide}
          setIsAutoSlide={setIsAutoSlide}
        />
      </main>

      {/* 5. Action Modals */}
      <DonateModal
        isOpen={isDonateOpen}
        onClose={() => setIsDonateOpen(false)}
      />
      <ShareModal
        isOpen={isShareOpen}
        onClose={() => setIsShareOpen(false)}
      />
    </div>
  );
}
