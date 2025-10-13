// src/app/(main)/log/page.tsx
'use client';

import * as React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { format, parse } from 'date-fns';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PlusCircle, BedDouble, Utensils, Baby, type LucideIcon } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { AiSleepSuggestor } from '@/components/ai-sleep-suggestor';
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/use-auth';
import { useCollection, useFirestore } from '@/firebase';
import { collection, addDoc, serverTimestamp, query, orderBy, Timestamp } from 'firebase/firestore';

const logSchema = z.object({
  time: z.string().min(1, 'Time is required.'),
  type: z.enum(['Feeding', 'Diaper', 'Sleep']),
  details: z.string().min(1, 'Details are required.'),
});

export type DailyLog = {
    id: string;
    time: string;
    type: 'Feeding' | 'Diaper' | 'Sleep';
    details: string;
    userId: string;
    timestamp: Timestamp;
};


const iconMap: Record<string, LucideIcon> = {
    Feeding: Utensils,
    Diaper: Baby,
    Sleep: BedDouble,
};

export default function LogPage() {
    const { user } = useAuth();
    const { db } = useFirestore();
    const { data: logs, loading } = useCollection<DailyLog>(
        user && db ? query(collection(db, `users/${user.uid}/daily-logs`), orderBy('timestamp', 'desc')) : null
    );

    const [isDialogOpen, setIsDialogOpen] = React.useState(false);
    const { toast } = useToast();
    
    const logSummary = logs ? logs.map(log => `${log.time} - ${log.type}: ${log.details}`).join('\n') : '';

    const form = useForm<z.infer<typeof logSchema>>({
        resolver: zodResolver(logSchema),
        defaultValues: {
            time: format(new Date(), 'HH:mm'),
            type: 'Feeding',
            details: '',
        },
    });

    async function onSubmit(values: z.infer<typeof logSchema>) {
        if (!user || !db) {
            toast({ variant: 'destructive', title: 'You must be logged in.' });
            return;
        }

        try {
            await addDoc(collection(db, `users/${user.uid}/daily-logs`), {
                ...values,
                userId: user.uid,
                timestamp: serverTimestamp(),
            });
            toast({
                title: "Log Entry Added!",
                description: `Successfully added "${values.type}" log.`,
            });
            form.reset({
                time: format(new Date(), 'HH:mm'),
                type: 'Feeding',
                details: '',
            });
            setIsDialogOpen(false);
        } catch (error) {
            console.error(error);
            toast({ variant: 'destructive', title: 'Error adding log.' });
        }
    }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
            <h1 className="text-3xl font-headline font-extra-bold uppercase tracking-tight">Harper's Log</h1>
            <p className="text-muted-foreground mt-1">
                A real-time log of feedings, sleep, and diaper changes.
            </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
                <Button>
                    <PlusCircle />
                    <span>Add Log Entry</span>
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Add New Log Entry</DialogTitle>
                    <DialogDescription>Record a new activity for Harper.</DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                          control={form.control}
                          name="time"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Time</FormLabel>
                              <FormControl>
                                <Input type="time" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="type"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Log Type</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select a log type" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="Feeding">Feeding</SelectItem>
                                  <SelectItem value="Diaper">Diaper</SelectItem>
                                  <SelectItem value="Sleep">Sleep</SelectItem>
                                </SelectContent>
                              </Select>
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
                                <Input placeholder="e.g., 6 oz formula" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <DialogFooter>
                          <DialogClose asChild>
                            <Button type="button" variant="secondary">Cancel</Button>
                          </DialogClose>
                          <Button type="submit">Save Entry</Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
      </div>
      
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
            <Card>
                <CardHeader>
                    <CardTitle>Today's Log</CardTitle>
                    <CardDescription>{format(new Date(), 'PPPP')}</CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[100px]">Time</TableHead>
                                <TableHead>Type</TableHead>
                                <TableHead>Details</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {loading && <TableRow><TableCell colSpan={3}>Loading logs...</TableCell></TableRow>}
                            {logs && logs.map((log) => {
                                const Icon = iconMap[log.type];
                                return (
                                    <TableRow key={log.id}>
                                        <TableCell className="font-medium">{format(parse(log.time, 'HH:mm', new Date()), 'p')}</TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-2">
                                                {Icon && <Icon className="w-4 h-4 text-muted-foreground" />}
                                                <span>{log.type}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell>{log.details}</TableCell>
                                    </TableRow>
                                )}
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
        <div className="lg:col-span-1">
            <AiSleepSuggestor recentLogs={logSummary} />
        </div>
      </div>
    </div>
  );
}
