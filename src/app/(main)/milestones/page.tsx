// src/app/(main)/milestones/page.tsx
'use client';

export const dynamic = 'force-dynamic';

import * as React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { format } from 'date-fns';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Trophy, Stethoscope, Ruler, PlusCircle, CalendarIcon } from 'lucide-react';
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


const milestoneSchema = z.object({
  title: z.string().min(1, 'Title is required.'),
  date: z.date(),
  description: z.string().min(1, 'Description is required.'),
  category: z.enum(['Achievement', 'Health', 'Growth']),
});

export type Milestone = {
    id: string;
    title: string;
    date: Timestamp;
    description: string;
    category: 'Achievement' | 'Health' | 'Growth';
    userId: string;
    timestamp: Timestamp;
};

const iconMap: Record<Milestone['category'], React.ElementType> = {
    Achievement: Trophy,
    Health: Stethoscope,
    Growth: Ruler,
};


export default function MilestonesPage() {
    const { user } = useAuth();
    const { db } = useFirestore();
    const { data: milestones, loading } = useCollection<Milestone>(
        user && db ? query(collection(db, `users/${user.uid}/milestones`), orderBy('date', 'desc')) : null
    );

    const [isDialogOpen, setIsDialogOpen] = React.useState(false);
    const { toast } = useToast();

    const form = useForm<z.infer<typeof milestoneSchema>>({
        resolver: zodResolver(milestoneSchema),
        defaultValues: {
            title: '',
            description: '',
            category: 'Achievement',
            date: new Date(),
        },
    });

    async function onSubmit(values: z.infer<typeof milestoneSchema>) {
        if (!user || !db) {
            toast({ variant: 'destructive', title: 'You must be logged in.' });
            return;
        }

        try {
            await addDoc(collection(db, `users/${user.uid}/milestones`), {
                ...values,
                userId: user.uid,
                timestamp: serverTimestamp(),
            });

            toast({
                title: "Milestone Added!",
                description: `Successfully added "${values.title}".`,
            });
            form.reset({
                title: '',
                description: '',
                category: 'Achievement',
                date: new Date(),
            });
            setIsDialogOpen(false);
        } catch (error) {
            console.error(error);
            toast({ variant: 'destructive', title: 'Error adding milestone.' });
        }
    }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
         <div>
            <h1 className="text-3xl font-headline font-extra-bold uppercase tracking-tight">Developmental Milestones</h1>
            <p className="text-muted-foreground mt-1">
                A living record of Harper's growth and achievements.
            </p>
         </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
                <PlusCircle />
                <span>Add Milestone</span>
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add a New Milestone</DialogTitle>
              <DialogDescription>
                Record a new achievement or event in Harper's development.
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
                        <Input placeholder="e.g., First Word" {...field} />
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
                 <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Category</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a category" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Achievement">Achievement</SelectItem>
                          <SelectItem value="Health">Health</SelectItem>
                          <SelectItem value="Growth">Growth</SelectItem>
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
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Describe the milestone..." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <DialogFooter>
                  <DialogClose asChild>
                    <Button type="button" variant="secondary">Cancel</Button>
                  </DialogClose>
                  <Button type="submit">Save Milestone</Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>
       <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {loading && <p>Loading milestones...</p>}
        {milestones && milestones.map((milestone) => {
            const IconComponent = iconMap[milestone.category];
            return (
                <Card key={milestone.id}>
                    <CardHeader>
                        <div className="flex items-start justify-between">
                            <div>
                                <CardTitle>{milestone.title}</CardTitle>
                                <CardDescription>{format(milestone.date.toDate(), 'PPP')}</CardDescription>
                            </div>
                            <div className="p-3 bg-primary/10 rounded-lg">
                                <IconComponent className="w-5 h-5 text-primary" />
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <p className="text-muted-foreground">{milestone.description}</p>
                    </CardContent>
                </Card>
            )
        })}
       </div>
    </div>
  );
}
