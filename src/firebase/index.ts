import { getApps, initializeApp, getApp, FirebaseApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';
import { getStorage, FirebaseStorage } from 'firebase/storage';
import { firebaseConfig, isFirebaseConfigured } from './config';
import { useCollection } from './firestore/use-collection';
import { useDoc } from './firestore/use-doc';
import {
  FirebaseProvider,
  useFirebase,
  useFirebaseAuthService,
  useFirestore,
  useStorage,
} from './provider';
import { FirebaseClientProvider } from './client-provider';

export interface FirebaseServices {
  app: FirebaseApp | null;
  auth: Auth | null;
  db: Firestore | null;
  storage: FirebaseStorage | null;
}

export function initializeFirebase(): FirebaseServices {
  // If Firebase is not configured, return null services (demo mode)
  if (!isFirebaseConfigured) {
    console.warn('Firebase is not configured. Running in demo mode. Add your Firebase credentials to .env.local');
    return { app: null, auth: null, db: null, storage: null };
  }

  try {
    const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
    const auth = getAuth(app);
    const db = getFirestore(app);
    const storage = getStorage(app);
    return { app, auth, db, storage };
  } catch (error) {
    console.error('Failed to initialize Firebase:', error);
    return { app: null, auth: null, db: null, storage: null };
  }
}

// Hooks and providers
export {
  FirebaseProvider,
  FirebaseClientProvider,
  useFirebase,
  useFirebaseAuthService,
  useFirestore,
  useStorage,
  useCollection,
  useDoc,
};
