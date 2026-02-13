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
import { Loader2, Trash2, Edit, X, Sparkles } from 'lucide-react';
import { Loader2, Trash2, Edit, X } from 'lucide-react';
// import { categorizeExpenseFlow } from '@/ai/flows/categorize-expense'; // Disabled AI flow for now to prevent build errors
// import { runFlow } from '@genkit-ai/flow'; // Disabled AI flow for now

export const dynamic = 'force-dynamic';

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
    // AI feature temporarily disabled to fix build errors.
    // The previous implementation was causing build failures due to direct import of server-side flows.
    toast({ title: 'Feature Unavailable', description: 'AI categorization is temporarily disabled due to build issues.' });
    /*
    const description = form.getValues('description');
    if (!description) {
      toast({ variant: 'destructive', title: 'Please enter a description first.' });
      return;
    }
    setIsAiLoading(true);
    try {
      // Import removed to fix build
      // AI categorization disabled to fix build
      // const result = await runFlow(categorizeExpenseFlow, description);
      // if (result.category) {
      //   form.setValue('category', result.category);
      //   toast({ title: 'AI Suggestion Applied', description: `Category set to ${result.category}` });
      // }
      // if (result.amount) {
      //   form.setValue('amount', result.amount);
      // }
      toast({ title: 'AI Categorization', description: 'This feature is temporarily unavailable.' });
    } catch (error) {
      console.error('AI categorization failed:', error);
      toast({ variant: 'destructive', title: 'AI Failed', description: 'Could not categorize expense.' });
    } finally {
      setIsAiLoading(false);
    }
    */
    // Feature temporarily disabled
    toast({ title: 'AI Categorization Coming Soon' });
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
      console.error('Error saving expense:', error);
      toast({ variant: 'destructive', title: 'Error', description: 'Could not save expense.' });
    } finally {
      setIsLoading(false);
      toast({ variant: 'destructive', title: 'Error', description: 'Failed to save expense.' });
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
          toast({ variant: 'destructive', title: 'Error', description: 'Could not delete expense.' });
          toast({ variant: 'destructive', title: 'Error', description: 'Failed to delete expense.' });
      }
  };

  const handleEdit = (expense: Expense) => {
      setEditId(expense.id);
      form.reset({
          description: expense.description,
          amount: expense.amount,
          category: expense.category,
      });
  };

  const handleCancelEdit = () => {
      setEditId(null);
      form.reset({
          description: '',
          amount: 0,
          category: 'Other',
      });
  };

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
            <CardTitle>Child's Fund</CardTitle>
            <CardDescription>Track and manage expenses for Harper.</CardDescription>
        </CardHeader>
        <CardContent>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                            control={form.control}
                            name="description"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Description</FormLabel>
                                    <FormControl>
                                        <div className="flex gap-2">
                                            <Input placeholder="e.g., Pediatrician visit" {...field} />
                                            <Button type="button" variant="outline" size="icon" onClick={handleAiCategorize} disabled={isAiLoading}>
                                                {isAiLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
                                            </Button>
                                        </div>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
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
                                    <Select onValueChange={field.onChange} value={field.value}>
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
                    <div className="flex justify-end gap-2">
                        {editId && (
                            <Button type="button" variant="ghost" onClick={handleCancelEdit}>
                                Cancel
                            </Button>
                        )}
                        <Button type="submit" disabled={isLoading}>
                            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            {editId ? 'Update Expense' : 'Log Expense'}
                        </Button>
                    </div>
                </form>
            </Form>
    <div className="container mx-auto p-4 space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Child Fund Tracker</CardTitle>
          <CardDescription>Track expenses related to your child.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="flex gap-4">
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Input placeholder="Describe expense..." {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  {/* AI Button disabled */}
                  {/* <Button type="button" variant="outline" size="icon" className="mt-8" onClick={handleAiCategorize} disabled={isAiLoading}>
                      {isAiLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
                  </Button> */}
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
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select category" />
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
              </div>

              <div className="flex gap-2 justify-end">
                  {editId && (
                      <Button type="button" variant="ghost" onClick={handleCancelEdit}>
                          <X className="h-4 w-4 mr-2" /> Cancel
                      </Button>
                  )}
                  <Button type="submit" disabled={isLoading}>
                      {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      {editId ? 'Update Expense' : 'Log Expense'}
                  </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
            <CardTitle>Recent Expenses</CardTitle>
        </CardHeader>
        <CardContent>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Description</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {expensesLoading && <TableRow><TableCell colSpan={4}>Loading...</TableCell></TableRow>}
                    {expenses && expenses.map((expense) => (
                        <TableRow key={expense.id}>
                            <TableCell>{expense.description}</TableCell>
                            <TableCell><Badge variant="secondary">{expense.category}</Badge></TableCell>
                            <TableCell>${expense.amount.toFixed(2)}</TableCell>
                            <TableCell className="text-right">
                                <Button variant="ghost" size="sm" onClick={() => handleEdit(expense)}>
                                    <Edit className="h-4 w-4" />
                                </Button>
                                <Button variant="ghost" size="sm" onClick={() => handleDelete(expense.id)}>
                                    <Trash2 className="h-4 w-4 text-red-500" />
                                </Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </CardContent>
          <CardHeader>
              <CardTitle>Recent Expenses</CardTitle>
          </CardHeader>
          <CardContent>
              {expensesLoading ? (
                  <div className="text-center p-4">Loading expenses...</div>
              ) : !expenses || expenses.length === 0 ? (
                  <div className="text-center p-4 text-muted-foreground">No expenses logged yet.</div>
              ) : (
                  <Table>
                      <TableHeader>
                          <TableRow>
                              <TableHead>Date</TableHead>
                              <TableHead>Description</TableHead>
                              <TableHead>Category</TableHead>
                              <TableHead>Amount</TableHead>
                              <TableHead className="text-right">Actions</TableHead>
                          </TableRow>
                      </TableHeader>
                      <TableBody>
                          {expenses.map((expense) => (
                              <TableRow key={expense.id}>
                                  <TableCell>
                                      {expense.timestamp?.toDate ? expense.timestamp.toDate().toLocaleDateString() : 'N/A'}
                                  </TableCell>
                                  <TableCell>{expense.description}</TableCell>
                                  <TableCell>
                                      <Badge variant="secondary">{expense.category}</Badge>
                                  </TableCell>
                                  <TableCell>${expense.amount.toFixed(2)}</TableCell>
                                  <TableCell className="text-right">
                                      <div className="flex justify-end gap-2">
                                          <Button variant="ghost" size="icon" onClick={() => handleEdit(expense)}>
                                              <Edit className="h-4 w-4" />
                                          </Button>
                                          <Button variant="ghost" size="icon" onClick={() => handleDelete(expense.id)}>
                                              <Trash2 className="h-4 w-4 text-destructive" />
                                          </Button>
                                      </div>
                                  </TableCell>
                              </TableRow>
                          ))}
                      </TableBody>
                  </Table>
              )}
          </CardContent>
      </Card>
    </div>
  );
}
      console.error(error);
      toast({ variant: 'destructive', title: 'Error saving expense' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4 space-y-8">
        <h1 className="text-3xl font-bold">Fund</h1>
        <p>Expense tracking temporarily unavailable.</p>
    </div>
  );
}
