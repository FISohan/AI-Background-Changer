import React from 'react';
import { ART_STYLES } from '../constants';
import type { ArtStyle } from '../types';

interface StyleSelectorProps {
  selectedStyle: ArtStyle | null;
  onSelectStyle: (style: ArtStyle) => void;
  onSelectRandom: () => void;
  disabled: boolean;
}

const StyleSelector: React.FC<StyleSelectorProps> = ({ selectedStyle, onSelectStyle, onSelectRandom, disabled }) => {
  return (
    <div className="w-full">
      <div className="flex flex-wrap justify-center gap-2">
        {ART_STYLES.map(style => (
          <button
            key={style.id}
            onClick={() => !disabled && onSelectStyle(style)}
            disabled={disabled}
            className={`px-3 py-2 text-sm font-medium rounded-full transition-colors duration-200
              ${selectedStyle?.id === style.id
                ? 'bg-indigo-600 text-white shadow-md'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600'}
              ${disabled ? 'cursor-not-allowed opacity-50' : ''}`}
            aria-pressed={selectedStyle?.id === style.id}
          >
            {style.name}
          </button>
        ))}
        <button
          onClick={!disabled ? onSelectRandom : undefined}
          disabled={disabled}
          className={`px-3 py-2 text-sm font-medium rounded-full transition-colors duration-200
            bg-white dark:bg-gray-800 border-2 border-dashed border-gray-400 dark:border-gray-500 text-gray-800 dark:text-gray-200 hover:border-indigo-500
            ${disabled ? 'cursor-not-allowed opacity-50' : ''}`}
        >
          Random ✨
        </button>
      </div>
    </div>
  );
};

export default StyleSelector;