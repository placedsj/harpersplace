'use server';

import { z } from 'zod';
import { ai } from '@/ai/genkit';
import * as admin from 'firebase-admin';

// Initialize Firebase Admin SDK lazily
function getAdminStorage() {
  const adminCredentialsString = process.env.FIREBASE_ADMIN_CREDENTIALS;

  if (!adminCredentialsString) {
    console.error("FATAL: FIREBASE_ADMIN_CREDENTIALS environment variable is not set.");
    throw new Error("Admin credentials missing. Cannot initialize Firebase Admin SDK.");
  }

  if (!admin.apps.length) {
    try {
      const credentials = JSON.parse(adminCredentialsString);
      admin.initializeApp({
        credential: admin.credential.cert(credentials)
      });
      console.log("Firebase Admin SDK initialized successfully.");
    } catch (error) {
      console.error("Error initializing Firebase Admin SDK:", error);
      throw new Error("Failed to parse or initialize Firebase Admin SDK.");
    }
  }

  return admin.storage();
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
        const storage = getAdminStorage();

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
);
