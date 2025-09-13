import { GoogleGenAI, Modality, GenerateContentResponse } from "@google/genai";
import type { ImageData, AspectRatio } from '../types';

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const handleApiError = (error: unknown, context: string): never => {
    let message = `An unknown error occurred during ${context}.`;
    if (error instanceof Error) {
        // Check for specific error messages from the API to provide better user feedback
        if (error.message.includes('API key not valid')) {
            message = 'The provided API key is invalid. Please check your configuration.';
        } else if (error.message.includes('quota')) {
            message = 'You have exceeded your API quota. Please check your account status and billing.';
        } else if (error.message.includes('safety') || error.message.includes('blocked')) {
            message = `The request was blocked for safety reasons during ${context}. Please adjust your custom details or try a different style.`;
        } else if (error.message.includes('fetch failed') || error.message.includes('network')) {
            message = `A network error occurred. Please check your internet connection and try again.`;
        }
        else {
            message = `An unexpected error occurred during ${context}. Please try again.`;
        }
    }
    console.error(`Gemini Service Error (${context}):`, error);
    throw new Error(message);
};


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
    try {
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
            throw new Error("The AI failed to remove the background. The model did not return a valid image.");
        }
        return resultImage;
    } catch (error) {
        handleApiError(error, 'background removal');
    }
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

    try {
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
            throw new Error("The AI failed to generate a background. The model did not return any images.");
        }
        
        return generatedImages.map(img => {
            if (!img.image || !img.image.imageBytes) {
                throw new Error("An image was generated but contained no data. Please try again.");
            }
            return {
                base64: img.image.imageBytes,
                mimeType: 'image/jpeg'
            };
        });
    } catch(error) {
        handleApiError(error, 'background generation');
    }
};

export const compositeImages = async (foreground: ImageData, background: ImageData): Promise<ImageData> => {
    try {
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
                        text: `You are an expert digital artist specializing in photorealistic image compositing. Your task is to flawlessly merge a foreground subject (provided as the first image with a transparent background) onto a new background (the second image). The final result must be indistinguishable from a real photograph.

**Core Objective:** Create a single, cohesive, and photorealistic image.

**Non-Negotiable Rule: Preserve the Foreground**
*   The foreground subject is the hero. Its original form, pixels, and silhouette are SACROSANCT.
*   Under NO circumstances should the background image overlap, obscure, or clip any part of the foreground subject.
*   Imagine the foreground is on a locked top layer. The background must only be visible in the transparent areas. Any violation of this rule is a complete failure.

**Subject-Aware Background Integration Checklist:**
To achieve realism, you MUST analyze both images and meticulously match the following elements:

1.  **Lighting & Direction:**
    *   Identify the primary light source(s) in the background (direction, color, hardness/softness).
    *   Re-light the foreground subject so it is illuminated from the same direction and with the same quality of light.
    *   The subject's highlights and shadows must align perfectly with the background's lighting environment.

2.  **Shadow Casting:**
    *   The foreground subject MUST cast a realistic shadow onto the background.
    *   The shadow's direction, length, sharpness, and color must be dictated by the background's light source. A mismatch here will break the illusion.

3.  **Scale & Perspective:**
    *   Analyze the perspective lines and depth of field in the background.
    *   Position and scale the foreground subject so it fits naturally and correctly within that perspective. It should not look like it's floating or incorrectly sized for its position in the scene.

4.  **Color Grading & Atmosphere:**
    *   The foreground subject's colors must be graded to match the background's overall color palette, temperature (warm/cool), and contrast.
    *   If the background has atmospheric effects (e.g., haze, fog, dust), the subject must be integrated into it realistically.

5.  **Edge Integration:**
    *   Ensure the edges of the subject blend seamlessly. Use subtle light wrap from the background to create a more natural contact, but without violating the non-negotiable rule of preservation.

**Final Output:** A single, masterfully composited image that looks like it was captured with a single camera shot.`,
                    },
                ],
            },
            config: {
                responseModalities: [Modality.IMAGE, Modality.TEXT],
            },
        });

        const resultImage = getImagePartFromResponse(response);
        if (!resultImage) {
            throw new Error("The AI failed to combine the images. The model did not return a final composite.");
        }
        return resultImage;
    } catch(error) {
        handleApiError(error, 'image composition');
    }
};