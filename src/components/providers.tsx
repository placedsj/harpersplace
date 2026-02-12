
'use client';

import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '@/lib/queryClient';
import { FirebaseProvider } from '@/firebase';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <FirebaseProvider>
        {children}
      </FirebaseProvider>
    </QueryClientProvider>
  );
}
