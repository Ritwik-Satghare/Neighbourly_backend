import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

// Initialize the Gemini Client safely using your API key
const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;
const ai = new GoogleGenAI({ apiKey: apiKey || '' });

/**
 * Validates a set of images to make sure they aren't blurry, dark, or garbage.
 */
export const validateImageQuality = async (
  imageUrls: string[]
): Promise<{ accepted: boolean; qualityScore: number; reason?: string }> => {
  try {
    if (!apiKey) {
      console.warn("⚠️ Gemini API key missing, bypassing quality safety validation.");
      return { accepted: true, qualityScore: 1.0 };
    }

    // Map your Cloudinary URLs for Gemini's multimodal input window
    const imageParts = imageUrls.map(url => ({
      fileData: { fileUri: url, mimeType: 'image/jpeg' }
    }));

    const prompt = `
      You are an expert image quality assurance assistant. Analyze these uploaded rental item condition photos.
      Check for:
      1. Extreme motion blur or completely out-of-focus subjects.
      2. High darkness/underexposure where components cannot be visually inspected.
      3. Irrelevant scenes (e.g., a pocket photo, empty floor, or blank wall instead of an actual product).

      Provide your output strictly in the following JSON format:
      {
        "accepted": boolean,
        "qualityScore": number (between 0.0 and 1.0),
        "reason": "string describing the issue if accepted is false, otherwise omit this key"
      }
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: [...imageParts, prompt],
      config: { responseMimeType: 'application/json' } // Forces Gemini to respond in perfect JSON
    });

    if (!response.text) {
      throw new Error("Gemini returned an empty or blocked quality response.");
    }

    return JSON.parse(response.text.trim());
  } catch (error) {
    console.error("Gemini Image Quality Validation failed:", error);
    // Graceful fallback: don't block core user app features if the API fails
    return { accepted: true, qualityScore: 1.0 };
  }
};