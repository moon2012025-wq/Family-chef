
import { GoogleGenAI, Type } from "@google/genai";
import { UserProfile, Recipe, Language } from "./types";

const getAI = () => new GoogleGenAI({ apiKey: process.env.API_KEY });

export const analyzeImageOrText = async (
  input: { base64?: string; text?: string },
  profile: UserProfile,
  lang: Language,
  isMealAnalysis: boolean = false
): Promise<Recipe[]> => {
  const ai = getAI();
  
  const healthContext = profile.diseases.length > 0 
    ? `The user suffers from: ${profile.diseases.join(', ')}. Avoid harmful ingredients.` 
    : "No medical restrictions.";

  const regionNames: Record<string, string> = {
    international: "International",
    gulf: "Gulf/Arabian",
    egyptian: "Egyptian",
    levant: "Levant/Shami",
    maghreb: "Maghreb/North African"
  };

  const prompt = isMealAnalysis 
    ? `Analyze this READY MEAL image. Return exactly ONE JSON object with nutritional analysis, calories, and health advice based on the user's health profile. DO NOT provide recipe steps.`
    : `Using these ingredients: "${input.text || 'from image'}", suggest THREE DIFFERENT recipes from the ${regionNames[profile.region]} kitchen. 
       Ensure they follow ${profile.diet} diet. Health context: ${healthContext}. 
       Return as a JSON array of objects.`;

  const inputParts = input.base64 
    ? [{ inlineData: { data: input.base64, mimeType: "image/jpeg" } }, { text: prompt }]
    : [{ text: prompt }];

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: [{ parts: inputParts }],
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            ingredients: { type: Type.ARRAY, items: { type: Type.STRING } },
            steps: { type: Type.ARRAY, items: { type: Type.STRING } },
            calories: { type: Type.NUMBER },
            prepTime: { type: Type.STRING },
            detectedIngredients: { type: Type.ARRAY, items: { type: Type.STRING } }
          },
          required: ["title", "ingredients", "steps", "prepTime", "detectedIngredients"]
        }
      }
    }
  });

  const rawData = JSON.parse(response.text || "[]");
  return rawData.map((r: any) => ({
    ...r,
    id: Math.random().toString(36).substr(2, 9),
    timestamp: Date.now(),
    isMealAnalysis
  }));
};

export const getSubstitutes = async (ingredient: string, lang: Language): Promise<string[]> => {
  const ai = getAI();
  const prompt = `Suggest 3 healthy substitutes for "${ingredient}" in ${lang === 'ar' ? 'Arabic' : 'English'}. Return as JSON array of strings.`;
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: { type: Type.ARRAY, items: { type: Type.STRING } }
    }
  });
  return JSON.parse(response.text || "[]");
};
