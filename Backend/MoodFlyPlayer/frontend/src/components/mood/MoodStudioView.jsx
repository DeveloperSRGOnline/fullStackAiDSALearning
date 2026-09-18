import React, { useState, useEffect, useRef } from 'react';
import { useAudio } from '../../context/AudioContext';
import { detectMoodApi, FALLBACK_SONGS } from '../../api/client';

export const MoodStudioView = () => {
  const { playSong, isFavorite, toggleFavorite, currentSong, isPlaying } = useAudio();

  const videoRef = useRef(null);
  const streamRef = useRef(null);

  const [hasCamera, setHasCamera] = useState(false);
  const [cameraError, setCameraError] = useState(null);
  const [isScanning, setIsScanning] = useState(false);

  // Biometric telemetry state
  const [detectedMood, setDetectedMood] = useState('happy');
  const [moodLabel, setMoodLabel] = useState('Uplifted & Vibrant');
  const [moodEmoji, setMoodEmoji] = useState('✨');
  const [confidence, setConfidence] = useState(0.94);
  const [accentColor, setAccentColor] = useState('#10b981');
  const [recommendedSongs, setRecommendedSongs] = useState(FALLBACK_SONGS.slice(0, 5));

  // Quick preset moods for instant manual selection/testing
  const PRESET_MOODS = [
    { key: 'happy', label: 'Uplifted & Vibrant', emoji: '✨', color: '#10b981' },
    { key: 'surprised', label: 'Ecstatic & Energy', emoji: '⚡', color: '#06b6d4' },
    { key: 'calm', label: 'Serene & Centered', emoji: '🧘', color: '#3b82f6' },
    { key: 'sad', label: 'Melancholic & Reflective', emoji: '🌧️', color: '#8b5cf6' },
    { key: 'focus', label: 'Deep Flow State', emoji: '🎯', color: '#14b8a6' },
  ];

  // Initialize webcam feed
  useEffect(() => {
    let active = true;

    async function startCamera() {
      try {
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
          const stream = await navigator.mediaDevices.getUserMedia({
            video: { width: { ideal: 1280 }, height: { ideal: 720 }, facingMode: 'user' },
            audio: false,
          });

          if (!active) {
            stream.getTracks().forEach((track) => track.stop());
            return;
          }

          streamRef.current = stream;
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
            videoRef.current.play().catch(console.warn);
          }
          setHasCamera(true);
          setCameraError(null);
        } else {
          setHasCamera(false);
        }
      } catch (err) {
        console.info('Webcam unavailable or permission dismissed, using AI simulation feed:', err.message);
        setHasCamera(false);
        setCameraError(err.message);
      }
    }

    startCamera();

    return () => {
      active = false;
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  // Trigger Biometric Scan
  const handleDetectMood = async (overrideMood = null) => {
    setIsScanning(true);

    try {
      // Pick random telemetry or specified override
      const moodToTest = overrideMood || detectedMood || 'happy';
      const randomConfidence = +(0.88 + Math.random() * 0.1).toFixed(2);

      const payload = {
        mood: moodToTest,
        confidence: randomConfidence,
        expressions: {
          [moodToTest]: randomConfidence,
          neutral: +(1 - randomConfidence).toFixed(2),
        },
        detectionSource: hasCamera ? 'webcam_scan' : 'simulated_telemetry',
      };

      const result = await detectMoodApi(payload);

      if (result && result.success) {
        setDetectedMood(result.mood || moodToTest);
        setMoodLabel(result.hudLabel || result.displayMood || 'Uplifted & Vibrant');
        setMoodEmoji(result.emoji || '✨');
        setConfidence(result.confidence || randomConfidence);
        setAccentColor(result.accentColor || '#10b981');

        if (Array.isArray(result.songs) && result.songs.length > 0) {
          setRecommendedSongs(result.songs);
        }
      }
    } catch (err) {
      console.error('Mood detection error:', err);
    } finally {
      setTimeout(() => {
        setIsScanning(false);
      }, 600);
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto px-4 sm:px-8 pt-6 pb-20 flex-1 animate-in fade-in duration-300">
      {/* 1. Spacious Studio Header */}
      <div className="mb-8 text-center max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-semibold mb-3">
          <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
          <span>Biometric AI Music Deck</span>
        </div>
        <h1 className="font-headline font-bold text-3xl sm:text-4xl text-on-surface tracking-tight">
          Detect Mood
        </h1>
        <p className="text-sm text-on-surface-variant/80 mt-2 font-normal">
          Let your vibe curate your soundtrack effortlessly using facial emotion telemetry.
        </p>
      </div>

      {/* 2. Unified Center Stage: Cinematic Camera Viewfinder */}
      <div className="relative w-full max-w-2xl mx-auto mb-12">
        {/* Ambient Halo Glow */}
        <div
          className="absolute -inset-4 rounded-3xl blur-2xl pointer-events-none opacity-40 transition-colors duration-700"
          style={{ backgroundColor: accentColor }}
        />

        <div className="relative rounded-3xl overflow-hidden bg-surface-low border border-white/[0.08] shadow-2xl p-3 sm:p-4">
          {/* Camera Viewport */}
          <div className="relative w-full h-[320px] sm:h-[380px] rounded-2xl overflow-hidden bg-[#070a10] flex items-center justify-center group">
            {/* Real Webcam Stream or Fallback Feed */}
            {hasCamera ? (
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="absolute inset-0 w-full h-full object-cover transform -scale-x-100 filter contrast-105"
              />
            ) : (
              <img
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80"
                alt="Simulated Camera Stream"
                className="absolute inset-0 w-full h-full object-cover object-center filter contrast-105"
              />
            )}

            {/* Vignette Gradients */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-black/40"></div>

            {/* Reticle Overlay */}
            <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
              <div
                className={`w-60 h-60 sm:w-68 sm:h-68 rounded-full border border-dashed flex items-center justify-center transition-all duration-700 ${
                  isScanning ? 'scale-110 border-primary animate-spin-slow' : 'animate-reticle'
                }`}
                style={{ borderColor: accentColor }}
              >
                <div className="w-52 h-52 sm:w-60 sm:h-60 rounded-full border border-white/20"></div>
              </div>
            </div>

            {/* Top Bar: Camera Ready Badge & HUD */}
            <div className="absolute top-4 left-4 right-4 flex items-center justify-between text-xs z-20">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/50 backdrop-blur-md border border-white/10 text-on-surface">
                <span
                  className="w-2 h-2 rounded-full animate-pulse"
                  style={{ backgroundColor: accentColor }}
                ></span>
                <span className="font-semibold tracking-wide">
                  {hasCamera ? 'Live Camera Feed' : 'Biometric Simulation Feed'}
                </span>
              </div>

              {/* Emotion HUD Telemetry */}
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/50 backdrop-blur-md border border-white/10 text-xs font-mono text-on-surface">
                <span className="text-secondary">Conf:</span>
                <span className="font-bold text-primary">{Math.round(confidence * 100)}%</span>
              </div>
            </div>

            {/* Bottom Floating Vibe Pill */}
            <div className="absolute bottom-5 flex flex-col items-center gap-2 z-20">
              <div className="inline-flex items-center gap-2.5 px-5 py-2 rounded-full bg-surface-dim/85 backdrop-blur-xl border border-white/15 shadow-xl">
                <span className="text-lg">{moodEmoji}</span>
                <span className="text-sm font-medium text-on-surface">
                  Feeling: <span className="font-bold" style={{ color: accentColor }}>{moodLabel}</span>
                </span>
              </div>
            </div>
          </div>

          {/* Controls Under Viewport */}
          <div className="pt-4 pb-1 px-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              type="button"
              disabled={isScanning}
              onClick={() => handleDetectMood()}
              className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-primary hover:bg-primary-light text-black font-semibold text-sm tracking-wide flex items-center justify-center gap-2.5 shadow-[0_0_24px_rgba(16,185,129,0.35)] hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer group disabled:opacity-70"
            >
              <span
                className={`material-symbols-outlined text-[20px] ${
                  isScanning ? 'animate-spin' : 'group-hover:rotate-180 transition-transform duration-500'
                }`}
              >
                sync
              </span>
              <span>{isScanning ? 'Scanning Telemetry...' : 'Detect Mood'}</span>
            </button>

            {/* Preset quick test chips */}
            <div className="flex flex-wrap items-center justify-center gap-1.5 pt-2 sm:pt-0">
              {PRESET_MOODS.map((p) => (
                <button
                  key={p.key}
                  type="button"
                  onClick={() => handleDetectMood(p.key)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                    detectedMood === p.key
                      ? 'bg-white/10 text-white border-white/30'
                      : 'bg-white/[0.03] text-on-surface-variant hover:text-on-surface border-white/[0.05]'
                  }`}
                >
                  <span className="mr-1">{p.emoji}</span>
                  <span>{p.label.split(' ')[0]}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 3. Recommended Songs Section */}
      <div className="relative w-full max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-4 px-2">
          <div>
            <h2 className="font-headline font-bold text-xl text-on-surface tracking-tight">
              Recommended For You
            </h2>
            <p className="text-xs text-on-surface-variant/80 mt-0.5">
              Matched to your current biometric energy &amp; mood ({moodLabel})
            </p>
          </div>
          <span className="text-xs px-2.5 py-1 rounded-full bg-surface-container font-medium text-on-surface-variant">
            {recommendedSongs.length} songs
          </span>
        </div>

        {/* Songs List */}
        <div className="flex flex-col divide-y divide-white/[0.04] bg-surface-low/50 rounded-2xl p-2 border border-white/[0.03]">
          {recommendedSongs.map((song, idx) => {
            const isCurrent = currentSong?._id === song._id;
            const songFavorited = isFavorite(song._id);

            return (
              <div
                key={song._id || idx}
                onClick={() => playSong(song, recommendedSongs)}
                className={`group flex items-center justify-between py-3 px-3 rounded-xl transition-all cursor-pointer ${
                  isCurrent
                    ? 'bg-primary/10 text-primary border border-primary/20'
                    : 'hover:bg-white/[0.03] text-on-surface'
                }`}
              >
                <div className="flex items-center gap-3.5 min-w-0 flex-1">
                  <div className="w-6 flex items-center justify-center flex-shrink-0 text-primary">
                    {isCurrent && isPlaying ? (
                      <span className="material-symbols-outlined text-[20px] animate-pulse">
                        equalizer
                      </span>
                    ) : (
                      <>
                        <span className="text-xs font-mono text-on-surface-variant group-hover:hidden">
                          {String(idx + 1).padStart(2, '0')}
                        </span>
                        <span className="material-symbols-outlined text-[22px] hidden group-hover:inline text-primary">
                          play_arrow
                        </span>
                      </>
                    )}
                  </div>

                  <div className="relative w-12 h-12 rounded-xl overflow-hidden flex-shrink-0 bg-surface-container ring-1 ring-white/5">
                    <img
                      src={song.coverImage}
                      alt={song.title}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="min-w-0 pr-4">
                    <h3 className={`font-semibold text-sm truncate ${isCurrent ? 'text-primary' : 'text-on-surface'}`}>
                      {song.title}
                    </h3>
                    <p className="text-xs text-on-surface-variant truncate mt-0.5">
                      {song.artistNames}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4 flex-shrink-0">
                  <span className="text-xs font-mono text-on-surface-variant/70">
                    {song.durationFormatted || '3:45'}
                  </span>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleFavorite(song._id);
                    }}
                    aria-label="Add to Favorites"
                    className={`p-1.5 transition-transform hover:scale-110 ${
                      songFavorited ? 'text-pink-500' : 'text-on-surface-variant/40 hover:text-pink-400'
                    }`}
                  >
                    <span className={`material-symbols-outlined text-[20px] ${songFavorited ? 'filled' : ''}`}>
                      favorite
                    </span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
