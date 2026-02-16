'use server';

import { generateTransitionSummaryFlow } from '@/ai/flows/generate-transition-summary';
import { getStorageUploadUrlFlow } from '@/ai/flows/get-storage-upload-url';
import { runFlow } from '@genkit-ai/flow';

type Summary = {
    title: string;
    childsMood: string;
    activities: string[];
    healthAndWellness: string;
    headsUpForTheWeek: string;
    fullSummary: string;
    mediaUrls?: string[];
}

export async function generateSummaryAction(ramble: string, uploadedFiles: string[]): Promise<Summary> {
    let prompt = ramble;
    if (uploadedFiles.length > 0) {
      prompt += `\n\n The user has uploaded the following images related to the day. Briefly mention them in the summary where relevant: ${uploadedFiles.join(', ')}`;
    }
    
    // The 'run' and 'runFlow' functions from Genkit should not be used in client components.
    // Instead, we call the flow directly from this server action.
    const result = await generateTransitionSummaryFlow(prompt);
    
    const finalResult: Summary = {
        ...result,
        mediaUrls: uploadedFiles
    };

    return finalResult;
}


export async function getSignedUrlAction(fileName: string, contentType: string, userId: string) {
    return await getStorageUploadUrlFlow({ fileName, contentType, userId });
}