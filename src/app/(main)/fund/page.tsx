'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/use-auth';
import { useFirestore, useCollection } from '@/firebase';
import { collection, addDoc, query, orderBy, serverTimestamp, doc, updateDoc, deleteDoc, Timestamp } from 'firebase/firestore';
import { Loader2, Trash2, Edit, X } from 'lucide-react';
// import { categorizeExpenseFlow } from '@/ai/flows/categorize-expense';
// import { runFlow } from '@genkit-ai/flow';

const expenseSchema = z.object({
  description: z.string().min(1, 'Description is required.'),
  amount: z.coerce.number().positive('Amount must be a positive number.'),
  category: z.enum(['Health', 'Education', 'Extracurricular', 'Clothing', 'Childcare', 'Travel', 'Other']),
});

type ExpenseFormValues = z.infer<typeof expenseSchema>;

interface Expense {
  id: string;
  description: string;
  amount: number;
  category: 'Health' | 'Education' | 'Extracurricular' | 'Clothing' | 'Childcare' | 'Travel' | 'Other';
  loggedBy: string;
  timestamp: Timestamp;
}

export default function FundPage() {
  const { user } = useAuth();
  const { db } = useFirestore();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);

  const expensesQuery = useMemo(() => {
    if (!user || !db) return null;
    return query(collection(db, `users/${user.uid}/expenses`), orderBy('timestamp', 'desc'));
  }, [user, db]);

  const { data: expenses, loading: expensesLoading } = useCollection<Expense>(expensesQuery);

  const form = useForm<ExpenseFormValues>({
    resolver: zodResolver(expenseSchema),
    defaultValues: {
      description: '',
      amount: 0,
      category: 'Other',
    },
  });

  const handleAiCategorize = async () => {
    const description = form.getValues('description');
    if (!description) {
      toast({ variant: 'destructive', title: 'Please enter a description first.' });
      return;
    }
    setIsAiLoading(true);
    try {
        // Mock implementation to fix build
        await new Promise(resolve => setTimeout(resolve, 1000));
        toast({ title: 'AI Categorization Unavailable', description: 'This feature is currently disabled.' });
      /*
      const result = await runFlow(categorizeExpenseFlow, description);
      if (result.category) {
        // Cast the result to the enum type to satisfy TS
        const category = result.category as 'Health' | 'Education' | 'Extracurricular' | 'Clothing' | 'Childcare' | 'Travel' | 'Other';
        if (['Health', 'Education', 'Extracurricular', 'Clothing', 'Childcare', 'Travel', 'Other'].includes(category)) {
             form.setValue('category', category);
             toast({ title: 'AI Suggestion Applied', description: `Category set to ${result.category}` });
        }
      }
      if (result.amount) {
        form.setValue('amount', result.amount);
      }
      */
    } catch (error) {
      console.error('AI categorization failed:', error);
      toast({ variant: 'destructive', title: 'AI Failed', description: 'Could not categorize expense.' });
    } finally {
      setIsAiLoading(false);
    }
  };

  const onSubmit = async (values: ExpenseFormValues) => {
    if (!user || !db) return;
    setIsLoading(true);
    try {
      if (editId) {
        const docRef = doc(db, `users/${user.uid}/expenses`, editId);
        await updateDoc(docRef, values);
        toast({ title: 'Expense Updated' });
        setEditId(null);
      } else {
        const expensesColRef = collection(db, `users/${user.uid}/expenses`);
        await addDoc(expensesColRef, {
          ...values,
          loggedBy: user.displayName || 'Anonymous',
          timestamp: serverTimestamp(),
        });
        toast({ title: 'Expense Logged' });
      }
      form.reset({
        description: '',
        amount: 0,
        category: 'Other',
      });
    } catch (error) {
        console.error(error);
        toast({ variant: 'destructive', title: 'Error saving expense.' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
        <h1 className="text-3xl font-bold">Fund & Expenses</h1>
        <div className="grid gap-6 md:grid-cols-2">
            <Card>
                <CardHeader>
                    <CardTitle>{editId ? 'Edit Expense' : 'Log Expense'}</CardTitle>
                    <CardDescription>Track shared expenses for the child.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                            <FormField
                                control={form.control}
                                name="description"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Description</FormLabel>
                                        <FormControl>
                                            <Input placeholder="e.g. School supplies" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <Button type="button" variant="outline" size="sm" onClick={handleAiCategorize} disabled={isAiLoading}>
                                {isAiLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                AI Categorize
                            </Button>
                            <FormField
                                control={form.control}
                                name="amount"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Amount</FormLabel>
                                        <FormControl>
                                            <Input type="number" step="0.01" {...field} />
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
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select a category" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {['Health', 'Education', 'Extracurricular', 'Clothing', 'Childcare', 'Travel', 'Other'].map((cat) => (
                                                    <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <Button type="submit" disabled={isLoading}>
                                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                {editId ? 'Update Expense' : 'Log Expense'}
                            </Button>
                        </form>
                    </Form>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Recent Expenses</CardTitle>
                </CardHeader>
                <CardContent>
                    {expensesLoading ? (
                        <p>Loading expenses...</p>
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Description</TableHead>
                                    <TableHead>Amount</TableHead>
                                    <TableHead>Category</TableHead>
                                    <TableHead>Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {expenses?.map((expense) => (
                                    <TableRow key={expense.id}>
                                        <TableCell>{expense.description}</TableCell>
                                        <TableCell>${expense.amount}</TableCell>
                                        <TableCell><Badge variant="secondary">{expense.category}</Badge></TableCell>
                                        <TableCell>
                                            <Button variant="ghost" size="icon" onClick={() => {
                                                setEditId(expense.id);
                                                form.reset({
                                                    description: expense.description,
                                                    amount: expense.amount,
                                                    category: expense.category,
                                                });
                                            }}>
                                                <Edit className="h-4 w-4" />
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    )}
                </CardContent>
            </Card>
        </div>
    </div>
  );
}
