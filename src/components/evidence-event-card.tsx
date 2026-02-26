'use client';

import React, { memo } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { format } from 'date-fns';
import { Timestamp } from 'firebase/firestore';

export interface EvidenceEvent {
  id: string;
  eventDate: string;
  category: string;
  description: string;
  partiesInvolved?: string;
  response?: string;
  yourResponse?: string; // Adding this to handle potential data mismatch
  loggedBy: string;
  userId: string;
  timestamp?: Timestamp;
}

interface EvidenceEventCardProps {
  event: EvidenceEvent;
}

export const EvidenceEventCard = memo(({ event }: EvidenceEventCardProps) => {
  const responseText = event.response || event.yourResponse;

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg">{event.category}</CardTitle>
            <div className="text-xs text-muted-foreground flex items-center gap-2 mt-1">
              <span>{format(new Date(event.eventDate.replace(/-/g, '/')), 'MMMM do, yyyy')}</span>
              {event.timestamp?.toDate && (
                <>
                  <span>&bull;</span>
                  <span>Logged at {format(event.timestamp.toDate(), 'p')}</span>
                </>
              )}
              <span>&bull;</span>
              <span>by {event.loggedBy}</span>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <p>{event.description}</p>
        {event.partiesInvolved && (
          <p className="mt-2 text-sm">
            <strong>Parties Involved:</strong> {event.partiesInvolved}
          </p>
        )}
        {responseText && (
          <p className="mt-2 text-sm">
            <strong>Your Response:</strong> {responseText}
          </p>
        )}
      </CardContent>
    </Card>
  );
});

EvidenceEventCard.displayName = 'EvidenceEventCard';
