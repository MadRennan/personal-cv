
import { GoogleGenAI, Type } from '@google/genai';

// Initialize the AI client once
let ai: GoogleGenAI | null = null;
const getAiClient = () => {
    if (!ai) {
        if (!process.env.API_KEY) {
            console.error("API_KEY is not set.");
            return null;
        }
        ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    }
    return ai;
}

type GeminiAspectRatio = '4:3' | '16:9';

function isValidAspectRatio(value: string): value is GeminiAspectRatio {
  return value === '4:3' || value === '16:9';
}

/**
 * Generates an image using the Gemini API and caches it in sessionStorage.
 * @param imageId - A unique ID for the image to use as the cache key.
 * @param prompt - The prompt to send to the image generation model.
 * @returns A base64 encoded string of the generated JPEG image.
 */
export async function generateAndCacheImage(imageId: string, prompt: string, aspectRatio: '4:3' | '16:9' = '4:3'): Promise<string> {
    const cacheKey = `genimg-${imageId}`;
    try {
        const cachedImage = sessionStorage.getItem(cacheKey);
        if (cachedImage) {
            return cachedImage;
        }
    } catch (e) {
        console.warn("Session storage is unavailable. Images will be generated on each view.", e);
    }


    const client = getAiClient();
    if (!client) {
        throw new Error("Gemini AI Client not initialized. Check API_KEY.");
    }

    try {
        const response = await client.models.generateImages({
            model: 'imagen-3.0-generate-002',
            prompt: prompt,
            config: {
              numberOfImages: 1,
              outputMimeType: 'image/jpeg', // JPEG is generally smaller
              aspectRatio: aspectRatio,
            },
        });

        if (response.generatedImages && response.generatedImages.length > 0) {
            const base64ImageBytes = response.generatedImages[0].image.imageBytes;
            try {
              sessionStorage.setItem(cacheKey, base64ImageBytes);
            } catch (e) {
              console.warn("Could not cache image in session storage.", e);
            }
            return base64ImageBytes;
        } else {
            throw new Error("Image generation failed, no images returned.");
        }
    } catch (error) {
        console.error(`Error generating image for prompt "${prompt}":`, error);
        throw error; // Re-throw to be handled by the component
    }
}


/**
 * Generates a summary for a blog post using the Gemini API and caches it.
 * @param postId - A unique ID for the blog post to use as the cache key.
 * @param content - The full content of the blog post to summarize.
 * @returns An array of strings representing the key takeaways.
 */
export async function generateSummary(postId: string, content: string): Promise<string[]> {
    const cacheKey = `summary-${postId}`;
    try {
        const cachedSummary = sessionStorage.getItem(cacheKey);
        if (cachedSummary) {
            return JSON.parse(cachedSummary);
        }
    } catch (e) {
        console.warn("Session storage is unavailable. Summaries will be generated on each view.", e);
    }
    
    const client = getAiClient();
    if (!client) {
        throw new Error("Gemini AI Client not initialized. Check API_KEY.");
    }

    try {
        const response = await client.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: `Summarize the following article content into 3-4 concise, impactful bullet points for a 'Key Takeaways' section. Return the result as a JSON object with a single key 'takeaways' which is an array of strings. Article content:\n\n${content}`,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        takeaways: {
                            type: Type.ARRAY,
                            items: {
                                type: Type.STRING
                            }
                        }
                    }
                }
            }
        });

        const jsonText = response.text;
        const result = JSON.parse(jsonText);

        if (result && result.takeaways) {
            try {
                sessionStorage.setItem(cacheKey, JSON.stringify(result.takeaways));
            } catch (e) {
                console.warn("Could not cache summary in session storage.", e);
            }
            return result.takeaways;
        } else {
            throw new Error("Summary generation failed, invalid format returned.");
        }
    } catch (error) {
        console.error(`Error generating summary for post "${postId}":`, error);
        throw error;
    }
}
