'use client';

import { useState, useEffect, useRef } from 'react';
import { getCountFromServer, Query, DocumentData, queryEqual } from 'firebase/firestore';

export function useCount(query: Query<DocumentData> | null) {
  const [count, setCount] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // Use a ref to store the stable query reference
  const queryRef = useRef<Query<DocumentData> | null>(query);

  // Update ref only if query has changed deeply
  if (typeof window !== 'undefined' && !isQueryEqual(query, queryRef.current)) {
    queryRef.current = query;
  }
  // On server, always use the current query
  if (typeof window === 'undefined') {
    queryRef.current = query;
  }

  const stableQuery = queryRef.current;

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
