'use client';

import {
  useState,
  useEffect,
  createContext,
  useContext,
  ReactNode,
} from 'react';
import { initializeFirebase, FirebaseServices } from './init';

const FirebaseClientContext = createContext<FirebaseServices | null>(null);

export function FirebaseClientProvider({ children }: { children: ReactNode }) {
  const [firebase, setFirebase] = useState<FirebaseServices | null>(null);

  useEffect(() => {
    const firebaseServices = initializeFirebase();
    setFirebase(firebaseServices);
  }, []);

  return (
    <FirebaseClientContext.Provider value={firebase}>
      {children}
    </FirebaseClientContext.Provider>
  );
}

export const useFirebaseClient = () => {
  return useContext(FirebaseClientContext);
};
