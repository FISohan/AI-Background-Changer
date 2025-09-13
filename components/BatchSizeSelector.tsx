import React from 'react';

const SIZES = [1, 4];

interface BatchSizeSelectorProps {
  selectedSize: number;
  onSelectSize: (size: number) => void;
  disabled: boolean;
}

const BatchSizeSelector: React.FC<BatchSizeSelectorProps> = ({ selectedSize, onSelectSize, disabled }) => {
  return (
    <div className="w-full">
      <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-4 text-center">5. Select Generation Count</h2>
      <div className="flex flex-wrap items-center justify-center gap-3">
        {SIZES.map((size) => (
          <button
            key={size}
            onClick={() => onSelectSize(size)}
            disabled={disabled}
            className={`px-4 py-2 text-sm font-semibold rounded-full transition-colors duration-200
              ${selectedSize === size 
                ? 'bg-indigo-600 text-white shadow-md' 
                : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600'}
              ${disabled ? 'cursor-not-allowed opacity-50' : ''}`}
            aria-pressed={selectedSize === size}
          >
            {size === 1 ? 'Single Image' : `Batch (${size} Images)`}
          </button>
        ))}
      </div>
    </div>
  );
};

export default BatchSizeSelector;