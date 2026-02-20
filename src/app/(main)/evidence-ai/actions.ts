'use server';

import { processEvidenceImage, ProcessEvidenceImageOutput } from '@/ai/flows/process-evidence-image';

export async function processEvidenceImageAction(imageBase64: string): Promise<ProcessEvidenceImageOutput | null> {
  try {
    const result = await processEvidenceImage({ imageDataUri: imageBase64 });
    return result;
  } catch (error) {
    console.error("Error in processEvidenceImageAction:", error);
    return null;
  }
}
