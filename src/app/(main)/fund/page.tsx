
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
import { Loader2, Trash2, Edit, X, Wand2 } from 'lucide-react';
import { categorizeExpense } from '@/ai/flows/categorize-expense';

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
      amount: undefined,
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
      const result = await categorizeExpense(description);
      if (result.category) {
        form.setValue('category', result.category);
        toast({ title: 'AI Suggestion Applied', description: `Category set to ${result.category}` });
      }
      if (result.amount) {
        form.setValue('amount', result.amount);
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
        await updateDoc(docRef, values);
        toast({ title: 'Expense Updated' });
        setEditId(null);
      } else {
        const expensesColRef = collection(db, `users/${user.uid}/expenses`);
        await addDoc(expensesColRef, {
          ...values,
          loggedBy: user.displayName || 'Anonymous',
          userId: user.uid,
          timestamp: serverTimestamp(),
        });
        toast({ title: 'Expense Logged' });
      }
      form.reset({
        description: '',
        amount: undefined,
        category: 'Other',
      });
    } catch (error) {
        console.error("Error submitting expense:", error);
        toast({
            variant: "destructive",
            title: "Submission Error",
            description: "Could not save the expense. Please try again.",
        });
    } finally {
      setIsLoading(false);
    }
  };

  const totalExpenses = useMemo(() => {
    return expenses?.reduce((acc, expense) => acc + expense.amount, 0) || 0;
  }, [expenses]);


  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-headline font-extrabold uppercase tracking-tight">HARPER'S FUND</h1>
        <p className="text-muted-foreground mt-1">
          A transparent and shared ledger for all of Harper's expenses.
        </p>
      </div>

       <Card>
        <CardHeader>
          <CardTitle>Overview</CardTitle>
        </CardHeader>
        <CardContent>
            <p className="text-4xl font-bold text-primary">${totalExpenses.toFixed(2)}</p>
            <p className="text-sm text-muted-foreground">Total expenses logged</p>
        </CardContent>
      </Card>


      <div className="grid lg:grid-cols-3 gap-8 items-start">
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>{editId ? 'Edit Expense' : 'Log New Expense'}</CardTitle>
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
                          <Input placeholder="e.g., Fall soccer registration" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="flex justify-end -mt-2">
                    <Button type="button" variant="ghost" size="sm" onClick={handleAiCategorize} disabled={isAiLoading} className="text-xs h-auto py-1 px-2">
                      {isAiLoading ? <Loader2 className="animate-spin h-3 w-3 mr-1" /> : <Wand2 className="h-3 w-3 mr-1" />}
                      AI-Categorize
                    </Button>
                  </div>
                  <FormField
                    control={form.control}
                    name="amount"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Amount (CAD)</FormLabel>
                        <FormControl>
                          <Input type="number" step="0.01" placeholder="50.00" {...field} />
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
                            <SelectItem value="Health">Health</SelectItem>
                            <SelectItem value="Education">Education</SelectItem>
                            <SelectItem value="Extracurricular">Extracurricular</SelectItem>
                            <SelectItem value="Clothing">Clothing</SelectItem>
                            <SelectItem value="Childcare">Childcare</SelectItem>
                            <SelectItem value="Travel">Travel</SelectItem>
                            <SelectItem value="Other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="flex gap-2 pt-2">
                    <Button type="submit" className="w-full" disabled={isLoading}>
                      {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      {editId ? 'Update Expense' : 'Log Expense'}
                    </Button>
                    {editId && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          setEditId(null);
                          form.reset({ description: '', amount: undefined, category: 'Other' });
                        }}
                      >
                        <X />
                      </Button>
                    )}
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Expense History</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Description</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                    <TableHead>Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {expensesLoading && (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center h-24">
                        <Loader2 className="mx-auto animate-spin" />
                      </TableCell>
                    </TableRow>
                  )}
                   {!expensesLoading && expenses?.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center h-24 text-muted-foreground">
                        No expenses logged yet.
                      </TableCell>
                    </TableRow>
                  )}
                  {expenses &&
                    expenses.map((expense) => (
                      <TableRow key={expense.id}>
                        <TableCell className="font-medium">{expense.description}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{expense.category}</Badge>
                        </TableCell>
                        <TableCell className="text-right">${expense.amount.toFixed(2)}</TableCell>
                        <TableCell>{expense.timestamp?.toDate().toLocaleDateString()}</TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
