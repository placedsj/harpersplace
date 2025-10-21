/**
 * Environment variable validation for Harper's Place
 * Ensures all required configuration is present and valid
 */

import { z } from 'zod';

const envSchema = z.object({
  // Firebase Configuration
  NEXT_PUBLIC_FIREBASE_API_KEY: z.string().min(1, 'Firebase API key is required'),
  NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN: z.string().min(1, 'Firebase auth domain is required'),
  NEXT_PUBLIC_FIREBASE_PROJECT_ID: z.string().min(1, 'Firebase project ID is required'),
  NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET: z.string().min(1, 'Firebase storage bucket is required'),
  NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID: z.string().min(1, 'Firebase messaging sender ID is required'),
  NEXT_PUBLIC_FIREBASE_APP_ID: z.string().min(1, 'Firebase app ID is required'),
  
  // Optional Gemini API for AI features
  GEMINI_API_KEY: z.string().optional(),
  
  // Node environment
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
});

export type Env = z.infer<typeof envSchema>;

/**
 * Validates environment variables at startup
 * @throws {Error} If validation fails
 */
export function validateEnv(): Env {
  try {
    const env = envSchema.parse(process.env);
    return env;
  } catch (error) {
    if (error instanceof z.ZodError) {
      const missing = error.errors.map(e => e.path.join('.')).join(', ');
      console.error('❌ Environment validation failed!');
      console.error('Missing or invalid environment variables:', missing);
      console.error('\nPlease check your .env file and ensure all required variables are set.');
      throw new Error(`Environment validation failed: ${missing}`);
    }
    throw error;
  }
}

/**
 * Check if required environment variables are set (for runtime checks)
 */
export function isEnvConfigured(): boolean {
  try {
    validateEnv();
    return true;
  } catch {
    return false;
  }
}
