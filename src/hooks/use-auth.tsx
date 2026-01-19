// src/hooks/use-auth.tsx
'use client';

import { createContext, useContext, ReactNode, useState, useEffect } from 'react';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut,
  updateProfile,
  onAuthStateChanged,
  User
} from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { doc, setDoc } from 'firebase/firestore';
import { useFirebase } from '@/firebase';

type AuthContextType = {
  user: User | null;
  loading: boolean;
  signUp: (firstName: string, lastName: string, email: string, password: string) => Promise<any>;
  logIn: (email: string, password: string) => Promise<any>;
  logOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const { auth, db } = useFirebase();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!auth) {
        setLoading(false);
        return;
    }
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [auth]);

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
    user,
    loading,
    signUp,
    logIn,
    logOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
