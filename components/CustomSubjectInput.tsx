import React, { useState } from 'react';

interface CustomSubjectInputProps {
  value: string;
  onChange: (value: string) => void;
  disabled: boolean;
}

const SUGGESTIONS = [
  {
    category: 'Natural Scenery',
    prompts: [
      'a serene beach at sunset with calm waves',
      'a dense, enchanted forest with glowing mushrooms',
      'misty mountains at dawn',
      'the aurora borealis over a frozen lake',
      'a dramatic volcanic eruption at night',
      'a peaceful meadow during a meteor shower',
      'an underwater coral reef teeming with life',
      'a crystal cave with shimmering formations',
      'a windswept desert with towering sand dunes',
    ],
  },
  {
    category: 'Floral',
    prompts: [
      'a field of sunflowers at golden hour',
      'a cherry blossom garden in full bloom',
      'a single, perfect white orchid',
      'a macro photograph of a vibrant hibiscus flower',
      'a delicate rosebud opening at sunrise',
      'a surrealistic arrangement of floating water lilies',
      'a tranquil pond with lotus flowers',
      'a vibrant bouquet of mixed wildflowers in a rustic vase',
      'an enchanted garden with glowing, bioluminescent flowers',
      'a field of lavender under a starry sky',
      'a hidden grove with rare exotic flowers',
      'a cascade of orchids in a lush, misty rainforest',
      'a Dutch Golden Age painting of a bouquet with tulips and peonies',
      'a close-up of morning dew on a rose petal',
      'a single red poppy in a green field',
      'a detailed illustration of a rare black tulip',
      'a glowing, ethereal lotus flower on dark water',
      'a vibrant field of colorful tulips in the Netherlands',
      'a single, elegant white tulip in a minimalist vase',
      'a close-up of a delicate water lily with dewdrops',
      'an intricate botanical illustration of a passion flower',
      'a hanging garden of wisteria in full bloom',
      'an impressionist painting of a water lily pond',
      'a lush, overgrown English cottage garden with roses and delphiniums',
      'a pattern of pressed and dried flowers on parchment',
      'a magical tree with glowing, crystalline flowers',
      'a terrarium filled with exotic carnivorous plants',
      'a field of impossible, rainbow-colored roses',
      'a single, frost-covered flower in winter',
    ],
  },
  {
    category: 'Urban & Interior',
    prompts: [
      'a vibrant cityscape at night with glowing lights',
      'a quiet, cobblestone alleyway in a European city',
      'a cozy, book-filled library with warm lighting',
      'a modern, minimalist room with clean lines',
      'a grand, empty ballroom with crystal chandeliers',
      'a futuristic, sterile laboratory with holographic interfaces',
      'a bustling Parisian cafe on a rainy day',
      'a steampunk-inspired workshop filled with gears and gadgets',
      'an abandoned, overgrown greenhouse',
    ],
  },
  {
    category: 'Abstract & Textured',
    prompts: [
      'a soft, abstract gradient of colors',
      'a detailed close-up of a rustic wood grain texture',
      'a macro shot of iridescent soap bubbles',
      'a pattern of cracked desert earth from above',
      'a wall of colorful, peeling paint',
      'the swirling patterns of liquid marble',
      'a metallic surface with intricate futuristic etchings',
    ],
  },
  {
    category: 'Fantasy & Surreal',
    prompts: [
      'an otherworldly landscape with floating islands',
      'a futuristic city with flying vehicles',
      'a city built on the back of a giant, ancient turtle',
      'a library where books fly like birds',
      'a landscape made entirely of candy and sweets',
      'an ocean with a purple sky and two moons',
      'a forest of giant, luminous mushrooms',
    ],
  },
  {
    category: 'Cultural',
    prompts: [
      'a traditional Japanese Zen garden',
      'a vibrant Indian folk art pattern',
      'an ornate Moroccan riad with a courtyard fountain',
      'a minimalist Scandinavian interior with light wood and hygge elements',
      'a colorful Mexican street market scene with papel picado',
      'an ancient Egyptian temple with hieroglyph-covered walls',
      'a tranquil scene of a Chinese ink wash painting landscape',
    ],
  },
];


const CustomSubjectInput: React.FC<CustomSubjectInputProps> = ({ value, onChange, disabled }) => {
  const [activeCategory, setActiveCategory] = useState<string | null>('Floral');

  const handleCategoryClick = (category: string) => {
    setActiveCategory(prevCategory => (prevCategory === category ? null : category));
  };
  
  return (
    <div className="w-full">
      <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-4 text-center">3. (Optional) Add Custom Details</h2>
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
         <p className="mt-2 text-xs text-center text-gray-500 dark:text-gray-400">Describe the background you want, or get started with a suggestion below.</p>
      </div>
       <div className="mt-6 max-w-2xl mx-auto space-y-4">
          <div className="flex flex-wrap items-center justify-center gap-2">
            {SUGGESTIONS.map(({ category }) => (
              <button
                key={category}
                onClick={() => handleCategoryClick(category)}
                disabled={disabled}
                className={`px-3 py-2 text-sm font-medium rounded-full transition-colors duration-200
                  ${activeCategory === category
                    ? 'bg-indigo-600 text-white shadow-md'
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600'}
                  ${disabled ? 'cursor-not-allowed opacity-50' : ''}`}
                aria-pressed={activeCategory === category}
              >
                {category}
              </button>
            ))}
          </div>
          
          {activeCategory && (
            <div className="p-4 bg-gray-100 dark:bg-gray-700/50 rounded-lg animate-fade-in">
                 <div className="flex flex-wrap items-center justify-center gap-2">
                    {SUGGESTIONS.find(s => s.category === activeCategory)?.prompts.map(prompt => (
                      <button
                        key={prompt}
                        onClick={() => !disabled && onChange(prompt)}
                        disabled={disabled}
                        className="px-3 py-1 text-xs font-medium bg-white dark:bg-gray-600 text-gray-700 dark:text-gray-200 rounded-full hover:bg-indigo-100 dark:hover:bg-indigo-900/50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        {prompt}
                      </button>
                    ))}
                  </div>
            </div>
          )}
      </div>
    </div>
  );
};

export default CustomSubjectInput;
