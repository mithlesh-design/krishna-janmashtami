import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
  Volume1,
  Shuffle,
  Repeat,
  Repeat1,
  ListMusic,
  Tv,
  Headphones,
  ExternalLink
} from 'lucide-react';

function YoutubeIcon({ className = "w-3 h-3 text-red-500" }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor">
      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
    </svg>
  );
}

const YOUTUBE_PLAYLIST_URL = "https://www.youtube.com/watch?v=kNK7XYZcyBM&list=RDkNK7XYZcyBM&start_radio=1";

// Helper to convert mm:ss to seconds
function parseDurationToSeconds(durStr) {
  if (!durStr || typeof durStr !== 'string') return 240;
  const parts = durStr.split(':').map(Number);
  if (parts.length === 2) {
    return parts[0] * 60 + parts[1];
  } else if (parts.length === 3) {
    return parts[0] * 3600 + parts[1] * 60 + parts[2];
  }
  return 240;
}

export default function MusicPlayer({
  tracks = [],
  currentIndex = 0,
  onSelectTrack,
  isPlaying,
  setIsPlaying,
  isCompact = false
}) {
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.85);
  const [isMuted, setIsMuted] = useState(false);
  const [isShuffle, setIsShuffle] = useState(false);
  const [repeatMode, setRepeatMode] = useState('off'); // 'off' | 'all' | 'one'
  const [showTrackList, setShowTrackList] = useState(false);
  const [showVideo, setShowVideo] = useState(false);
  const [isYtReady, setIsYtReady] = useState(false);

  const audioRef = useRef(null);
  const progressBarRef = useRef(null);
  const ytPlayerRef = useRef(null);

  const currentTrack = tracks[currentIndex] || tracks[0] || {};

  // Setup YouTube IFrame API
  useEffect(() => {
    // Check if YouTube API is already loaded
    if (!window.YT) {
      const tag = document.createElement('script');
      tag.src = 'https://www.youtube.com/iframe_api';
      const firstScriptTag = document.getElementsByTagName('script')[0];
      firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
    }

    const initPlayer = () => {
      if (!window.YT || !window.YT.Player) return;
      if (ytPlayerRef.current) return;

      try {
        ytPlayerRef.current = new window.YT.Player('yt-player-embed', {
          height: '100%',
          width: '100%',
          videoId: currentTrack.videoId || 'kNK7XYZcyBM',
          playerVars: {
            autoplay: 0,
            controls: 1,
            rel: 0,
            modestbranding: 1,
            playsinline: 1,
            enablejsapi: 1,
            origin: window.location.origin,
          },
          events: {
            onReady: (e) => {
              setIsYtReady(true);
              e.target.setVolume(isMuted ? 0 : volume * 100);
              const dur = e.target.getDuration();
              if (dur && dur > 0) setDuration(dur);
            },
            onStateChange: (e) => {
              if (e.data === window.YT.PlayerState.PLAYING) {
                setIsPlaying(true);
              } else if (e.data === window.YT.PlayerState.PAUSED) {
                setIsPlaying(false);
              } else if (e.data === window.YT.PlayerState.ENDED) {
                if (repeatMode === 'one') {
                  if (ytPlayerRef.current) {
                    ytPlayerRef.current.seekTo(0);
                    ytPlayerRef.current.playVideo();
                  }
                } else {
                  playNext();
                }
              }
            },
            onError: (err) => {
              console.warn("YouTube player error:", err);
            }
          }
        });
      } catch (err) {
        console.warn("Error creating YouTube player instance:", err);
      }
    };

    if (window.YT && window.YT.Player) {
      initPlayer();
    } else {
      window.onYouTubeIframeAPIReady = initPlayer;
    }
  }, []);

  // Update track when currentIndex or currentTrack changes
  useEffect(() => {
    setCurrentTime(0);
    if (currentTrack.duration) {
      setDuration(parseDurationToSeconds(currentTrack.duration));
    }

    if (currentTrack.videoId && ytPlayerRef.current && isYtReady) {
      try {
        if (isPlaying) {
          ytPlayerRef.current.loadVideoById(currentTrack.videoId);
        } else {
          ytPlayerRef.current.cueVideoById(currentTrack.videoId);
        }
      } catch (err) {
        console.warn("Error loading video in YT player:", err);
      }
    } else if (audioRef.current && currentTrack.audioUrl && !currentTrack.videoId) {
      audioRef.current.src = currentTrack.audioUrl;
      audioRef.current.load();
      if (isPlaying) {
        audioRef.current.play().catch((e) => console.warn("Audio play prevented:", e));
      }
    }
  }, [currentIndex, currentTrack.videoId, isYtReady]);

  // Sync volume with both YouTube and HTML5 audio
  useEffect(() => {
    const targetVol = isMuted ? 0 : volume;
    if (ytPlayerRef.current && typeof ytPlayerRef.current.setVolume === 'function') {
      try {
        ytPlayerRef.current.setVolume(targetVol * 100);
      } catch (e) {}
    }
    if (audioRef.current) {
      audioRef.current.volume = targetVol;
    }
  }, [volume, isMuted]);

  // Live polling for YouTube playback time and duration
  useEffect(() => {
    if (!isPlaying) return;

    const timer = setInterval(() => {
      if (ytPlayerRef.current && typeof ytPlayerRef.current.getCurrentTime === 'function') {
        try {
          const cur = ytPlayerRef.current.getCurrentTime();
          const dur = ytPlayerRef.current.getDuration();
          if (typeof cur === 'number' && !isNaN(cur)) {
            setCurrentTime(cur);
          }
          if (typeof dur === 'number' && !isNaN(dur) && dur > 0) {
            setDuration(dur);
          }
        } catch (e) {}
      }
    }, 400);

    return () => clearInterval(timer);
  }, [isPlaying]);

  // Play / Pause toggle
  const togglePlay = () => {
    if (currentTrack.videoId && ytPlayerRef.current && isYtReady) {
      try {
        if (isPlaying) {
          ytPlayerRef.current.pauseVideo();
          setIsPlaying(false);
        } else {
          ytPlayerRef.current.playVideo();
          setIsPlaying(true);
        }
        return;
      } catch (err) {
        console.warn("YouTube play/pause failed:", err);
      }
    }

    // Fallback to HTML5 audio
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play()
        .then(() => setIsPlaying(true))
        .catch((err) => {
          console.warn("Audio play prevented:", err);
          setIsPlaying(false);
        });
    }
  };

  // Next Track
  const playNext = useCallback(() => {
    if (tracks.length === 0) return;
    let nextIdx = (currentIndex + 1) % tracks.length;
    if (isShuffle) {
      nextIdx = Math.floor(Math.random() * tracks.length);
      if (tracks.length > 1 && nextIdx === currentIndex) {
        nextIdx = (nextIdx + 1) % tracks.length;
      }
    }
    if (onSelectTrack) onSelectTrack(nextIdx);
    setIsPlaying(true);
  }, [isShuffle, tracks.length, currentIndex, onSelectTrack, setIsPlaying]);

  // Previous Track
  const playPrev = () => {
    if (tracks.length === 0) return;
    if (currentTime > 3) {
      if (ytPlayerRef.current && typeof ytPlayerRef.current.seekTo === 'function') {
        ytPlayerRef.current.seekTo(0, true);
      } else if (audioRef.current) {
        audioRef.current.currentTime = 0;
      }
      setCurrentTime(0);
    } else {
      const prevIdx = (currentIndex - 1 + tracks.length) % tracks.length;
      if (onSelectTrack) onSelectTrack(prevIdx);
      setIsPlaying(true);
    }
  };

  // Time format helper (03:45)
  const formatTime = (seconds) => {
    if (isNaN(seconds) || seconds < 0) return '00:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Seek
  const handleSeek = (e) => {
    const newTime = parseFloat(e.target.value);
    setCurrentTime(newTime);
    if (ytPlayerRef.current && typeof ytPlayerRef.current.seekTo === 'function') {
      try {
        ytPlayerRef.current.seekTo(newTime, true);
      } catch (err) {}
    } else if (audioRef.current) {
      audioRef.current.currentTime = newTime;
    }
  };

  // Repeat toggle
  const cycleRepeat = () => {
    if (repeatMode === 'off') setRepeatMode('all');
    else if (repeatMode === 'all') setRepeatMode('one');
    else setRepeatMode('off');
  };

  // HTML5 audio event handlers (fallback)
  const handleTimeUpdate = () => {
    if (audioRef.current && !currentTrack.videoId) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current && !currentTrack.videoId) {
      setDuration(audioRef.current.duration);
    }
  };

  const handleEnded = () => {
    if (repeatMode === 'one') {
      if (audioRef.current) {
        audioRef.current.currentTime = 0;
        audioRef.current.play();
      }
    } else if (repeatMode === 'all' || currentIndex < tracks.length - 1) {
      playNext();
    } else {
      setIsPlaying(false);
    }
  };

  return (
    <div className="w-full">
      {/* Hidden HTML5 Audio for fallback */}
      <audio
        ref={audioRef}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={handleEnded}
        preload="metadata"
      />

      {isCompact ? (
        /* =========================================================================
            MOBILE: MINIMAL MUSIC PLAYER STRIP
            Sleek horizontal pill / strip (~48px height) with all controls & collapsible drawers
            ========================================================================= */
        <div className="w-full relative z-20">
          
          {/* A. Collapsible Track List Drawer (Floats upward above the strip without affecting document flow) */}
          {showTrackList && (
            <div className="absolute bottom-full mb-2 left-0 right-0 p-2 rounded-2xl bg-[#07182E]/95 backdrop-blur-2xl border border-white/20 shadow-2xl max-h-56 overflow-y-auto space-y-1 custom-scrollbar text-left z-30">
              <div className="flex items-center justify-between px-2 py-1 border-b border-white/10 text-[11px] text-[#FDE68A] font-semibold">
                <span>कृष्ण भजन रस • {tracks.length} Songs</span>
                <button
                  onClick={() => setShowTrackList(false)}
                  className="text-white/60 hover:text-white text-[10px] px-1 py-0.5 rounded cursor-pointer"
                >
                  बंद करें ✕
                </button>
              </div>
              {tracks.map((t, idx) => (
                <button
                  key={t.id || idx}
                  onClick={() => {
                    if (onSelectTrack) onSelectTrack(idx);
                    setIsPlaying(true);
                  }}
                  className={`w-full flex items-center justify-between p-2 rounded-xl text-left text-xs transition-all cursor-pointer ${
                    idx === currentIndex
                      ? 'bg-[#123A68]/90 text-[#FDE68A] font-semibold border border-[#F4B942]/40 shadow-sm'
                      : 'bg-white/5 hover:bg-white/10 text-[#FFF5DF]/80 hover:text-[#FFF5DF]'
                  }`}
                >
                  <div className="flex items-center gap-2 truncate">
                    <span className="text-[10px] font-mono text-[#F4B942] w-4 shrink-0">{idx + 1}.</span>
                    <div className="truncate">
                      <div className="truncate font-medium text-[11px]">{t.title}</div>
                      <div className="text-[9px] text-[#FFF5DF]/50 truncate">{t.artist}</div>
                    </div>
                  </div>
                  <span className="text-[9px] font-mono text-[#FFF5DF]/50 shrink-0 ml-1">{t.duration}</span>
                </button>
              ))}
            </div>
          )}

          {/* B. Collapsible Video Window (Floats upward above the strip without affecting document flow) */}
          {showVideo && (
            <div className="absolute bottom-full mb-2 left-0 right-0 w-full aspect-video rounded-2xl overflow-hidden border border-[#F4B942]/40 shadow-2xl bg-black z-30">
              <div id="yt-player-embed" className="w-full h-full" />
            </div>
          )}
          {!showVideo && (
            <div className="absolute -left-[9999px] top-0 w-1 h-1 opacity-0 pointer-events-none">
              <div id="yt-player-embed" className="w-full h-full" />
            </div>
          )}

          {/* C. The Slim Minimal Music Player Strip */}
          <div className="relative rounded-full bg-[#07182E]/90 backdrop-blur-2xl border border-white/20 px-2.5 py-1.5 shadow-[0_8px_30px_rgba(0,0,0,0.75)] flex items-center justify-between gap-2 overflow-hidden">
            
            {/* Integrated Thin 2px Seeker Line along bottom of strip */}
            <div
              className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-white/10 overflow-hidden cursor-pointer"
              onClick={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                const clickX = e.clientX - rect.left;
                const newRatio = Math.max(0, Math.min(1, clickX / rect.width));
                if (duration) {
                  const newTime = newRatio * duration;
                  setCurrentTime(newTime);
                  if (ytPlayerRef.current && typeof ytPlayerRef.current.seekTo === 'function') {
                    ytPlayerRef.current.seekTo(newTime, true);
                  } else if (audioRef.current) {
                    audioRef.current.currentTime = newTime;
                  }
                }
              }}
            >
              <div
                className="h-full bg-gradient-to-r from-[#F4B942] to-[#FDE68A] transition-all duration-200"
                style={{
                  width: `${duration ? (currentTime / duration) * 100 : 0}%`,
                }}
              />
            </div>

            {/* Left: Mini Circular Cover & Title */}
            <div className="flex items-center gap-2 overflow-hidden flex-1 min-w-0">
              <div className="relative w-8 h-8 rounded-full overflow-hidden shrink-0 border border-[#F4B942]/60 shadow-sm bg-black">
                <img
                  src={currentTrack.coverImage || `/images/krishna-${((currentIndex % 6) + 1)}.png`}
                  alt={currentTrack.title}
                  onError={(e) => {
                    e.target.src = `/images/krishna-${((currentIndex % 6) + 1)}.png`;
                  }}
                  className={`w-full h-full object-cover ${isPlaying ? 'animate-[spin_8s_linear_infinite]' : ''}`}
                />
                {isPlaying && (
                  <div className="absolute inset-0 bg-black/25 flex items-center justify-center">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#F4B942] animate-ping" />
                  </div>
                )}
              </div>

              <div className="truncate flex-1 min-w-0 text-left">
                <h4 className="font-serif-dev text-xs font-bold text-[#FFF5DF] truncate leading-tight" title={currentTrack.title}>
                  {currentTrack.title}
                </h4>
                <p className="text-[10px] text-[#FDE68A]/80 truncate leading-tight font-sans">
                  {currentTrack.artist}
                </p>
              </div>
            </div>

            {/* Right: Essential Compact Controls */}
            <div className="flex items-center gap-1 shrink-0">
              {/* Prev */}
              <button
                onClick={playPrev}
                className="p-1 text-[#FFF5DF]/70 hover:text-white transition-colors active:scale-90 cursor-pointer"
                aria-label="Previous track"
              >
                <SkipBack className="w-3.5 h-3.5 fill-current" />
              </button>

              {/* Play / Pause */}
              <button
                onClick={togglePlay}
                className="w-7 h-7 rounded-full bg-gradient-to-tr from-[#FDE68A] via-[#F4B942] to-[#E5A93C] text-[#07182E] flex items-center justify-center shadow-md active:scale-90 transition-transform cursor-pointer shrink-0"
                aria-label={isPlaying ? 'Pause' : 'Play'}
              >
                {isPlaying ? (
                  <Pause className="w-3.5 h-3.5 fill-[#07182E]" />
                ) : (
                  <Play className="w-3.5 h-3.5 fill-[#07182E] ml-0.5" />
                )}
              </button>

              {/* Next */}
              <button
                onClick={playNext}
                className="p-1 text-[#FFF5DF]/70 hover:text-white transition-colors active:scale-90 cursor-pointer"
                aria-label="Next track"
              >
                <SkipForward className="w-3.5 h-3.5 fill-current" />
              </button>

              {/* Playlist drawer toggle */}
              <button
                onClick={() => setShowTrackList(!showTrackList)}
                className={`p-1 rounded-full transition-colors cursor-pointer ${
                  showTrackList
                    ? 'bg-[#F4B942] text-[#07182E]'
                    : 'text-[#FDE68A] hover:bg-white/10'
                }`}
                title="Playlist"
                aria-label="Playlist"
              >
                <ListMusic className="w-3.5 h-3.5" />
              </button>

              {/* Video toggle */}
              <button
                onClick={() => setShowVideo(!showVideo)}
                className={`p-1 rounded-full transition-colors cursor-pointer ${
                  showVideo
                    ? 'bg-[#F4B942] text-[#07182E]'
                    : 'text-[#FFF5DF]/60 hover:bg-white/10 hover:text-white'
                }`}
                title={showVideo ? "Hide Video" : "Show Video"}
                aria-label="Video"
              >
                {showVideo ? <Headphones className="w-3 h-3" /> : <Tv className="w-3 h-3" />}
              </button>
            </div>

          </div>

        </div>
      ) : (
        /* =========================================================================
            DESKTOP: FULL LIQUID-GLASS CONTAINER (100% Preserved)
            ========================================================================= */
        <div className="glass-player-container rounded-3xl p-4 sm:p-5 space-y-3 text-left relative overflow-hidden">

          {/* Header Badges & View Toggles */}
          <div className="flex items-center justify-between gap-2 text-xs">
            <div className="flex items-center gap-2">
              <span className="text-[10px] sm:text-[11px] uppercase font-mono tracking-widest text-[#F4B942] font-semibold flex items-center gap-1.5">
                <YoutubeIcon className="w-3.5 h-3.5 text-red-500 shrink-0" />
                <span>कृष्ण भजन • {currentIndex + 1}/{tracks.length}</span>
              </span>
            </div>

            <div className="flex items-center gap-1.5">
              {/* Toggle Video / Audio View */}
              <button
                onClick={() => setShowVideo(!showVideo)}
                className={`flex items-center gap-1 text-[11px] px-2.5 py-1 rounded-full border transition-all cursor-pointer ${
                  showVideo
                    ? 'bg-[#F4B942]/25 border-[#F4B942]/60 text-[#FDE68A] font-medium'
                    : 'bg-white/5 hover:bg-white/10 text-[#FFF5DF]/70 border-white/10 hover:text-[#FFF5DF]'
                }`}
                title={showVideo ? "Switch to Audio View" : "Watch Devotional Video"}
              >
                {showVideo ? (
                  <>
                    <Headphones className="w-3 h-3 text-[#F4B942]" />
                    <span>Audio View</span>
                  </>
                ) : (
                  <>
                    <Tv className="w-3 h-3 text-[#F4B942]" />
                    <span>Video View</span>
                  </>
                )}
              </button>

              {/* All Songs / Playlist Toggle */}
              <button
                onClick={() => setShowTrackList(!showTrackList)}
                className="flex items-center gap-1 text-[11px] text-[#FDE68A]/90 hover:text-[#FFF5DF] bg-white/5 hover:bg-white/10 px-2.5 py-1 rounded-full border border-white/10 transition-colors cursor-pointer"
                title="View All 27 Songs"
              >
                <ListMusic className="w-3 h-3 text-[#F4B942]" />
                <span>{showTrackList ? 'Hide' : '27 Songs'}</span>
              </button>

              {/* Direct Link to YouTube Playlist */}
              <a
                href={YOUTUBE_PLAYLIST_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="p-1 rounded-full text-[#FFF5DF]/50 hover:text-red-400 hover:bg-white/10 transition-colors"
                title="Open full playlist on YouTube"
                aria-label="Open full playlist on YouTube"
              >
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>

          {/* YouTube Embedded Video Window (Revealed in Video View, kept active offscreen in Audio View) */}
          <div
            className={
              showVideo
                ? 'w-full aspect-video rounded-2xl overflow-hidden mt-2 mb-1 border border-[#F4B942]/30 shadow-lg bg-black transition-all'
                : 'absolute -left-[9999px] top-0 w-1 h-1 opacity-0 pointer-events-none'
            }
          >
            <div id="yt-player-embed" className="w-full h-full" />
          </div>

          {/* Track Info & Artwork Row (Displayed when showVideo is false or minimized) */}
          <div className="flex items-center gap-3.5">
            {/* Mini Album Cover with Pulsing Glow & YouTube Thumbnail */}
            <div className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-2xl overflow-hidden shrink-0 border border-[#F4B942]/40 bg-[#07182E] shadow-md group">
              <img
                src={currentTrack.coverImage || `/images/krishna-${((currentIndex % 6) + 1)}.png`}
                alt={currentTrack.title}
                onError={(e) => {
                  e.target.src = `/images/krishna-${((currentIndex % 6) + 1)}.png`;
                }}
                className={`w-full h-full object-cover transition-transform duration-700 ${
                  isPlaying ? 'scale-110' : 'scale-100'
                }`}
              />
              {isPlaying && (
                <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                  {/* Live Equalizer Wave Animation */}
                  <div className="flex items-end gap-0.5 h-4">
                    <span className="w-1 bg-[#F4B942] rounded-full animate-[divine-pulse_0.8s_infinite] h-full" />
                    <span className="w-1 bg-[#FFF5DF] rounded-full animate-[divine-pulse_1s_infinite_0.2s] h-3/4" />
                    <span className="w-1 bg-[#E879A9] rounded-full animate-[divine-pulse_0.6s_infinite_0.4s] h-2/3" />
                  </div>
                </div>
              )}
            </div>

            {/* Title & Artist */}
            <div className="overflow-hidden flex-1">
              <h4 className="font-serif-dev text-base sm:text-lg font-bold text-[#FFF5DF] truncate mt-0.5" title={currentTrack.title}>
                {currentTrack.title}
              </h4>
              <p className="text-xs text-[#FDE68A]/85 truncate font-normal" title={currentTrack.artist}>
                {currentTrack.artist}
              </p>
            </div>
          </div>

          {/* Collapsible Playlist Selector (Displays all 27 tracks) */}
          {showTrackList && (
            <div className="mt-2 pt-2 border-t border-white/10 max-h-52 overflow-y-auto space-y-1 pr-1 custom-scrollbar">
              {tracks.map((t, idx) => (
                <button
                  key={t.id || idx}
                  onClick={() => {
                    if (onSelectTrack) onSelectTrack(idx);
                    setIsPlaying(true);
                  }}
                  className={`w-full flex items-center justify-between p-2 rounded-xl text-left text-xs transition-all cursor-pointer ${
                    idx === currentIndex
                      ? 'bg-[#123A68]/80 text-[#FDE68A] font-semibold border border-[#F4B942]/40'
                      : 'bg-white/5 hover:bg-white/10 text-[#FFF5DF]/80 hover:text-[#FFF5DF]'
                  }`}
                >
                  <div className="flex items-center gap-2 truncate">
                    <span className="text-[10px] font-mono text-[#F4B942]/80 w-5 shrink-0">{idx + 1}.</span>
                    <div className="truncate">
                      <div className="truncate font-medium">{t.title}</div>
                      <div className="text-[10px] text-[#FFF5DF]/50 truncate">{t.artist}</div>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono text-[#FFF5DF]/50 shrink-0 ml-2">{t.duration}</span>
                </button>
              ))}
            </div>
          )}

          {/* Progress Bar & Timestamps */}
          <div className="mt-2 space-y-1">
            <input
              ref={progressBarRef}
              type="range"
              min="0"
              max={duration || 100}
              value={currentTime}
              onChange={handleSeek}
              aria-label="Seek track"
              className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-[#F4B942] hover:h-2 transition-all focus:outline-none"
              style={{
                background: `linear-gradient(to right, #F4B942 ${
                  duration ? (currentTime / duration) * 100 : 0
                }%, rgba(255,255,255,0.15) ${
                  duration ? (currentTime / duration) * 100 : 0
                }%)`,
              }}
            />
            <div className="flex justify-between text-[11px] font-mono text-[#FFF5DF]/60">
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(duration || 0)}</span>
            </div>
          </div>

          {/* Main Audio Controls Row */}
          <div className="flex items-center justify-between mt-1 pt-1">
            {/* Shuffle */}
            <button
              onClick={() => setIsShuffle(!isShuffle)}
              className={`p-1.5 rounded-full transition-colors cursor-pointer ${
                isShuffle ? 'text-[#F4B942] bg-[#F4B942]/20' : 'text-[#FFF5DF]/50 hover:text-[#FFF5DF]'
              }`}
              title="Shuffle"
              aria-label="Shuffle"
            >
              <Shuffle className="w-3.5 h-3.5" />
            </button>

            {/* Previous */}
            <button
              onClick={playPrev}
              className="p-2 rounded-full text-[#FFF5DF]/80 hover:text-[#FFF5DF] hover:bg-white/10 transition-all cursor-pointer active:scale-90"
              aria-label="Previous track"
              title="Previous"
            >
              <SkipBack className="w-4 h-4 fill-current" />
            </button>

            {/* Big Play / Pause */}
            <button
              onClick={togglePlay}
              className="w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-gradient-to-tr from-[#FDE68A] via-[#F4B942] to-[#E5A93C] text-[#07182E] flex items-center justify-center shadow-[0_0_20px_rgba(244,185,66,0.6)] hover:brightness-110 transition-all cursor-pointer active:scale-95"
              aria-label={isPlaying ? 'Pause' : 'Play'}
              title={isPlaying ? 'Pause' : 'Play'}
            >
              {isPlaying ? (
                <Pause className="w-5 h-5 fill-[#07182E]" />
              ) : (
                <Play className="w-5 h-5 fill-[#07182E] ml-0.5" />
              )}
            </button>

            {/* Next */}
            <button
              onClick={playNext}
              className="p-2 rounded-full text-[#FFF5DF]/80 hover:text-[#FFF5DF] hover:bg-white/10 transition-all cursor-pointer active:scale-90"
              aria-label="Next track"
              title="Next"
            >
              <SkipForward className="w-4 h-4 fill-current" />
            </button>

            {/* Repeat */}
            <button
              onClick={cycleRepeat}
              className={`p-1.5 rounded-full transition-colors cursor-pointer ${
                repeatMode !== 'off' ? 'text-[#F4B942] bg-[#F4B942]/20' : 'text-[#FFF5DF]/50 hover:text-[#FFF5DF]'
              }`}
              title={`Repeat: ${repeatMode}`}
              aria-label="Repeat"
            >
              {repeatMode === 'one' ? <Repeat1 className="w-3.5 h-3.5" /> : <Repeat className="w-3.5 h-3.5" />}
            </button>
          </div>

          {/* Volume Bar & YouTube Status */}
          <div className="flex items-center gap-2.5 mt-2 pt-2 border-t border-white/5">
            <button
              onClick={() => setIsMuted(!isMuted)}
              className="text-[#FFF5DF]/60 hover:text-[#F4B942] transition-colors cursor-pointer"
              aria-label={isMuted ? 'Unmute' : 'Mute'}
            >
              {isMuted || volume === 0 ? (
                <VolumeX className="w-3.5 h-3.5" />
              ) : volume < 0.5 ? (
                <Volume1 className="w-3.5 h-3.5" />
              ) : (
                <Volume2 className="w-3.5 h-3.5" />
              )}
            </button>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={isMuted ? 0 : volume}
              onChange={(e) => {
                setVolume(parseFloat(e.target.value));
                if (isMuted) setIsMuted(false);
              }}
              aria-label="Volume slider"
              className="w-20 sm:w-24 h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-[#F4B942]"
            />
            <span className="text-[10px] font-mono text-[#FFF5DF]/50">
              {isMuted ? 'Muted' : `${Math.round(volume * 100)}%`}
            </span>

            <span className="text-[10px] text-[#FDE68A]/70 font-serif-dev ml-auto truncate flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>लाइव भजन रस</span>
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
