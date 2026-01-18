
'use server';
/**
 * @fileOverview An AI agent for generating co-parenting transition summaries.
 *
 * - generateTransitionSummaryFlow - A function that converts structured notes into a summary.
 * - TransitionSummaryInput - The input type for the flow.
 * - TransitionSummary - The return type for the flow.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

export const TransitionSummaryInputSchema = z.object({
  childsMood: z.string().describe("The child's general mood and emotional state."),
  keyActivities: z.string().describe('A list of key activities the child participated in.'),
  healthAndWellnessNotes: z.string().describe("Notes on the child's health, like meals, naps, and any concerns."),
  upcomingEvents: z.string().describe('Any upcoming events or important information for the co-parent.'),
  additionalNotes: z.string().optional().describe('Any other relevant notes or a general ramble.'),
  mediaUrls: z.array(z.string()).optional().describe("URLs of any uploaded photos."),
});
export type TransitionSummaryInput = z.infer<typeof TransitionSummaryInputSchema>;


const TransitionSummarySchema = z.object({
  title: z.string().describe('A concise, neutral title for the summary (e.g., "Transition Summary for [Date]").'),
  childsMood: z.string().describe("A brief, objective description of the child's overall mood."),
  activities: z.array(z.string()).describe('A bulleted list of key activities the child participated in.'),
  healthAndWellness: z.string().describe('Notes on the child\'s health, like meals, naps, and any concerns.'),
  headsUpForTheWeek: z.string().describe('Any upcoming events or important information for the co-parent.'),
  fullSummary: z.string().describe('A detailed, neutral summary of the day, suitable for a co-parent, that synthesizes all the provided information.'),
});
export type TransitionSummary = z.infer<typeof TransitionSummarySchema>;


const prompt = ai.definePrompt({
    name: 'generateTransitionSummaryPrompt',
    input: { schema: TransitionSummaryInputSchema },
    output: { schema: TransitionSummarySchema },
    prompt: `
        You are a helpful assistant for co-parents.
        Your task is to convert structured notes about a child's day into a professional, neutral, and clear transition summary.
        The summary should be objective and avoid emotional or biased language.
        Focus on factual information that a co-parent would need to know.

        Use the following structured information to create the summary:
        - Child's Mood: {{{childsMood}}}
        - Key Activities: {{{keyActivities}}}
        - Health & Wellness Notes: {{{healthAndWellnessNotes}}}
        - Upcoming Events: {{{upcomingEvents}}}
        {{#if additionalNotes}}
        - Additional Notes: {{{additionalNotes}}}
        {{/if}}

        {{#if mediaUrls}}
        - The user has uploaded {{mediaUrls.length}} photo(s). Briefly mention these images in the summary where relevant. You can refer to them generically (e.g., "the attached photo of the drawing," "the picture from the park").
        {{/if}}
    `,
});


export const generateTransitionSummaryFlow = ai.defineFlow(
  {
    name: 'generateTransitionSummaryFlow',
    inputSchema: TransitionSummaryInputSchema,
    outputSchema: TransitionSummarySchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    if (!output) {
      throw new Error("The AI model failed to generate a valid summary. Please try again.");
    }
    return output;
  }
);
