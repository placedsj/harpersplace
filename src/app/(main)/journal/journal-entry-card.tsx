'use client';

import { memo } from 'react';
import { format } from 'date-fns';
import Image from 'next/image';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import type { JournalEntry } from '@/lib/journal-data';

interface JournalEntryCardProps {
  entry: JournalEntry;
}

const JournalEntryCardComponent = ({ entry }: JournalEntryCardProps) => {
  // Handle cases where date might not be a Firestore Timestamp (e.g. from mock data)
  const dateObj = entry.date && typeof entry.date.toDate === 'function'
    ? entry.date.toDate()
    : (entry.date as unknown as Date) || new Date();

  return (
    <Card className="overflow-hidden shadow-lg border-2 border-primary/40 h-full flex flex-col">
      <div className="relative w-full aspect-video">
        <Image
          src={entry.image || 'https://picsum.photos/400/200'}
          alt={entry.title}
          width={400}
          height={200}
          className="object-cover w-full h-full"
          data-ai-hint={entry.dataAiHint}
        />
      </div>
      <CardHeader>
        <CardTitle className="font-bebas uppercase text-primary tracking-widest line-clamp-1">
          {entry.title.toUpperCase()}
        </CardTitle>
        <CardDescription className="font-montserrat text-accent">
          {format(dateObj, 'PPP')}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-grow">
        <p className="text-muted-foreground font-montserrat line-clamp-3">
          {entry.content}
        </p>
      </CardContent>
    </Card>
  );
};

// ⚡ Bolt Optimization: Memoize the card component to prevent unnecessary re-renders
// when parent component updates or during list operations.
export const JournalEntryCard = memo(JournalEntryCardComponent);

// ⚡ Bolt Optimization: Skeleton component to reduce Cumulative Layout Shift (CLS)
// and improve Perceived Performance by showing layout structure during data fetching.
export const JournalEntrySkeleton = () => {
  return (
    <Card className="overflow-hidden shadow-lg border-2 border-primary/10 h-full flex flex-col">
      <Skeleton className="w-full aspect-video rounded-none" />
      <CardHeader className="space-y-2">
        <Skeleton className="h-6 w-3/4" />
        <Skeleton className="h-4 w-1/3" />
      </CardHeader>
      <CardContent className="space-y-2 flex-grow">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-2/3" />
      </CardContent>
    </Card>
  );
};
