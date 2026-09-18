import React, { useState } from 'react';
import { useAudio } from '../../context/AudioContext';

export const PlaylistsView = ({
  playlists,
  onOpenCreateModal,
  selectedPlaylistId,
  setSelectedPlaylistId,
}) => {
  const { playSong, isPlaying, currentSong, isFavorite, toggleFavorite, formatTime } = useAudio();

  const [filterQuery, setFilterQuery] = useState('');

  // Determine active selected playlist
  const activePlaylist =
    playlists.find((p) => p._id === selectedPlaylistId) || playlists[0] || null;

  const playlistSongs = activePlaylist?.songs || [];

  // Filter songs within the active playlist
  const filteredSongs = playlistSongs.filter((s) => {
    if (!filterQuery.trim()) return true;
    const q = filterQuery.toLowerCase();
    return (
      s.title?.toLowerCase().includes(q) ||
      s.artistNames?.toLowerCase().includes(q) ||
      s.albumTitle?.toLowerCase().includes(q)
    );
  });

  return (
    <div className="w-full pb-16 space-y-8 animate-in fade-in duration-300">
      {/* Top Header & Breadcrumb */}
      <div className="flex items-center justify-between py-1">
        <div className="flex items-center gap-2 text-sm text-on-surface-variant">
          <span className="text-xs uppercase tracking-widest text-primary font-semibold">
            Library
          </span>
          <span className="material-symbols-outlined text-[14px]">chevron_right</span>
          <span className="text-xs uppercase tracking-widest text-on-surface font-semibold">
            Playlists
          </span>
        </div>

        <button
          type="button"
          onClick={onOpenCreateModal}
          className="flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 hover:bg-primary/20 text-primary border border-primary/30 transition-all shadow-sm group font-semibold text-xs"
        >
          <span className="material-symbols-outlined text-[18px] group-hover:rotate-90 transition-transform duration-300">
            add
          </span>
          <span>New Playlist</span>
        </button>
      </div>

      {/* Playlist Horizontal Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {playlists.map((pl) => (
          <button
            key={pl._id}
            type="button"
            onClick={() => setSelectedPlaylistId(pl._id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
              activePlaylist?._id === pl._id
                ? 'bg-primary text-black shadow-[0_0_16px_rgba(16,185,129,0.3)]'
                : 'bg-surface-low hover:bg-surface-container text-on-surface border border-white/[0.04]'
            }`}
          >
            <span
              className="material-symbols-outlined text-[16px]"
              style={{ color: activePlaylist?._id === pl._id ? '#000' : pl.accentColor || '#10b981' }}
            >
              {pl.sidebarIcon || 'queue_music'}
            </span>
            <span>{pl.name}</span>
            {pl.moodSyncDynamic && (
              <span className={`text-[9px] px-1.5 py-0.5 rounded ${activePlaylist?._id === pl._id ? 'bg-black/20 text-black' : 'bg-secondary/15 text-secondary'}`}>
                Sync
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Hero Banner for Active Playlist */}
      {activePlaylist && (
        <section className="relative rounded-3xl bg-surface-low p-6 sm:p-8 overflow-hidden shadow-xl border border-white/[0.04]">
          <div className="absolute inset-0 bg-gradient-to-r from-surface-low via-surface-low/95 to-transparent z-10"></div>
          <div
            className="absolute -right-10 -bottom-10 w-80 h-80 rounded-full blur-3xl opacity-20 pointer-events-none"
            style={{ backgroundColor: activePlaylist.accentColor || '#10b981' }}
          ></div>

          <div className="relative z-20 flex flex-col md:flex-row items-start md:items-end gap-6">
            {/* Cover Artwork */}
            <div className="relative w-44 h-44 sm:w-52 sm:h-52 rounded-2xl overflow-hidden flex-shrink-0 shadow-2xl bg-surface-container group">
              <img
                src={
                  activePlaylist.coverImage ||
                  'https://images.unsplash.com/photo-1518609878373-06d740f60d8b?auto=format&fit=crop&w=500&q=80'
                }
                alt={activePlaylist.name}
                className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
              {activePlaylist.moodSyncDynamic && (
                <div className="absolute bottom-3 left-3 flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/10">
                  <span className="material-symbols-outlined text-secondary text-[14px]">
                    psychology
                  </span>
                  <span className="text-[10px] text-white uppercase tracking-wider font-semibold">
                    Mood Sync Dynamic
                  </span>
                </div>
              )}
            </div>

            {/* Metadata & Actions */}
            <div className="flex-1 min-w-0">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold mb-2.5">
                <span className="material-symbols-outlined text-[14px]">auto_awesome</span>
                <span className="uppercase tracking-widest text-[10px]">Curated Playlist</span>
              </div>

              <h1 className="font-headline font-extrabold text-3xl sm:text-4xl text-on-surface tracking-tight mb-2">
                {activePlaylist.name}
              </h1>

              <p className="text-sm text-on-surface-variant max-w-2xl mb-4 line-clamp-2">
                {activePlaylist.description ||
                  'Curated biometric selections adapted to your state, featuring modern downtempo, energetic beats, and melodious frequencies.'}
              </p>

              {/* Meta row */}
              <div className="flex flex-wrap items-center gap-y-1.5 gap-x-4 text-xs text-on-surface-variant mb-6 font-medium">
                <div className="flex items-center gap-1.5 text-on-surface font-semibold">
                  <span className="w-2 h-2 rounded-full bg-primary"></span>
                  <span>Alex M. (Curator)</span>
                </div>
                <span>•</span>
                <div className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-[15px]">music_note</span>
                  <span>{activePlaylist.songsCount || filteredSongs.length} songs</span>
                </div>
                <span>•</span>
                <div className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-[15px]">schedule</span>
                  <span>{activePlaylist.durationText || '1 hr 38 min'}</span>
                </div>
                <span>•</span>
                <span className="px-2 py-0.5 rounded-full bg-surface-container text-on-surface-variant text-[10px]">
                  {activePlaylist.isPublic ? 'Public' : 'Private'}
                </span>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={() => {
                    if (filteredSongs.length > 0) {
                      playSong(filteredSongs[0], filteredSongs);
                    }
                  }}
                  className="flex items-center gap-2 px-6 py-2.5 rounded-full bg-primary hover:bg-primary-light text-black font-semibold text-xs tracking-wide shadow-[0_0_20px_rgba(16,185,129,0.35)] hover:scale-105 transition-all cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[18px] font-bold">
                    play_arrow
                  </span>
                  <span>Play All</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    if (filteredSongs.length > 0) {
                      const randomIdx = Math.floor(Math.random() * filteredSongs.length);
                      playSong(filteredSongs[randomIdx], filteredSongs);
                    }
                  }}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-surface-container hover:bg-surface-container-high text-on-surface font-semibold text-xs transition-colors"
                >
                  <span className="material-symbols-outlined text-[18px]">shuffle</span>
                  <span>Shuffle</span>
                </button>

                <button
                  type="button"
                  aria-label="Favorite Playlist"
                  className="w-10 h-10 rounded-full bg-surface-container hover:bg-surface-container-high flex items-center justify-center text-pink-400 transition-colors"
                >
                  <span className="material-symbols-outlined text-[18px] filled">favorite</span>
                </button>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Track List Section */}
      <section className="flex flex-col w-full space-y-3">
        {/* Filter subheader */}
        <div className="flex items-center justify-between gap-4 px-1">
          <div className="flex items-center gap-2">
            <span className="font-headline font-bold text-lg text-on-surface">Tracks</span>
            <span className="text-xs text-on-surface-variant px-2.5 py-0.5 rounded-full bg-surface-container">
              {filteredSongs.length} items
            </span>
          </div>

          <div className="relative flex items-center">
            <span className="material-symbols-outlined absolute left-3 text-on-surface-variant text-[18px]">
              filter_list
            </span>
            <input
              type="text"
              value={filterQuery}
              onChange={(e) => setFilterQuery(e.target.value)}
              placeholder="Filter in playlist..."
              className="bg-surface-low text-on-surface placeholder:text-on-surface-variant/40 pl-9 pr-3 py-1.5 rounded-full text-xs outline-none focus:bg-surface-container border border-white/[0.04] transition-colors w-44 sm:w-60"
            />
          </div>
        </div>

        {/* Table Header Row */}
        <div className="grid grid-cols-12 gap-4 px-4 py-2 text-on-surface-variant text-[11px] font-semibold uppercase tracking-wider border-b border-white/[0.04]">
          <div className="col-span-1 text-center sm:text-left">#</div>
          <div className="col-span-6 sm:col-span-5">Title</div>
          <div className="hidden sm:block sm:col-span-3">Album</div>
          <div className="hidden md:block md:col-span-2">Date Added</div>
          <div className="col-span-5 sm:col-span-3 md:col-span-1 text-right flex items-center justify-end">
            <span className="material-symbols-outlined text-[16px]">schedule</span>
          </div>
        </div>

        {/* Table Track Rows */}
        <div className="space-y-1">
          {filteredSongs.map((song, idx) => {
            const isCurrent = currentSong?._id === song._id;
            const songFavorited = isFavorite(song._id);

            return (
              <div
                key={song._id || idx}
                onClick={() => playSong(song, filteredSongs)}
                className={`grid grid-cols-12 gap-4 items-center px-4 py-2.5 rounded-xl transition-all group cursor-pointer ${
                  isCurrent
                    ? 'bg-primary/10 border border-primary/25 shadow-sm'
                    : 'hover:bg-surface-low border border-transparent'
                }`}
              >
                {/* Column: # */}
                <div className="col-span-1 flex items-center justify-center sm:justify-start">
                  {isCurrent && isPlaying ? (
                    <span className="material-symbols-outlined text-[18px] text-primary animate-pulse">
                      equalizer
                    </span>
                  ) : (
                    <>
                      <span className="text-xs font-mono text-on-surface-variant group-hover:hidden">
                        {String(idx + 1).padStart(2, '0')}
                      </span>
                      <span className="material-symbols-outlined text-[20px] hidden group-hover:inline-block text-primary">
                        play_arrow
                      </span>
                    </>
                  )}
                </div>

                {/* Column: Title & Artist thumbnail */}
                <div className="col-span-6 sm:col-span-5 flex items-center gap-3 min-w-0">
                  <div className="relative w-10 h-10 rounded-lg overflow-hidden flex-shrink-0 bg-surface-container ring-1 ring-white/5">
                    <img
                      src={song.coverImage}
                      alt={song.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="min-w-0">
                    <h4 className={`text-sm font-semibold truncate ${isCurrent ? 'text-primary' : 'text-on-surface group-hover:text-primary'}`}>
                      {song.title}
                    </h4>
                    <p className="text-xs text-on-surface-variant truncate">
                      {song.artistNames}
                    </p>
                  </div>
                </div>

                {/* Column: Album */}
                <div className="hidden sm:block sm:col-span-3 min-w-0">
                  <span className="text-xs text-on-surface-variant truncate block">
                    {song.albumTitle || 'Single'}
                  </span>
                </div>

                {/* Column: Date Added */}
                <div className="hidden md:block md:col-span-2">
                  <span className="text-xs text-on-surface-variant/70">
                    {idx === 0 ? 'Just now' : `${idx + 1} days ago`}
                  </span>
                </div>

                {/* Column: Duration & Favorite */}
                <div className="col-span-5 sm:col-span-3 md:col-span-1 flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleFavorite(song._id);
                    }}
                    aria-label="Favorite Track"
                    className={`p-1 transition-transform hover:scale-110 ${
                      songFavorited ? 'text-pink-500' : 'text-on-surface-variant/40 hover:text-pink-400'
                    }`}
                  >
                    <span className={`material-symbols-outlined text-[18px] ${songFavorited ? 'filled' : ''}`}>
                      favorite
                    </span>
                  </button>

                  <span className="text-xs font-mono text-on-surface-variant">
                    {song.durationFormatted || formatTime(song.duration)}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};
