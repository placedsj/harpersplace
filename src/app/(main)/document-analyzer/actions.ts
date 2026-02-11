// src/app/(main)/document-analyzer/actions.ts
'use server';

import { processEvidenceText, ProcessEvidenceTextOutput } from '@/ai/flows/process-evidence-text';

export async function processEvidenceTextAction(text: string): Promise<ProcessEvidenceTextOutput | null> {
  try {
    const result = await processEvidenceText({ textContent: text });
    return result;
  } catch (error) {
    console.error("Error in processEvidenceTextAction:", error);
    return null;
  }
}
