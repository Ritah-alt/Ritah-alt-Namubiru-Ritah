
import { GoogleGenAI } from "@google/genai";
import { Source } from '../types';

if (!process.env.API_KEY) {
    console.warn("API_KEY environment variable not set. Using a placeholder. AI features will not work.");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || 'MISSING_API_KEY' });

/**
 * Gets financial advice from the Gemini model with Google Search grounding.
 * @param query - The user's question.
 * @returns An object containing the generated text and a list of sources.
 */
export const getFinancialAdvice = async (query: string): Promise<{ text: string; sources: Source[] }> => {
    const systemInstruction = "You are the Mikozi Shield SACCO Financial Advisor. Your purpose is to provide clear, actionable, and culturally relevant financial literacy advice to rural community members in Uganda, focusing on topics like savings, loan management, and budgeting. Keep your advice concise and supportive. You must base your answer on real-world information using the tools provided.";

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            // FIX: Simplified `contents` to a string for a single text prompt, following API best practices.
            contents: query,
            config: {
                systemInstruction,
                tools: [{ googleSearch: {} }],
            },
        });

        const text = response.text;
        let sources: Source[] = [];
        
        const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
        if (groundingChunks) {
            sources = groundingChunks
                .map(chunk => ({
                    uri: chunk.web?.uri || '',
                    title: chunk.web?.title || '',
                }))
                .filter(source => source.uri && source.title);
        }

        return { text, sources };

    } catch (error) {
        console.error("Gemini API call for advice failed:", error);
        throw new Error("The financial advisor is currently unavailable. Please try again later.");
    }
};

/**
 * Drafts a formal claim description based on user notes.
 * @param claimType - The type of insurance claim.
 * @param notes - The user's informal notes about the event.
 * @returns The formatted claim description text.
 */
export const draftClaimDescription = async (claimType: string, notes: string): Promise<string> => {
    const systemInstruction = `You are an AI Claims Assistant for Mikozi Shield. Your task is to take brief notes or bullet points about an event and convert them into a formal, clear, and comprehensive claim description for an insurance policy claim. The claim type is "${claimType}". The description must be written in simple, clear English, suitable for official documentation. Start directly with the description, do not add greetings or titles.`;

    const userQuery = `Draft the official claim description based on these details: ${notes}`;

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            // FIX: Simplified `contents` to a string for a single text prompt, following API best practices.
            contents: userQuery,
            config: {
                systemInstruction,
            },
        });
        
        return response.text.trim();

    } catch (error) {
        console.error("Gemini API call for drafting failed:", error);
        throw new Error("The AI drafting assistant failed to generate a description.");
    }
};
