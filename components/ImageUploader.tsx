import React, { useState, useCallback } from 'react';
import UploadIcon from './icons/UploadIcon';
import CameraIcon from './icons/CameraIcon';
import WebcamCapture from './WebcamCapture';
import type { ImageData } from '../types';

interface ImageUploaderProps {
  onImageUpload: (imageData: ImageData) => void;
  disabled: boolean;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageUpload, disabled }) => {
  const [preview, setPreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showWebcam, setShowWebcam] = useState(false);

  const handleFileChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
          setError('Please upload a valid image file (PNG, JPG, etc.).');
          setPreview(null);
          return;
      }
      
      setError(null);
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setPreview(result);
        onImageUpload({
          base64: result.split(',')[1],
          mimeType: file.type,
        });
      };
      reader.readAsDataURL(file);
    }
  }, [onImageUpload]);
  
  const handleCapture = useCallback((imageData: ImageData) => {
    const dataUrl = `data:${imageData.mimeType};base64,${imageData.base64}`;
    setPreview(dataUrl);
    onImageUpload(imageData);
    setShowWebcam(false);
    setError(null);
  }, [onImageUpload]);

  if (showWebcam) {
    return <WebcamCapture onCapture={handleCapture} onClose={() => setShowWebcam(false)} />;
  }

  return (
    <div className="w-full">
      <label htmlFor="file-upload" className={`relative block w-full border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors duration-300 ${disabled ? 'cursor-not-allowed bg-gray-100 dark:bg-gray-800' : 'border-gray-300 dark:border-gray-600 hover:border-indigo-500 hover:bg-indigo-50 dark:hover:bg-gray-700'}`}>
        {preview ? (
          <img src={preview} alt="Image preview" className="mx-auto max-h-64 rounded-lg object-contain" />
        ) : (
          <div className="flex flex-col items-center justify-center space-y-2 text-gray-500 dark:text-gray-400">
            <UploadIcon className="h-12 w-12" />
            <span className="font-semibold">Click to upload or drag and drop</span>
            <span className="text-sm">PNG, JPG, GIF up to 10MB</span>
          </div>
        )}
        <input id="file-upload" name="file-upload" type="file" className="sr-only" onChange={handleFileChange} accept="image/*" disabled={disabled} />
      </label>
      {error && <p className="mt-2 text-sm text-red-600 dark:text-red-400">{error}</p>}
      
      <div className="relative flex py-4 items-center">
        <div className="flex-grow border-t border-gray-300 dark:border-gray-600"></div>
        <span className="flex-shrink mx-4 text-gray-500 dark:text-gray-400 text-sm">OR</span>
        <div className="flex-grow border-t border-gray-300 dark:border-gray-600"></div>
      </div>
      
      <button
        onClick={() => !disabled && setShowWebcam(true)}
        disabled={disabled}
        type="button"
        className="w-full inline-flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md shadow-sm text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        <CameraIcon className="w-5 h-5" />
        Use Webcam
      </button>
    </div>
  );
};

export default ImageUploader;