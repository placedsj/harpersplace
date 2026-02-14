import { z } from 'zod';
import { ai } from '@/ai/genkit';

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

export const categorizeExpenseFlow = ai.defineFlow(
  {
    name: 'categorizeExpenseFlow',
    inputSchema: z.string().describe('A description of the expense.'),
    outputSchema: ExpenseCategorySchema,
  },
  async (description) => {
    const { output } = await ai.generate({
        prompt: `
            You are an expert at parsing and categorizing expenses for co-parents.
            Analyze the following expense description and extract its category and cost.

            Expense Description: "${description}"

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

    return output || { category: 'Other' };
  }
);
