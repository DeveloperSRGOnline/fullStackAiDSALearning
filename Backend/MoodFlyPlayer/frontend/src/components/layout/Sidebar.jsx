import React from 'react';

export const Sidebar = ({ activeTab, setActiveTab, onOpenCreateModal, playlists = [] }) => {
  return (
    <aside className="fixed left-0 top-0 bottom-24 w-64 bg-surface-dim/95 backdrop-blur-xl border-r border-white/[0.04] z-50 flex flex-col justify-between overflow-y-auto selection:bg-primary selection:text-black">
      <div className="p-6">
        {/* Brand Logo & Name */}
        <div 
          onClick={() => setActiveTab('home')}
          className="flex items-center gap-3 mb-8 cursor-pointer group"
        >
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-primary to-secondary flex items-center justify-center shadow-[0_0_16px_rgba(16,185,129,0.35)] group-hover:scale-105 transition-transform">
            <span className="material-symbols-outlined text-black font-bold text-[22px]">
              graphic_eq
            </span>
          </div>
          <div className="flex flex-col">
            <span className="font-headline font-bold text-xl tracking-tight text-on-surface group-hover:text-primary transition-colors">
              Moodfly
            </span>
            <span className="text-[10px] text-secondary font-semibold uppercase tracking-widest">
              Biometric AI Audio
            </span>
          </div>
        </div>

        {/* Navigation Sections */}
        <nav className="space-y-6">
          {/* Main Menu */}
          <div className="space-y-1.5">
            <p className="px-3 text-[11px] font-semibold text-on-surface-variant/60 uppercase tracking-widest">
              Menu
            </p>
            <div className="space-y-1">
              <button
                type="button"
                onClick={() => setActiveTab('detect-mood')}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl font-medium text-sm transition-all ${
                  activeTab === 'detect-mood'
                    ? 'bg-primary text-black font-semibold shadow-[0_0_16px_rgba(16,185,129,0.3)]'
                    : 'text-on-surface-variant hover:bg-white/[0.04] hover:text-on-surface'
                }`}
              >
                <span className={`material-symbols-outlined text-[20px] ${activeTab === 'detect-mood' ? 'text-black' : 'text-primary'}`}>
                  auto_videocam
                </span>
                <span>Detect Mood</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('home')}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl font-medium text-sm transition-all ${
                  activeTab === 'home'
                    ? 'bg-primary text-black font-semibold shadow-[0_0_16px_rgba(16,185,129,0.3)]'
                    : 'text-on-surface-variant hover:bg-white/[0.04] hover:text-on-surface'
                }`}
              >
                <span className="material-symbols-outlined text-[20px]">
                  home
                </span>
                <span>Home</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('playlists')}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl font-medium text-sm transition-all ${
                  activeTab === 'playlists'
                    ? 'bg-primary text-black font-semibold shadow-[0_0_16px_rgba(16,185,129,0.3)]'
                    : 'text-on-surface-variant hover:bg-white/[0.04] hover:text-on-surface'
                }`}
              >
                <span className="material-symbols-outlined text-[20px]">
                  queue_music
                </span>
                <span>Playlists</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('artists')}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl font-medium text-sm transition-all ${
                  activeTab === 'artists'
                    ? 'bg-primary text-black font-semibold'
                    : 'text-on-surface-variant hover:bg-white/[0.04] hover:text-on-surface'
                }`}
              >
                <span className="material-symbols-outlined text-[20px]">
                  mic
                </span>
                <span>Artists</span>
              </button>
            </div>
          </div>

          {/* Library Section */}
          <div className="space-y-1.5">
            <p className="px-3 text-[11px] font-semibold text-on-surface-variant/60 uppercase tracking-widest">
              Library
            </p>
            <div className="space-y-1">
              <button
                type="button"
                onClick={() => setActiveTab('recents')}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl font-medium text-sm transition-all ${
                  activeTab === 'recents'
                    ? 'bg-white/[0.08] text-primary font-semibold'
                    : 'text-on-surface-variant hover:bg-white/[0.04] hover:text-on-surface'
                }`}
              >
                <span className="material-symbols-outlined text-[20px]">
                  schedule
                </span>
                <span>Recents</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('favorites')}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl font-medium text-sm transition-all ${
                  activeTab === 'favorites'
                    ? 'bg-white/[0.08] text-primary font-semibold'
                    : 'text-on-surface-variant hover:bg-white/[0.04] hover:text-on-surface'
                }`}
              >
                <span className="material-symbols-outlined text-[20px] text-pink-400">
                  favorite
                </span>
                <span>Favorites</span>
              </button>
            </div>
          </div>

          {/* Playlist Section */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between px-3">
              <p className="text-[11px] font-semibold text-on-surface-variant/60 uppercase tracking-widest">
                Playlists
              </p>
              <button
                type="button"
                onClick={onOpenCreateModal}
                title="Create New Playlist"
                className="w-6 h-6 rounded-md hover:bg-white/[0.06] text-on-surface-variant hover:text-primary flex items-center justify-center transition-colors"
              >
                <span className="material-symbols-outlined text-[18px]">add</span>
              </button>
            </div>

            <div className="space-y-1">
              <button
                type="button"
                onClick={onOpenCreateModal}
                className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-on-surface-variant hover:bg-white/[0.04] hover:text-on-surface transition-colors font-medium text-sm"
              >
                <span className="material-symbols-outlined text-[20px] text-primary">
                  add_box
                </span>
                <span>Create New</span>
              </button>

              <div className="pt-1.5 space-y-1 border-t border-white/[0.04]">
                {playlists.slice(0, 4).map((pl) => (
                  <button
                    key={pl._id}
                    type="button"
                    onClick={() => setActiveTab('playlists')}
                    className="w-full flex items-center gap-2.5 px-3 py-1.5 rounded-lg text-on-surface-variant hover:bg-white/[0.04] hover:text-on-surface transition-colors text-left"
                  >
                    <span
                      className="material-symbols-outlined text-[16px]"
                      style={{ color: pl.accentColor || '#10b981' }}
                    >
                      {pl.sidebarIcon || 'graphic_eq'}
                    </span>
                    <span className="text-xs truncate font-medium flex-1">
                      {pl.name}
                    </span>
                    {pl.moodSyncDynamic && (
                      <span className="text-[9px] px-1.5 py-0.5 rounded bg-secondary/15 text-secondary font-semibold">
                        Sync
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </nav>
      </div>

      {/* Footer / System Status */}
      <div className="p-4 mx-4 mb-3 rounded-2xl bg-surface-container/60 border border-white/[0.04] flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-primary animate-ping"></span>
          <span className="text-[11px] font-medium text-on-surface-variant">
            Biometric Link Active
          </span>
        </div>
        <span className="text-[10px] px-2 py-0.5 rounded-full bg-primary/10 text-primary font-bold uppercase tracking-wider">
          v1.0
        </span>
      </div>
    </aside>
  );
};
