import { z } from 'zod';
import { defineFlow } from '@genkit-ai/flow';
import { googleAI } from '@genkit-ai/googleai';

const TransitionSummarySchema = z.object({
  title: z.string().describe('A concise, neutral title for the summary (e.g., "Transition Summary for [Date]").'),
  childsMood: z.string().describe("A brief, objective description of the child's overall mood."),
  activities: z.array(z.string()).describe('A list of key activities the child participated in.'),
  healthAndWellness: z.string().describe('Notes on the child\'s health, like meals, naps, and any concerns.'),
  headsUpForTheWeek: z.string().describe('Any upcoming events or important information for the co-parent.'),
  fullSummary: z.string().describe('A detailed, neutral summary of the day, suitable for a co-parent.'),
});

export const generateTransitionSummaryFlow = defineFlow(
  {
    name: 'generateTransitionSummaryFlow',
    inputSchema: z.string().describe('A raw text dump of notes about a child\'s day.'),
    outputSchema: TransitionSummarySchema,
  },
  async (prompt) => {
    const llm = googleAI({ model: 'gemini-pro' });
    const result = await llm.generate({
        prompt: `
            You are a helpful assistant for co-parents.
            Your task is to convert a raw text dump of notes about a child's day into a structured, neutral, and clear transition summary.
            The summary should be objective and avoid emotional or biased language.
            Focus on factual information that a co-parent would need to know.

            Raw Notes: "${prompt}"
        `,
        output: {
            schema: TransitionSummarySchema,
        }
    });
    return result.output()!;
  }
);
