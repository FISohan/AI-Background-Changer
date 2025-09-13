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
                    text: 'Remove the background from this image. The output should be only the main subject with a transparent background.',
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

export const generateBackground = async (styleKeywords: string, aspectRatio: AspectRatio): Promise<ImageData> => {
    const response = await ai.models.generateImages({
        model: 'imagen-4.0-generate-001',
        prompt: `Generate a beautiful, high-resolution background image. Style: ${styleKeywords}. The image should be a background and not contain any prominent subjects, people, or animals.`,
        config: {
            numberOfImages: 1,
            outputMimeType: 'image/jpeg',
            aspectRatio: aspectRatio,
        },
    });

    const generatedImage = response.generatedImages?.[0]?.image;
    if (!generatedImage || !generatedImage.imageBytes) {
        throw new Error("Failed to generate background. The model did not return an image.");
    }
    return {
        base64: generatedImage.imageBytes,
        mimeType: 'image/jpeg'
    };
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
                    text: 'Place the first image (the subject) onto the second image (the background). Center the subject and blend it naturally to create a composite image.',
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