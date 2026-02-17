'use client';

import React, { memo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from 'date-fns';
import { EvidenceEvent } from '@/lib/types';

interface EvidenceListProps {
    events: EvidenceEvent[] | null;
    loading: boolean;
}

export const EvidenceList = memo(({ events, loading }: EvidenceListProps) => {
    return (
        <div className="space-y-4">
            {loading && <Card><CardContent className="text-center text-muted-foreground py-8">Loading events...</CardContent></Card>}
            {!loading && events && events.length === 0 && <Card><CardContent className="text-center text-muted-foreground py-8">No events logged yet.</CardContent></Card>}
            {events && events.map(event => (
                <Card key={event.id}>
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
                        {event.partiesInvolved && <p className="mt-2 text-sm"><strong>Parties Involved:</strong> {event.partiesInvolved}</p>}
                        {event.response && <p className="mt-2 text-sm"><strong>Your Response:</strong> {event.response}</p>}
                    </CardContent>
                </Card>
            ))}
        </div>
    );
});

EvidenceList.displayName = 'EvidenceList';
