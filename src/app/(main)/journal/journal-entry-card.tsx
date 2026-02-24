// src/app/(main)/journal/journal-entry-card.tsx
'use client';

import React, { memo } from 'react';
import { format } from 'date-fns';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Image from 'next/image';
import type { JournalEntry } from '@/lib/journal-data';

interface JournalEntryCardProps {
  entry: JournalEntry;
}

const JournalEntryCard = ({ entry }: JournalEntryCardProps) => {
    // Safely handle date conversion (Firestore Timestamp vs Date object)
    // We cast to any to handle both Timestamp (from Firestore) and Date (from mock data)
    // avoiding TypeScript errors about Timestamp not being assignable to Date constructor.
    const dateValue = entry.date as any;
    const dateObj = typeof dateValue?.toDate === 'function'
        ? dateValue.toDate()
        : new Date(dateValue);

    return (
        <Card className="overflow-hidden shadow-lg border-2 border-primary/40">
             <Image src={entry.image || 'https://picsum.photos/400/200'} data-ai-hint={entry.dataAiHint} alt={entry.title} width={400} height={200} className="object-cover w-full aspect-video" />
            <CardHeader>
              <CardTitle className="font-bebas uppercase text-primary tracking-widest">{entry.title.toUpperCase()}</CardTitle>
              <CardDescription className="font-montserrat text-accent">{format(dateObj, 'PPP')}</CardDescription>
            </CardHeader>
            <CardContent>
                <p className="text-muted-foreground font-montserrat">{entry.content}</p>
            </CardContent>
        </Card>
    );
};

export default memo(JournalEntryCard);
