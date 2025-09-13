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
    let prompt: string;
    const finalSubject = customSubject;

    if (finalSubject) {
        // This regex looks for a generic subject in the style prompt (e.g., "a serene landscape") and replaces it with the user's custom subject.
        const subjectRegex = /( of a | of an | of )(.+?)( with |, in the style of |, featuring |, and |, composed of|\.)/;
        
        if (subjectRegex.test(styleKeywords)) {
            // If a generic subject is found, replace it with the custom one for a more integrated prompt.
            prompt = styleKeywords.replace(subjectRegex, `$1${finalSubject}$3`);
        } else {
            // Fallback for style prompts that don't have a clear replaceable subject.
            // Appends the custom subject in a descriptive way.
            const separator = styleKeywords.endsWith('.') ? '' : '.';
            prompt = `${styleKeywords}${separator} The scene should feature ${finalSubject}.`;
        }
    } else {
      // If no custom subject is provided, use the style's default prompt.
      prompt = styleKeywords;
    }
    
    // If generating a batch, add an instruction to ensure diversity in the results.
    if (batchSize > 1) {
        const separator = prompt.endsWith('.') ? ' ' : '. ';
        prompt += `${separator}Create significantly different versions of this scene, exploring variations in color, lighting, and composition.`;
    }

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
                    text: `You are a professional digital compositing AI. Your task is to combine two images: a foreground subject with a transparent background (layer 1) and a background image (layer 2).

**Primary Directive:** The foreground subject (layer 1) is immutable and must be placed perfectly *on top* of the background (layer 2). The background must fill only the transparent areas around the subject.

**CRITICAL RULE: NO OVERLAP.**
*   The background image must **NEVER** cover, clip, obscure, or blend with any part of the foreground subject.
*   The silhouette and all pixels of the foreground subject must remain 100% intact and visible.
*   Treat the foreground as a locked top layer in an image editor. The background goes underneath and cannot affect the top layer.

**Secondary Directive: Realistic Integration.**
Once the layering is correct, make the composite photorealistic.
*   **Lighting & Shadows:** Analyze the background's lighting. The subject must cast realistic shadows onto the background, and its own lighting should match the environment.
*   **Scale & Perspective:** Adjust the subject's scale and position to fit the background's perspective perfectly.
*   **Color Harmony:** Match the subject's color temperature, saturation, and grading to the background's atmosphere.
*   **Edge Blending:** Subtly integrate the subject's edges with the background using techniques like light wrap, but without violating the "NO OVERLAP" rule.

**Final Output:** A single, high-quality image where the foreground is perfectly placed on the background without any overlap, and the scene looks completely real.`,
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