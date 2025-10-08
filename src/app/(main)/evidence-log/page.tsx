// src/app/(main)/evidence-log/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { db } from '@/lib/firebase';
import { collection, addDoc, query, orderBy, onSnapshot, serverTimestamp } from 'firebase/firestore';
import { format } from 'date-fns';
import { useAuth } from '@/hooks/use-auth';
import { useToast } from '@/hooks/use-toast';
import { Loader2, CalendarIcon } from 'lucide-react';

const logSchema = z.object({
  eventDate: z.string().min(1, 'Date is required.'),
  category: z.string().min(1, 'Category is required.'),
  description: z.string().min(1, 'Description is required.'),
  partiesInvolved: z.string().optional(),
  yourResponse: z.string().optional(),
});

type LogFormValues = z.infer<typeof logSchema>;

interface Event {
    id: string;
    eventDate: string;
    category: string;
    description: string;
    partiesInvolved?: string;
    response?: string;
    loggedBy: string;
    timestamp?: {
        toDate: () => Date;
    };
}


function EvidenceLogPageInternal() {
    const { user } = useAuth();
    const { toast } = useToast();
    const searchParams = useSearchParams();

    const [events, setEvents] = useState<Event[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    const form = useForm<LogFormValues>({
        resolver: zodResolver(logSchema),
        defaultValues: {
            eventDate: format(new Date(), 'yyyy-MM-dd'),
            category: searchParams.get('category') || 'Communication',
            description: searchParams.get('description') || '',
            partiesInvolved: '',
            yourResponse: '',
        },
    });
     
    useEffect(() => {
        // This effect updates the form if the query params change after initial load.
        form.reset({
            eventDate: format(new Date(), 'yyyy-MM-dd'),
            category: searchParams.get('category') || 'Communication',
            description: searchParams.get('description') || searchParams.get('evidence') || '',
            partiesInvolved: '',
            yourResponse: '',
        })
    }, [searchParams, form]);


    useEffect(() => {
        if (!user) return;
        const evidenceCollectionRef = collection(db, `users/${user.uid}/evidence`);
        const q = query(evidenceCollectionRef, orderBy('timestamp', 'desc'));
        
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const eventsData: Event[] = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...(doc.data() as Omit<Event, 'id'>),
            }));
            setEvents(eventsData);
        });

        return () => unsubscribe();
    }, [user]);

    const handleLogEvent = async (values: LogFormValues) => {
        if (!user) {
            toast({
                variant: 'destructive',
                title: 'Not authenticated',
                description: 'You must be logged in to log an event.',
            });
            return;
        }

        setIsLoading(true);

        try {
            const evidenceCollectionRef = collection(db, `users/${user.uid}/evidence`);
            await addDoc(evidenceCollectionRef, {
                ...values,
                loggedBy: user.displayName || 'Unknown User',
                userId: user.uid,
                timestamp: serverTimestamp()
            });
            toast({
                title: 'Event Logged',
                description: 'Your event has been securely saved.',
            });
            form.reset({
                eventDate: format(new Date(), 'yyyy-MM-dd'),
                category: 'Communication',
                description: '',
                partiesInvolved: '',
                yourResponse: '',
            });
        } catch (error) {
            console.error("Error adding document: ", error);
            toast({
                variant: 'destructive',
                title: 'Error',
                description: 'There was a problem logging your event.',
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
    <div className="main-content">
        <div className="page-header">
            <h1>EVIDENCE LOG</h1>
            <p>A secure and chronological record of co-parenting events</p>
        </div>

        <div className="evidence-container">
            <Card className="log-new-event">
                <CardHeader>
                    <CardTitle as="h2">Log New Event</CardTitle>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(handleLogEvent)} className="space-y-6">
                             <FormField
                                control={form.control}
                                name="eventDate"
                                render={({ field }) => (
                                    <FormItem className="form-group">
                                        <FormLabel>Date of Event</FormLabel>
                                         <div className="input-with-icon">
                                            <FormControl>
                                                <Input type="date" {...field} />
                                            </FormControl>
                                             <CalendarIcon className="far" />
                                        </div>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="category"
                                render={({ field }) => (
                                    <FormItem className="form-group">
                                        <FormLabel>Category</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select a category" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value="Communication">Communication</SelectItem>
                                                <SelectItem value="Custody Exchange">Custody Exchange</SelectItem>
                                                <SelectItem value="Financial">Financial</SelectItem>
                                                <SelectItem value="Health">Health</SelectItem>
                                                <SelectItem value="Safety Concern">Safety Concern</SelectItem>
                                                <SelectItem value="Other">Other</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="description"
                                render={({ field }) => (
                                    <FormItem className="form-group">
                                        <FormLabel>Factual Description</FormLabel>
                                        <FormControl>
                                            <Textarea placeholder="Describe the event in factual, objective detail..." {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="partiesInvolved"
                                render={({ field }) => (
                                    <FormItem className="form-group">
                                        <FormLabel>Parties Involved (Optional)</FormLabel>
                                        <FormControl>
                                            <Input placeholder="e.g., Jane Doe, Officer Smith" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                             <FormField
                                control={form.control}
                                name="yourResponse"
                                render={({ field }) => (
                                    <FormItem className="form-group">
                                        <FormLabel>Your Response (Optional)</FormLabel>
                                        <FormControl>
                                            <Textarea placeholder="How you responded to the event..." {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <Button type="submit" className="btn-primary" disabled={isLoading}>
                                {isLoading && <Loader2 className="animate-spin" />}
                                Log Event
                            </Button>
                        </form>
                    </Form>
                </CardContent>
            </Card>

            <div className="event-history-section">
                <div className="event-history-header">
                    <h2>Event History</h2>
                    <p>A chronological record of events</p>
                    <div className="filter-sort">
                        <div className="filter-group">
                            <Label htmlFor="filterCategory">Filter by Category</Label>
                            <Select>
                               <SelectTrigger id="filterCategory">
                                    <SelectValue placeholder="All Categories" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="All">All Categories</SelectItem>
                                    <SelectItem value="Communication">Communication</SelectItem>
                                    <SelectItem value="Custody Exchange">Custody Exchange</SelectItem>
                                    <SelectItem value="Financial">Financial</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="sort-group">
                            <Label htmlFor="sortOrder">Sort by</Label>
                            <Select>
                               <SelectTrigger id="sortOrder">
                                    <SelectValue placeholder="Date (Newest)" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="newest">Date (Newest)</SelectItem>
                                    <SelectItem value="oldest">Date (Oldest)</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </div>

                <div className="event-list">
                    {events.length === 0 && <p className="text-center text-muted-foreground py-8">No events logged yet.</p>}
                    {events.map(event => (
                        <Card key={event.id} className="event-item">
                            <div className="event-meta">
                               <span className="event-date">
                                    {format(new Date(event.eventDate.replace(/-/g, '/')), 'MMMM do, yyyy')}
                                </span>
                                {event.timestamp && (
                                     <span className="event-time">
                                        {format(event.timestamp.toDate(), 'p')}
                                     </span>
                                )}
                                <span className="logged-by">Logged by {event.loggedBy}</span>
                            </div>
                            <div className="event-details">
                                <h3>{event.category}</h3>
                                <p>{event.description}</p>
                                {event.partiesInvolved && <p><strong>Parties Involved:</strong> {event.partiesInvolved}</p>}
                                {event.response && <p><strong>Your Response:</strong> {event.response}</p>}
                            </div>
                        </Card>
                    ))}
                </div>
            </div>
        </div>
    </div>
  );
}

// Wrap the component in a Suspense boundary to use useSearchParams
export default function EvidenceLogPage() {
    return (
        <React.Suspense fallback={<div>Loading...</div>}>
            <EvidenceLogPageInternal />
        </React.Suspense>
    );
}
