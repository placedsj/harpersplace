// src/app/(main)/fund/page.tsx
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { DollarSign, Construction } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default function FundPage() {
    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-headline font-extra-bold uppercase tracking-tight">Child's Fund</h1>
                <p className="text-muted-foreground mt-1">Transparent support and expense tracking.</p>
            </div>

            <Card className="text-center py-12">
                <CardHeader>
                    <div className="mx-auto bg-primary/10 p-4 rounded-full mb-4 w-fit">
                        <Construction className="h-10 w-10 text-primary" />
                    </div>
                    <CardTitle>Coming Soon</CardTitle>
                    <CardDescription>
                        This feature is currently under development. Check back later for updates!
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground max-w-md mx-auto">
                        We are building a comprehensive tool to help you track and manage child-related expenses with transparency and ease.
                    </p>
                </CardContent>
            </Card>
        </div>
    );
}
