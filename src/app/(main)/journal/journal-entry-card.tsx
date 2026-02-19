'use client';

import * as React from 'react';
import Image from 'next/image';
import { format } from 'date-fns';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import type { JournalEntry } from '@/lib/journal-data';

interface JournalEntryCardProps {
  entry: JournalEntry;
}

const JournalEntryCard = React.memo(({ entry }: JournalEntryCardProps) => {
  // Safe date handling: Check for Firestore Timestamp or fallback to Date
  const date = entry.date && typeof (entry.date as any).toDate === 'function'
    ? (entry.date as any).toDate()
    : (entry.date as unknown as Date) || new Date();

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
        <CardTitle className="font-bebas uppercase text-primary tracking-widest">
          {entry.title.toUpperCase()}
        </CardTitle>
        <CardDescription className="font-montserrat text-accent">
          {format(date, 'PPP')}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground font-montserrat">{entry.content}</p>
      </CardContent>
    </Card>
  );
});

JournalEntryCard.displayName = 'JournalEntryCard';

export { JournalEntryCard };
