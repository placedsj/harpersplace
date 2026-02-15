// src/firebase/init.ts
import { getApps, initializeApp, getApp, FirebaseApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';
import { firebaseConfig, isFirebaseConfigured } from './config';

export interface FirebaseServices {
  app: FirebaseApp | null;
  auth: Auth | null;
  db: Firestore | null;
}

export function initializeFirebase(): FirebaseServices {
  // If Firebase is not configured, return null services (demo mode)
  if (!isFirebaseConfigured) {
    console.warn('Firebase is not configured. Running in demo mode. Add your Firebase credentials to .env.local');
    return { app: null, auth: null, db: null };
  }

  try {
    const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
    const auth = getAuth(app);
    const db = getFirestore(app);
    return { app, auth, db };
  } catch (error) {
    console.error('Failed to initialize Firebase:', error);
    return { app: null, auth: null, db: null };
  }
}
