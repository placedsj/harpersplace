'use client';

import { ReactNode, createContext, useContext } from 'react';
import { FirebaseApp } from 'firebase/app';
import { Auth } from 'firebase/auth';
import { Firestore } from 'firebase/firestore';
import { FirebaseClientProvider, useFirebaseClient } from './client-provider';
import { UserProvider } from './auth/use-user';

export interface FirebaseContextValue {
  app: FirebaseApp | null;
  auth: Auth | null;
  db: Firestore | null;
}

const FirebaseContext = createContext<FirebaseContextValue | undefined>(
  undefined
);

export function FirebaseProvider({ children }: { children: ReactNode }) {
  return (
    <FirebaseClientProvider>
      <FirebaseServicesProvider>{children}</FirebaseServicesProvider>
    </FirebaseClientProvider>
  );
}

function FirebaseServicesProvider({ children }: { children: ReactNode }) {
  const firebaseServices = useFirebaseClient();
  const contextValue: FirebaseContextValue = {
    app: firebaseServices?.app || null,
    auth: firebaseServices?.auth || null,
    db: firebaseServices?.db || null,
  };

  return (
    <FirebaseContext.Provider value={contextValue}>
        <UserProvider auth={contextValue.auth}>
            {children}
        </UserProvider>
    </FirebaseContext.Provider>
  );
}


export const useFirebase = () => {
  const context = useContext(FirebaseContext);
  if (context === undefined) {
    throw new Error('useFirebase must be used within a FirebaseProvider');
  }
  return context;
};

export const useAuth = () => {
  const context = useContext(FirebaseContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within a FirebaseProvider');
  }
  return { auth: context.auth };
};

export const useFirestore = () => {
  const context = useContext(FirebaseContext);
  if (context === undefined) {
    throw new Error('useFirestore must be used within a FirebaseProvider');
  }
  return { db: context.db };
};
