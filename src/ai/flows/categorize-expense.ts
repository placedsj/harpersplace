
import { z } from 'zod';
import { defineFlow } from '@genkit-ai/flow';
import { googleAI, gemini15Flash } from '@genkit-ai/googleai';

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
  async (prompt: string) => {
    // Simple fallback implementation when AI is not available
    // In production, this would call the Google AI API
    const lowerPrompt = prompt.toLowerCase();
    
    let category: 'Health' | 'Education' | 'Extracurricular' | 'Clothing' | 'Childcare' | 'Travel' | 'Other' = 'Other';
    
    if (lowerPrompt.includes('doctor') || lowerPrompt.includes('medical') || lowerPrompt.includes('prescription') || lowerPrompt.includes('dental')) {
      category = 'Health';
    } else if (lowerPrompt.includes('school') || lowerPrompt.includes('tutor') || lowerPrompt.includes('book')) {
      category = 'Education';
    } else if (lowerPrompt.includes('sport') || lowerPrompt.includes('music') || lowerPrompt.includes('lesson') || lowerPrompt.includes('camp')) {
      category = 'Extracurricular';
    } else if (lowerPrompt.includes('clothes') || lowerPrompt.includes('shoe') || lowerPrompt.includes('uniform')) {
      category = 'Clothing';
    } else if (lowerPrompt.includes('daycare') || lowerPrompt.includes('babysit')) {
      category = 'Childcare';
    } else if (lowerPrompt.includes('travel') || lowerPrompt.includes('trip') || lowerPrompt.includes('visit')) {
      category = 'Travel';
    }
    
    // Extract amount if present
    const amountMatch = prompt.match(/\$?(\d+(?:\.\d{2})?)/);
    const amount = amountMatch ? parseFloat(amountMatch[1]) : undefined;
    
    return {
      category,
      amount,
      currency: amount ? 'CAD' : undefined,
    };
  }
);
