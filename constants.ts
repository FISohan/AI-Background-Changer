import type { ArtStyle, BackgroundSubject } from './types';

export const ART_STYLES: ArtStyle[] = [
  {
    id: 'impressionism',
    name: 'Impressionism',
    description: 'Visible brushstrokes, soft focus, dappled light.',
    keywords: 'An impressionist painting of a serene landscape with soft focus and dappled light, visible brushstrokes. No people or animals.',
    thumbnail: 'https://picsum.photos/seed/impressionism/400/300'
  },
  {
    id: 'post-impressionism',
    name: 'Post-Impressionism',
    description: 'Expressive color, symbolic imagery, distinct forms.',
    keywords: 'A post-impressionist painting in the style of Van Gogh\'s Starry Night, with swirling clouds and a vibrant night sky.',
    thumbnail: 'https://picsum.photos/seed/post-impressionism/400/300'
  },
  {
    id: 'expressionism',
    name: 'Expressionism',
    description: 'Bold colors, distorted forms, emotional intensity.',
    keywords: 'An expressionist background with bold, distorted colors conveying a strong emotional intensity, inspired by Edvard Munch.',
    thumbnail: 'https://picsum.photos/seed/expressionism/400/300'
  },
  {
    id: 'art-nouveau',
    name: 'Art Nouveau',
    description: 'Flowing, organic lines, natural forms, decorative.',
    keywords: 'An Art Nouveau decorative background with flowing, organic floral patterns and elegant lines, in the style of Alphonse Mucha.',
    thumbnail: 'https://picsum.photos/seed/art-nouveau/400/300'
  },
  {
    id: 'fauvism',
    name: 'Fauvism',
    description: 'Intense, non-naturalistic color, simplified forms.',
    keywords: 'A fauvist landscape background using wild, intense, and vibrant non-naturalistic colors for expressive effect.',
    thumbnail: 'https://picsum.photos/seed/fauvism/400/300'
  },
  {
    id: 'pointillism',
    name: 'Pointillism',
    description: 'Tiny dots of pure color that blend optically.',
    keywords: 'A pointillist background made of tiny, distinct dots of color, creating a shimmering, textured effect like Seurat.',
    thumbnail: 'https://picsum.photos/seed/pointillism/400/300'
  },
  {
    id: 'cubism',
    name: 'Cubism',
    description: 'Geometric shapes, fractured forms, multiple perspectives.',
    keywords: 'An abstract cubist background with geometric shapes, fractured planes, and a neutral color palette, in the style of Picasso.',
    thumbnail: 'https://picsum.photos/seed/cubism/400/300'
  },
  {
    id: 'surrealism',
    name: 'Surrealism',
    description: 'Dream-like scenes, fantastical elements, symbolic.',
    keywords: 'A surreal, dreamlike landscape background with melting clocks and fantastical elements, in the style of Salvador Dalí.',
    thumbnail: 'https://picsum.photos/seed/surrealism/400/300'
  },
  {
    id: 'pop-art',
    name: 'Pop Art',
    description: 'Bold outlines, vibrant colors, comic book style.',
    keywords: 'A pop art background with bold colors, graphic patterns, and Ben-Day dots, inspired by Roy Lichtenstein.',
    thumbnail: 'https://picsum.photos/seed/pop-art/400/300'
  },
   {
    id: 'japanese-woodblock',
    name: 'Ukiyo-e',
    description: 'Japanese woodblock print style, elegant and stylized.',
    keywords: 'A beautiful Japanese ukiyo-e woodblock print of a wave and Mount Fuji, in the style of Hokusai.',
    thumbnail: 'https://picsum.photos/seed/ukiyoe/400/300'
  },
  {
    id: 'abstract-expressionism',
    name: 'Abstract Expressionism',
    description: 'Spontaneous, gestural, non-representational art.',
    keywords: 'An abstract expressionist background with bold, gestural brushstrokes and a dynamic composition, in the style of Jackson Pollock.',
    thumbnail: 'https://picsum.photos/seed/abstract-expressionism/400/300'
  },
  {
    id: 'art-deco',
    name: 'Art Deco',
    description: 'Sleek, geometric, elegant, and luxurious style.',
    keywords: 'An Art Deco background with bold geometric patterns, symmetrical lines, and a luxurious gold and black color scheme, inspired by the Roaring Twenties.',
    thumbnail: 'https://picsum.photos/seed/art-deco/400/300'
  },
  {
    id: 'cyberpunk',
    name: 'Cyberpunk',
    description: 'High-tech, futuristic, neon-drenched cityscapes.',
    keywords: 'A neon-drenched, high-tech cyberpunk cityscape at night, with towering skyscrapers, holographic ads, and a Blade Runner aesthetic.',
    thumbnail: 'https://picsum.photos/seed/cyberpunk/400/300'
  },
  {
    id: 'steampunk',
    name: 'Steampunk',
    description: 'Victorian-era aesthetic with retrofuturistic technology.',
    keywords: 'A steampunk-inspired background featuring intricate clockwork gears, brass pipes, and Victorian industrial machinery.',
    thumbnail: 'https://picsum.photos/seed/steampunk/400/300'
  },
  {
    id: 'minimalism',
    name: 'Minimalism',
    description: 'Simplicity, clean lines, and a monochromatic palette.',
    keywords: 'A minimalist background with simple geometric shapes, clean lines, a neutral color palette, and plenty of negative space.',
    thumbnail: 'https://picsum.photos/seed/minimalism/400/300'
  },
  {
    id: 'baroque',
    name: 'Baroque',
    description: 'Drama, rich color, and intense light and dark shadows.',
    keywords: 'A dramatic Baroque style background with intense contrast between light and shadow (chiaroscuro), rich, deep colors, and ornate details, reminiscent of Caravaggio or Rembrandt.',
    thumbnail: 'https://picsum.photos/seed/baroque/400/300'
  },
  {
    id: 'rococo',
    name: 'Rococo',
    description: 'Light, elegant, and ornate, with pastel colors.',
    keywords: 'An elegant and ornate Rococo style background with soft pastel colors, asymmetrical curves, and lighthearted, playful motifs, in the style of Fragonard.',
    thumbnail: 'https://picsum.photos/seed/rococo/400/300'
  },
  {
    id: 'geometric-abstraction',
    name: 'Geometric Abstraction',
    description: 'Art based on simple geometric shapes like lines and squares.',
    keywords: 'A geometric abstraction background composed of clean lines, squares, and primary colors, in the style of Piet Mondrian\'s De Stijl movement.',
    thumbnail: 'https://picsum.photos/seed/geometric-abstraction/400/300'
  },
  {
    id: 'photorealism',
    name: 'Photorealism',
    description: 'Ultra-realistic imagery that resembles a high-resolution photo.',
    keywords: 'An ultra-realistic, photorealistic background of a tranquil forest scene, with incredible detail, sharp focus, and accurate lighting, resembling a high-resolution photograph.',
    thumbnail: 'https://picsum.photos/seed/photorealism/400/300'
  },
  {
    id: 'vintage-photo',
    name: 'Vintage Photo',
    description: 'Simulates the look of old photographs, with sepia tones, grain, and slight imperfections.',
    keywords: 'A vintage photograph background with sepia tones, grainy texture, and slight imperfections, like a retro, old-fashioned photo.',
    thumbnail: 'https://picsum.photos/seed/vintage/400/300'
  },
  {
    id: 'glitch-art',
    name: 'Glitch Art',
    description: 'Digital errors and artifacts for a distorted, futuristic look.',
    keywords: 'A glitch art background featuring datamoshing, pixelation, and vibrant, distorted digital artifacts for a futuristic, abstract effect.',
    thumbnail: 'https://picsum.photos/seed/glitch/400/300'
  }
];

// FIX: Add missing BACKGROUND_SUBJECTS constant to fix compilation error in an unused component.
export const BACKGROUND_SUBJECTS: BackgroundSubject[] = [
  {
    id: 'beach',
    name: 'Beach',
    description: 'Serene beach at sunset.',
  },
  {
    id: 'forest',
    name: 'Forest',
    description: 'Enchanted, glowing forest.',
  },
  {
    id: 'mountains',
    name: 'Mountains',
    description: 'Misty mountains at dawn.',
  },
  {
    id: 'cityscape',
    name: 'Cityscape',
    description: 'Vibrant cityscape at night.',
  },
  {
    id: 'zen-garden',
    name: 'Zen Garden',
    description: 'Traditional Japanese garden.',
  },
  {
    id: 'library',
    name: 'Library',
    description: 'Cozy, book-filled library.',
  },
  {
    id: 'space',
    name: 'Outer Space',
    description: 'Galaxies and nebulae.',
  },
  {
    id: 'abstract',
    name: 'Abstract',
    description: 'Soft, abstract gradient.',
  },
];
