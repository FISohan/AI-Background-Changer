export interface ArtStyle {
  id: string;
  name: string;
  description: string;
  keywords: string;
  thumbnail: string;
}

export interface ImageData {
  base64: string;
  mimeType: string;
}

export type AspectRatio = "16:9" | "9:16" | "1:1" | "4:3" | "3:4";
