// src/app/(main)/fund/page.tsx
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { DollarSign, Clock } from 'lucide-react';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default function FundPage() {
    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-headline font-extra-bold uppercase tracking-tight">Child's Fund</h1>
                    <p className="text-muted-foreground mt-1">
                        Track and categorize expenses for your child.
                    </p>
                </div>
            </div>

            <div className="grid gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Clock className="h-5 w-5" />
                            Under Maintenance
                        </CardTitle>
                        <CardDescription>
                            This feature is currently being updated. Please check back later.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="flex flex-col items-center justify-center py-12 text-center space-y-4">
                        <DollarSign className="h-16 w-16 text-muted-foreground opacity-50" />
                        <p className="text-muted-foreground max-w-md">
                            We are working on improving the expense tracking and AI categorization features.
                            Your previous data is safe.
                        </p>
                        <Button asChild variant="outline">
                            <Link href="/dashboard">Return to Dashboard</Link>
                        </Button>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
