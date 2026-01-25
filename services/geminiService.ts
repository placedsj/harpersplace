
import { GoogleGenAI, Type } from "@google/genai";

export const generateConfigFromPrompt = async (prompt: string, currentSpec: any) => {
    // Initializing GoogleGenAI client
    const apiKey = (import.meta as any).env.VITE_GEMINI_API_KEY;
    const ai = new GoogleGenAI({ apiKey });

    // Using gemini-3-pro-preview for complex reasoning tasks
    const response = await ai.models.generateContent({
        model: "gemini-3-pro-preview",
        contents: `Current Config: ${JSON.stringify(currentSpec)}. User prompt: ${prompt}`,
        config: {
            systemInstruction: `You are LUNAI, a world-class architectural configurator for PLACED SHEDS. 
            
            PLACED SHEDS CATALOG (LEVEL 7):
            - Lofted Barn 12x28: Storage Superstar.
            - Utility 10x20: Organization Bliss.
            - Quaker 10x16: Practical Perfection.
            - A-Frame 10x18: Backyard MVP.
            
            POWER KIT KNOWLEDGE BASE:
            If user asks about power, electric, or trenching, suggest these:
            1. Shell Only: Future-ready but empty.
            2. 20A Weekender (~$300): Lights, laptops, light tools.
            3. 30A Workshop (~$900): Heater, PC, real tools. NO TRENCHING required.
            4. 50A Guest: Full kitchen/heavy heat. Requires permit/trench.
            
            CONSTRAINTS & COMMANDS:
            - width: 8 to 16 (feet)
            - depth: 8 to 28 (feet)
            - pitch: 3 to 12
            - styles: "A-Frame", "Modern Studio", "Gable", "Quaker", "Lofted Barn", "Utility"
            - addons: {ramp, solar, ac, loft, workbench, shedLoo}
            - "Shed Loo" is a composting toilet system with privacy screen.
            
            Tone: Professional, helpful, slightly witty. Mention "Saint John City Limits Free Delivery" when appropriate.
            
            Respond ONLY with JSON.`,
            responseMimeType: "application/json",
            responseSchema: {
                type: Type.OBJECT,
                properties: {
                    style: { type: Type.STRING },
                    material: { type: Type.STRING },
                    weather: { type: Type.STRING },
                    terrain: { type: Type.STRING },
                    time: { type: Type.NUMBER },
                    viewMode: { type: Type.STRING },
                    renderMode: { type: Type.STRING },
                    pitch: { type: Type.NUMBER },
                    width: { type: Type.NUMBER },
                    depth: { type: Type.NUMBER },
                    wallColor: { type: Type.STRING },
                    trimColor: { type: Type.STRING },
                    addons: {
                        type: Type.OBJECT,
                        properties: {
                            ramp: { type: Type.BOOLEAN },
                            solar: { type: Type.BOOLEAN },
                            ac: { type: Type.BOOLEAN },
                            loft: { type: Type.BOOLEAN },
                            workbench: { type: Type.BOOLEAN },
                            shedLoo: { type: Type.BOOLEAN }
                        }
                    },
                    explanation: { type: Type.STRING }
                }
            }
        }
    });

    try {
        const text = response.text?.trim();
        if (!text) return null;
        return JSON.parse(text);
    } catch (e) {
        console.error("LUNAI JSON Parse Error", e);
        return null;
    }
};
