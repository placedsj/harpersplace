'use server';

/**
 * @fileOverview An AI agent for processing image-based evidence.
 *
 * - processEvidenceImage - A function that analyzes an image, extracts text, and suggests a title and category.
 * - ProcessEvidenceImageInput - The input type for the processEvidenceImage function.
 * - ProcessEvidenceImageOutput - The return type for the processEvidenceImage function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';

const ProcessEvidenceImageInputSchema = z.object({
  imageDataUri: z
    .string()
    .describe(
      "A photo of a document, screenshot, or object for evidence, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type ProcessEvidenceImageInput = z.infer<typeof ProcessEvidenceImageInputSchema>;

const ProcessEvidenceImageOutputSchema = z.object({
  extractedText: z.string().describe('All text extracted from the image. If no text is found, this should be empty.'),
  summary: z.string().describe('A brief, factual summary of the image content.'),
  suggestedTitle: z.string().describe('A concise, descriptive title for the evidence log entry.'),
  suggestedCategory: z.enum(['Communication', 'Custody Exchange', 'Financial', 'Health', 'Other']).describe('The most relevant category for this piece of evidence.'),
});
export type ProcessEvidenceImageOutput = z.infer<typeof ProcessEvidenceImageOutputSchema>;

export async function processEvidenceImage(input: ProcessEvidenceImageInput): Promise<ProcessEvidenceImageOutput> {
  return processEvidenceImageFlow(input);
}

const prompt = ai.definePrompt({
  name: 'processEvidenceImagePrompt',
  input: { schema: ProcessEvidenceImageInputSchema },
  output: { schema: ProcessEvidenceImageOutputSchema },
  prompt: `You are an AI assistant for a co-parenting app. Your task is to analyze an uploaded image that will be used as evidence in a legal context. Be objective and factual.

The user has uploaded the following image:
{{media url=imageDataUri}}

Your tasks are:
1.  **Extract Text (OCR):** Identify and extract all text from the image. If there is no text, return an empty string for the 'extractedText' field.
2.  **Summarize Content:** Write a short, neutral summary of what the image shows. If it's a screenshot of a conversation, summarize the key points. If it's a receipt, state what was purchased and the total.
3.  **Suggest Title:** Create a short, descriptive title for the evidence log. For example, "Text regarding weekend pickup" or "Receipt for school supplies."
4.  **Suggest Category:** Classify the evidence into one of the following categories: 'Communication', 'Custody Exchange', 'Financial', 'Health', 'Other'.`,
});

const processEvidenceImageFlow = ai.defineFlow(
  {
    name: 'processEvidenceImageFlow',
    inputSchema: ProcessEvidenceImageInputSchema,
    outputSchema: ProcessEvidenceImageOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
