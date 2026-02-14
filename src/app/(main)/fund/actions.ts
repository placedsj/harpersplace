'use server';

import { categorizeExpenseFlow } from '@/ai/flows/categorize-expense';

export async function categorizeExpenseAction(description: string) {
  try {
    const result = await categorizeExpenseFlow(description);
    return result;
  } catch (error) {
    console.error("Error in categorizeExpenseAction:", error);
    // Return partial result or rethrow
    return { category: 'Other', amount: undefined };
  }
}
