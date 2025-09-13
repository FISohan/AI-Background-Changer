import React from 'react';
import type { AspectRatio } from '../types';

const RATIOS: { value: AspectRatio; label: string }[] = [
  { value: '16:9', label: 'Landscape' },
  { value: '9:16', label: 'Portrait' },
  { value: '1:1', label: 'Square' },
  { value: '4:3', label: 'Standard' },
  { value: '3:4', label: 'Vertical' },
];

interface AspectRatioSelectorProps {
  selectedRatio: AspectRatio;
  onSelectRatio: (ratio: AspectRatio) => void;
  disabled: boolean;
}

const AspectRatioSelector: React.FC<AspectRatioSelectorProps> = ({ selectedRatio, onSelectRatio, disabled }) => {
  return (
    <div className="w-full">
      <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-4 text-center">4. Choose Aspect Ratio</h2>
      <div className="flex flex-wrap items-center justify-center gap-3">
        {RATIOS.map(({ value, label }) => (
          <button
            key={value}
            onClick={() => onSelectRatio(value)}
            disabled={disabled}
            className={`px-4 py-2 text-sm font-semibold rounded-full transition-colors duration-200
              ${selectedRatio === value 
                ? 'bg-indigo-600 text-white shadow-md' 
                : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600'}
              ${disabled ? 'cursor-not-allowed opacity-50' : ''}`}
            aria-pressed={selectedRatio === value}
          >
            {label} ({value})
          </button>
        ))}
      </div>
    </div>
  );
};

export default AspectRatioSelector;