'use client';

import { useRef } from 'react';
import { Query, DocumentData, queryEqual } from 'firebase/firestore';

export function useStableQuery<T = DocumentData>(query: Query<T> | null): Query<T> | null {
  const queryRef = useRef<Query<T> | null>(query);

  // Compare the new query with the stored ref
  if (!isQueryEqual(query, queryRef.current)) {
    queryRef.current = query;
  }

  return queryRef.current;
}

function isQueryEqual<T>(a: Query<T> | null, b: Query<T> | null): boolean {
  if (a === b) return true;
  if (!a || !b) return false;
  return queryEqual(a, b);
}
