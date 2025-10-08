import { getApps, initializeApp, getApp, FirebaseApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';
import { firebaseConfig } from './config';
import { useCollection } from './firestore/use-collection';
import { useDoc } from './firestore/use-doc';
import { useUser } from './auth/use-user';
import {
  FirebaseProvider,
  useFirebase,
  useAuth as useFirebaseAuth,
  useFirestore,
} from './provider';
import { FirebaseClientProvider } from './client-provider';

export interface FirebaseServices {
  app: FirebaseApp;
  auth: Auth;
  db: Firestore;
}

export function initializeFirebase(): FirebaseServices {
  const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
  const auth = getAuth(app);
  const db = getFirestore(app);
  return { app, auth, db };
}

// Hooks and providers
export {
  FirebaseProvider,
  FirebaseClientProvider,
  useFirebase,
  useFirebaseAuth,
  useFirestore,
  useCollection,
  useDoc,
  useUser,
};
