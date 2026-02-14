'use server';

import { runFlow } from '@genkit-ai/flow';
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
    
    // The 'run' and 'runFlow' functions from Genkit should not be used in client components.
    // Instead, we call the flow directly from this server action.
    const result = await runFlow(generateTransitionSummaryFlow, prompt);
    
    const finalResult: Summary = {
        ...result,
        mediaUrls: uploadedFiles
    };

    return finalResult;
}


export async function getSignedUrlAction(fileName: string, contentType: string, userId: string) {
    return await runFlow(getStorageUploadUrlFlow, { fileName, contentType, userId });
}
