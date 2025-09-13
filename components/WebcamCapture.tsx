import React, { useRef, useEffect, useCallback, useState } from 'react';
import type { ImageData } from '../types';
import CameraIcon from './icons/CameraIcon';

interface WebcamCaptureProps {
  onCapture: (imageData: ImageData) => void;
  onClose: () => void;
}

const WebcamCapture: React.FC<WebcamCaptureProps> = ({ onCapture, onClose }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let stream: MediaStream | null = null;
    const startCamera = async () => {
      try {
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
          setError("Webcam is not supported by your browser.");
          return;
        }
        stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' } });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (err) {
        console.error("Error accessing webcam:", err);
        if (err instanceof Error) {
            if (err.name === "NotAllowedError" || err.name === "PermissionDeniedError") {
                setError("Camera permission denied. Please enable camera access in your browser settings.");
            } else {
                 setError(`Error accessing webcam: ${err.message}`);
            }
        } else {
            setError("An unknown error occurred while accessing the webcam.");
        }
      }
    };
    startCamera();

    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const handleCapture = useCallback(() => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (video && canvas) {
      const context = canvas.getContext('2d');
      if (context) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        context.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);
        
        const dataUrl = canvas.toDataURL('image/jpeg');
        onCapture({
          base64: dataUrl.split(',')[1],
          mimeType: 'image/jpeg'
        });
      }
    }
  }, [onCapture]);
  
  if (error) {
      return (
          <div className="w-full flex flex-col items-center justify-center space-y-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
              <p className="text-red-700 dark:text-red-300 font-semibold text-center">{error}</p>
              <button
                  onClick={onClose}
                  className="inline-flex items-center justify-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md shadow-sm text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
                >
                  Go Back
                </button>
          </div>
      )
  }

  return (
    <div className="w-full flex flex-col items-center space-y-4">
      <div className="relative w-full max-w-lg bg-black rounded-lg overflow-hidden shadow-lg">
        <video ref={videoRef} autoPlay playsInline muted className="w-full h-auto block" aria-label="Webcam feed" />
        <canvas ref={canvasRef} className="hidden" aria-hidden="true" />
      </div>
      <div className="flex items-center space-x-4">
         <button
          onClick={handleCapture}
          className="inline-flex items-center justify-center gap-2 px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
        >
          <CameraIcon className="w-5 h-5"/>
          Capture Photo
        </button>
        <button
          onClick={onClose}
          className="inline-flex items-center justify-center px-6 py-3 border border-gray-300 dark:border-gray-600 text-base font-medium rounded-md shadow-sm text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default WebcamCapture;