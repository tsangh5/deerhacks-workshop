import logo from './logo.svg';
import './App.css';
// Import libraries
import {Hands} from '@mediapipe/hands';
import * as hands from '@mediapipe/hands';
import * as cam from '@mediapipe/camera_utils';
import Webcam from 'react-webcam';
import {useRef, useEffect, use} from 'react';
import { drawConnectors, drawLandmarks } from "@mediapipe/drawing_utils";

function App() {
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);
  var camera = null;

  const onResults = (results) => {
    const canvas = canvasRef.current;
    canvas.width = 640;
    canvas.height = 480;
    const context = canvas.getContext("2d");
    context.save();
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.drawImage(
        results.image, 0, 0, canvas.width, canvas.height);
    if (results.multiHandLandmarks) {
      for (const landmarks of results.multiHandLandmarks) {
        drawConnectors(context, landmarks, hands.HAND_CONNECTIONS,
                       {color: '#00FF00', lineWidth: 5});
        drawLandmarks(context, landmarks, {color: '#FF0000', lineWidth: 2});
      }
    }
    context.restore();
  }
  useEffect(() => {
    const handTracker = new Hands({locateFile: (file) => {
      return `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`;
    }});
    handTracker.setOptions({
        maxNumHands: 2,
        modelComplexity: 1,
        minDetectionConfidence: 0.5,
        minTrackingConfidence: 0.5
    });
    handTracker.onResults(onResults);
    if (webcamRef.current) {
      camera = new cam.Camera(webcamRef.current.video, {
        onFrame: async () => {
          if (handTracker){
            await handTracker.send({image: webcamRef.current.video});
          }
        },
        width: 640,
        height: 480
      });
      camera.start();
    }
  }, []);
  
  return (
    <div className="App">
        <Webcam ref={webcamRef} style={{
          position: "absolute",
          marginRight: "auto",
          marginLeft: "auto",
          left: 0,
          right: 0,
          textAlign: "center",
          zIndex: 9,
          width: 640,
          height: 480,
        }}></Webcam>
        <canvas ref={canvasRef}style={{
          position: "absolute",
          marginRight: "auto",
          marginLeft: "auto",
          left: 0,
          right: 0,
          textAlign: "center",
          zIndex: 9,
          width: 640,
          height: 480,
        }}></canvas>
    </div>
  );
}

export default App;
