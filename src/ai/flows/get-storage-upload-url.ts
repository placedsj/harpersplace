'use server';

import { defineFlow, action } from '@genkit-ai/flow';
import { z } from 'zod';
import * as admin from 'firebase-admin';

// Check for the environment variable, which should contain the JSON string
const adminCredentialsString = process.env.FIREBASE_ADMIN_CREDENTIALS;

if (!adminCredentialsString) {
  // CRITICAL: Fail fast if the secret is missing.
  console.error("FATAL: FIREBASE_ADMIN_CREDENTIALS environment variable is not set.");
  // Throwing an error prevents server code from running without credentials.
  throw new Error("Admin credentials missing. Cannot initialize Firebase Admin SDK.");
}

// Check if an Admin SDK instance has already been initialized (prevents re-initialization errors in Next.js/serverless)
if (!admin.apps.length) {
  try {
    // 1. Parse the JSON string from the Replit secret into an object
    const credentials = JSON.parse(adminCredentialsString);
    
    // 2. Initialize the Admin SDK using the Certificate (private key)
    admin.initializeApp({
      credential: admin.credential.cert(credentials)
    });
    
    console.log("Firebase Admin SDK initialized successfully.");

  } catch (error) {
    console.error("Error initializing Firebase Admin SDK:", error);
    throw new Error("Failed to parse or initialize Firebase Admin SDK.");
  }
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
