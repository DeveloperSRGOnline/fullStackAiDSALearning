import React from 'react';

export const Navbar = ({ searchQuery, setSearchQuery, onOpenMoodStudio }) => {
  return (
    <header className="fixed top-0 left-64 right-0 h-16 bg-surface/75 backdrop-blur-xl z-40 border-b border-white/[0.04] px-6 flex items-center justify-between gap-4">
      {/* Search Input Bar */}
      <div className="flex-1 max-w-xl">
        <div className="relative flex items-center w-full group">
          <span className="material-symbols-outlined absolute left-3.5 text-on-surface-variant/70 text-[20px] transition-colors group-focus-within:text-primary">
            search
          </span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search songs, artist, genres, moods..."
            className="w-full bg-surface-container-low/80 text-on-surface placeholder:text-on-surface-variant/50 pl-11 pr-4 py-2 rounded-full text-sm font-normal outline-none border border-transparent focus:border-primary/40 focus:bg-surface-container focus:ring-1 focus:ring-primary/40 transition-all shadow-inner"
          />
        </div>
      </div>

      {/* Right Action Icons & Profile */}
      <div className="flex items-center gap-3">
        {/* Mood Scanner Quick Trigger Button */}
        <button
          onClick={onOpenMoodStudio}
          title="Open Biometric Mood Studio"
          className="hidden md:flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary/10 hover:bg-primary/20 text-primary border border-primary/25 text-xs font-semibold tracking-wide transition-all shadow-[0_0_12px_rgba(16,185,129,0.15)]"
        >
          <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
          <span className="material-symbols-outlined text-[16px]">psychology</span>
          <span>Mood Scan</span>
        </button>

        {/* Settings Button */}
        <button
          aria-label="Settings"
          type="button"
          className="w-9 h-9 rounded-full flex items-center justify-center text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high transition-colors"
        >
          <span className="material-symbols-outlined text-[20px]">settings</span>
        </button>

        {/* User Pill */}
        <div className="flex items-center gap-2.5 p-1 pr-3.5 rounded-full bg-surface-container-low hover:bg-surface-container border border-white/[0.04] transition-colors cursor-pointer">
          <img
            alt="Alex M. Avatar"
            src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80"
            className="w-7 h-7 rounded-full object-cover ring-1 ring-primary/40"
          />
          <div className="flex flex-col text-left">
            <span className="text-xs font-semibold text-on-surface leading-tight">Alex M.</span>
            <span className="text-[10px] text-primary leading-none">Pro Listener</span>
          </div>
        </div>
      </div>
    </header>
  );
};
