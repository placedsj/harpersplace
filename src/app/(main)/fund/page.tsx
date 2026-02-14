// src/app/(main)/fund/page.tsx
'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

export default function FundPage() {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-headline font-extra-bold uppercase tracking-tight">Child's Fund</h1>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Fund Management</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center p-8 text-center text-muted-foreground">
            <Loader2 className="h-8 w-8 animate-spin mb-4" />
            <p>This module is currently under maintenance. Please check back later.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
