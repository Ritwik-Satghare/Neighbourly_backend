import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

// Initialize the Gemini Client using your free API key
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

/**
 * Phase 2: Validates a set of images to make sure they aren't blurry, dark, or garbage.
 */
export const validateImageQuality = async (imageUrls: string[]): Promise<{ accepted: boolean; qualityScore: number; reason?: string }> => {
  try {
    if (!process.env.GEMINI_API_KEY) {
      console.warn("⚠️ GEMINI_API_KEY missing, bypassing quality safety validation.");
      return { accepted: true, qualityScore: 1.0 };
    }

    // Prepare image formats for Gemini's multimodal input
    const imageParts = imageUrls.map(url => ({
      fileData: { fileUri: url, mimeType: 'image/jpeg' } // Cloudinary URLs work seamlessly here
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
        throw new Error("Gemini returned an empty or blocked response.");
        }
    return JSON.parse(response.text.trim());
  } catch (error) {
    console.error("Gemini Image Quality Validation failed:", error);
    // Graceful fallback fallback: don't block users if the API fails
    return { accepted: true, qualityScore: 1.0 };
  }
};

/**
 * Phase 3: Compares BEFORE images against AFTER return images to detect anomalies.
 */
export const generateComparisonReport = async (
  beforeImages: string[],
  afterImages: string[]
): Promise<{ changesDetected: boolean; summary: string[]; confidence: number }> => {
  try {
    if (!process.env.GEMINI_API_KEY) {
      return { changesDetected: false, summary: ["API Key missing"], confidence: 0 };
    }

    const prompt = `
      You are an objective rental dispute assistant. 
      Compare the "BEFORE" rental photos with the "AFTER" return photos of this item.
      Identify any potential new physical issues, such as:
      - New prominent scratches, dents, or structural cracks.
      - Components or accessories present in the BEFORE photos but missing in the AFTER photos (e.g., cables, controllers).

      Treat this as non-binding helpful advice for the platform operators.
      
      Respond strictly in this JSON format:
      {
        "changesDetected": boolean,
        "summary": ["string describing problem 1", "string describing problem 2"],
        "confidence": number (0 to 100 representing your certainty)
      }
    `;

    // Map both image sets for the model's multimodal context window
    const beforeParts = beforeImages.map(url => ({ fileData: { fileUri: url, mimeType: 'image/jpeg' } }));
    const afterParts = afterImages.map(url => ({ fileData: { fileUri: url, mimeType: 'image/jpeg' } }));

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: [
        "BEFORE RENTAL IMAGES:", ...beforeParts,
        "AFTER RENTAL IMAGES:", ...afterParts,
        prompt
      ],
      config: { responseMimeType: 'application/json' }
    });

    if (!response.text) {
        throw new Error("Gemini returned an empty or blocked comparison response.");
        }
    return JSON.parse(response.text.trim());
  } catch (error) {
    console.error("Gemini Condition Comparison failed:", error);
    return { changesDetected: false, summary: ["Failed to generate automated report due to processing error"], confidence: 0 };
  }
};