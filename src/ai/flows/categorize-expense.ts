
'use server';

/**
 * @fileOverview An AI agent for categorizing expenses.
 *
 * - categorizeExpense - A function that analyzes a description and suggests an expense category.
 * - CategorizeExpenseOutput - The return type for the categorizeExpense function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const CategorizeExpenseOutputSchema = z.object({
  category: z.enum([
    'Health',
    'Education',
    'Extracurricular',
    'Clothing',
    'Childcare',
    'Travel',
    'Other'
  ]).describe('The most appropriate category for the expense.'),
  amount: z.number().optional().describe('The numeric cost of the expense, if mentioned.'),
});
export type CategorizeExpenseOutput = z.infer<typeof CategorizeExpenseOutputSchema>;


export async function categorizeExpense(description: string): Promise<CategorizeExpenseOutput> {
  return categorizeExpenseFlow(description);
}

const prompt = ai.definePrompt({
    name: 'categorizeExpensePrompt',
    input: { schema: z.string() },
    output: { schema: CategorizeExpenseOutputSchema },
    prompt: `
        You are an expert at parsing and categorizing expenses for co-parents.
        Analyze the following expense description and extract its category and cost if available.

        Expense Description: "{{{input}}}"

        Valid Categories:
        - Health (doctor visits, prescriptions, dental, vision)
        - Education (school fees, tutors, books, supplies)
        - Extracurricular (sports, music lessons, clubs, camps)
        - Clothing (new clothes, shoes, uniforms)
        - Childcare (babysitting, daycare)
        - Travel (costs related to custody exchange or trips)
        - Other (anything that doesn't fit elsewhere)
    `,
});

const categorizeExpenseFlow = ai.defineFlow(
    {
      name: 'categorizeExpenseFlow',
      inputSchema: z.string(),
      outputSchema: CategorizeExpenseOutputSchema,
    },
    async (description) => {
        const { output } = await prompt(description);
        return output!;
    }
);
