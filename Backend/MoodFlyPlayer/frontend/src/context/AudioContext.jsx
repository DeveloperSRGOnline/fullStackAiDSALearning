import React, { createContext, useContext, useState, useRef, useEffect, useCallback } from 'react';
import { FALLBACK_SONGS, toggleFavoriteApi } from '../api/client';

const AudioContext = createContext(null);

export const AudioProvider = ({ children }) => {
  const audioRef = useRef(new Audio());
  
  // Audio state
  const [currentSong, setCurrentSong] = useState(FALLBACK_SONGS[0]);
  const [queue, setQueue] = useState(FALLBACK_SONGS);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(268);
  const [volume, setVolume] = useState(0.75);
  const [isMuted, setIsMuted] = useState(false);
  const [isShuffle, setIsShuffle] = useState(false);
  const [repeatMode, setRepeatMode] = useState('all'); // 'off' | 'one' | 'all'
  const [favorites, setFavorites] = useState(new Set(['song-01']));
  const [isQueueOpen, setIsQueueOpen] = useState(false);

  // Sync volume with audio element
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  // Handle song load and source change
  useEffect(() => {
    const audio = audioRef.current;
    if (!currentSong || !audio) return;

    const streamUrl = currentSong.audioUrl || 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3';
    
    // Only update src if different
    if (audio.src !== streamUrl) {
      audio.src = streamUrl;
      audio.currentTime = 0;
      setCurrentTime(0);
      if (currentSong.duration) {
        setDuration(currentSong.duration);
      }
    }

    if (isPlaying) {
      audio.play().catch((err) => {
        console.warn('Playback autoplay policy prevented instant play:', err.message);
        setIsPlaying(false);
      });
    }
  }, [currentSong]);

  // Play / Pause handling
  const playSong = useCallback((song, newQueue = null) => {
    if (newQueue && Array.isArray(newQueue) && newQueue.length > 0) {
      setQueue(newQueue);
      const foundIdx = newQueue.findIndex((s) => s._id === song._id);
      setCurrentIndex(foundIdx >= 0 ? foundIdx : 0);
    } else {
      const idx = queue.findIndex((s) => s._id === song._id);
      if (idx !== -1) {
        setCurrentIndex(idx);
      } else {
        setQueue((prev) => [song, ...prev]);
        setCurrentIndex(0);
      }
    }

    setCurrentSong(song);
    setIsPlaying(true);

    if (audioRef.current) {
      if (audioRef.current.src !== song.audioUrl) {
        audioRef.current.src = song.audioUrl;
      }
      audioRef.current.play().catch(console.warn);
    }
  }, [queue]);

  const togglePlay = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      audio.play().catch(console.warn);
      setIsPlaying(true);
    }
  }, [isPlaying]);

  const nextTrack = useCallback(() => {
    if (queue.length === 0) return;

    let nextIdx;
    if (isShuffle) {
      nextIdx = Math.floor(Math.random() * queue.length);
      if (nextIdx === currentIndex && queue.length > 1) {
        nextIdx = (nextIdx + 1) % queue.length;
      }
    } else {
      nextIdx = (currentIndex + 1) % queue.length;
    }

    setCurrentIndex(nextIdx);
    setCurrentSong(queue[nextIdx]);
    setIsPlaying(true);
  }, [currentIndex, isShuffle, queue]);

  const prevTrack = useCallback(() => {
    if (queue.length === 0) return;

    // If more than 3 seconds in, restart current track
    if (audioRef.current && audioRef.current.currentTime > 3) {
      audioRef.current.currentTime = 0;
      setCurrentTime(0);
      return;
    }

    const prevIdx = (currentIndex - 1 + queue.length) % queue.length;
    setCurrentIndex(prevIdx);
    setCurrentSong(queue[prevIdx]);
    setIsPlaying(true);
  }, [currentIndex, queue]);

  const seekTo = useCallback((timeSeconds) => {
    if (audioRef.current) {
      audioRef.current.currentTime = timeSeconds;
      setCurrentTime(timeSeconds);
    }
  }, []);

  const handleVolumeChange = useCallback((newVol) => {
    const clamped = Math.max(0, Math.min(1, newVol));
    setVolume(clamped);
    if (clamped > 0 && isMuted) {
      setIsMuted(false);
    }
  }, [isMuted]);

  const toggleMute = useCallback(() => {
    setIsMuted((prev) => !prev);
  }, []);

  const toggleShuffle = useCallback(() => {
    setIsShuffle((prev) => !prev);
  }, []);

  const toggleRepeat = useCallback(() => {
    setRepeatMode((prev) => {
      if (prev === 'off') return 'all';
      if (prev === 'all') return 'one';
      return 'off';
    });
  }, []);

  const toggleFavorite = useCallback((songId) => {
    setFavorites((prev) => {
      const next = new Set(prev);
      if (next.has(songId)) {
        next.delete(songId);
      } else {
        next.add(songId);
      }
      return next;
    });
    toggleFavoriteApi(songId).catch(console.warn);
  }, []);

  const isFavorite = useCallback((songId) => {
    return favorites.has(songId);
  }, [favorites]);

  const addToQueue = useCallback((song) => {
    setQueue((prev) => [...prev, song]);
  }, []);

  // Wire HTMLAudioElement events
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
    };

    const handleLoadedMetadata = () => {
      if (audio.duration && !isNaN(audio.duration)) {
        setDuration(audio.duration);
      }
    };

    const handleEnded = () => {
      if (repeatMode === 'one') {
        audio.currentTime = 0;
        audio.play().catch(console.warn);
      } else if (repeatMode === 'all' || isShuffle) {
        nextTrack();
      } else {
        setIsPlaying(false);
      }
    };

    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('play', handlePlay);
    audio.addEventListener('pause', handlePause);

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('play', handlePlay);
      audio.removeEventListener('pause', handlePause);
    };
  }, [repeatMode, isShuffle, nextTrack]);

  // Time format helper (e.g. 165 -> "2:45")
  const formatTime = (secs) => {
    if (!secs || isNaN(secs)) return '0:00';
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const value = {
    currentSong,
    queue,
    currentIndex,
    isPlaying,
    currentTime,
    duration,
    volume,
    isMuted,
    isShuffle,
    repeatMode,
    isQueueOpen,
    setIsQueueOpen,
    playSong,
    togglePlay,
    nextTrack,
    prevTrack,
    seekTo,
    setVolume: handleVolumeChange,
    toggleMute,
    toggleShuffle,
    toggleRepeat,
    toggleFavorite,
    isFavorite,
    addToQueue,
    formatTime,
  };

  return (
    <AudioContext.Provider value={value}>
      {children}
    </AudioContext.Provider>
  );
};

export const useAudio = () => {
  const context = useContext(AudioContext);
  if (!context) {
    throw new Error('useAudio must be used within an AudioProvider');
  }
  return context;
};
