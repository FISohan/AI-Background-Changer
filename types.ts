export interface ArtStyle {
  id: string;
  name: string;
  description: string;
  keywords: string;
  thumbnail: string;
}

// FIX: Add missing BackgroundSubject type to fix compilation error in an unused component.
export interface BackgroundSubject {
  id: string;
  name: string;
  description: string;
}

export interface ImageData {
  base64: string;
  mimeType: string;
}

export type AspectRatio = "16:9" | "9:16" | "1:1" | "4:3" | "3:4";
