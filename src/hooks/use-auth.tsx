// src/hooks/use-auth.tsx
'use client';

import { createContext, useContext, ReactNode } from 'react';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut,
  updateProfile
} from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { doc, setDoc } from 'firebase/firestore';
import { useUser, useFirebase } from '@/firebase';

type AuthMethodsType = {
  signUp: (firstName: string, lastName: string, email: string, password: string) => Promise<any>;
  logIn: (email: string, password: string) => Promise<any>;
  logOut: () => Promise<void>;
};

const AuthContext = createContext<AuthMethodsType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const { auth, db } = useFirebase();

  const signUp = async (firstName: string, lastName: string, email: string, password: string) => {
    if (!auth || !db) throw new Error("Firebase not initialized");
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const currentUser = userCredential.user;
    
    await updateProfile(currentUser, {
        displayName: `${firstName} ${lastName}`
    });

    // Create a user document in Firestore
    await setDoc(doc(db, "users", currentUser.uid), {
        uid: currentUser.uid,
        displayName: `${firstName} ${lastName}`,
        email: currentUser.email,
        createdAt: new Date(),
    });

    router.push('/dashboard');
    return userCredential;
  };

  const logIn = async (email: string, password: string) => {
    if (!auth) throw new Error("Firebase not initialized");
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    router.push('/dashboard');
    return userCredential;
  };

  const logOut = async () => {
    if (!auth) throw new Error("Firebase not initialized");
    await signOut(auth);
    router.push('/login');
  };

  const value = {
    signUp,
    logIn,
    logOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
  const userContext = useUser();
  const context = useContext(AuthContext);
  if (context === undefined || userContext === undefined) {
    throw new Error('useAuth must be used within an AuthProvider and FirebaseProvider');
  }
  return { ...userContext, ...context };
};
