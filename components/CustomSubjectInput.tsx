import React from 'react';

interface CustomSubjectInputProps {
  value: string;
  onChange: (value: string) => void;
  disabled: boolean;
}

const CustomSubjectInput: React.FC<CustomSubjectInputProps> = ({ value, onChange, disabled }) => {
  return (
    <div className="w-full">
      <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-4 text-center">3. (Optional) Describe the Background</h2>
      <div className="relative max-w-lg mx-auto">
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          placeholder="e.g., a field of sunflowers, a futuristic city"
          className="w-full px-4 py-3 bg-gray-100 dark:bg-gray-700 border-2 border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors"
          aria-label="Custom background subject"
        />
         <p className="mt-2 text-xs text-center text-gray-500 dark:text-gray-400">Describe what you want to see in the background.</p>
      </div>
    </div>
  );
};

export default CustomSubjectInput;