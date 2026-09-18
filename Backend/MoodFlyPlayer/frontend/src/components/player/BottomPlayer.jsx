import React, { useRef } from 'react';
import { useAudio } from '../../context/AudioContext';

export const BottomPlayer = () => {
  const {
    currentSong,
    isPlaying,
    currentTime,
    duration,
    volume,
    isMuted,
    isShuffle,
    repeatMode,
    isQueueOpen,
    setIsQueueOpen,
    togglePlay,
    nextTrack,
    prevTrack,
    seekTo,
    setVolume,
    toggleMute,
    toggleShuffle,
    toggleRepeat,
    toggleFavorite,
    isFavorite,
    formatTime,
  } = useAudio();

  const progressRef = useRef(null);

  if (!currentSong) return null;

  const currentFavorited = isFavorite(currentSong._id);
  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

  const handleSeek = (e) => {
    if (!progressRef.current || !duration) return;
    const rect = progressRef.current.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const fraction = Math.max(0, Math.min(1, clickX / rect.width));
    seekTo(fraction * duration);
  };

  return (
    <footer className="fixed bottom-0 left-0 right-0 h-24 bg-surface-dim/95 backdrop-blur-2xl z-50 px-6 sm:px-8 flex items-center justify-between border-t border-white/[0.06] shadow-[0_-8px_32px_rgba(0,0,0,0.5)]">
      {/* 1. Track Info (Left - 1/4) */}
      <div className="flex items-center gap-3.5 w-1/4 min-w-[200px]">
        <div className="relative w-14 h-14 rounded-xl bg-surface-container overflow-hidden flex-shrink-0 shadow-md ring-1 ring-white/10 group">
          <img
            src={currentSong.coverImage || 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=120&q=80'}
            alt={currentSong.title}
            className={`w-full h-full object-cover transition-transform duration-500 ${isPlaying ? 'scale-105' : 'scale-100'}`}
          />
          <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <span className="material-symbols-outlined text-white text-[18px]">
              fullscreen
            </span>
          </div>
        </div>

        <div className="min-w-0 flex-1">
          <h4 className="font-headline font-semibold text-sm text-on-surface truncate hover:text-primary transition-colors cursor-pointer">
            {currentSong.title}
          </h4>
          <p className="text-xs text-on-surface-variant truncate mt-0.5">
            {currentSong.artistNames}
          </p>
        </div>

        {/* Favorite Heart Button */}
        <button
          type="button"
          onClick={() => toggleFavorite(currentSong._id)}
          aria-label={currentFavorited ? 'Remove from Favorites' : 'Add to Favorites'}
          className={`p-1.5 rounded-full transition-all flex-shrink-0 ${
            currentFavorited
              ? 'text-pink-500 scale-110'
              : 'text-on-surface-variant/60 hover:text-pink-400 hover:scale-105'
          }`}
        >
          <span className={`material-symbols-outlined text-[20px] ${currentFavorited ? 'filled' : ''}`}>
            favorite
          </span>
        </button>
      </div>

      {/* 2. Playback Controls & Seekbar (Center - 2/4) */}
      <div className="flex flex-col items-center gap-1.5 w-2/4 max-w-2xl px-4">
        {/* Buttons Row */}
        <div className="flex items-center gap-5">
          {/* Shuffle */}
          <button
            type="button"
            onClick={toggleShuffle}
            aria-label="Shuffle"
            className={`transition-colors ${
              isShuffle ? 'text-primary' : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            <span className="material-symbols-outlined text-[20px]">shuffle</span>
          </button>

          {/* Previous Track */}
          <button
            type="button"
            onClick={prevTrack}
            aria-label="Previous Track"
            className="text-on-surface-variant hover:text-on-surface transition-colors active:scale-95"
          >
            <span className="material-symbols-outlined text-[24px]">skip_previous</span>
          </button>

          {/* Emerald Glow Play / Pause */}
          <button
            type="button"
            onClick={togglePlay}
            aria-label={isPlaying ? 'Pause' : 'Play'}
            className="w-11 h-11 rounded-full bg-primary hover:bg-primary-light text-black flex items-center justify-center shadow-[0_0_20px_rgba(16,185,129,0.45)] hover:scale-105 active:scale-95 transition-all"
          >
            <span className="material-symbols-outlined text-[26px] font-bold">
              {isPlaying ? 'pause' : 'play_arrow'}
            </span>
          </button>

          {/* Next Track */}
          <button
            type="button"
            onClick={nextTrack}
            aria-label="Next Track"
            className="text-on-surface-variant hover:text-on-surface transition-colors active:scale-95"
          >
            <span className="material-symbols-outlined text-[24px]">skip_next</span>
          </button>

          {/* Repeat Mode */}
          <button
            type="button"
            onClick={toggleRepeat}
            aria-label="Repeat Mode"
            className={`transition-colors ${
              repeatMode !== 'off' ? 'text-primary' : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            <span className="material-symbols-outlined text-[20px]">
              {repeatMode === 'one' ? 'repeat_one' : 'repeat'}
            </span>
          </button>
        </div>

        {/* Progress Seekbar Row */}
        <div className="w-full flex items-center gap-3">
          <span className="text-[11px] font-mono text-on-surface-variant/70 min-w-[34px] text-right">
            {formatTime(currentTime)}
          </span>

          <div
            ref={progressRef}
            onClick={handleSeek}
            className="relative flex-1 h-1.5 bg-surface-container-high rounded-full cursor-pointer group py-1.5 flex items-center"
          >
            <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden relative">
              <div
                className="h-full bg-primary rounded-full transition-all duration-75 relative group-hover:bg-primary-light"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            {/* Scrubber thumb with glow on hover */}
            <div
              className="absolute top-1/2 -translate-y-1/2 w-3.5 h-3.5 bg-white rounded-full shadow-[0_0_12px_#10b981] opacity-0 group-hover:opacity-100 transition-opacity -ml-1.5 pointer-events-none"
              style={{ left: `${progressPercent}%` }}
            />
          </div>

          <span className="text-[11px] font-mono text-on-surface-variant/70 min-w-[34px]">
            {formatTime(duration)}
          </span>
        </div>
      </div>

      {/* 3. Auxiliary Controls (Right - 1/4) */}
      <div className="flex items-center justify-end gap-4 w-1/4 min-w-[180px]">
        {/* Queue Button with Badge */}
        <button
          type="button"
          onClick={() => setIsQueueOpen((prev) => !prev)}
          aria-label="Queue"
          className={`p-2 rounded-lg transition-colors relative ${
            isQueueOpen ? 'bg-white/10 text-primary' : 'text-on-surface-variant hover:text-on-surface hover:bg-white/[0.04]'
          }`}
        >
          <span className="material-symbols-outlined text-[20px]">queue_music</span>
        </button>

        {/* Volume Scrub */}
        <div className="flex items-center gap-2 w-28">
          <button
            type="button"
            onClick={toggleMute}
            aria-label={isMuted ? 'Unmute' : 'Mute'}
            className="text-on-surface-variant hover:text-on-surface transition-colors"
          >
            <span className="material-symbols-outlined text-[20px]">
              {isMuted || volume === 0 ? 'volume_off' : volume < 0.5 ? 'volume_down' : 'volume_up'}
            </span>
          </button>
          <input
            type="range"
            min="0"
            max="1"
            step="0.02"
            value={isMuted ? 0 : volume}
            onChange={(e) => setVolume(parseFloat(e.target.value))}
            className="w-full h-1 bg-surface-container-high rounded-full appearance-none accent-primary cursor-pointer"
          />
        </div>
      </div>
    </footer>
  );
};
