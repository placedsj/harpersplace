'use server';

/**
 * @fileOverview An AI agent for suggesting pediatric sleep schedules.
 *
 * - suggestSleepSchedule - A function that suggests sleep schedules for a child.
 * - SuggestSleepScheduleInput - The input type for the suggestSleepSchedule function.
 * - SuggestSleepScheduleOutput - The return type for the suggestSleepSchedule function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestSleepScheduleInputSchema = z.object({
  ageInMonths: z.number().describe("The child's age in months."),
  recentLogs: z.string().describe("A summary of the child's recent logs, including sleep times, feedings, and diaper changes."),
  desiredSchedule: z.string().optional().describe("Any desired schedule goals the parents have, like a specific bedtime."),
});

export type SuggestSleepScheduleInput = z.infer<typeof SuggestSleepScheduleInputSchema>;

const SuggestSleepScheduleOutputSchema = z.object({
  nextNapTime: z.string().describe("The suggested time for the next nap."),
  nextFeedTime: z.string().describe("An estimate for the next feeding time based on the logs."),
  suggestedSchedule: z.string().describe("A detailed suggested sleep schedule for the day, including nap windows and a final bedtime."),
  sleepTips: z.string().describe("Actionable tips to help the child sleep better, such as quiet down routines."),
  reasoning: z.string().describe("The AI's reasoning for the suggested schedule, based on the child's age and recent patterns."),
});

export type SuggestSleepScheduleOutput = z.infer<typeof SuggestSleepScheduleOutputSchema>;

export async function suggestSleepSchedule(input: SuggestSleepScheduleInput): Promise<SuggestSleepScheduleOutput> {
  return suggestSleepScheduleFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestSleepSchedulePrompt',
  input: {schema: SuggestSleepScheduleInputSchema},
  output: {schema: SuggestSleepScheduleOutputSchema},
  prompt: `You are an expert pediatric sleep consultant AI. Your goal is to help parents establish a healthy sleep schedule for their child.

Analyze the following information:
- Child's Age: {{{ageInMonths}}} months
- Recent Logs: {{{recentLogs}}}
- Desired Schedule Goals: {{#if desiredSchedule}}{{{desiredSchedule}}}{{else}}None specified.{{/if}}

Based on this information, provide the following:
1.  **Next Nap Time:** Predict the optimal time for the next nap.
2.  **Next Feed Time:** Predict the next feeding time based on typical patterns for this age.
3.  **Suggested Schedule:** Create a simple, ideal schedule for the rest of the day, including nap windows and a final bedtime.
4.  **Sleep Tips:** Offer 2-3 practical tips for improving sleep habits (e.g., quiet down routines, creating a good sleep environment).
5.  **Reasoning:** Briefly explain your recommendations based on common sleep patterns for a child of this age and the provided logs.`,
});

const suggestSleepScheduleFlow = ai.defineFlow(
  {
    name: 'suggestSleepScheduleFlow',
    inputSchema: SuggestSleepScheduleInputSchema,
    outputSchema: SuggestSleepScheduleOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
