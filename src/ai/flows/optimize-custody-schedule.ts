// src/ai/flows/optimize-custody-schedule.ts
'use server';

/**
 * @fileOverview An AI agent for optimizing custody schedules.
 *
 * - optimizeCustodySchedule - A function that suggests optimized custody schedules.
 * - OptimizeCustodyScheduleInput - The input type for the optimizeCustodySchedule function.
 * - OptimizeCustodyScheduleOutput - The return type for the optimizeCustodySchedule function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'zod';

const OptimizeCustodyScheduleInputSchema = z.object({
  parentalNeeds: z.string().describe('Description of each parent\'s needs and availability.'),
  childWellbeingFactors: z.string().describe('Factors related to the child\'s wellbeing, such as preferences, activities, and needs.'),
  externalFactors: z.string().describe('External factors such as school events, appointments, and other commitments.'),
});

export type OptimizeCustodyScheduleInput = z.infer<typeof OptimizeCustodyScheduleInputSchema>;

const OptimizeCustodyScheduleOutputSchema = z.object({
  optimizedSchedule: z.string().describe('The AI-suggested optimized custody schedule.'),
  reasoning: z.string().describe('The AI\'s reasoning for the suggested schedule.'),
});

export type OptimizeCustodyScheduleOutput = z.infer<typeof OptimizeCustodyScheduleOutputSchema>;

export async function optimizeCustodySchedule(input: OptimizeCustodyScheduleInput): Promise<OptimizeCustodyScheduleOutput> {
  return optimizeCustodyScheduleFlow(input);
}

const prompt = ai.definePrompt({
  name: 'optimizeCustodySchedulePrompt',
  input: {schema: OptimizeCustodyScheduleInputSchema},
  output: {schema: OptimizeCustodyScheduleOutputSchema},
  prompt: `You are an AI expert in creating optimized custody schedules, always prioritizing the child\'s best interest.

  Consider the following information to create an optimized custody schedule:

  Parental Needs: {{{parentalNeeds}}}
  Child Wellbeing Factors: {{{childWellbeingFactors}}}
  External Factors: {{{externalFactors}}}

  Provide a detailed custody schedule and explain your reasoning.`,
});

const optimizeCustodyScheduleFlow = ai.defineFlow(
  {
    name: 'optimizeCustodyScheduleFlow',
    inputSchema: OptimizeCustodyScheduleInputSchema,
    outputSchema: OptimizeCustodyScheduleOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
