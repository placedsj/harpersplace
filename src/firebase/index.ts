import {
  FirebaseProvider,
  useFirebase,
  useAuth as useFirebaseAuth,
  useFirestore,
} from './provider';
import { FirebaseClientProvider } from './client-provider';
import { initializeFirebase, type FirebaseServices } from './init';
import { useCollection } from './firestore/use-collection';
import { useCount } from './firestore/use-count';
import { useDoc } from './firestore/use-doc';
import { useUser } from './auth/use-user';

export {
  initializeFirebase,
  FirebaseProvider,
  FirebaseClientProvider,
  useFirebase,
  useFirebaseAuth,
  useFirestore,
  useCollection,
  useCount,
  useDoc,
  useUser,
  type FirebaseServices
};
