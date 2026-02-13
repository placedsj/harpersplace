import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/googleai';

// Safely initialize Google AI plugin only if API key is present or we are building
const apiKey = process.env.GOOGLE_GENAI_API_KEY || 'dummy-key-for-build';

export const ai = genkit({
  plugins: [googleAI({ apiKey })],
  model: 'googleai/gemini-2.5-flash',
});
