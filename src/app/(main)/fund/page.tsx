'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function FundPage() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Child's Fund</CardTitle>
        </CardHeader>
        <CardContent>
          <p>This feature is currently under development.</p>
        </CardContent>
      </Card>
    </div>
  );
}
