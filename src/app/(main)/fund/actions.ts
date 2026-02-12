'use server';

import { runFlow } from '@genkit-ai/flow';
import { categorizeExpenseFlow } from '@/ai/flows/categorize-expense';

export async function categorizeExpenseAction(description: string) {
  try {
    const result = await runFlow(categorizeExpenseFlow, description);
    return { success: true, data: result };
  } catch (error) {
    console.error('Error categorizing expense:', error);
    return { success: false, error: 'Failed to categorize expense' };
  }
}
