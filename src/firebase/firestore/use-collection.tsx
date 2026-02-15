'use client';
import { useState, useEffect, useRef } from 'react';
import { onSnapshot, Query, DocumentData, QuerySnapshot, queryEqual } from 'firebase/firestore';

export type WithId<T> = T & { id: string };

export function useCollection<T>(query: Query<DocumentData> | null) {
  const [data, setData] = useState<WithId<T>[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // Use a ref to store the stable query object
  const queryRef = useRef<Query<DocumentData> | null>(query);

  // Update the ref only if the query has logically changed
  // If we have both, check equality. If different, update.
  if (query && queryRef.current && !queryEqual(query, queryRef.current)) {
    queryRef.current = query;
  }
  // If we went from no query to a query, update.
  else if (query && !queryRef.current) {
    queryRef.current = query;
  }
  // If we went from query to no query, update.
  else if (!query && queryRef.current) {
    queryRef.current = null;
  }

  // Use the stable ref in the effect dependency array.
  // This ensures we only re-subscribe when the query logically changes.
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
