import React, { useEffect, useRef } from 'react';
import * as faceapi from 'face-api.js';
import "./FacialExpression.css"

const FacialExpression = () => {
    const videoRef = useRef(null);

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

        async function detectMood(){
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
                        mostProbableExpression = detections[0].expressions[expression]
                        _expression = expression
                    }
                }
                console.log(_expression)

            return () => clearInterval(intervalId);
        }

    useEffect(() => {
        loadModels().then(startVideo)
    }, []);

    return (
        <div className='mood-element'>
            <div className='video-feed-box'>
                <video
                    ref={videoRef}
                    autoPlay
                    muted
                    playsInline
                    className='user-video-feed'
                />
            </div>
            <button className='detect-mood-btn' onClick={detectMood}>
                detect mood
            </button>
        </div>
    );
};

export default FacialExpression;
