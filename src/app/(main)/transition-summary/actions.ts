
'use server';

import { generateTransitionSummaryFlow, TransitionSummaryInput } from '@/ai/flows/generate-transition-summary';
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

export async function generateSummaryAction(formData: Omit<TransitionSummaryInput, 'mediaUrls'>, uploadedFiles: string[]): Promise<Summary> {
    
    const inputForFlow: TransitionSummaryInput = {
        ...formData,
        mediaUrls: uploadedFiles,
    };
    
    const result = await generateTransitionSummaryFlow(inputForFlow);
    
    const finalResult: Summary = {
        ...result,
        mediaUrls: uploadedFiles
    };

    return finalResult;
}


export async function getSignedUrlAction(fileName: string, contentType: string, userId: string) {
    return await getStorageUploadUrlFlow({ fileName, contentType, userId });
}
