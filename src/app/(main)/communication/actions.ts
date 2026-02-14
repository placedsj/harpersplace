// src/app/(main)/communication/actions.ts
'use server';

import { coParentingActions, CoParentingActionsOutput } from '@/ai/flows/co-parenting-actions';

export async function coParentingActionsAction(input: { text: string }): Promise<CoParentingActionsOutput | null> {
  try {
    const result = await coParentingActions(input);
    return result;
  } catch (error) {
    console.error("Error in coParentingActionsAction:", error);
    return null;
  }
}
