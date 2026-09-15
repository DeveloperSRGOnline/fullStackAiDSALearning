import React, { useEffect, useRef } from 'react';
import * as faceapi from 'face-api.js';

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
        <div>
            <video
                ref={videoRef}
                autoPlay
                muted
                playsInline
                width="720"
                height="560"
                style={{ width: '720px', height: '560px' }}
            />
            <button onClick={detectMood}>Detect Mood</button>
        </div>
    );
};

export default FacialExpression;
