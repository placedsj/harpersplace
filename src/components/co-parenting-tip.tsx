// src/components/co-parenting-tip.tsx
'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Lightbulb } from 'lucide-react';

const tips = [
  "When messaging, try using 'I' statements instead of 'you' statements to avoid sounding accusatory. For example, 'I was concerned when pickup was late' instead of 'You were late again.'",
  "Before sending a message, read it out loud. Does it sound respectful and collaborative? A quick pause can prevent a big conflict.",
  "Always keep conversations focused on the child's needs. The central question should always be: 'What is best for Harper?'",
  "Acknowledge the other parent's perspective, even if you don't agree. Saying 'I understand your concern about...' can de-escalate tension.",
  "When proposing a schedule change, suggest a specific solution rather than just pointing out a problem. It shows you're willing to work together.",
  "Keep your communication brief and to the point. Long, emotional messages can often lead to misunderstandings.",
  "Celebrate your child's successes together. Sharing positive moments strengthens the co-parenting team.",
];

export function CoParentingTip() {
  const [tip, setTip] = useState('');

  useEffect(() => {
    // This ensures the random selection only happens on the client, avoiding hydration mismatches.
    const randomTip = tips[Math.floor(Math.random() * tips.length)];
    setTip(randomTip);
  }, []);

  if (!tip) {
    return null; // Don't render anything on the server or before hydration
  }

  return (
    <Card className="bg-accent border-accent/50">
      <CardHeader className="flex flex-row items-center gap-3 space-y-0 pb-2">
        <Lightbulb className="w-5 h-5 text-accent-foreground" />
        <CardTitle className="font-headline uppercase text-accent-foreground tracking-widest">Co-Parenting Tip</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm font-sans text-accent-foreground/80">
          {tip}
        </p>
      </CardContent>
    </Card>
  );
}
