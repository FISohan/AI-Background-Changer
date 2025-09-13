import React from 'react';
import { ART_STYLES } from '../constants';
import type { ArtStyle } from '../types';

interface StyleSelectorProps {
  selectedStyle: ArtStyle | null;
  onSelectStyle: (style: ArtStyle) => void;
  onSelectRandom: () => void;
  disabled: boolean;
}

const StyleCard: React.FC<{
  style: ArtStyle;
  isSelected: boolean;
  onClick: () => void;
  disabled: boolean;
}> = ({ style, isSelected, onClick, disabled }) => (
  <div
    onClick={!disabled ? onClick : undefined}
    className={`group relative overflow-hidden rounded-lg shadow-md transition-all duration-300 ${disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer hover:shadow-xl hover:-translate-y-1'}`}
  >
    <img src={style.thumbnail} alt={style.name} className="h-40 w-full object-cover transition-transform duration-300 group-hover:scale-110" />
    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
    <div className="absolute bottom-0 left-0 p-4">
      <h3 className="font-bold text-white text-lg">{style.name}</h3>
      <p className="text-gray-200 text-sm">{style.description}</p>
    </div>
    {isSelected && (
      <div className="absolute inset-0 border-4 border-indigo-500 rounded-lg flex items-center justify-center bg-black/50">
        <svg className="w-12 h-12 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      </div>
    )}
  </div>
);

const StyleSelector: React.FC<StyleSelectorProps> = ({ selectedStyle, onSelectStyle, onSelectRandom, disabled }) => {
  return (
    <div className="w-full">
      <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-4 text-center">2. Choose a Background Style</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {ART_STYLES.map(style => (
          <StyleCard
            key={style.id}
            style={style}
            isSelected={selectedStyle?.id === style.id}
            onClick={() => onSelectStyle(style)}
            disabled={disabled}
          />
        ))}
        <div
          onClick={!disabled ? onSelectRandom : undefined}
          className={`group flex flex-col items-center justify-center text-center bg-white dark:bg-gray-800 border-2 border-dashed rounded-lg shadow-md transition-all duration-300 ${disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer hover:shadow-xl hover:-translate-y-1 hover:border-indigo-500'}`}
        >
          <div className="p-4">
            <h3 className="font-bold text-gray-800 dark:text-gray-200 text-lg">Random Style</h3>
            <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Feeling lucky?</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StyleSelector;
