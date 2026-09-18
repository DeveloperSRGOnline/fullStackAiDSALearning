import React, { useRef } from 'react';
import { useAudio } from '../../context/AudioContext';

export const HomeView = ({
  featuredSong,
  artists,
  genres,
  songs,
  onOpenMoodStudio,
}) => {
  const {
    currentSong,
    isPlaying,
    currentTime,
    duration,
    isShuffle,
    repeatMode,
    playSong,
    togglePlay,
    nextTrack,
    prevTrack,
    seekTo,
    toggleShuffle,
    toggleRepeat,
    toggleFavorite,
    isFavorite,
    formatTime,
  } = useAudio();

  const deckProgressRef = useRef(null);

  const heroSong = featuredSong || songs[0];
  const isHeroPlaying = currentSong?._id === heroSong?._id && isPlaying;
  const isHeroFavorited = heroSong ? isFavorite(heroSong._id) : false;

  const deckProgressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

  const handleDeckSeek = (e) => {
    if (!deckProgressRef.current || !duration) return;
    const rect = deckProgressRef.current.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const fraction = Math.max(0, Math.min(1, clickX / rect.width));
    seekTo(fraction * duration);
  };

  return (
    <div className="w-full pb-16 space-y-8 animate-in fade-in duration-300">
      {/* 1. Hero Section: Featured Release */}
      {heroSong && (
        <section className="relative w-full rounded-3xl overflow-hidden shadow-2xl bg-surface-dim border border-white/[0.04]">
          <div
            className="bg-cover bg-center w-full min-h-[300px] sm:min-h-[340px] relative flex flex-col justify-end p-6 sm:p-10"
            style={{
              backgroundImage: `url('${heroSong.coverImage || 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=1200&q=80'}')`,
            }}
          >
            {/* Atmospheric Gradient Scrim */}
            <div className="absolute inset-0 bg-gradient-to-t from-surface-dim via-surface-dim/80 to-transparent"></div>
            <div className="absolute inset-0 bg-gradient-to-r from-surface-dim via-surface-dim/70 to-transparent"></div>

            {/* Trending Badge */}
            <div className="absolute top-6 right-6 flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-surface-container-low/80 backdrop-blur-md border border-white/[0.06]">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
              <span className="text-[11px] uppercase tracking-widest text-primary font-bold">
                Trending #1 Today
              </span>
            </div>

            {/* Content Details */}
            <div className="relative z-10 max-w-2xl space-y-3">
              <div className="flex items-center gap-2 text-on-surface-variant text-xs font-medium">
                <span className="uppercase tracking-wider text-secondary font-bold">
                  Featured Release
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-[15px] text-primary">
                    play_circle
                  </span>{' '}
                  {heroSong.playCount ? `${heroSong.playCount} Plays` : '300 Plays'}
                </span>
              </div>

              <h1 className="font-headline font-extrabold text-3xl sm:text-4xl text-on-surface tracking-tight drop-shadow-md">
                {heroSong.title}
              </h1>

              <div className="flex items-center gap-2 text-on-surface-variant text-sm">
                <span className="text-on-surface font-semibold">
                  {heroSong.artistNames}
                </span>
                <span>•</span>
                <span>{heroSong.albumTitle || 'Spiritual Resonance • 2024'}</span>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => playSong(heroSong, songs)}
                  className="flex items-center gap-2 px-7 py-3 rounded-full bg-primary hover:bg-primary-light text-black font-semibold text-sm shadow-lg shadow-primary/25 transition-all hover:scale-105 active:scale-95 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[20px] font-bold">
                    {isHeroPlaying ? 'pause' : 'play_arrow'}
                  </span>
                  <span>{isHeroPlaying ? 'Pause' : 'Listen Now'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => toggleFavorite(heroSong._id)}
                  aria-label="Favorite Track"
                  className={`w-11 h-11 rounded-full bg-surface-container/80 hover:bg-surface-high backdrop-blur-md flex items-center justify-center transition-all ${
                    isHeroFavorited ? 'text-pink-500 scale-105' : 'text-on-surface-variant hover:text-pink-400'
                  }`}
                >
                  <span className={`material-symbols-outlined text-[22px] ${isHeroFavorited ? 'filled' : ''}`}>
                    favorite
                  </span>
                </button>

                <button
                  type="button"
                  onClick={onOpenMoodStudio}
                  className="hidden sm:flex items-center gap-2 px-4 py-2.5 rounded-full bg-surface-container/80 hover:bg-surface-high text-on-surface text-xs font-semibold border border-white/[0.05] transition-all hover:border-secondary/40"
                >
                  <span className="material-symbols-outlined text-secondary text-[18px]">
                    psychology
                  </span>
                  <span>Detect Mood Match</span>
                </button>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* 2. Top Artists Carousel / Grid */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-baseline gap-2.5">
            <h2 className="font-headline font-bold text-xl text-on-surface">Top Artists</h2>
            <span className="text-[11px] uppercase tracking-widest text-on-surface-variant/70 font-semibold">
              Global Heavyweights
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
          {artists.map((artist) => (
            <div
              key={artist._id}
              className="group flex flex-col items-center p-4 rounded-2xl bg-surface-low/70 hover:bg-surface-container border border-white/[0.03] transition-all duration-300 cursor-pointer text-center"
            >
              <div className="relative mb-3">
                <img
                  src={artist.avatar}
                  alt={artist.name}
                  className="w-20 h-20 sm:w-24 sm:h-24 rounded-full object-cover shadow-lg group-hover:scale-105 transition-transform duration-300 ring-2 ring-transparent group-hover:ring-primary/40"
                />
                {artist.isVerified && (
                  <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-primary text-black flex items-center justify-center shadow-md">
                    <span className="material-symbols-outlined text-[14px] font-bold">
                      verified
                    </span>
                  </div>
                )}
              </div>
              <p className="font-headline font-semibold text-sm text-on-surface group-hover:text-primary transition-colors truncate w-full">
                {artist.name}
              </p>
              <span className="text-xs text-on-surface-variant/70 mt-0.5">
                {artist.monthlyListenersDisplay || '192M Monthly'}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* 3. Lower Split Deck: Left Content Matrix (Genres & Top Charts) + Right Dedicated Audio Deck */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
        {/* Left Column (xl:col-span-8) */}
        <div className="xl:col-span-8 space-y-8">
          {/* Genres Sub-deck */}
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-headline font-bold text-lg text-on-surface">
                Explore Genres
              </h3>
              <span className="text-[11px] uppercase tracking-wider text-on-surface-variant/70 font-semibold">
                6 Curated Vibes
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3.5">
              {genres.map((genre) => (
                <div
                  key={genre.name}
                  className="group relative h-24 rounded-2xl overflow-hidden bg-gradient-to-br from-surface-high to-surface-low p-4 flex flex-col justify-between cursor-pointer border border-white/[0.04] hover:border-white/10 hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5"
                >
                  <div
                    className={`absolute -right-4 -bottom-4 w-16 h-16 rounded-full blur-xl transition-all group-hover:scale-150 ${genre.glowClass || 'bg-primary/25'}`}
                  />
                  <span
                    className="text-[11px] uppercase tracking-widest font-bold z-10"
                    style={{ color: genre.accentColor || '#10b981' }}
                  >
                    {genre.vibeDescriptor}
                  </span>
                  <span className="font-headline font-bold text-base text-on-surface z-10 group-hover:text-white transition-colors">
                    {genre.name}
                  </span>
                </div>
              ))}
            </div>
          </section>

          {/* Top Chart Song List */}
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <h3 className="font-headline font-bold text-lg text-on-surface">Top Chart</h3>
                <span className="px-2.5 py-0.5 rounded-full bg-surface-container text-on-surface-variant text-[11px] font-semibold">
                  Live Wave
                </span>
              </div>
              <span className="text-xs text-primary font-semibold">
                {songs.length} tracks
              </span>
            </div>

            <div className="space-y-1.5 bg-surface-low/50 p-2 sm:p-3 rounded-2xl border border-white/[0.03]">
              {songs.map((song, idx) => {
                const isCurrent = currentSong?._id === song._id;
                const songFavorited = isFavorite(song._id);

                return (
                  <div
                    key={song._id || idx}
                    onClick={() => playSong(song, songs)}
                    className={`flex items-center justify-between p-2.5 rounded-xl transition-all cursor-pointer group ${
                      isCurrent
                        ? 'bg-surface-container-high border border-primary/25 shadow-sm'
                        : 'hover:bg-surface-container border border-transparent'
                    }`}
                  >
                    <div className="flex items-center gap-3.5 min-w-0">
                      <span
                        className={`font-mono text-xs font-bold w-6 text-center ${
                          isCurrent ? 'text-primary' : 'text-on-surface-variant group-hover:text-on-surface'
                        }`}
                      >
                        {String(idx + 1).padStart(2, '0')}
                      </span>

                      <div className="w-10 h-10 rounded-lg overflow-hidden flex-shrink-0 relative bg-surface-container flex items-center justify-center ring-1 ring-white/5">
                        {isCurrent && isPlaying ? (
                          <div className="w-full h-full bg-primary/20 flex items-center justify-center">
                            <span className="material-symbols-outlined text-[20px] text-primary animate-pulse">
                              equalizer
                            </span>
                          </div>
                        ) : (
                          <img
                            src={song.coverImage}
                            alt={song.title}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                          />
                        )}
                      </div>

                      <div className="min-w-0">
                        <p
                          className={`font-headline text-sm truncate font-semibold transition-colors ${
                            isCurrent ? 'text-primary' : 'text-on-surface group-hover:text-primary'
                          }`}
                        >
                          {song.title}
                        </p>
                        <p className="text-xs text-on-surface-variant truncate">
                          {song.artistNames}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 flex-shrink-0">
                      <span className="text-xs font-mono text-on-surface-variant/75">
                        {song.durationFormatted || formatTime(song.duration)}
                      </span>

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleFavorite(song._id);
                        }}
                        aria-label="Favorite Track"
                        className={`transition-transform hover:scale-110 p-1 ${
                          songFavorited ? 'text-pink-500' : 'text-on-surface-variant/50 hover:text-pink-400'
                        }`}
                      >
                        <span className={`material-symbols-outlined text-[18px] ${songFavorited ? 'filled' : ''}`}>
                          favorite
                        </span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        </div>

        {/* Right Column (xl:col-span-4): Dedicated Live Audio Deck matching Stitch spec */}
        <aside className="xl:col-span-4 space-y-4">
          <div className="bg-surface-low rounded-3xl p-6 shadow-2xl relative overflow-hidden border border-white/[0.04]">
            {/* Ambient Glow Blobs */}
            <div className="absolute -top-12 -right-12 w-40 h-40 rounded-full bg-primary/15 blur-3xl pointer-events-none"></div>
            <div className="absolute -bottom-12 -left-12 w-40 h-40 rounded-full bg-secondary/15 blur-3xl pointer-events-none"></div>

            {/* Deck Header */}
            <div className="flex items-center justify-between mb-4">
              <span className="text-[11px] uppercase tracking-widest text-primary font-bold flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-primary animate-ping"></span>
                Live Audio Deck
              </span>
              <button
                type="button"
                onClick={onOpenMoodStudio}
                title="Sync Mood Telemetry"
                className="text-on-surface-variant hover:text-secondary transition-colors"
              >
                <span className="material-symbols-outlined text-[18px]">psychology</span>
              </button>
            </div>

            {/* Vinyl Record Disc Artwork */}
            <div className="relative w-full aspect-square max-w-[240px] mx-auto mb-5 flex items-center justify-center">
              {/* Outer Spinning Vinyl Disc */}
              <div
                className={`absolute inset-2 rounded-full bg-[#080b11] shadow-2xl flex items-center justify-center border border-white/5 transition-transform ${
                  isPlaying ? 'animate-vinyl' : 'paused'
                }`}
              >
                {/* Concentric vinyl groove rings */}
                <div className="w-[88%] h-[88%] rounded-full border border-white/[0.06] flex items-center justify-center">
                  <div className="w-[76%] h-[76%] rounded-full border border-white/[0.04] flex items-center justify-center">
                    <div className="w-[64%] h-[64%] rounded-full border border-white/[0.05] flex items-center justify-center"></div>
                  </div>
                </div>
              </div>

              {/* Vinyl Center Art Label */}
              <div className="relative z-10 w-24 h-24 rounded-full overflow-hidden shadow-xl ring-2 ring-primary/40 shadow-primary/20">
                <img
                  src={
                    currentSong?.coverImage ||
                    'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=300&q=80'
                  }
                  alt="Vinyl Label"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/15 flex items-center justify-center">
                  <div className="w-4 h-4 rounded-full bg-[#080b11] border border-white/20"></div>
                </div>
              </div>
            </div>

            {/* Track Info in Deck */}
            <div className="text-center space-y-1 mb-4">
              <h4 className="font-headline font-bold text-base text-on-surface truncate">
                {currentSong?.title || 'Kesariya'}
              </h4>
              <p className="text-xs text-on-surface-variant truncate">
                {currentSong?.artistNames || 'Arijit Singh'} • Master Audio
              </p>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface-container text-secondary text-[11px] font-semibold mt-1">
                <span className="material-symbols-outlined text-[13px]">psychology</span>
                <span>Detected Mood: {currentSong?.moodTags?.[0] || 'Euphoric'} &amp; Vibrant</span>
              </div>
            </div>

            {/* Soundwave Visualizer Bars */}
            <div className="w-full py-2 flex items-center justify-center gap-1.5 h-10 px-2 mb-2">
              <span className={`w-1 bg-secondary/80 rounded-full transition-all duration-300 ${isPlaying ? 'h-4 animate-pulse' : 'h-1.5'}`}></span>
              <span className={`w-1 bg-secondary rounded-full transition-all duration-300 ${isPlaying ? 'h-7 animate-[pulse_0.8s_ease-in-out_infinite]' : 'h-2'}`}></span>
              <span className={`w-1 bg-primary rounded-full transition-all duration-300 ${isPlaying ? 'h-9 animate-[pulse_0.5s_ease-in-out_infinite]' : 'h-2.5'}`}></span>
              <span className={`w-1 bg-primary-light rounded-full transition-all duration-300 ${isPlaying ? 'h-5 animate-[pulse_0.9s_ease-in-out_infinite]' : 'h-1.5'}`}></span>
              <span className={`w-1 bg-primary rounded-full transition-all duration-300 ${isPlaying ? 'h-10 animate-[pulse_0.4s_ease-in-out_infinite]' : 'h-3'}`}></span>
              <span className={`w-1 bg-primary rounded-full transition-all duration-300 ${isPlaying ? 'h-7 animate-[pulse_0.6s_ease-in-out_infinite]' : 'h-2'}`}></span>
              <span className={`w-1 bg-primary-light rounded-full transition-all duration-300 ${isPlaying ? 'h-10 animate-[pulse_0.45s_ease-in-out_infinite]' : 'h-2.5'}`}></span>
              <span className={`w-1 bg-secondary rounded-full transition-all duration-300 ${isPlaying ? 'h-6 animate-[pulse_0.75s_ease-in-out_infinite]' : 'h-1.5'}`}></span>
              <span className={`w-1 bg-secondary rounded-full transition-all duration-300 ${isPlaying ? 'h-8 animate-[pulse_0.55s_ease-in-out_infinite]' : 'h-2'}`}></span>
              <span className={`w-1 bg-secondary/80 rounded-full transition-all duration-300 ${isPlaying ? 'h-3 animate-pulse' : 'h-1.5'}`}></span>
            </div>

            {/* Custom Deck Seekbar */}
            <div className="space-y-1 my-3">
              <div
                ref={deckProgressRef}
                onClick={handleDeckSeek}
                className="relative w-full h-1.5 bg-surface-container-high rounded-full cursor-pointer group py-1.5 flex items-center"
              >
                <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden relative">
                  <div
                    className="h-full bg-primary rounded-full transition-all duration-75"
                    style={{ width: `${deckProgressPercent}%` }}
                  />
                </div>
                <div
                  className="absolute top-1/2 -translate-y-1/2 w-3.5 h-3.5 bg-white rounded-full shadow-md -ml-1.5 pointer-events-none"
                  style={{ left: `${deckProgressPercent}%` }}
                />
              </div>

              <div className="flex justify-between text-[10px] font-mono text-on-surface-variant pt-0.5">
                <span>{formatTime(currentTime)}</span>
                <span>{formatTime(duration)}</span>
              </div>
            </div>

            {/* Controls */}
            <div className="flex items-center justify-between pt-2">
              <button
                type="button"
                onClick={toggleShuffle}
                aria-label="Shuffle"
                className={`transition-colors ${isShuffle ? 'text-primary' : 'text-on-surface-variant hover:text-on-surface'}`}
              >
                <span className="material-symbols-outlined text-[18px]">shuffle</span>
              </button>

              <button
                type="button"
                onClick={prevTrack}
                aria-label="Previous Track"
                className="text-on-surface-variant hover:text-on-surface transition-colors"
              >
                <span className="material-symbols-outlined text-[22px]">skip_previous</span>
              </button>

              <button
                type="button"
                onClick={togglePlay}
                aria-label="Play or Pause"
                className="w-11 h-11 rounded-full bg-primary text-black flex items-center justify-center shadow-lg shadow-primary/30 hover:scale-105 transition-transform"
              >
                <span className="material-symbols-outlined text-[24px] font-bold">
                  {isPlaying ? 'pause' : 'play_arrow'}
                </span>
              </button>

              <button
                type="button"
                onClick={nextTrack}
                aria-label="Next Track"
                className="text-on-surface-variant hover:text-on-surface transition-colors"
              >
                <span className="material-symbols-outlined text-[22px]">skip_next</span>
              </button>

              <button
                type="button"
                onClick={toggleRepeat}
                aria-label="Repeat"
                className={`transition-colors ${repeatMode !== 'off' ? 'text-primary' : 'text-on-surface-variant hover:text-on-surface'}`}
              >
                <span className="material-symbols-outlined text-[18px]">
                  {repeatMode === 'one' ? 'repeat_one' : 'repeat'}
                </span>
              </button>
            </div>
          </div>

          {/* Quick AI Mood Feedback Teaser Card */}
          <div className="p-4 rounded-2xl bg-surface-low/70 border border-white/[0.04] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-surface-container flex items-center justify-center text-primary shadow-sm">
                <span className="material-symbols-outlined text-[20px]">auto_awesome</span>
              </div>
              <div>
                <p className="text-xs font-semibold text-on-surface">Moodfly AI Auto-Sync</p>
                <p className="text-[11px] text-on-surface-variant">Camera telemetry is ready</p>
              </div>
            </div>
            <button
              type="button"
              onClick={onOpenMoodStudio}
              className="px-3 py-1.5 rounded-lg bg-surface-container-high hover:bg-surface-bright text-primary text-xs font-semibold border border-primary/20 hover:border-primary transition-colors"
            >
              Scan Now
            </button>
          </div>
        </aside>
      </div>
    </div>
  );
};
