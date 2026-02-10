'use server';

import { categorizeExpenseFlow } from '@/ai/flows/categorize-expense';
import { runFlow } from '@genkit-ai/flow';

export async function categorizeExpenseAction(description: string) {
  const result = await runFlow(categorizeExpenseFlow, description);
  return result;
}
