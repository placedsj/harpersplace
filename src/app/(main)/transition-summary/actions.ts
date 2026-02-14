'use server';

import { generateTransitionSummaryFlow } from '@/ai/flows/generate-transition-summary';
import { getStorageUploadUrlFlow } from '@/ai/flows/get-storage-upload-url';

export async function generateSummaryAction(ramble: string, mediaUrls: string[] = []) {
  try {
    const result = await generateTransitionSummaryFlow(ramble);
    return { ...result, mediaUrls };
  } catch (error) {
    console.error("Error in generateSummaryAction:", error);
    throw error;
  }
}

export async function getSignedUrlAction(fileName: string, contentType: string, userId: string) {
    try {
        return await getStorageUploadUrlFlow({ fileName, contentType, userId });
    } catch (error) {
        console.error("Error in getSignedUrlAction:", error);
        throw error;
    }
}
