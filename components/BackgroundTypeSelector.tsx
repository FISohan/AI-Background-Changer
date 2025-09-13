import React from 'react';
import { BACKGROUND_SUBJECTS } from '../constants';
import type { BackgroundSubject } from '../types';

interface BackgroundSubjectSelectorProps {
  selectedSubject: BackgroundSubject | null;
  onSelectSubject: (subject: BackgroundSubject) => void;
  disabled: boolean;
}

const BackgroundSubjectSelector: React.FC<BackgroundSubjectSelectorProps> = ({ selectedSubject, onSelectSubject, disabled }) => {
  return (
    <div className="w-full">
      <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-4 text-center">3. Choose a Background Subject</h2>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {BACKGROUND_SUBJECTS.map((subject) => (
          <button
            key={subject.id}
            onClick={() => !disabled && onSelectSubject(subject)}
            disabled={disabled}
            className={`p-3 text-center rounded-lg border-2 transition-all duration-200
              ${selectedSubject?.id === subject.id
                ? 'bg-indigo-600 border-indigo-600 text-white shadow-lg scale-105'
                : 'bg-gray-100 dark:bg-gray-700 border-gray-200 dark:border-gray-600 hover:border-indigo-500 dark:hover:border-indigo-500 hover:bg-indigo-50 dark:hover:bg-gray-600'}
              ${disabled ? 'cursor-not-allowed opacity-50' : ''}`}
            aria-pressed={selectedSubject?.id === subject.id}
          >
            <h3 className="font-bold text-sm">{subject.name}</h3>
            <p className="text-xs text-gray-600 dark:text-gray-400 mt-1 px-1 group-aria-pressed:text-white">
                {subject.description}
            </p>
          </button>
        ))}
      </div>
    </div>
  );
};

export default BackgroundSubjectSelector;