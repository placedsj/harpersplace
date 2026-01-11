
'use server';

/**
 * @fileOverview An AI agent that provides advice based on the child's best interest principle.
 *
 * - childsBestInterestCheck - A function that analyzes a dilemma and provides child-focused advice.
 * - ChildsBestInterestCheckInput - The input type for the childsBestInterestCheck function.
 * - ChildsBestInterestCheckOutput - The return type for the childsBestInterestCheck function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const ChildsBestInterestCheckInputSchema = z.object({
  dilemma: z.string().describe('The co-parenting dilemma or situation the user is facing.'),
});
export type ChildsBestInterestCheckInput = z.infer<typeof ChildsBestInterestCheckInputSchema>;

const ChildsBestInterestCheckOutputSchema = z.object({
  advice: z.string().describe('A single, concise piece of advice that directly answers the question from the perspective of the child\'s best interest.'),
  principle: z.string().describe('The underlying child-first principle the advice is based on (e.g., "Predictability and Routine," "Emotional Safety," "Freedom from Adult Conflict").'),
});
export type ChildsBestInterestCheckOutput = z.infer<typeof ChildsBestInterestCheckOutputSchema>;


export async function childsBestInterestCheck(input: ChildsBestInterestCheckInput): Promise<ChildsBestInterestCheckOutput> {
  return childsBestInterestCheckFlow(input);
}


const prompt = ai.definePrompt({
  name: 'childsBestInterestCheckPrompt',
  input: { schema: ChildsBestInterestCheckInputSchema },
  output: { schema: ChildsBestInterestCheckOutputSchema },
  prompt: `You are an impartial child advocate and family law expert, similar to a "Guardian ad litem". Your only goal is to apply the "Best Interests of the Child" principle.

A parent is facing a dilemma and needs guidance. Analyze their situation and provide a single, clear, and actionable piece of advice. Your response must be framed *exclusively* from the child's perspective.

When providing the advice, also state the core child-welfare principle behind it.

Core Principles to consider:
- The child's need for emotional and physical safety.
- The child's need for predictability, stability, and routine.
- The child's right to be shielded from adult conflict.
- The child's relationship with both parents and their wider family.
- The child's age and developmental stage.

Do not be vague. Give a direct answer to the dilemma.

Parent's Dilemma:
"{{{dilemma}}}"`,
});

const childsBestInterestCheckFlow = ai.defineFlow(
  {
    name: 'childsBestInterestCheckFlow',
    inputSchema: ChildsBestInterestCheckInputSchema,
    outputSchema: ChildsBestInterestCheckOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
