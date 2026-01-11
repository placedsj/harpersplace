
'use server';

import { generateTransitionSummaryFlow } from '@/ai/flows/generate-transition-summary';
import { getStorageUploadUrlFlow } from '@/ai/flows/get-storage-upload-url';

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
      prompt += `\n\n The user has uploaded ${uploadedFiles.length} photo(s). Briefly mention these images in the summary where relevant. You can refer to them generically (e.g., "the attached photo of the drawing," "the picture from the park").`;
    }
    
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
