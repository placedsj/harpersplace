'use client';
import { useState, useEffect, useRef } from 'react';
import { onSnapshot, Query, DocumentData, QuerySnapshot, queryEqual } from 'firebase/firestore';

export type WithId<T> = T & { id: string };

export function useCollection<T>(query: Query<DocumentData> | null) {
  const [data, setData] = useState<WithId<T>[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // Use a ref to store the stable query object
  const queryRef = useRef<Query<DocumentData> | null>(null);

  // Effect to handle query updates and subscription
  useEffect(() => {
    // If the new query is null, clear state and stop listening
    if (!query) {
      queryRef.current = null;
      setData(null);
      setLoading(false);
      return;
    }

    // Check if the query is logically equal to the stored one
    // If it is, do nothing (preserve the existing subscription)
    if (queryRef.current && queryEqual(query, queryRef.current)) {
      return;
    }

    // Update the stored query reference
    queryRef.current = query;
    
    setLoading(true);

    const unsubscribe = onSnapshot(
      query,
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
  }, [query]); // Re-run if the query object reference changes (or other dependencies)

  return { data, loading, error };
}
