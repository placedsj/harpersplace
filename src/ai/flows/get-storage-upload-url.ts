
'use server';

import { ai } from '@/ai/genkit';
import { z } from 'zod';
import { getStorage } from 'firebase-admin/storage';
import * as admin from 'firebase-admin';

// Initialize Firebase Admin SDK if not already initialized
if (!admin.apps.length) {
    try {
        const serviceAccountString = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;
        if (!serviceAccountString) {
            throw new Error("FIREBASE_SERVICE_ACCOUNT_KEY environment variable is not set.");
        }
        const serviceAccount = JSON.parse(serviceAccountString);

        admin.initializeApp({
            credential: admin.credential.cert(serviceAccount),
            storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
        });
        console.log("Firebase Admin SDK initialized successfully for Storage.");
    } catch (error: any) {
        console.warn(`Firebase Admin SDK initialization failed: ${error.message}. File upload features will not be available.`);
    }
}

const inputSchema = z.object({
    fileName: z.string(),
    contentType: z.string(),
    userId: z.string(),
});

const outputSchema = z.object({
    signedUrl: z.string(),
    publicUrl: z.string(),
});

export const getStorageUploadUrlFlow = ai.defineFlow(
    {
        name: 'getStorageUploadUrlFlow',
        inputSchema,
        outputSchema,
    },
    async ({ fileName, contentType, userId }) => {
        if (!admin.apps.length) {
            throw new Error("Firebase Admin SDK not initialized. Cannot generate signed URL for file uploads.");
        }
        
        const bucket = getStorage().bucket();
        // Sanitize file name to prevent path traversal and other issues
        const safeFileName = fileName.replace(/[^a-zA-Z0-9._-]/g, '_');
        const filePath = `user-uploads/${userId}/${Date.now()}-${safeFileName}`;
        const file = bucket.file(filePath);

        const [signedUrl] = await file.getSignedUrl({
            version: 'v4',
            action: 'write',
            expires: Date.now() + 15 * 60 * 1000, // 15 minutes
            contentType,
        });

        const publicUrl = `https://storage.googleapis.com/${bucket.name}/${filePath}`;

        return { signedUrl, publicUrl };
    }
);
