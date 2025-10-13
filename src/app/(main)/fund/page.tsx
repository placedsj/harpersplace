
'use client';

import React, { useState, useEffect } from 'react';
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
import { useFirestore } from '@/firebase';
import { collection, addDoc, query, orderBy, onSnapshot, serverTimestamp, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { Loader2, Trash2, Edit, X } from 'lucide-react';
import { categorizeExpenseFlow } from '@/ai/flows/categorize-expense'; // Assuming the flow can be imported
import { runFlow } from '@genkit-ai/flow';

const expenseSchema = z.object({
  description: z.string().min(1, 'Description is required.'),
  amount: z.coerce.number().positive('Amount must be a positive number.'),
  category: z.enum(['Health', 'Education', 'Extracurricular', 'Clothing', 'Childcare', 'Travel', 'Other']),
});

type ExpenseFormValues = z.infer<typeof expenseSchema>;

interface Expense extends ExpenseFormValues {
  id: string;
  loggedBy: string;
  timestamp: { toDate: () => Date };
}

export default function FundPage() {
  const { user } = useAuth();
  const { db } = useFirestore();
  const { toast } = useToast();
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);

  const form = useForm<ExpenseFormValues>({
    resolver: zodResolver(expenseSchema),
    defaultValues: {
      description: '',
      amount: 0,
      category: 'Other',
    },
  });

  useEffect(() => {
    if (!user || !db) return;
    const expensesColRef = collection(db, `users/${user.uid}/expenses`);
    const q = query(expensesColRef, orderBy('timestamp', 'desc'));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const userExpenses = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Expense));
      setExpenses(userExpenses);
    });

    return () => unsubscribe();
  }, [user, db]);

  const handleAiCategorize = async () => {
    const description = form.getValues('description');
    if (!description) {
      toast({ variant: 'destructive', title: 'Please enter a description first.' });
      return;
    }
    setIsAiLoading(true);
    try {
      const result = await runFlow(categorizeExpenseFlow, description);
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
      console.error('Failed to save expense:', error);
      toast({ variant: 'destructive', title: 'Error', description: 'Failed to save expense.' });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleEdit = (expense: Expense) => {
      setEditId(expense.id);
      form.reset(expense);
  }

  const handleCancelEdit = () => {
      setEditId(null);
      form.reset({
        description: '',
        amount: 0,
        category: 'Other',
      });
  }

  const handleDelete = async (id: string) => {
      if (!user || !db) return;
      if (confirm('Are you sure you want to delete this expense?')) {
          const docRef = doc(db, `users/${user.uid}/expenses`, id);
          try {
            await deleteDoc(docRef);
            toast({ title: 'Expense Deleted' });
          } catch (error) {
            toast({ variant: 'destructive', title: 'Error', description: 'Failed to delete expense.' });
          }
      }
  }

  const totalExpenses = expenses.reduce((acc, exp) => acc + exp.amount, 0);

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-headline font-extra-bold uppercase tracking-tight">Shared Expense Tracker</h1>

      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-1 space-y-6">
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
                          <FormControl><Input {...field} placeholder="e.g., Soccer registration fee" /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button type="button" size="sm" variant="outline" onClick={handleAiCategorize} disabled={isAiLoading}>
                      {isAiLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                      Categorize with AI
                    </Button>
                    <FormField
                      control={form.control}
                      name="amount"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Amount</FormLabel>
                          <FormControl><Input type="number" {...field} placeholder='50.00' /></FormControl>
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
                            <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                            <SelectContent>
                                {expenseSchema.shape.category.options.map(cat => <SelectItem key={cat} value={cat}>{cat}</SelectItem>)}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <div className='flex gap-2 justify-end'>
                        {editId && <Button type="button" variant="outline" onClick={handleCancelEdit}><X className="h-4 w-4"/></Button>}
                        <Button type="submit" disabled={isLoading}>{isLoading ? <Loader2 className="animate-spin"/> : (editId ? 'Update' : 'Log Expense')}</Button>
                    </div>
                  </form>
                </Form>
              </CardContent>
            </Card>
             <Card>
                <CardHeader>
                    <CardTitle>Total Expenses</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-4xl font-bold">${totalExpenses.toFixed(2)}</p>
                </CardContent>
            </Card>
        </div>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Expense History</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Description</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {expenses.map((expense) => (
                  <TableRow key={expense.id}>
                    <TableCell className='font-medium'>{expense.description}</TableCell>
                    <TableCell><Badge variant="secondary">{expense.category}</Badge></TableCell>
                    <TableCell>${expense.amount.toFixed(2)}</TableCell>
                    <TableCell className='text-sm text-muted-foreground'>{expense.timestamp?.toDate().toLocaleDateString()}</TableCell>
                    <TableCell className="text-right">
                        <Button variant="ghost" size="icon" onClick={() => handleEdit(expense)}><Edit className="h-4 w-4"/></Button>
                        <Button variant="ghost" size="icon" onClick={() => handleDelete(expense.id)}><Trash2 className="h-4 w-4 text-red-500"/></Button>
                    </TableCell>
                  </TableRow>
                ))}
                 {expenses.length === 0 && <TableRow><TableCell colSpan={5} className="text-center text-muted-foreground py-8">No expenses logged yet.</TableCell></TableRow>}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
