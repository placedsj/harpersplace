'use server';

/**
 * @fileOverview An AI agent for processing text-based evidence from documents or emails.
 *
 * - processEvidenceText - A function that analyzes text content and suggests a title, summary, and category.
 * - ProcessEvidenceTextInput - The input type for the processEvidenceText function.
 * - ProcessEvidenceTextOutput - The return type for the processEvidenceText function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

export const ProcessEvidenceTextInputSchema = z.object({
  textContent: z
    .string()
    .min(20, "Text content must be at least 20 characters long.")
    .max(20000, "Text content must not exceed 20,000 characters.")
    .describe(
      "The full text content copied from a document, email, or other text-based source."
    ),
});
export type ProcessEvidenceTextInput = z.infer<typeof ProcessEvidenceTextInputSchema>;

const ProcessEvidenceTextOutputSchema = z.object({
  summary: z.string().describe('A brief, factual summary of the text content, highlighting key points, dates, and names.'),
  suggestedTitle: z.string().describe('A concise, descriptive title for the evidence log entry based on the text.'),
  suggestedCategory: z.enum(['Communication', 'Custody Exchange', 'Financial', 'Health', 'Other']).describe('The most relevant category for this piece of evidence.'),
});
export type ProcessEvidenceTextOutput = z.infer<typeof ProcessEvidenceTextOutputSchema>;

export async function processEvidenceText(input: ProcessEvidenceTextInput): Promise<ProcessEvidenceTextOutput> {
  return processEvidenceTextFlow(input);
}

const prompt = ai.definePrompt({
  name: 'processEvidenceTextPrompt',
  input: { schema: ProcessEvidenceTextInputSchema },
  output: { schema: ProcessEvidenceTextOutputSchema },
  prompt: `You are an AI assistant for a co-parenting app. Your task is to analyze pasted text content that will be used as evidence in a legal context. Be objective, factual, and concise. The text is from a document, email, or a transcribed conversation.

The user has pasted the following text:
---
{{{textContent}}}
---

Your tasks are:
1.  **Summarize Content:** Write a short, neutral summary of the text. Identify and include key points, names, dates, and any resolutions or conflicts mentioned.
2.  **Suggest Title:** Create a short, descriptive title for the evidence log. For example, "Email regarding school event" or "Text conversation about medical appointment."
3.  **Suggest Category:** Classify the evidence into one of the following categories: 'Communication', 'Custody Exchange', 'Financial', 'Health', 'Other'. Base your classification on the primary subject of the text.`,
});

const processEvidenceTextFlow = ai.defineFlow(
  {
    name: 'processEvidenceTextFlow',
    inputSchema: ProcessEvidenceTextInputSchema,
    outputSchema: ProcessEvidenceTextOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
