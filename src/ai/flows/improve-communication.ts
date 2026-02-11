
'use server';

/**
 * @fileOverview An AI agent for improving co-parenting communication.
 *
 * - improveCommunication - A function that analyzes a message and suggests improvements.
 * - ImproveCommunicationInput - The input type for the improveCommunication function.
 * - ImproveCommunicationOutput - The return type for the improveCommunication function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';

const ImproveCommunicationInputSchema = z.object({
  message: z.string().describe('The message draft written by one co-parent to the other.'),
});
export type ImproveCommunicationInput = z.infer<typeof ImproveCommunicationInputSchema>;

const ImproveCommunicationOutputSchema = z.object({
  revisedMessage: z.string().describe('A revised, clearer, and more positive version of the message.'),
  keyChanges: z.array(z.string()).describe('A list of key changes made and the reasoning behind each one, focusing on collaborative language and child-centric focus.'),
});
export type ImproveCommunicationOutput = z.infer<typeof ImproveCommunicationOutputSchema>;

export async function improveCommunication(input: ImproveCommunicationInput): Promise<ImproveCommunicationOutput> {
  return improveCommunicationFlow(input);
}

const prompt = ai.definePrompt({
  name: 'improveCommunicationPrompt',
  input: { schema: ImproveCommunicationInputSchema },
  output: { schema: ImproveCommunicationOutputSchema },
  prompt: `You are an expert AI mediator specializing in co-parenting communication. Your goal is to de-escalate conflict, promote collaboration, and ensure messages are child-focused.

Analyze the following message draft from one co-parent to another.

Original Message:
"{{{message}}}"

Your task is to:
1.  Rewrite the message to be more positive, collaborative, and less accusatory. Frame requests clearly and politely. Keep the focus on the child's well-being.
2.  Provide a list of the key changes you made and briefly explain the reasoning for each. For example, "Replaced 'you always' with 'I've noticed that' to avoid blame," or "Added a specific suggestion for a solution to be more collaborative."

The tone should be helpful and constructive, not critical. You are a coach helping the parent communicate more effectively for the sake of their child.`,
});

const improveCommunicationFlow = ai.defineFlow(
  {
    name: 'improveCommunicationFlow',
    inputSchema: ImproveCommunicationInputSchema,
    outputSchema: ImproveCommunicationOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
