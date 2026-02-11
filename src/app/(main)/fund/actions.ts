'use server';

import { categorizeExpenseFlow } from '@/ai/flows/categorize-expense';

export async function categorizeExpenseAction(description: string) {
  // Execute the flow on the server side
  const result = await categorizeExpenseFlow(description);
  return result;
}
