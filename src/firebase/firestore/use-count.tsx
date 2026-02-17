'use client';

import { useState, useEffect } from 'react';
import { getCountFromServer, Query, DocumentData } from 'firebase/firestore';
import { useStableQuery } from './use-stable-query';

export function useCount(query: Query<DocumentData> | null) {
  const [count, setCount] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const stableQuery = useStableQuery(query);

  useEffect(() => {
    if (!stableQuery) {
      setCount(null);
      setLoading(false);
      return;
    }

    const fetchCount = async () => {
      setLoading(true);
      try {
        const snapshot = await getCountFromServer(stableQuery);
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
  }, [stableQuery]);

  return { count, loading, error };
}
