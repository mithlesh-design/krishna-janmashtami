import React from 'react';
import { Play, Pause, Volume2, FileSpreadsheet } from 'lucide-react';

export default function Playlist({ tracks = [], currentIndex, isPlaying, onSelectTrack }) {
  return (
    <div className="mt-8 space-y-3">
      {/* Subtle Playlist Header */}
      <div className="flex items-center justify-between px-2 text-xs font-medium text-[#FFF5DF]/60">
        <span className="uppercase tracking-widest">Devotional Song List</span>
        <span className="flex items-center gap-1.5 text-[#F4B942]/75 font-mono">
          <FileSpreadsheet className="w-3.5 h-3.5" />
          <span>Synced via playlist.csv</span>
        </span>
      </div>

      {/* Song List Container */}
      <div className="space-y-2">
        {tracks.map((track, idx) => {
          const isActive = idx === currentIndex;

          return (
            <div
              key={track.id || idx}
              onClick={() => onSelectTrack(idx)}
              className={`group relative flex items-center justify-between p-3 sm:p-4 rounded-2xl transition-all cursor-pointer border select-none ${
                isActive
                  ? 'bg-[#123A68]/50 border-[#F4B942]/40 shadow-[0_8px_25px_rgba(7,24,46,0.7)] backdrop-blur-md'
                  : 'bg-[#07182E]/40 hover:bg-[#123A68]/30 border-white/5 hover:border-[#F4B942]/20'
              }`}
            >
              {/* Left: Index/Status, Mini Cover, Song Title & Artist */}
              <div className="flex items-center gap-3 sm:gap-4 overflow-hidden">
                {/* Index / Play indicator */}
                <div className="w-8 flex items-center justify-center text-sm font-mono text-[#FFF5DF]/50">
                  {isActive && isPlaying ? (
                    <div className="flex items-end gap-0.5 h-4">
                      <span className="w-0.5 bg-[#F4B942] rounded-full animate-[divine-pulse_0.8s_infinite] h-full" />
                      <span className="w-0.5 bg-[#FFF5DF] rounded-full animate-[divine-pulse_1s_infinite_0.2s] h-3/4" />
                      <span className="w-0.5 bg-[#E879A9] rounded-full animate-[divine-pulse_0.6s_infinite_0.4s] h-2/3" />
                    </div>
                  ) : isActive ? (
                    <Volume2 className="w-4 h-4 text-[#F4B942]" />
                  ) : (
                    <span className="group-hover:hidden text-xs">{idx + 1}</span>
                  )}
                  {/* Hover play icon */}
                  {!isActive && (
                    <Play className="w-3.5 h-3.5 text-[#F4B942] hidden group-hover:block ml-0.5 fill-current" />
                  )}
                </div>

                {/* Small thumbnail */}
                <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-lg overflow-hidden bg-[#07182E] border border-white/10 shrink-0">
                  <img
                    src={track.coverImage || '/covers/achyutam.svg'}
                    alt={track.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = '/covers/achyutam.svg';
                    }}
                  />
                </div>

                {/* Title & Artist */}
                <div className="text-left truncate">
                  <h4
                    className={`text-sm sm:text-base font-serif-dev font-semibold truncate transition-colors ${
                      isActive ? 'text-[#FDE68A]' : 'text-[#FFF5DF] group-hover:text-[#FDE68A]'
                    }`}
                  >
                    {track.title}
                  </h4>
                  <p className="text-xs text-[#FFF5DF]/60 truncate font-light">
                    {track.artist}
                  </p>
                </div>
              </div>

              {/* Right: Duration */}
              <div className="flex items-center gap-3 shrink-0 ml-4">
                <span className="text-xs font-mono text-[#FFF5DF]/50">
                  {track.duration || '04:00'}
                </span>
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center transition-all ${
                    isActive
                      ? 'bg-[#F4B942] text-[#07182E]'
                      : 'opacity-0 group-hover:opacity-100 bg-white/10 text-[#FFF5DF]'
                  }`}
                >
                  {isActive && isPlaying ? (
                    <Pause className="w-3.5 h-3.5 fill-current" />
                  ) : (
                    <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
