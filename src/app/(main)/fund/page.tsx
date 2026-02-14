// src/app/(main)/fund/page.tsx
'use client';

import * as React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { categorizeExpenseAction } from './actions';
import { useToast } from '@/hooks/use-toast';
import { Loader2, DollarSign } from 'lucide-react';

export default function FundPage() {
    const [description, setDescription] = React.useState('');
    const [amount, setAmount] = React.useState('');
    const [isLoading, setIsLoading] = React.useState(false);
    const { toast } = useToast();

    const handleAddExpense = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!description || !amount) return;

        setIsLoading(true);
        try {
            // In a real app, we would save this to the database.
            // For now, we just demonstrate the AI categorization action.
            const categoryResult = await categorizeExpenseAction(description);

            toast({
                title: "Expense Logged",
                description: `Added $${amount} for "${description}" (${categoryResult?.category || 'Uncategorized'}).`,
            });
            setDescription('');
            setAmount('');
        } catch (error) {
            console.error("Error adding expense:", error);
            toast({
                variant: 'destructive',
                title: "Error",
                description: "Failed to log expense.",
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-headline font-extra-bold uppercase tracking-tight">Child's Fund</h1>
                <p className="text-muted-foreground mt-1">
                    Track shared expenses and manage contributions transparently.
                </p>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Log New Expense</CardTitle>
                    <CardDescription>Enter the details of the expense. AI will help categorize it.</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleAddExpense} className="space-y-4">
                        <div className="grid gap-2">
                            <Label htmlFor="description">Description</Label>
                            <Input
                                id="description"
                                placeholder="e.g., School supplies"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="amount">Amount ($)</Label>
                            <Input
                                id="amount"
                                type="number"
                                placeholder="0.00"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                            />
                        </div>
                        <Button type="submit" disabled={isLoading}>
                            {isLoading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Processing...
                                </>
                            ) : (
                                <>
                                    <DollarSign className="mr-2 h-4 w-4" />
                                    Log Expense
                                </>
                            )}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
