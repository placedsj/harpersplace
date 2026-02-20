'use client';
import { useState, useEffect, useRef } from 'react';
import { onSnapshot, Query, DocumentData, QuerySnapshot, queryEqual } from 'firebase/firestore';

export type WithId<T> = T & { id: string };

export function useCollection<T>(query: Query<DocumentData> | null) {
  const [data, setData] = useState<WithId<T>[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // Memoize query to prevent unnecessary re-subscriptions and JSON serialization overhead
  const queryRef = useRef<Query<DocumentData> | null>(query);

  // Update ref only if query has actually changed (deep equality check)
  // This allows us to pass a stable reference to useEffect even if the query object identity changes
  if (!queryEqualWithNullCheck(query, queryRef.current)) {
    queryRef.current = query;
  }

  const memoizedQuery = queryRef.current;

  useEffect(() => {
    if (!memoizedQuery) {
      setData(null);
      setLoading(false);
      return;
    }
    
    setLoading(true);

    const unsubscribe = onSnapshot(
      memoizedQuery,
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
  }, [memoizedQuery]);

  return { data, loading, error };
}

function queryEqualWithNullCheck(a: Query<DocumentData> | null, b: Query<DocumentData> | null): boolean {
  if (a === b) return true;
  if (!a || !b) return false;
  return queryEqual(a, b);
}
