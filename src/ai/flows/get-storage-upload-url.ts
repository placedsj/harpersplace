'use server';

import { defineFlow, action } from '@genkit-ai/flow';
import { z } from 'zod';
import * as admin from 'firebase-admin';

// Initialize Firebase Admin SDK if not already initialized
if (!admin.apps.length) {
  admin.initializeApp();
}

const storage = admin.storage();

const inputSchema = z.object({
    fileName: z.string(),
    contentType: z.string(),
    userId: z.string(),
});

const outputSchema = z.object({
    signedUrl: z.string(),
    publicUrl: z.string(),
});

export const getStorageUploadUrlFlow = defineFlow(
    {
        name: 'getStorageUploadUrlFlow',
        inputSchema,
        outputSchema,
    },
    async (input) => {
        return await action(
            { 
                name: 'generateSignedUrl', 
                inputSchema, 
                outputSchema 
            },
            async ({ fileName, contentType, userId }) => {
                const bucketName = process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET;
                if (!bucketName) {
                    throw new Error("Firebase Storage bucket name is not configured.");
                }
                const bucket = storage.bucket(bucketName);
                const filePath = `user-uploads/${userId}/${Date.now()}-${fileName}`;
                const file = bucket.file(filePath);

                const [signedUrl] = await file.getSignedUrl({
                    action: 'write',
                    expires: Date.now() + 15 * 60 * 1000, // 15 minutes
                    contentType,
                });

                const publicUrl = `https://storage.googleapis.com/${bucket.name}/${filePath}`;

                return { signedUrl, publicUrl };
            }
        )(input);
    }
);
