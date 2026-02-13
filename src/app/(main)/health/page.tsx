// src/app/(main)/health/page.tsx
'use client';

import * as React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { format, isFuture, isPast } from 'date-fns';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PlusCircle, Calendar as CalendarIcon, Syringe, Stethoscope, ClipboardList } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/hooks/use-auth';
import { useCollection, useFirestore } from '@/firebase';
import { collection, addDoc, serverTimestamp, query, orderBy, Timestamp } from 'firebase/firestore';

export const dynamic = 'force-dynamic';

const eventSchema = z.object({
  title: z.string().min(1, 'Title is required.'),
  date: z.date(),
  details: z.string().min(1, 'Details are required.'),
  type: z.enum(['Appointment', 'Immunization', 'Note']),
  doctor: z.string().optional(),
});

export type HealthEvent = {
  id: string;
  title: string;
  date: Timestamp;
  details: string;
  type: 'Appointment' | 'Immunization' | 'Note';
  doctor?: string;
  userId: string;
  timestamp: Timestamp;
};


const iconMap: Record<HealthEvent['type'], React.ElementType> = {
    Appointment: Stethoscope,
    Immunization: Syringe,
    Note: ClipboardList,
};

export default function HealthPage() {
    const { user } = useAuth();
    const { db } = useFirestore();
    const { data: events, loading } = useCollection<HealthEvent>(
        user && db ? query(collection(db, `users/${user.uid}/health-events`), orderBy('date', 'desc')) : null
    );

    const [isDialogOpen, setIsDialogOpen] = React.useState(false);
    const { toast } = useToast();

    const form = useForm<z.infer<typeof eventSchema>>({
        resolver: zodResolver(eventSchema),
        defaultValues: {
            title: '',
            details: '',
            type: 'Appointment',
            date: new Date(),
            doctor: '',
        },
    });

    async function onSubmit(values: z.infer<typeof eventSchema>) {
        if (!user || !db) {
            toast({ variant: 'destructive', title: 'You must be logged in.' });
            return;
        }

        try {
            await addDoc(collection(db, `users/${user.uid}/health-events`), {
                ...values,
                userId: user.uid,
                timestamp: serverTimestamp(),
            });
            toast({
                title: "Health Event Added!",
                description: `Successfully added "${values.title}".`,
            });
            form.reset({
                title: '',
                details: '',
                type: 'Appointment',
                date: new Date(),
                doctor: '',
            });
            setIsDialogOpen(false);
        } catch (error) {
            console.error(error);
            toast({ variant: 'destructive', title: 'Error adding event.' });
        }
    }

    const sortedEvents = events ? [...events].sort((a,b) => b.date.toMillis() - a.date.toMillis()) : [];
    const upcomingAppointments = sortedEvents.filter(e => e.type === 'Appointment' && isFuture(e.date.toDate()));
    const pastAppointments = sortedEvents.filter(e => e.type === 'Appointment' && isPast(e.date.toDate()));
    const immunizations = sortedEvents.filter(e => e.type === 'Immunization');
    const notes = sortedEvents.filter(e => e.type === 'Note');

    const EventCard = ({ event }: { event: HealthEvent }) => {
        const Icon = iconMap[event.type];
        return (
            <div className="flex items-start gap-4 p-4 border-b last:border-b-0">
                <div className="p-3 bg-primary/10 rounded-lg mt-1">
                    <Icon className="w-5 h-5 text-primary" />
                </div>
                <div>
                    <p className="font-semibold">{event.title}</p>
                    <p className="text-sm text-muted-foreground">{event.details}</p>
                    {event.doctor && <p className="text-xs text-muted-foreground/80">With {event.doctor}</p>}
                    <p className="text-xs font-medium pt-1">{format(event.date.toDate(), 'PPP p')}</p>
                </div>
            </div>
        )
    };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
         <div>
            <h1 className="text-3xl font-headline font-extra-bold uppercase tracking-tight">Health Hub</h1>
            <p className="text-muted-foreground mt-1">
                Track appointments, immunizations, and medical notes for Harper.
            </p>
         </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
                <PlusCircle />
                <span>Log Health Event</span>
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Log a New Health Event</DialogTitle>
              <DialogDescription>
                Record an appointment, immunization, or important medical note.
              </DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Annual Check-up" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                 <FormField
                  control={form.control}
                  name="date"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Date & Time</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "w-full pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value ? (
                                format(field.value, "PPP")
                              ) : (
                                <span>Pick a date</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                 <FormField
                  control={form.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Event Type</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select an event type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Appointment">Appointment</SelectItem>
                          <SelectItem value="Immunization">Immunization</SelectItem>
                          <SelectItem value="Note">Note</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                 <FormField
                  control={form.control}
                  name="doctor"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Doctor/Provider (Optional)</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Dr. Carter" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                 <FormField
                  control={form.control}
                  name="details"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Details</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Add any relevant details, notes, or outcomes..." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <DialogFooter>
                  <DialogClose asChild>
                    <Button type="button" variant="secondary">Cancel</Button>
                  </DialogClose>
                  <Button type="submit">Save Event</Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

       <div className="grid gap-6 lg:grid-cols-2">
            <Card>
                <CardHeader>
                    <CardTitle>Upcoming Appointments</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                    {loading && <p className="p-4 text-sm text-muted-foreground">Loading...</p>}
                    {!loading && upcomingAppointments.length > 0 ? (
                        upcomingAppointments.map(event => <EventCard key={event.id} event={event} />)
                    ) : (
                        !loading && <p className="text-sm text-muted-foreground p-4">No upcoming appointments scheduled.</p>
                    )}
                </CardContent>
            </Card>
             <Card>
                <CardHeader>
                    <CardTitle>Immunization Record</CardTitle>
                </CardHeader>
                <CardContent className="p-0 max-h-96 overflow-y-auto">
                    {loading && <p className="p-4 text-sm text-muted-foreground">Loading...</p>}
                    {!loading && immunizations.length > 0 ? (
                        immunizations.map(event => <EventCard key={event.id} event={event} />)
                    ) : (
                       !loading && <p className="text-sm text-muted-foreground p-4">No immunization records logged.</p>
                    )}
                </CardContent>
            </Card>
       </div>
       <Card>
            <CardHeader>
                <CardTitle>Health History</CardTitle>
                <CardDescription>A reverse chronological log of past appointments and notes.</CardDescription>
            </CardHeader>
            <CardContent className="p-0 max-h-[60vh] overflow-y-auto">
                {loading && <p className="p-4 text-sm text-muted-foreground">Loading...</p>}
                {!loading && [...pastAppointments, ...notes].length > 0 ? ([...pastAppointments, ...notes].sort((a,b) => b.date.toMillis() - a.date.toMillis()).map(event => (
                    <EventCard key={event.id} event={event} />
                ))) : (
                   !loading && <p className="p-4 text-sm text-muted-foreground">No past events.</p>
                )}
            </CardContent>
       </Card>
    </div>
  );
}
