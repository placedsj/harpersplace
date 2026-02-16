// src/app/(main)/fund/page.tsx
'use client';

import * as React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { DollarSign } from 'lucide-react';

export default function FundPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bebas font-extrabold uppercase tracking-widest text-primary drop-shadow-md">CHILD'S FUND</h1>
        <p className="text-lg font-montserrat text-muted-foreground mt-1 tracking-wide">
          Manage shared expenses and financial contributions for your child.
        </p>
      </div>

      <Card className="border-2 border-primary/20 shadow-lg">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-full">
              <DollarSign className="w-6 h-6 text-primary" />
            </div>
            <div>
              <CardTitle className="font-bebas uppercase tracking-wide">Expense Tracker</CardTitle>
              <CardDescription>Coming Soon: Track and split expenses transparently.</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12 bg-muted/20 rounded-lg border border-dashed">
            <p className="text-muted-foreground">This feature is currently under development.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
