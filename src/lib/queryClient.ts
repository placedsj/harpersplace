'use client';

import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000,
      refetchOnWindowFocus: false,
    },
  },
});

export async function apiRequest(endpoint: string, options?: RequestInit) {
  const response = await fetch(endpoint, {
    credentials: 'include',
    ...options,
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`${response.status}: ${text || response.statusText}`);
  }

  return response.json();
}
