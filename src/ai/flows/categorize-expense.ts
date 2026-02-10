
import { z } from 'zod';
import { defineFlow } from '@genkit-ai/flow';
import { googleAI } from '@genkit-ai/googleai';

// Define the expected output format for the AI
const ExpenseCategorySchema = z.object({
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
  currency: z.string().optional().describe('The currency of the expense, e.g., USD, EUR.'),
});

// Define the Genkit flow
export const categorizeExpenseFlow = defineFlow(
  {
    name: 'categorizeExpenseFlow',
    inputSchema: z.string().describe('The user\'s description of the expense.'),
    outputSchema: ExpenseCategorySchema.describe('The categorized expense details.'),
  },
  async (prompt) => {
    const llm = googleAI({ model: 'gemini-pro' });
    const result = await llm.generate({
        prompt: `
            You are an expert at parsing and categorizing expenses for co-parents.
            Analyze the following expense description and extract its category and cost.

            Expense Description: "${prompt}"

            Valid Categories:
            - Health (doctor visits, prescriptions, dental, vision)
            - Education (school fees, tutors, books, supplies)
            - Extracurricular (sports, music lessons, clubs, camps)
            - Clothing (new clothes, shoes, uniforms)
            - Childcare (babysitting, daycare)
            - Travel (costs related to custody exchange or trips)
            - Other (anything that doesn't fit elsewhere)
        `,
        output: {
            schema: ExpenseCategorySchema,
        }
    });

    return result.output() || { category: 'Other' };
  }
);
