// src/app/(main)/fund/page.tsx
'use client';

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { DollarSign } from "lucide-react";

export default function FundPage() {
  return (
    <div className="container mx-auto p-4 space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-6 w-6 text-primary" />
            Child's Fund
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">This section is currently under maintenance. Please check back later.</p>
        </CardContent>
      </Card>
    </div>
  );
}
