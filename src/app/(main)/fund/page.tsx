'use client';

import * as React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { DollarSign } from 'lucide-react';

export default function FundPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <DollarSign className="h-8 w-8 text-green-600" />
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Child's Fund</h1>
          <p className="text-muted-foreground">Track expenses and support for your child.</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Expense Tracker</CardTitle>
          <CardDescription>
            This feature is currently under development. Check back soon for updates on tracking and managing child-related expenses.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-12 text-muted-foreground">
            <DollarSign className="h-12 w-12 opacity-20" />
            <span className="ml-4 text-lg">Coming Soon</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
