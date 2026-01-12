
'use client';

import * as React from 'react';
import { useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { format } from 'date-fns';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/use-auth';
import { useFirestore, useCollection } from '@/firebase';
import { collection, addDoc, query, orderBy, serverTimestamp, Timestamp } from 'firebase/firestore';
import { Loader2, BookLock, Eye } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';

const evidenceSchema = z.object({
  date: z.string().min(1, 'Date is required.'),
  category: z.enum(['Communication', 'Custody Exchange', 'Financial', 'Health', 'Other']),
  description: z.string().min(1, 'A short description or title is required.'),
  evidence: z.string().min(1, 'The evidence details are required.'),
});

type EvidenceFormValues = z.infer<typeof evidenceSchema>;

interface EvidenceEntry {
  id: string;
  date: string;
  category: 'Communication' | 'Custody Exchange' | 'Financial' | 'Health' | 'Other';
  description: string;
  evidence: string;
  loggedBy: string;
  userId: string;
  timestamp: Timestamp;
}

function EvidenceLogPageInternal() {
  const { user } = useAuth();
  const { db } = useFirestore();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = React.useState(false);
  const [selectedEntry, setSelectedEntry] = React.useState<EvidenceEntry | null>(null);
  const searchParams = useSearchParams();

  const evidenceQuery = React.useMemo(() => {
    if (!user || !db) return null;
    return query(collection(db, `users/${user.uid}/evidence`), orderBy('timestamp', 'desc'));
  }, [user, db]);

  const { data: evidenceEntries, loading: evidenceLoading } = useCollection<EvidenceEntry>(evidenceQuery);

  const form = useForm<EvidenceFormValues>({
    resolver: zodResolver(evidenceSchema),
    defaultValues: {
      date: format(new Date(), 'yyyy-MM-dd'),
      category: 'Other',
      description: '',
      evidence: '',
    },
  });

  React.useEffect(() => {
    const category = searchParams.get('category');
    const description = searchParams.get('description');
    const evidence = searchParams.get('evidence');

    if (category) {
        form.setValue('category', category as EvidenceFormValues['category']);
    }
    if (description) {
        form.setValue('description', description);
    }
    if (evidence) {
        form.setValue('evidence', evidence);
    }
  }, [searchParams, form]);


  const onSubmit = async (values: EvidenceFormValues) => {
    if (!user || !db) return;
    setIsLoading(true);
    try {
      const evidenceColRef = collection(db, `users/${user.uid}/evidence`);
      await addDoc(evidenceColRef, {
        ...values,
        loggedBy: user.displayName || 'Anonymous',
        userId: user.uid,
        timestamp: serverTimestamp(),
      });
      toast({ title: 'Evidence Logged Successfully' });
      form.reset({
          date: format(new Date(), 'yyyy-MM-dd'),
          category: 'Other',
          description: '',
          evidence: '',
      });
    } catch (error) {
        console.error("Error submitting evidence:", error);
        toast({
            variant: "destructive",
            title: "Submission Error",
            description: "Could not save the evidence. Please try again.",
        });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleRowClick = (entry: EvidenceEntry) => {
    setSelectedEntry(entry);
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-headline font-extrabold uppercase tracking-tight">Court-Ready Evidence Log</h1>
        <p className="text-muted-foreground mt-1">
          A secure, timestamped, and unalterable log for all important events.
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8 items-start">
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Log New Evidence</CardTitle>
               <CardDescription>All entries are timestamped and cannot be edited or deleted to ensure legal integrity.</CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="date"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Date of Event</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Title / Summary</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., Late pickup on Tuesday" {...field} />
                        </FormControl>
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
                        <Select onValueChange={field.onChange} value={field.value}>
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
                            <SelectItem value="Other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                   <FormField
                    control={form.control}
                    name="evidence"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Evidence Details</FormLabel>
                        <FormControl>
                          <Textarea rows={5} placeholder="Describe the event, copy/paste text, or note the evidence details here." {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? <Loader2 className="animate-spin" /> : <BookLock />}
                    <span>Log Evidence Securely</span>
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Evidence History</CardTitle>
              <CardDescription>A chronological record of all logged events. Click a row to view details.</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Summary</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {evidenceLoading && (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center h-24">
                        <Loader2 className="mx-auto animate-spin text-primary" />
                      </TableCell>
                    </TableRow>
                  )}
                   {!evidenceLoading && evidenceEntries?.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center h-24 text-muted-foreground">
                        No evidence has been logged yet.
                      </TableCell>
                    </TableRow>
                  )}
                  {evidenceEntries &&
                    evidenceEntries.map((entry) => (
                      <TableRow key={entry.id} onClick={() => handleRowClick(entry)} className="cursor-pointer">
                        <TableCell className="font-medium whitespace-nowrap">{format(new Date(entry.date), 'PP')}</TableCell>
                        <TableCell>
                          <Badge variant="secondary">{entry.category}</Badge>
                        </TableCell>
                        <TableCell className="max-w-xs truncate">{entry.description}</TableCell>
                         <TableCell className="text-right">
                            <Button variant="ghost" size="sm">
                               <Eye className="h-4 w-4 mr-2" /> View
                            </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </div>
        <Dialog open={!!selectedEntry} onOpenChange={(open) => !open && setSelectedEntry(null)}>
            <DialogContent className="max-w-2xl">
                {selectedEntry && (
                    <>
                        <DialogHeader>
                            <DialogTitle>{selectedEntry.description}</DialogTitle>
                            <DialogDescription>
                                Logged on {format(selectedEntry.timestamp.toDate(), 'PPP p')}
                            </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                            <div>
                                <h4 className="text-sm font-semibold text-muted-foreground">Date of Event</h4>
                                <p>{format(new Date(selectedEntry.date), 'PPP')}</p>
                            </div>
                             <div>
                                <h4 className="text-sm font-semibold text-muted-foreground">Category</h4>
                                <p><Badge variant="outline">{selectedEntry.category}</Badge></p>
                            </div>
                            <div>
                                <h4 className="text-sm font-semibold text-muted-foreground">Evidence Details</h4>
                                <div className="p-3 bg-muted rounded-md text-sm max-h-60 overflow-y-auto whitespace-pre-wrap">
                                    {selectedEntry.evidence}
                                </div>
                            </div>
                        </div>
                    </>
                )}
            </DialogContent>
        </Dialog>
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
