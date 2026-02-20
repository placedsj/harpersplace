// src/app/(main)/journal/page.tsx
'use client';

import * as React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { format } from 'date-fns';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PlusCircle, CalendarIcon, ImageUp, Loader2, Book } from 'lucide-react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
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
import { useAuth } from '@/hooks/use-auth';
import { useCollection, useFirestore } from '@/firebase';
import { collection, addDoc, serverTimestamp, query, orderBy } from 'firebase/firestore';
import type { JournalEntry } from '@/lib/journal-data';

export const dynamic = 'force-dynamic';

const entrySchema = z.object({
  title: z.string().min(1, 'Title is required.'),
  date: z.date(),
  content: z.string().min(1, 'Content is required.'),
  image: z.string().url('Please provide a valid image URL.').optional().or(z.literal('')),
  dataAiHint: z.string().optional(),
});


export default function JournalPage() {
    const { user } = useAuth();
    const { db } = useFirestore();
    const { data: entries, loading } = useCollection<JournalEntry>(
        user && db ? query(collection(db, `users/${user.uid}/journal`), orderBy('timestamp', 'desc')) : null
    );

    const [isDialogOpen, setIsDialogOpen] = React.useState(false);
    const { toast } = useToast();

    const form = useForm<z.infer<typeof entrySchema>>({
        resolver: zodResolver(entrySchema),
        defaultValues: {
            title: '',
            content: '',
            date: new Date(),
            image: '',
            dataAiHint: '',
        },
    });

    async function onSubmit(values: z.infer<typeof entrySchema>) {
        if (!user || !db) {
            toast({ variant: 'destructive', title: 'You must be logged in.' });
            return;
        }

        try {
            const newEntry = {
              ...values,
              image: values.image || `https://images.unsplash.com/photo-1516627145497-ae4db4e4da1d?w=400&h=200&fit=crop&crop=center`,
              dataAiHint: values.dataAiHint || 'family memory placeholder',
              userId: user.uid,
              timestamp: serverTimestamp(),
            };
            await addDoc(collection(db, `users/${user.uid}/journal`), newEntry);
            toast({
                title: "Journal Entry Added!",
                description: `Successfully added "${values.title}".`,
            });
            form.reset({
                title: '',
                content: '',
                date: new Date(),
                image: '',
                dataAiHint: '',
            });
            setIsDialogOpen(false);
        } catch (error) {
            console.error(error);
            toast({ variant: 'destructive', title: 'Error adding entry.' });
        }
    }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bebas font-extrabold uppercase tracking-widest text-primary drop-shadow-md">FAMILY JOURNAL</h1>
          <p className="text-lg font-montserrat text-accent mt-1 tracking-wide">Share precious moments and milestones.</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
                <PlusCircle />
                <span>New Entry</span>
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add a New Journal Entry</DialogTitle>
              <DialogDescription>
                Share a new memory or moment with the family.
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
                        <Input placeholder="e.g., A day at the park" {...field} />
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
                      <FormLabel>Date</FormLabel>
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
                            disabled={(date) => date > new Date()}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormItem>
                    <FormLabel>Photo (Optional)</FormLabel>
                    <div className="border-2 border-dashed border-muted-foreground/20 rounded-lg p-6 text-center bg-muted/10">
                        <ImageUp className="mx-auto h-12 w-12 text-muted-foreground/50 mb-3" />
                        <div className="space-y-2">
                            <Button type="button" variant="outline" disabled className="cursor-not-allowed">
                                Upload Image
                            </Button>
                            <p className="text-xs text-muted-foreground">
                                Photo uploads coming soon. For now, entries will use a beautiful placeholder image.
                            </p>
                        </div>
                    </div>
                </FormItem>
                 <FormField
                  control={form.control}
                  name="content"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Content</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Describe the memory..." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <DialogFooter>
                  <DialogClose asChild>
                    <Button type="button" variant="secondary">Cancel</Button>
                  </DialogClose>
                  <Button type="submit" disabled={form.formState.isSubmitting}>
                    {form.formState.isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Save Entry
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>
       <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {loading && Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="overflow-hidden rounded-xl border border-muted shadow-sm bg-card">
            <Skeleton className="h-[200px] w-full" />
            <div className="p-6 space-y-4">
               <Skeleton className="h-8 w-3/4" />
               <Skeleton className="h-4 w-1/4" />
               <div className="space-y-2 pt-2">
                 <Skeleton className="h-4 w-full" />
                 <Skeleton className="h-4 w-5/6" />
               </div>
            </div>
          </div>
        ))}

        {!loading && entries && entries.length === 0 && (
          <div className="col-span-full flex flex-col items-center justify-center py-16 text-center animate-in fade-in zoom-in duration-500">
            <div className="rounded-full bg-primary/10 p-6 mb-4">
              <Book className="h-10 w-10 text-primary" />
            </div>
            <h3 className="text-2xl font-bebas tracking-wide text-primary mb-2">No Memories Yet</h3>
            <p className="text-muted-foreground font-montserrat max-w-md mb-8">
              Start capturing your family's precious moments. Your first entry is just a click away!
            </p>
            <Button onClick={() => setIsDialogOpen(true)} size="lg" className="font-montserrat">
              <PlusCircle className="mr-2 h-5 w-5" />
              Create First Entry
            </Button>
          </div>
        )}

        {entries && entries.map((entry) => (
          <Card key={entry.id} className="overflow-hidden shadow-lg border-2 border-primary/40">
             <Image src={entry.image || 'https://picsum.photos/400/200'} data-ai-hint={entry.dataAiHint} alt={entry.title} width={400} height={200} className="object-cover w-full aspect-video" />
            <CardHeader>
              <CardTitle className="font-bebas uppercase text-primary tracking-widest">{entry.title.toUpperCase()}</CardTitle>
              <CardDescription className="font-montserrat text-accent">
                {format((entry.date as any).toDate ? (entry.date as any).toDate() : entry.date, 'PPP')}
              </CardDescription>
            </CardHeader>
            <CardContent>
                <p className="text-muted-foreground font-montserrat">{entry.content}</p>
            </CardContent>
          </Card>
        ))}
       </div>
    </div>
  );
}
