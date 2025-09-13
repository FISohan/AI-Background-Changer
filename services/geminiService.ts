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