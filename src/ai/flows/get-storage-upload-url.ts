
'use server';

import { ai } from '@/ai/genkit';
import { z } from 'zod';
import { getStorage, getSignedUrl } from 'firebase-admin/storage';
import * as admin from 'firebase-admin';


// Check for the environment variable, which should contain the JSON string
// This is a placeholder for a more secure secret management strategy
const serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT_KEY
  ? JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY)
  : null;

// Initialize Firebase Admin SDK if not already initialized
if (!admin.apps.length && serviceAccount) {
    try {
        admin.initializeApp({
            credential: admin.credential.cert(serviceAccount),
            storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
        });
        console.log("Firebase Admin SDK initialized successfully for Storage.");
    } catch (error) {
        console.error("Error initializing Firebase Admin SDK for Storage:", error);
    }
} else if (!serviceAccount) {
    console.warn("FIREBASE_SERVICE_ACCOUNT_KEY is not set. File upload features will not work.");
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
            throw new Error("Firebase Admin SDK not initialized. Cannot generate signed URL.");
        }
        
        const bucket = getStorage().bucket();
        const filePath = `user-uploads/${userId}/${Date.now()}-${fileName}`;
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
