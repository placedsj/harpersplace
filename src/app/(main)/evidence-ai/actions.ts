// src/app/(main)/evidence-ai/actions.ts
'use server';

import { processEvidenceImage, ProcessEvidenceImageOutput } from '@/ai/flows/process-evidence-image';

export async function processEvidenceImageAction(imageDataUri: string): Promise<ProcessEvidenceImageOutput | null> {
  try {
    const result = await processEvidenceImage({ imageDataUri });
    return result;
  } catch (error) {
    console.error("Error in processEvidenceImageAction:", error);
    return null;
  }
}
