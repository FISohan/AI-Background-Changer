import React, { useState, useCallback } from 'react';
import ImageUploader from './components/ImageUploader';
import StyleSelector from './components/StyleSelector';
import ResultDisplay from './components/ResultDisplay';
import Loader from './components/Loader';
import SparklesIcon from './components/icons/SparklesIcon';
import { ART_STYLES } from './constants';
import * as geminiService from './services/geminiService';
import type { ArtStyle, ImageData, AspectRatio } from './types';
import AspectRatioSelector from './components/AspectRatioSelector';

function App() {
  const [originalImage, setOriginalImage] = useState<ImageData | null>(null);
  const [selectedStyle, setSelectedStyle] = useState<ArtStyle | null>(null);
  const [selectedAspectRatio, setSelectedAspectRatio] = useState<AspectRatio>('16:9');
  const [finalImage, setFinalImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleImageUpload = useCallback((imageData: ImageData) => {
    setOriginalImage(imageData);
    setFinalImage(null);
    setError(null);
  }, []);

  const handleSelectStyle = useCallback((style: ArtStyle) => {
    setSelectedStyle(style);
  }, []);
  
  const handleSelectAspectRatio = useCallback((ratio: AspectRatio) => {
    setSelectedAspectRatio(ratio);
  }, []);

  const handleSelectRandom = useCallback(() => {
    const randomIndex = Math.floor(Math.random() * ART_STYLES.length);
    setSelectedStyle(ART_STYLES[randomIndex]);
  }, []);

  const handleGenerate = async () => {
    if (!originalImage || !selectedStyle) {
      setError("Please upload an image and select a style.");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      setLoadingMessage("Removing background...");
      const foreground = await geminiService.removeBackground(originalImage);

      setLoadingMessage("Generating new background...");
      const background = await geminiService.generateBackground(selectedStyle.keywords, selectedAspectRatio);
      
      setLoadingMessage("Combining images...");
      const final = await geminiService.compositeImages(foreground, background);
      
      setFinalImage(`data:${final.mimeType};base64,${final.base64}`);

    } catch (e) {
        if (e instanceof Error) {
            setError(`An error occurred: ${e.message}`);
        } else {
            setError("An unknown error occurred.");
        }
        console.error(e);
    } finally {
      setIsLoading(false);
      setLoadingMessage('');
    }
  };
  
  const handleReset = () => {
    setOriginalImage(null);
    setSelectedStyle(null);
    setFinalImage(null);
    setIsLoading(false);
    setError(null);
    setLoadingMessage('');
    setSelectedAspectRatio('16:9');
  };

  const isGenerateDisabled = !originalImage || !selectedStyle || isLoading;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 flex flex-col items-center justify-center p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-4xl mx-auto">
        <header className="text-center mb-8">
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-gray-900 dark:text-white">
            AI Background Changer
          </h1>
          <p className="mt-4 text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Transform your photos by replacing the background with stunning, AI-generated art.
          </p>
        </header>

        <main className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-6 sm:p-8 space-y-8 flex flex-col items-center">
          {finalImage ? (
            <ResultDisplay image={finalImage} onReset={handleReset} />
          ) : isLoading ? (
             <Loader message={loadingMessage} />
          ) : (
            <>
              <div className="w-full max-w-md">
                 <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-4 text-center">1. Upload Your Photo</h2>
                <ImageUploader onImageUpload={handleImageUpload} disabled={isLoading} />
              </div>

              {originalImage && (
                <div className="w-full space-y-8">
                  <StyleSelector 
                      selectedStyle={selectedStyle} 
                      onSelectStyle={handleSelectStyle} 
                      onSelectRandom={handleSelectRandom}
                      disabled={isLoading}
                  />
                  <AspectRatioSelector
                    selectedRatio={selectedAspectRatio}
                    onSelectRatio={handleSelectAspectRatio}
                    disabled={isLoading}
                  />
                </div>
              )}

              <div className="pt-4 text-center">
                 {error && <p className="text-red-500 dark:text-red-400 mb-4">{error}</p>}
                <button
                  onClick={handleGenerate}
                  disabled={isGenerateDisabled}
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 border border-transparent text-lg font-semibold rounded-full shadow-lg text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105"
                >
                  <SparklesIcon className="w-6 h-6"/>
                  Generate Your Image
                </button>
              </div>
            </>
          )}
        </main>
        
        <footer className="text-center mt-8 text-gray-500 dark:text-gray-400">
            <p>Powered by Gemini API</p>
        </footer>
      </div>
    </div>
  );
}

export default App;
