
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { GoogleGenAI } from '@google/genai';

// Mock the GoogleGenAI class
vi.mock('@google/genai', () => {
    return {
        GoogleGenAI: vi.fn(function() {
            return {
                models: {
                    generateContent: vi.fn().mockResolvedValue({
                        text: JSON.stringify({ explanation: "Mocked response" })
                    })
                }
            };
        }),
        Type: {
            OBJECT: 'object',
            STRING: 'string',
            NUMBER: 'number',
            BOOLEAN: 'boolean'
        }
    };
});

describe('geminiService', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        vi.resetModules();
    });

    it('should instantiate GoogleGenAI only once', async () => {
        const { generateConfigFromPrompt } = await import('./geminiService');

        await generateConfigFromPrompt("prompt 1", {});
        await generateConfigFromPrompt("prompt 2", {});

        console.log('GoogleGenAI call count:', vi.mocked(GoogleGenAI).mock.calls.length);

        // Assert it was called 1 time (Target behavior)
        expect(GoogleGenAI).toHaveBeenCalledTimes(1);
    });
});
