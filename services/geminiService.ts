import { GoogleGenAI, Modality, GenerateContentResponse } from "@google/genai";
import type { ImageData, AspectRatio } from '../types';

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve((reader.result as string).split(',')[1]);
    reader.onerror = error => reject(error);
  });
};

const getImagePartFromResponse = (response: GenerateContentResponse): ImageData | null => {
    const imagePart = response.candidates?.[0]?.content?.parts?.find(part => part.inlineData);
    if (imagePart && imagePart.inlineData) {
        return {
            base64: imagePart.inlineData.data,
            mimeType: imagePart.inlineData.mimeType,
        };
    }
    return null;
}

export const removeBackground = async (image: ImageData): Promise<ImageData> => {
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image-preview',
        contents: {
            parts: [
                {
                    inlineData: {
                        data: image.base64,
                        mimeType: image.mimeType,
                    },
                },
                {
                    text: 'Segment the primary subject from the background. The output must be an image of the subject with a transparent background.',
                },
            ],
        },
        config: {
            responseModalities: [Modality.IMAGE, Modality.TEXT],
        },
    });
    
    const resultImage = getImagePartFromResponse(response);
    if (!resultImage) {
        throw new Error("Failed to remove background. The model did not return an image.");
    }
    return resultImage;
};

export const generateBackground = async (styleKeywords: string, aspectRatio: AspectRatio, customSubject: string, batchSize: number): Promise<ImageData[]> => {
    let prompt;
    if (customSubject) {
      prompt = `A high-resolution background image of ${customSubject}. The style is: ${styleKeywords}.`;
    } else {
      prompt = `Generate a beautiful, high-resolution background image. Style: ${styleKeywords}.`;
    }
    prompt += ` The image should be a background and not contain any prominent foreground subjects, people, or animals unless explicitly requested.`;
    
    const response = await ai.models.generateImages({
        model: 'imagen-4.0-generate-001',
        prompt: prompt,
        config: {
            numberOfImages: batchSize,
            outputMimeType: 'image/jpeg',
            aspectRatio: aspectRatio,
        },
    });

    const generatedImages = response.generatedImages;
    if (!generatedImages || generatedImages.length === 0) {
        throw new Error("Failed to generate background. The model did not return any images.");
    }
    
    return generatedImages.map(img => {
        if (!img.image || !img.image.imageBytes) {
            throw new Error("An image was generated but contained no data.");
        }
        return {
            base64: img.image.imageBytes,
            mimeType: 'image/jpeg'
        };
    });
};

export const compositeImages = async (foreground: ImageData, background: ImageData): Promise<ImageData> => {
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image-preview',
        contents: {
            parts: [
                {
                    inlineData: {
                        data: foreground.base64,
                        mimeType: foreground.mimeType,
                    },
                },
                {
                    inlineData: {
                        data: background.base64,
                        mimeType: background.mimeType,
                    },
                },
                {
                    text: 'Composite the first image (foreground subject) onto the second image (background). The subject should be centered and blended seamlessly into the background to create a realistic final image.',
                },
            ],
        },
        config: {
            responseModalities: [Modality.IMAGE, Modality.TEXT],
        },
    });

    const resultImage = getImagePartFromResponse(response);
    if (!resultImage) {
        throw new Error("Failed to composite images. The model did not return an image.");
    }
    return resultImage;
};