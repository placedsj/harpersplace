// src/app/(main)/fund/page.tsx
'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";

export default function FundPage() {
  return (
    <div className="container mx-auto p-6">
      <Card className="w-full max-w-2xl mx-auto mt-10">
        <CardHeader className="flex flex-row items-center gap-4">
          <AlertCircle className="h-8 w-8 text-yellow-500" />
          <CardTitle>Child's Fund - Under Maintenance</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            This section is currently being updated to ensure the best experience for tracking your child's expenses.
            Please check back soon.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
