'use client';

import { useState, useEffect, useRef } from 'react';
import { getCountFromServer, Query, DocumentData, queryEqual } from 'firebase/firestore';

export function useCount(query: Query<DocumentData> | null) {
  const [count, setCount] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // Use a ref to store the previous query object for comparison
  const queryRef = useRef<Query<DocumentData> | null>(null);

  useEffect(() => {
    if (!query) {
      queryRef.current = null;
      setCount(null);
      setLoading(false);
      return;
    }

    // If the query is equal to the previous one, don't refetch
    if (queryRef.current && queryEqual(query, queryRef.current)) {
      return;
    }

    queryRef.current = query;

    const fetchCount = async () => {
      setLoading(true);
      try {
        const snapshot = await getCountFromServer(query);
        setCount(snapshot.data().count);
        setError(null);
      } catch (err) {
        console.error("useCount error:", err);
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    };

    fetchCount();
  }, [query]);

  return { count, loading, error };
}
