'use client';
import { useState, useEffect, useRef } from 'react';
import { onSnapshot, Query, DocumentData, QuerySnapshot } from 'firebase/firestore';

export type WithId<T> = T & { id: string };

export function useCollection<T>(query: Query<DocumentData> | null) {
  const [data, setData] = useState<WithId<T>[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const queryRef = useRef(query);

  useEffect(() => {
    // Prevent re-running the effect if the query object itself is just a new instance
    // but logically the same. A better implementation might involve deep-comparing queries.
    // For now, we'll assume developers will use useMemo for dynamic queries.
    if (queryRef.current === query) {
      return;
    }
    queryRef.current = query;

    if (!query) {
      setData([]);
      setLoading(false);
      return;
    }
    
    // Set loading to true when a new query is provided
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
        console.error(err);
        setError(err);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [query]);

  return { data, loading, error };
}
