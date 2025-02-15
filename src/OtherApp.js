import logo from './logo.svg';
import './App.css';
// Import libraries
import {FaceDetection} from '@mediapipe/face_detection';
import * as Facedetection from '@mediapipe/face_detection';
import * as cam from '@mediapipe/camera_utils';
import Webcam from 'react-webcam';
import {useRef, useEffect, use} from 'react';
import { drawRectangle, drawLandmarks } from "@mediapipe/drawing_utils";

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
    if (results.detections.length > 0) {
      drawRectangle(
          context, results.detections[0].boundingBox,
          {color: 'blue', lineWidth: 4, fillColor: '#00000000'});
      drawLandmarks(context, results.detections[0].landmarks, {
        color: 'red',
        radius: 5,
      });
    }
    context.restore();
  }
  useEffect(() => {
    const faceDetection = new FaceDetection({locateFile: (file) => {
      return `https://cdn.jsdelivr.net/npm/@mediapipe/face_detection/${file}`;
    }});
    faceDetection.setOptions({
      model:  'short',
      minDetectionConfidence: 0.5,
      minTrackingConfidence: 0.5
    });
    faceDetection.onResults(onResults);
    if (webcamRef.current) {
      camera = new cam.Camera(webcamRef.current.video, {
        onFrame: async () => {
          if (faceDetection){
            await faceDetection.send({image: webcamRef.current.video});
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
