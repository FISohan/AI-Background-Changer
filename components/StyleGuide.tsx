import React from 'react';
import { ART_STYLES } from '../constants';

const StyleGuide: React.FC = () => {
  return (
    <div className="space-y-8">
      {ART_STYLES.map(style => (
        <div key={style.id} className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start pb-8 border-b border-gray-200 dark:border-gray-700 last:border-b-0 last:pb-0">
          <div className="md:col-span-1">
            <img src={style.thumbnail} alt={`Sample of ${style.name} style`} className="w-full h-auto rounded-lg shadow-md aspect-video object-cover" />
          </div>
          <div className="md:col-span-2 space-y-2">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{style.name}</h3>
            <p className="text-gray-600 dark:text-gray-400">{style.description}</p>
            <div>
              <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">AI Keywords:</p>
              <code className="block text-xs bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200 p-2 rounded-md font-mono">{style.keywords}</code>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default StyleGuide;
