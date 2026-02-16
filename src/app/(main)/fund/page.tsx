// src/app/(main)/fund/page.tsx
'use client';

import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function FundPage() {
    return (
        <div className="space-y-8">
            <h1 className="text-4xl font-bebas font-extrabold uppercase tracking-widest text-primary drop-shadow-md">
                CHILD'S FUND
            </h1>
            <Card>
                <CardHeader>
                    <CardTitle>Coming Soon</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground">This feature is currently under development.</p>
                </CardContent>
            </Card>
        </div>
    );
}
