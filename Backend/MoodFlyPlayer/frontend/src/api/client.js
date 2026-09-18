import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 8000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Fallback high-fidelity sample data matching Stitch design and database seed
export const FALLBACK_SONGS = [
  {
    _id: 'song-01',
    title: 'Kesariya',
    artistNames: 'Arijit Singh, Pritam',
    albumTitle: 'Brahmastra',
    duration: 268,
    durationFormatted: '4:28',
    coverImage: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=400&q=80',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
    energyLevel: 8,
    moodTags: ['Joy', 'Euphoric', 'Vibrant'],
    playCount: 1420,
    isFeatured: true,
  },
  {
    _id: 'song-02',
    title: 'Kabira (Encore)',
    artistNames: 'Harshdeep Kaur, Arijit Singh',
    albumTitle: 'Yeh Jawaani Hai Deewani',
    duration: 225,
    durationFormatted: '3:45',
    coverImage: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=400&q=80',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
    energyLevel: 4,
    moodTags: ['Calm', 'Relaxed', 'Soul'],
    playCount: 980,
  },
  {
    _id: 'song-03',
    title: 'Apna Bana Le',
    artistNames: 'Arijit Singh, Sachin-Jigar',
    albumTitle: 'Bhediya',
    duration: 244,
    durationFormatted: '4:04',
    coverImage: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=400&q=80',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
    energyLevel: 5,
    moodTags: ['Euphoric', 'Calm'],
    playCount: 820,
  },
  {
    _id: 'song-04',
    title: 'Chaleya',
    artistNames: 'Anirudh Ravichander, Shilpa Rao',
    albumTitle: 'Jawan',
    duration: 200,
    durationFormatted: '3:20',
    coverImage: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=400&q=80',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3',
    energyLevel: 9,
    moodTags: ['Energy', 'Euphoric', 'Vibrant'],
    playCount: 1650,
  },
  {
    _id: 'song-05',
    title: 'Satranga',
    artistNames: 'Arijit Singh, Shreyas Puranik',
    albumTitle: 'Animal',
    duration: 252,
    durationFormatted: '4:12',
    coverImage: 'https://images.unsplash.com/photo-1518609878373-06d740f60d8b?auto=format&fit=crop&w=400&q=80',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3',
    energyLevel: 4,
    moodTags: ['Sorrow', 'Melancholic', 'Calm'],
    playCount: 1120,
  },
  {
    _id: 'song-06',
    title: 'Heeriye',
    artistNames: 'Jasleen Royal, Arijit Singh',
    albumTitle: 'Heeriye Acoustic',
    duration: 195,
    durationFormatted: '3:15',
    coverImage: 'https://images.unsplash.com/photo-1487180144351-b8472da7d491?auto=format&fit=crop&w=400&q=80',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-9.mp3',
    energyLevel: 6,
    moodTags: ['Joy', 'Euphoric'],
    playCount: 890,
  },
];

export const FALLBACK_ARTISTS = [
  {
    _id: 'art-01',
    name: 'Arijit Singh',
    monthlyListenersDisplay: '192M Monthly',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
    isVerified: true,
  },
  {
    _id: 'art-02',
    name: 'Shreya Ghoshal',
    monthlyListenersDisplay: '148M Monthly',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
    isVerified: true,
  },
  {
    _id: 'art-03',
    name: 'Diljit Dosanjh',
    monthlyListenersDisplay: '115M Monthly',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80',
    isVerified: true,
  },
  {
    _id: 'art-04',
    name: 'The Weeknd',
    monthlyListenersDisplay: '108M Monthly',
    avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=300&q=80',
    isVerified: true,
  },
  {
    _id: 'art-05',
    name: 'Dua Lipa',
    monthlyListenersDisplay: '94M Monthly',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=300&q=80',
    isVerified: true,
  },
];

export const FALLBACK_GENRES = [
  { name: 'Hip Hop', vibeDescriptor: 'Rhythm', accentColor: '#06b6d4', glowClass: 'bg-secondary/25' },
  { name: 'Acoustic', vibeDescriptor: 'Organic', accentColor: '#10b981', glowClass: 'bg-primary/25' },
  { name: 'Ambient', vibeDescriptor: 'Atmosphere', accentColor: '#a855f7', glowClass: 'bg-tertiary/25' },
  { name: 'EDM', vibeDescriptor: 'Energy', accentColor: '#06b6d4', glowClass: 'bg-secondary/35' },
  { name: 'Lo-Fi', vibeDescriptor: 'Relaxed', accentColor: '#ddb7ff', glowClass: 'bg-purple-500/25' },
  { name: 'Bollywood', vibeDescriptor: 'Soul', accentColor: '#10b981', glowClass: 'bg-emerald-500/30' },
];

