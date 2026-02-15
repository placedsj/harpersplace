import { useCollection } from './firestore/use-collection';
import { useCount } from './firestore/use-count';
import { useDoc } from './firestore/use-doc';
import { useUser } from './auth/use-user';
import {
  FirebaseProvider,
  useFirebase,
  useAuth as useFirebaseAuth,
  useFirestore,
} from './provider';
import { FirebaseClientProvider } from './client-provider';
import { initializeFirebase, FirebaseServices } from './init';

// Hooks and providers
export type { FirebaseServices };
export { initializeFirebase };
export {
  FirebaseProvider,
  FirebaseClientProvider,
  useFirebase,
  useFirebaseAuth,
  useFirestore,
  useCollection,
  useCount,
  useDoc,
  useUser,
};
