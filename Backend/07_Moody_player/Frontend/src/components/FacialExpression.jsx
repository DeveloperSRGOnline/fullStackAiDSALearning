import React, { useEffect, useRef, useState } from 'react';
// import * as faceapi from 'face-api.js';
import "./FacialExpression.css"
import axios from 'axios'

const FacialExpression = ({ setSongs }) => {
    const [detectedMood, setDetectedMood] = useState('');
    // const videoRef = useRef(null);

    // List of 5 moods
    const moods = ['happy', 'sad', 'angry', 'neutral'];

    /* 
    // --- FACE DETECTION FUNCTIONALITY (COMMENTED OUT FOR NOW) ---
    const loadModels = async () => {
        const MODEL_URL = '/models';
        await faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL);
        await faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL);
    };

    const startVideo = () => {
        navigator.mediaDevices.getUserMedia({ video: true })
            .then((stream) => {
                videoRef.current.srcObject = stream;
            })
            .catch((err) => console.error("Error accessing webcam: ", err));
    };
    */

    async function detectMood() {
        /*
        // --- PREVIOUS FACE-API DETECTION LOGIC ---
        const detections = await faceapi
            .detectAllFaces(videoRef.current, new faceapi.TinyFaceDetectorOptions())
            .withFaceExpressions();

        let mostProbableExpression = 0;
        let _expression = '';

        if (!detections || detections.length === 0) {
            console.log("No face detected");
            return;
        }

        for (const expression of Object.keys(detections[0].expressions)) {
            if (detections[0].expressions[expression] > mostProbableExpression) {
                mostProbableExpression = detections[0].expressions[expression];
                _expression = expression;
            }
        }
        console.log(_expression);

        return () => clearInterval(intervalId);
        */

        // Randomly pick one mood from the 5 moods array
        const randomMood = moods[Math.floor(Math.random() * moods.length)];
        console.log("Detected Mood:", randomMood);
        setDetectedMood(randomMood);
        await axios.get(`http://localhost:3000/songs?mood=${randomMood}`)
            .then((response) => {
                console.log(response.data);
                setSongs(response.data.songs);
            })
            .catch((error) => {
                console.error("Error fetching songs:", error);
            })
        return randomMood;
    }

    useEffect(() => {
        // loadModels().then(startVideo)
    }, []);

    return (
        <div className='mood-element'>
            <div className='video-feed-box'>
                {/* 
                <video
                    ref={videoRef}
                    autoPlay
                    muted
                    playsInline
                    className='user-video-feed'
                /> 
                */}
                {detectedMood ? (
                    <span style={{ color: '#f3ece8', fontSize: '1.25rem', fontWeight: '600', textTransform: 'capitalize' }}>
                        {detectedMood}
                    </span>
                ) : (
                    <span style={{ color: 'rgba(240, 210, 205, 0.4)', fontSize: '0.95rem' }}>
                        Camera feed disabled
                    </span>
                )}
            </div>
            <button className='detect-mood-btn' onClick={detectMood}>
                detect mood
            </button>
        </div>
    );
};

export default FacialExpression;
