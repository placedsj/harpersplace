'use client';
import { useState, useEffect, useRef } from 'react';
import { onSnapshot, Query, DocumentData, QuerySnapshot, queryEqual } from 'firebase/firestore';

export type WithId<T> = T & { id: string };

function useStableQuery(query: Query<DocumentData> | null) {
  const queryRef = useRef<Query<DocumentData> | null>(null);

  // Update ref only if query has changed deeply
  // Case 1: One is null and the other isn't
  if ((query === null) !== (queryRef.current === null)) {
    queryRef.current = query;
  }
  // Case 2: Both are non-null but not equal
  else if (query && queryRef.current && !queryEqual(query, queryRef.current)) {
    queryRef.current = query;
  }
  // Case 3: Both null or equal -> keep existing ref

  return queryRef.current;
}

export function useCollection<T>(query: Query<DocumentData> | null) {
  const [data, setData] = useState<WithId<T>[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const stableQuery = useStableQuery(query);

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
