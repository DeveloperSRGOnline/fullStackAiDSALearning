import React, { useEffect, useRef, useState } from 'react';
import * as faceapi from 'face-api.js';
import "./FacialExpression.css";
import axios from 'axios';

const FacialExpression = ({ setSongs }) => {
    // Mode toggle: 'random' | 'face'
    const [mode, setMode] = useState('random');
    const [detectedMood, setDetectedMood] = useState('');
    const [isModelLoading, setIsModelLoading] = useState(false);
    const [isDetecting, setIsDetecting] = useState(false);
    const [statusMessage, setStatusMessage] = useState('');
    const [modelsLoaded, setModelsLoaded] = useState(false);

    const videoRef = useRef(null);
    const streamRef = useRef(null);

    // List of moods
    const moods = ['happy', 'sad', 'angry', 'neutral'];

    const moodEmojis = {
        happy: '😊',
        sad: '😢',
        angry: '😠',
        neutral: '😐',
        surprised: '😲',
        fearful: '😨',
        disgusted: '🤢'
    };

    // Load face-api models
    const loadModels = async () => {
        if (modelsLoaded) return;
        try {
            setIsModelLoading(true);
            setStatusMessage("Loading face models...");
            const MODEL_URL = '/models';
            await faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL);
            await faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL);
            setModelsLoaded(true);
            setIsModelLoading(false);
            setStatusMessage("");
        } catch (err) {
            console.error("Error loading models: ", err);
            setIsModelLoading(false);
            setStatusMessage("Error loading face detection models.");
        }
    };

    // Start webcam video feed
    const startVideo = () => {
        navigator.mediaDevices.getUserMedia({ video: true })
            .then((stream) => {
                streamRef.current = stream;
                if (videoRef.current) {
                    videoRef.current.srcObject = stream;
                }
            })
            .catch((err) => {
                console.error("Error accessing webcam: ", err);
                setStatusMessage("Camera permission denied or not available.");
            });
    };

    // Stop webcam feed and release camera
    const stopVideo = () => {
        if (streamRef.current) {
            streamRef.current.getTracks().forEach(track => track.stop());
            streamRef.current = null;
        }
        if (videoRef.current) {
            videoRef.current.srcObject = null;
        }
    };

    // Fetch songs for a given mood using the existing API
    const fetchSongs = async (mood) => {
        try {
            const response = await axios.get(`http://localhost:3000/songs?mood=${mood}`);
            console.log(response.data);
            if (response.data && response.data.songs) {
                setSongs(response.data.songs);
            }
        } catch (error) {
            console.error("Error fetching songs:", error);
            setStatusMessage("Error fetching songs from server.");
        }
    };

    // Handle switching between Random and Face Detect modes
    const handleModeSwitch = (newMode) => {
        if (newMode === mode) return;
        setMode(newMode);
        setStatusMessage('');
    };

    // Effect to start/stop video and load models depending on mode
    useEffect(() => {
        if (mode === 'face') {
            loadModels().then(() => {
                startVideo();
            });
        } else {
            stopVideo();
        }

        return () => {
            stopVideo();
        };
    }, [mode]);

    // Detect mood (either randomly or using face-api based on active mode)
    async function detectMood() {
        setIsDetecting(true);
        setStatusMessage('');

        if (mode === 'random') {
            // Randomly pick one mood from the moods array
            const randomMood = moods[Math.floor(Math.random() * moods.length)];
            console.log("Detected Mood:", randomMood);
            setDetectedMood(randomMood);
            await fetchSongs(randomMood);
            setIsDetecting(false);
            return randomMood;
        }

        if (mode === 'face') {
            if (!videoRef.current) {
                setStatusMessage("Camera feed not ready.");
                setIsDetecting(false);
                return;
            }

            try {
                const detections = await faceapi
                    .detectAllFaces(videoRef.current, new faceapi.TinyFaceDetectorOptions())
                    .withFaceExpressions();

                if (!detections || detections.length === 0) {
                    console.log("No face detected");
                    setStatusMessage("No face detected. Please face the camera!");
                    setIsDetecting(false);
                    return;
                }

                let mostProbableExpression = 0;
                let _expression = '';

                for (const expression of Object.keys(detections[0].expressions)) {
                    if (detections[0].expressions[expression] > mostProbableExpression) {
                        mostProbableExpression = detections[0].expressions[expression];
                        _expression = expression;
                    }
                }

                console.log("Detected Expression:", _expression);
                setDetectedMood(_expression);
                setStatusMessage(`Detected: ${_expression}`);
                await fetchSongs(_expression);
            } catch (err) {
                console.error("Face detection error:", err);
                setStatusMessage("Error detecting face expression.");
            } finally {
                setIsDetecting(false);
            }
        }
    }

    return (
        <div className='mood-element'>
            <div className='video-feed-box'>
                {mode === 'face' ? (
                    <>
                        <video
                            ref={videoRef}
                            autoPlay
                            muted
                            playsInline
                            className='user-video-feed'
                        />
                        {isModelLoading && (
                            <div className='video-overlay-msg'>
                                <div className='spinner'></div>
                                <span>Loading models...</span>
                            </div>
                        )}
                        {detectedMood && !isModelLoading && (
                            <div className='video-mood-tag'>
                                <span>{moodEmojis[detectedMood] || '✨'}</span>
                                <span style={{ textTransform: 'capitalize' }}>{detectedMood}</span>
                            </div>
                        )}
                    </>
                ) : (
                    <div className='mood-display-box'>
                        {detectedMood ? (
                            <>
                                <span className='mood-emoji'>{moodEmojis[detectedMood] || '🎵'}</span>
                                <span className='mood-name'>{detectedMood}</span>
                                <span className='mood-subtext'>Random mood selected</span>
                            </>
                        ) : (
                            <>
                                <span className='mood-emoji'>🎲</span>
                                <span className='mood-placeholder-title'>Random Mood Mode</span>
                                <span className='mood-subtext'>Click button to generate mood</span>
                            </>
                        )}
                    </div>
                )}
            </div>

            <div className='mood-controls'>
                {/* Toggle switch between Random and Face Detection */}
                <div className='mode-toggle-group'>
                    <button
                        type='button'
                        className={`toggle-tab ${mode === 'random' ? 'active' : ''}`}
                        onClick={() => handleModeSwitch('random')}
                    >
                        🎲 Random Mood
                    </button>
                    <button
                        type='button'
                        className={`toggle-tab ${mode === 'face' ? 'active' : ''}`}
                        onClick={() => handleModeSwitch('face')}
                    >
                        📷 Detect by Face
                    </button>
                </div>

                <button
                    className='detect-mood-btn'
                    onClick={detectMood}
                    disabled={isDetecting || (mode === 'face' && isModelLoading)}
                >
                    {isDetecting
                        ? 'Detecting...'
                        : isModelLoading
                            ? 'Loading Models...'
                            : mode === 'face'
                                ? 'Detect Face Mood'
                                : 'Get Random Mood'}
                </button>

                {statusMessage && (
                    <div className={`status-pill ${statusMessage.toLowerCase().includes('no face') || statusMessage.toLowerCase().includes('error') || statusMessage.toLowerCase().includes('denied') ? 'warning' : ''}`}>
                        {statusMessage}
                    </div>
                )}
            </div>
        </div>
    );
};

export default FacialExpression;
