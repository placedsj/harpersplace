// src/app/(main)/ai-tools/co-parenting-actions/page.tsx
import { AiCoParentingActions } from '@/components/ai-co-parenting-actions';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "AI Co-Parenting Recommendations | Harper's Home",
};

export default function CoParentingActionsPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-headline font-extra-bold uppercase tracking-tight">AI Co-Parenting Recommendations</h1>
        <p className="text-muted-foreground mt-1">
          Describe your scheduling concern and get actionable, child-focused recommendations from the AI mediator.
        </p>
      </div>
      <AiCoParentingActions />
    </div>
  );
}
