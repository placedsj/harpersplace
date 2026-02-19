'use client';

import * as React from 'react';
import Image from 'next/image';
import { format } from 'date-fns';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import type { JournalEntry } from '@/lib/journal-data';

interface JournalEntryCardProps {
  entry: JournalEntry;
}

export const JournalEntryCard = React.memo(function JournalEntryCard({ entry }: JournalEntryCardProps) {
  // Handle both Firestore Timestamp (production) and Date objects (mock/optimistic)
  const displayDate = React.useMemo(() => {
    if (!entry.date) return new Date();
    // @ts-ignore - handling runtime type difference between Timestamp and Date
    return (typeof entry.date.toDate === 'function' ? entry.date.toDate() : entry.date) as Date;
  }, [entry.date]);

  return (
    <Card className="overflow-hidden shadow-lg border-2 border-primary/40">
      <Image
        src={entry.image || 'https://picsum.photos/400/200'}
        data-ai-hint={entry.dataAiHint}
        alt={entry.title}
        width={400}
        height={200}
        className="object-cover w-full aspect-video"
      />
      <CardHeader>
        <CardTitle className="font-bebas uppercase text-primary tracking-widest">{entry.title.toUpperCase()}</CardTitle>
        <CardDescription className="font-montserrat text-accent">
          {format(displayDate, 'PPP')}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground font-montserrat">{entry.content}</p>
      </CardContent>
    </Card>
  );
});
