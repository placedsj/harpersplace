'use client';
import { useState, useEffect, useRef } from 'react';
import { onSnapshot, Query, DocumentData, QuerySnapshot, queryEqual } from 'firebase/firestore';

export type WithId<T> = T & { id: string };

export function useCollection<T>(query: Query<DocumentData> | null) {
  const [data, setData] = useState<WithId<T>[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // Use a ref to store the stable query reference
  const queryRef = useRef<Query<DocumentData> | null>(query);

  // Update ref only if query has changed deeply
  if (typeof window !== 'undefined' && !isQueryEqual(query, queryRef.current)) {
    queryRef.current = query;
  }
  // On server, always use the current query to avoid hydration mismatch if possible,
  // though effects don't run on server.
  if (typeof window === 'undefined') {
    queryRef.current = query;
  }

  const stableQuery = queryRef.current;

  useEffect(() => {
    if (!stableQuery) {
      setData(null);
      setLoading(false);
      return;
    }
    
    setLoading(true);

    const unsubscribe = onSnapshot(
      stableQuery,
      (snapshot: QuerySnapshot<DocumentData>) => {
        const result: WithId<T>[] = [];
        snapshot.forEach((doc) => {
          result.push({ id: doc.id, ...doc.data({ serverTimestamps: 'estimate' }) } as WithId<T>);
        });
        setData(result);
        setLoading(false);
        setError(null);
      },
      (err) => {
        console.error("useCollection error:", err);
        setError(err);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [stableQuery]);

  return { data, loading, error };
}

function isQueryEqual<T>(a: Query<T> | null, b: Query<T> | null): boolean {
  if (a === b) return true;
  if (!a || !b) return false;
  try {
    return queryEqual(a, b);
  } catch (error) {
    console.warn('Error comparing queries:', error);
    return false;
  }
}
