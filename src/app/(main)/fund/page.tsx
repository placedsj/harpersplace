
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
import { categorizeExpenseFlow } from '@/ai/flows/categorize-expense';
import { runFlow } from '@genkit-ai/flow';

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