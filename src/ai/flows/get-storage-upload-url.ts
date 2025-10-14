'''
import { defineFlow, action } from '@genkit-ai/flow';
import { z } from 'zod';
import * as admin from 'firebase-admin';
import { getApp, getApps, initializeApp } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';

// Initialize Firebase Admin SDK if not already initialized
if (!getApps().length) {
  initializeApp();
}

const bucketName = process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET;

// 1. Define the input schema
const inputSchema = z.object({
  fileName: z.string().describe("The name of the file to be uploaded."),
  contentType: z.string().describe("The MIME type of the file (e.g., 'image/png')."),
  userId: z.string().describe("The UID of the user uploading the file.")
});

// 2. Define the output schema
const outputSchema = z.object({
  signedUrl: z.string().describe("A secure, short-lived URL to which the client can upload the file."),
  publicUrl: z.string().describe("The permanent public URL of the file after upload.")
});

// 3. Define the Genkit flow
export const getStorageUploadUrlFlow = defineFlow(
  {
    name: 'getStorageUploadUrlFlow',
    inputSchema,
    outputSchema,
    authPolicy: (auth, input) => {
      // Enforce that the user ID in the token matches the user ID in the input
      if (!auth) {
          throw new Error("Authorization required.");
      }
      if (auth.uid !== input.userId) {
          throw new Error("User ID does not match authenticated user.");
      }
    },
  },
  async (input) => {
    if (!bucketName) {
        throw new Error('Firebase Storage bucket name is not configured. Please set NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET environment variable.');
    }

    const { fileName, contentType, userId } = input;
    const bucket = admin.storage().bucket(bucketName);

    const safeFileName = fileName.replace(/[^a-zA-Z0-9._-]/g, '_');
    const filePath = `transition-summaries/${userId}/${Date.now()}-${safeFileName}`;
    const file = bucket.file(filePath);

    // 4. Generate a signed URL for PUT request
    const [signedUrl] = await file.getSignedUrl({
      version: 'v4',
      action: 'write',
      expires: Date.now() + 15 * 60 * 1000, // 15 minutes
      contentType: contentType,
    });

    // 5. Construct the public URL
    const publicUrl = `https://storage.googleapis.com/${bucket.name}/${filePath}`;

    return { signedUrl, publicUrl };
  }
);
'''