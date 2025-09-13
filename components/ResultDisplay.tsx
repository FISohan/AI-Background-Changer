import React from 'react';

interface ResultDisplayProps {
  image: string;
  onReset: () => void;
}

const ResultDisplay: React.FC<ResultDisplayProps> = ({ image, onReset }) => {
  return (
    <div className="w-full max-w-2xl text-center space-y-6">
      <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-200">Your Masterpiece is Ready!</h2>
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl overflow-hidden p-2">
        <img src={image} alt="Generated result" className="w-full h-auto rounded-md" />
      </div>
      <div className="flex items-center justify-center space-x-4">
        <a
          href={image}
          download="ai-background-image.png"
          className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
        >
          Download Image
        </a>
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
