'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";

export default function FundPage() {
  return (
    <div className="container mx-auto p-6">
      <Card className="max-w-md mx-auto mt-10">
        <CardHeader>
          <div className="flex items-center gap-2">
            <AlertCircle className="h-6 w-6 text-yellow-500" />
            <CardTitle>Under Maintenance</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            The Fund feature is currently being updated. Please check back later.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
