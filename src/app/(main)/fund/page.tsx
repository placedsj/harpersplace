// src/app/(main)/fund/page.tsx
'use client';
import { Card } from '@/components/ui/card';

export default function FundPage() {
    return (
        <div className="space-y-6">
            <Card className="p-6">
                <h1 className="text-2xl font-bold mb-4">Child's Fund</h1>
                <p className="text-muted-foreground">This feature is currently under maintenance.</p>
            </Card>
        </div>
    );
}
