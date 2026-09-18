import React, { useState, useEffect } from 'react';
import { Navbar } from './components/layout/Navbar';
import { Sidebar } from './components/layout/Sidebar';
import { BottomPlayer } from './components/player/BottomPlayer';
import { QueueDrawer } from './components/player/QueueDrawer';
import { HomeView } from './components/dashboard/HomeView';
import { MoodStudioView } from './components/mood/MoodStudioView';
import { PlaylistsView } from './components/playlists/PlaylistsView';
import { CreatePlaylistModal } from './components/playlists/CreatePlaylistModal';
import { useAudio } from './context/AudioContext';
import {
  fetchSongs,
  fetchFeaturedSong,
  fetchArtists,
  fetchGenres,
  fetchPlaylists,
  FALLBACK_SONGS,
  FALLBACK_ARTISTS,
  FALLBACK_GENRES,
  FALLBACK_PLAYLISTS,
} from './api/client';

export const App = () => {
  const { playSong, isFavorite, toggleFavorite, formatTime } = useAudio();

  const [activeTab, setActiveTab] = useState('home'); // 'home' | 'detect-mood' | 'playlists' | 'artists' | 'favorites' | 'recents'
  const [searchQuery, setSearchQuery] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // App Data State
  const [songs, setSongs] = useState(FALLBACK_SONGS);
  const [featuredSong, setFeaturedSong] = useState(FALLBACK_SONGS[0]);
  const [artists, setArtists] = useState(FALLBACK_ARTISTS);
  const [genres, setGenres] = useState(FALLBACK_GENRES);
  const [playlists, setPlaylists] = useState(FALLBACK_PLAYLISTS);
  const [selectedPlaylistId, setSelectedPlaylistId] = useState(FALLBACK_PLAYLISTS[0]._id);

  // Initial load from backend API
  useEffect(() => {
    async function loadData() {
      try {
        const [songsData, featData, artistsData, genresData, playlistsData] = await Promise.all([
          fetchSongs(),
          fetchFeaturedSong(),
          fetchArtists(),
          fetchGenres(),
          fetchPlaylists(),
        ]);

        if (Array.isArray(songsData) && songsData.length > 0) setSongs(songsData);
        if (featData) setFeaturedSong(featData);
        if (Array.isArray(artistsData) && artistsData.length > 0) setArtists(artistsData);
        if (Array.isArray(genresData) && genresData.length > 0) setGenres(genresData);
        if (Array.isArray(playlistsData) && playlistsData.length > 0) {
          setPlaylists(playlistsData);
          setSelectedPlaylistId(playlistsData[0]._id);
        }
      } catch (err) {
        console.warn('API data fetch notice:', err.message);
      }
    }

    loadData();
  }, []);

  // Filter songs when search query is entered
  const filteredSongs = songs.filter((s) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      s.title?.toLowerCase().includes(q) ||
      s.artistNames?.toLowerCase().includes(q) ||
      s.albumTitle?.toLowerCase().includes(q) ||
      s.moodTags?.some((m) => m.toLowerCase().includes(q))
    );
  });

  const handlePlaylistCreated = (newPlaylist) => {
    setPlaylists((prev) => [newPlaylist, ...prev]);
    setSelectedPlaylistId(newPlaylist._id);
    setActiveTab('playlists');
  };

  return (
    <div className="min-h-screen bg-canvas text-on-surface font-body selection:bg-primary selection:text-black">
      {/* 1. Left Sidebar */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenCreateModal={() => setIsCreateModalOpen(true)}
        playlists={playlists}
      />

      {/* 2. Top Header / Navbar */}
      <div className="pl-64 flex flex-col min-h-screen pb-24">
        <Navbar
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          onOpenMoodStudio={() => setActiveTab('detect-mood')}
        />

        {/* 3. Main Dynamic Content Stage */}
        <main className="w-full px-6 sm:px-10 pt-20 flex-1">
          {/* If user is actively searching, render Search Results overlay view */}
          {searchQuery.trim() ? (
            <div className="w-full pb-16 space-y-6 animate-in fade-in duration-200">
              <div className="flex items-center justify-between">
                <h2 className="font-headline font-bold text-2xl text-on-surface">
                  Search Results for "{searchQuery}"
                </h2>
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="text-xs text-primary hover:underline"
                >
                  Clear Search
                </button>
              </div>

              <div className="space-y-2 bg-surface-low/50 p-4 rounded-2xl border border-white/[0.04]">
                {filteredSongs.length === 0 ? (
                  <p className="text-sm text-on-surface-variant py-8 text-center">
                    No songs found matching "{searchQuery}".
                  </p>
                ) : (
                  filteredSongs.map((song, idx) => (
                    <div
                      key={song._id || idx}
                      onClick={() => playSong(song, filteredSongs)}
                      className="flex items-center justify-between p-3 rounded-xl hover:bg-surface-container transition-all cursor-pointer group"
                    >
                      <div className="flex items-center gap-3.5 min-w-0">
                        <span className="font-mono text-xs text-on-surface-variant w-5 text-center">
                          {String(idx + 1).padStart(2, '0')}
                        </span>
                        <img
                          src={song.coverImage}
                          alt={song.title}
                          className="w-11 h-11 rounded-lg object-cover ring-1 ring-white/5"
                        />
                        <div className="min-w-0">
                          <p className="font-semibold text-sm text-on-surface group-hover:text-primary transition-colors truncate">
                            {song.title}
                          </p>
                          <p className="text-xs text-on-surface-variant truncate">
                            {song.artistNames}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="text-xs font-mono text-on-surface-variant">
                          {song.durationFormatted || formatTime(song.duration)}
                        </span>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleFavorite(song._id);
                          }}
                          className={`p-1 ${isFavorite(song._id) ? 'text-pink-500' : 'text-on-surface-variant/50 hover:text-pink-400'}`}
                        >
                          <span className={`material-symbols-outlined text-[18px] ${isFavorite(song._id) ? 'filled' : ''}`}>
                            favorite
                          </span>
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          ) : (
            <>
              {/* Tab: Home & Dashboard */}
              {activeTab === 'home' && (
                <HomeView
                  featuredSong={featuredSong}
                  artists={artists}
                  genres={genres}
                  songs={songs}
                  onOpenMoodStudio={() => setActiveTab('detect-mood')}
                />
              )}

              {/* Tab: Mood Detection Studio */}
              {activeTab === 'detect-mood' && <MoodStudioView />}

              {/* Tab: Playlists View */}
              {activeTab === 'playlists' && (
                <PlaylistsView
                  playlists={playlists}
                  onOpenCreateModal={() => setIsCreateModalOpen(true)}
                  selectedPlaylistId={selectedPlaylistId}
                  setSelectedPlaylistId={setSelectedPlaylistId}
                />
              )}

              {/* Tab: Artists View */}
              {activeTab === 'artists' && (
                <div className="space-y-6 pb-16 animate-in fade-in duration-300">
                  <div>
                    <h1 className="font-headline font-bold text-3xl text-on-surface">Artists</h1>
                    <p className="text-sm text-on-surface-variant mt-1">
                      Featured vocalists, producers, and trending heavyweights.
                    </p>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                    {artists.map((artist) => (
                      <div
                        key={artist._id}
                        className="p-5 rounded-2xl bg-surface-low border border-white/[0.04] hover:bg-surface-container flex flex-col items-center text-center transition-all group cursor-pointer"
                      >
                        <div className="relative mb-3">
                          <img
                            src={artist.avatar}
                            alt={artist.name}
                            className="w-24 h-24 rounded-full object-cover ring-2 ring-transparent group-hover:ring-primary/40 group-hover:scale-105 transition-all duration-300 shadow-xl"
                          />
                          {artist.isVerified && (
                            <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-primary text-black flex items-center justify-center shadow-md">
                              <span className="material-symbols-outlined text-[14px] font-bold">verified</span>
                            </div>
                          )}
                        </div>
                        <h3 className="font-headline font-semibold text-sm text-on-surface group-hover:text-primary transition-colors truncate w-full">
                          {artist.name}
                        </h3>
                        <p className="text-xs text-on-surface-variant/70 mt-0.5">
                          {artist.monthlyListenersDisplay || '120M Monthly'}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Tab: Favorites / Recents */}
              {(activeTab === 'favorites' || activeTab === 'recents') && (
                <div className="space-y-6 pb-16 animate-in fade-in duration-300">
                  <div>
                    <h1 className="font-headline font-bold text-3xl text-on-surface capitalize">
                      {activeTab}
                    </h1>
                    <p className="text-sm text-on-surface-variant mt-1">
                      {activeTab === 'favorites'
                        ? 'Your liked tracks and biometric favorites'
                        : 'Your recently played soundtrack and listening history'}
                    </p>
                  </div>
                  <div className="space-y-2 bg-surface-low/50 p-4 rounded-2xl border border-white/[0.04]">
                    {songs.slice(0, 4).map((song, idx) => (
                      <div
                        key={song._id || idx}
                        onClick={() => playSong(song, songs)}
                        className="flex items-center justify-between p-3 rounded-xl hover:bg-surface-container transition-all cursor-pointer group"
                      >
                        <div className="flex items-center gap-3.5 min-w-0">
                          <span className="font-mono text-xs text-on-surface-variant w-5 text-center">
                            {String(idx + 1).padStart(2, '0')}
                          </span>
                          <img
                            src={song.coverImage}
                            alt={song.title}
                            className="w-10 h-10 rounded-lg object-cover ring-1 ring-white/5"
                          />
                          <div className="min-w-0">
                            <p className="font-semibold text-sm text-on-surface group-hover:text-primary transition-colors truncate">
                              {song.title}
                            </p>
                            <p className="text-xs text-on-surface-variant truncate">
                              {song.artistNames}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <span className="text-xs font-mono text-on-surface-variant">
                            {song.durationFormatted || formatTime(song.duration)}
                          </span>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleFavorite(song._id);
                            }}
                            className="p-1 text-pink-500"
                          >
                            <span className="material-symbols-outlined text-[18px] filled">
                              favorite
                            </span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </main>
      </div>

      {/* 4. Queue Floating Drawer */}
      <QueueDrawer />

      {/* 5. Persistent Master Bottom Player */}
      <BottomPlayer />

      {/* 6. Create Playlist Modal */}
      <CreatePlaylistModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onPlaylistCreated={handlePlaylistCreated}
      />
    </div>
  );
};

export default App;
