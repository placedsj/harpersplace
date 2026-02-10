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
import { categorizeExpenseAction } from './actions';

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
      const result = await categorizeExpenseAction(description);
      if (result.success && result.data) {
        if (result.data.category) {
          form.setValue('category', result.data.category as any);
          toast({ title: 'AI Suggestion Applied', description: `Category set to ${result.data.category}` });
        }
        if (result.data.amount) {
          form.setValue('amount', result.data.amount);
        }
      } else {
        throw new Error(result.error || 'Failed to categorize');
      }
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
        await updateDoc(docRef, { ...values });
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
      console.error('Error logging expense:', error);
      toast({ variant: 'destructive', title: 'Error logging expense.' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!user || !db) return;
    if (!confirm('Are you sure you want to delete this expense?')) return;
    try {
        await deleteDoc(doc(db, `users/${user.uid}/expenses`, id));
        toast({ title: 'Expense Deleted' });
    } catch (error) {
        console.error('Error deleting expense:', error);
        toast({ variant: 'destructive', title: 'Error deleting expense.' });
    }
  };

  const handleEdit = (expense: Expense) => {
    form.reset({
        description: expense.description,
        amount: expense.amount,
        category: expense.category,
    });
    setEditId(expense.id);
  };

  const handleCancelEdit = () => {
    form.reset({ description: '', amount: 0, category: 'Other' });
    setEditId(null);
  };

  return (
    <div className="container mx-auto p-4 space-y-8 pb-8">
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Child's Fund</h1>
        <p className="text-muted-foreground">Track expenses and manage funds for your child.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>{editId ? 'Edit Expense' : 'Log New Expense'}</CardTitle>
            <CardDescription>Enter the details of the expense below.</CardDescription>
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
                        <Input placeholder="e.g., Diapers, School fees" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex justify-end">
                    <Button type="button" variant="outline" size="sm" onClick={handleAiCategorize} disabled={isAiLoading}>
                        {isAiLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Loader2 className="mr-2 h-4 w-4" />}
                        Auto-Categorize with AI
                    </Button>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="amount"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Amount ($)</FormLabel>
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
                          <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select category" />
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
                </div>

                <div className="flex gap-2 pt-4">
                    <Button type="submit" disabled={isLoading} className="flex-1">
                      {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      {editId ? 'Update Expense' : 'Log Expense'}
                    </Button>
                    {editId && (
                        <Button type="button" variant="ghost" size="icon" onClick={handleCancelEdit}>
                            <X className="h-4 w-4" />
                        </Button>
                    )}
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>

        <Card className="h-full">
            <CardHeader>
                <CardTitle>Recent Expenses</CardTitle>
                <CardDescription>A list of recently logged expenses.</CardDescription>
            </CardHeader>
            <CardContent>
                {expensesLoading ? (
                    <div className="flex justify-center p-8"><Loader2 className="h-8 w-8 animate-spin text-muted-foreground" /></div>
                ) : !expenses || expenses.length === 0 ? (
                    <div className="flex flex-col items-center justify-center p-8 text-center space-y-2">
                        <p className="text-muted-foreground">No expenses logged yet.</p>
                        <p className="text-sm text-muted-foreground">Start by logging your first expense!</p>
                    </div>
                ) : (
                    <div className="rounded-md border max-h-[500px] overflow-auto">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Desc</TableHead>
                                    <TableHead>Cat</TableHead>
                                    <TableHead className="text-right">Amt</TableHead>
                                    <TableHead className="w-[80px]"></TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {expenses.map((expense) => (
                                    <TableRow key={expense.id}>
                                        <TableCell className="font-medium">{expense.description}</TableCell>
                                        <TableCell><Badge variant="outline" className="text-xs">{expense.category}</Badge></TableCell>
                                        <TableCell className="text-right font-mono">${expense.amount.toFixed(2)}</TableCell>
                                        <TableCell className="flex justify-end gap-1">
                                            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleEdit(expense)}>
                                                <Edit className="h-4 w-4" />
                                            </Button>
                                            <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive" onClick={() => handleDelete(expense.id)}>
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                )}
            </CardContent>
        </Card>
      </div>
    </div>
  );
}
