'use client';
import { useEffect, useState, createContext, useContext, ReactNode } from 'react';
import { onAuthStateChanged, User, Auth } from 'firebase/auth';

export type AuthContextType = {
  user: User | null;
  loading: boolean;
};

const UserContext = createContext<AuthContextType | undefined>(undefined);

export const UserProvider = ({ children, auth }: { children: ReactNode; auth: Auth | null }) => {
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

  return (
    <UserContext.Provider value={{ user, loading }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
    const context = useContext(UserContext);
    if (context === undefined) {
        throw new Error('useUser must be used within a UserProvider');
    }
    return context;
};
