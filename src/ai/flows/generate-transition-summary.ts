
'use server';
/**
 * @fileOverview An AI agent for generating co-parenting transition summaries.
 *
 * - generateTransitionSummaryFlow - A function that converts raw notes into a structured summary.
 * - TransitionSummarySchema - The return type for the flow.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const TransitionSummarySchema = z.object({
  title: z.string().describe('A concise, neutral title for the summary (e.g., "Transition Summary for [Date]").'),
  childsMood: z.string().describe("A brief, objective description of the child's overall mood."),
  activities: z.array(z.string()).describe('A list of key activities the child participated in.'),
  healthAndWellness: z.string().describe('Notes on the child\'s health, like meals, naps, and any concerns.'),
  headsUpForTheWeek: z.string().describe('Any upcoming events or important information for the co-parent.'),
  fullSummary: z.string().describe('A detailed, neutral summary of the day, suitable for a co-parent.'),
});
export type TransitionSummary = z.infer<typeof TransitionSummarySchema>;


const prompt = ai.definePrompt({
    name: 'generateTransitionSummaryPrompt',
    input: { schema: z.string() },
    output: { schema: TransitionSummarySchema },
    prompt: `
        You are a helpful assistant for co-parents.
        Your task is to convert a raw text dump of notes about a child's day into a structured, neutral, and clear transition summary.
        The summary should be objective and avoid emotional or biased language.
        Focus on factual information that a co-parent would need to know.

        Raw Notes: "{{{input}}}"
    `,
});


export const generateTransitionSummaryFlow = ai.defineFlow(
  {
    name: 'generateTransitionSummaryFlow',
    inputSchema: z.string(),
    outputSchema: TransitionSummarySchema,
  },
  async (prompt) => {
    const { output } = await prompt(prompt);
    return output!;
  }
);
