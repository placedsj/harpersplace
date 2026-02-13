        // src/app/(main)/evidence-log/page.tsx
        'use client';

        import React, { useState, useEffect, useMemo } from 'react';
        import { useSearchParams } from 'next/navigation';
        import { useForm } from 'react-hook-form';
        import { zodResolver } from '@hookform/resolvers/zod';
        import { z } from 'zod';
        import { Button } from "@/components/ui/button";
        import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
        import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
        import { Input } from "@/components/ui/input";
        import { Textarea } from "@/components/ui/textarea";
        import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
        import { collection, addDoc, query, orderBy, serverTimestamp, Timestamp } from 'firebase/firestore';
        import { format } from 'date-fns';
        import { useAuth } from '@/hooks/use-auth';
        import { useToast } from '@/hooks/use-toast';
        import { Loader2, CalendarIcon } from 'lucide-react';
        import { useFirestore, useCollection } from '@/firebase';

export const dynamic = 'force-dynamic';

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
            userId: string;
            timestamp?: Timestamp
        }


        function EvidenceLogPageInternal() {
            const { user } = useAuth();
            const { db } = useFirestore();
            const { toast } = useToast();
            const searchParams = useSearchParams();
            const [isLoading, setIsLoading] = useState(false);

            const evidenceQuery = useMemo(() => {
                if (!user || !db) return null;
                return query(collection(db, `users/${user.uid}/evidence`), orderBy('timestamp', 'desc'));
            }, [user, db]);

            const { data: events, loading: eventsLoading } = useCollection<Event>(evidenceQuery);

            const form = useForm<LogFormValues>({
                resolver: zodResolver(logSchema),
                defaultValues: {
                    eventDate: format(new Date(), 'yyyy-MM-dd'),
                    category: 'Communication',
                    description: '',
                    partiesInvolved: '',
                    yourResponse: '',
                },
            });

            useEffect(() => {
                const category = searchParams.get('category');
                const description = searchParams.get('description');
                const evidence = searchParams.get('evidence');

                if (category || description || evidence) {
                    form.reset({
                        eventDate: format(new Date(), 'yyyy-MM-dd'),
                        category: category || 'Communication',
                        description: description || evidence || '',
                        partiesInvolved: '',
                        yourResponse: '',
                    });
                }
            }, [searchParams, form]);


            const handleLogEvent = async (values: LogFormValues) => {
                if (!user || !db) {
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
            <div className="space-y-8">
                <div>
                    <h1 className="text-3xl font-headline font-extra-bold uppercase tracking-tight">Evidence Log</h1>
                    <p className="text-muted-foreground mt-1">A secure and chronological record of co-parenting events.</p>
                </div>

                <div className="grid lg:grid-cols-3 gap-8">
                    <Card className="lg:col-span-1">
                        <CardHeader>
                            <CardTitle>Log New Event</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Form {...form}>
                                <form onSubmit={form.handleSubmit(handleLogEvent)} className="space-y-6">
                                     <FormField
                                        control={form.control}
                                        name="eventDate"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Date of Event</FormLabel>
                                                 <div className="relative">
                                                     <FormControl>
                                                         <Input type="date" {...field} className="pr-10" />
                                                     </FormControl>
                                                      <CalendarIcon className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                                                 </div>
                                                 <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="category"
                                        render={({ field }) => (
                                            <FormItem>
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
                                            <FormItem>
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
                                            <FormItem>
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
                                            <FormItem>
                                                <FormLabel>Your Response (Optional)</FormLabel>
                                                <FormControl>
                                                    <Textarea placeholder="How you responded to the event..." {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <Button type="submit" className="w-full" disabled={isLoading}>
                                        {isLoading ? <Loader2 className="animate-spin" /> : 'Log Event'}
                                    </Button>
                                </form>
                            </Form>
                        </CardContent>
                    </Card>

                    <div className="lg:col-span-2 space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Event History</CardTitle>
                                <p className="text-muted-foreground">A chronological record of events</p>
                            </CardHeader>
                             <CardContent>
                                {/* Filters could be added here later */}
                             </CardContent>
                        </Card>

                        <div className="space-y-4">
                            {eventsLoading && <Card><CardContent className="text-center text-muted-foreground py-8">Loading events...</CardContent></Card>}
                            {!eventsLoading && events && events.length === 0 && <Card><CardContent className="text-center text-muted-foreground py-8">No events logged yet.</CardContent></Card>}
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
                                        {event.yourResponse && <p className="mt-2 text-sm"><strong>Your Response:</strong> {event.yourResponse}</p>}
                                    </CardContent>
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
                <React.Suspense fallback={<div className="flex h-screen w-screen items-center justify-center"><Loader2 className="animate-spin" /></div>}>
                    <EvidenceLogPageInternal />
                </React.Suspense>
            );
        }