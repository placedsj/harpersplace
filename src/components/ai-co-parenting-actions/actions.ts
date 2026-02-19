// src/components/ai-co-parenting-actions/actions.ts
'use server';

import { coParentingActions, CoParentingActionsOutput } from '@/ai/flows/co-parenting-actions';

export async function coParentingActionsAction(text: string): Promise<CoParentingActionsOutput | null> {
  try {
    const result = await coParentingActions({ text });
    return result;
  } catch (error) {
    console.error("Error in coParentingActionsAction:", error);
    return null;
  }
}
