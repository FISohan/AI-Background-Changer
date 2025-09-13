import React from 'react';

interface ResultDisplayProps {
  images: string[];
  onReset: () => void;
}

const ResultDisplay: React.FC<ResultDisplayProps> = ({ images, onReset }) => {
  return (
    <div className="w-full max-w-4xl text-center space-y-6">
      <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-200">Your Masterpieces are Ready!</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {images.map((image, index) => (
          <div key={index} className="bg-white dark:bg-gray-800 rounded-lg shadow-xl overflow-hidden p-2 group relative">
            <img src={image} alt={`Generated result ${index + 1}`} className="w-full h-auto rounded-md" />
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <a
                href={image}
                download={`ai-background-image-${index + 1}.png`}
                className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-black bg-white hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Download
              </a>
            </div>
          </div>
        ))}
      </div>
      <div className="flex items-center justify-center pt-4">
        <button
          onClick={onReset}
          className="inline-flex items-center justify-center px-6 py-3 border border-gray-300 dark:border-gray-600 text-base font-medium rounded-md shadow-sm text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
        >
          Start Over
        </button>
      </div>
    </div>
  );
};

export default ResultDisplay;