export const FALLBACK_PLAYLISTS = [
  {
    _id: 'pl-01',
    name: 'Kabira Focus Flow',
    description: 'Curated biometric selections adapted to calm focus states and acoustic melody.',
    isPublic: true,
    moodSyncDynamic: true,
    sidebarIcon: 'graphic_eq',
    accentColor: '#06b6d4',
    songsCount: 24,
    durationText: '1 hr 38 min',
    coverImage: 'https://images.unsplash.com/photo-1518609878373-06d740f60d8b?auto=format&fit=crop&w=500&q=80',
    songs: FALLBACK_SONGS,
  },
  {
    _id: 'pl-02',
    name: 'Chill Vibes',
    description: 'Ambient downtempo and lo-fi beats to unwind after sundown.',
    isPublic: true,
    moodSyncDynamic: true,
    sidebarIcon: 'nightlight',
    accentColor: '#a855f7',
    songsCount: 18,
    durationText: '1 hr 12 min',
    coverImage: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=500&q=80',
    songs: FALLBACK_SONGS.slice(1, 4),
  },
  {
    _id: 'pl-03',
    name: 'Gym Boost',
    description: 'Peak BPM cardio anthems and high voltage sonic surges.',
    isPublic: true,
    moodSyncDynamic: false,
    sidebarIcon: 'bolt',
    accentColor: '#10b981',
    songsCount: 30,
    durationText: '1 hr 54 min',
    coverImage: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=500&q=80',
    songs: [FALLBACK_SONGS[0], FALLBACK_SONGS[3]],
  },
];

// API Functions
export const fetchSongs = async () => {
  try {
    const res = await apiClient.get('/songs');
    return res.data?.data || res.data?.songs || res.data || FALLBACK_SONGS;
  } catch {
    return FALLBACK_SONGS;
  }
};

export const fetchFeaturedSong = async () => {
  try {
    const res = await apiClient.get('/songs/featured');
    return res.data?.data || res.data?.song || res.data || FALLBACK_SONGS[0];
  } catch {
    return FALLBACK_SONGS[0];
  }
};

export const fetchArtists = async () => {
  try {
    const res = await apiClient.get('/artists');
    return res.data?.data || res.data?.artists || res.data || FALLBACK_ARTISTS;
  } catch {
    return FALLBACK_ARTISTS;
  }
};

export const fetchGenres = async () => {
  try {
    const res = await apiClient.get('/genres');
    return res.data?.data || res.data?.genres || res.data || FALLBACK_GENRES;
  } catch {
    return FALLBACK_GENRES;
  }
};

export const fetchPlaylists = async () => {
  try {
    const res = await apiClient.get('/playlists');
    const playlists = res.data?.data || res.data?.playlists || res.data;
    if (Array.isArray(playlists) && playlists.length > 0) {
      return playlists;
    }
    return FALLBACK_PLAYLISTS;
  } catch {
    return FALLBACK_PLAYLISTS;
  }
};

export const createPlaylistApi = async (playlistData) => {
  try {
    const res = await apiClient.post('/playlists', playlistData);
    return res.data?.data || res.data?.playlist || res.data;
  } catch {
    // Generate local mock playlist if offline
    return {
      _id: 'pl-' + Date.now(),
      name: playlistData.name,
      description: playlistData.description || 'Custom playlist',
      isPublic: playlistData.isPublic ?? true,
      moodSyncDynamic: playlistData.moodSyncDynamic ?? false,
      sidebarIcon: playlistData.moodSyncDynamic ? 'psychology' : 'queue_music',
      accentColor: playlistData.moodSyncDynamic ? '#06b6d4' : '#10b981',
      songsCount: 6,
      durationText: '24 min',
      coverImage: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=500&q=80',
      songs: FALLBACK_SONGS,
    };
  }
};

export const detectMoodApi = async (payload) => {
  try {
    const res = await apiClient.post('/mood/detect', payload);
    return res.data;
  } catch {
    // Graceful offline biometric resolution
    const moodMap = {
      happy: {
        mood: 'happy',
        displayMood: 'Joy',
        emoji: '✨',
        hudLabel: 'Uplifted & Vibrant ✨',
        accentColor: '#10b981',
        confidence: 0.94,
        songs: [FALLBACK_SONGS[0], FALLBACK_SONGS[3], FALLBACK_SONGS[5]],
      },
      surprised: {
        mood: 'surprised',
        displayMood: 'Energy',
        emoji: '⚡',
        hudLabel: 'Ecstatic & Electrified ⚡',
        accentColor: '#06b6d4',
        confidence: 0.91,
        songs: [FALLBACK_SONGS[3], FALLBACK_SONGS[0]],
      },
      neutral: {
        mood: 'neutral',
        displayMood: 'Calm',
        emoji: '🧘',
        hudLabel: 'Serene & Centered 🧘',
        accentColor: '#3b82f6',
        confidence: 0.88,
        songs: [FALLBACK_SONGS[1], FALLBACK_SONGS[2]],
      },
      sad: {
        mood: 'sad',
        displayMood: 'Sorrow',
        emoji: '🌧️',
        hudLabel: 'Melancholic & Reflective 🌧️',
        accentColor: '#8b5cf6',
        confidence: 0.86,
        songs: [FALLBACK_SONGS[4], FALLBACK_SONGS[1]],
      },
      calm: {
        mood: 'calm',
        displayMood: 'Calm',
        emoji: '😌',
        hudLabel: 'Serene & Mindful 😌',
        accentColor: '#10b981',
        confidence: 0.92,
        songs: [FALLBACK_SONGS[1], FALLBACK_SONGS[2]],
      },
    };
    const key = (payload.mood || 'happy').toLowerCase();
    return {
      success: true,
      ...(moodMap[key] || moodMap.happy),
    };
  }
};

export const toggleFavoriteApi = async (songId) => {
  try {
    const res = await apiClient.post('/library/favorites/toggle', { songId });
    return res.data;
  } catch {
    return { success: true };
  }
};
