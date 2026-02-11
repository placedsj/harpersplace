// src/components/ai-schedule-optimizer.tsx
'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, Wand2 } from 'lucide-react';
import { optimizeCustodyScheduleAction } from './ai-schedule-optimizer/actions';
import type { OptimizeCustodyScheduleOutput } from '@/ai/flows/optimize-custody-schedule';

const formSchema = z.object({
  parentalNeeds: z.string().min(10, 'Please describe the parental needs in more detail.'),
  childWellbeingFactors: z.string().min(10, "Please describe the child's wellbeing factors in more detail."),
  externalFactors: z.string().min(10, 'Please describe any external factors in more detail.'),
});

export function AiScheduleOptimizer() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<OptimizeCustodyScheduleOutput | null>(null);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      parentalNeeds: "Parent A works 9-5 M-F. Parent B works remotely with a flexible schedule but often travels for work on weekends.",
      childWellbeingFactors: "Harper is 8 years old and has after-school soccer on Tuesdays and Thursdays. She does best with a consistent routine and shorter transitions between homes.",
      externalFactors: "School events are typically on the first Friday of each month. Harper has a standing doctor's appointment on the second Wednesday of every other month.",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setResult(null);
    try {
      const output = await optimizeCustodyScheduleAction(values);
      if (output) {
        setResult(output);
      } else {
         toast({
            variant: 'destructive',
            title: 'An error occurred',
            description: 'Failed to generate the schedule. Please try again.',
          });
      }
    } catch (error) {
      console.error('Error optimizing schedule:', error);
      toast({
        variant: 'destructive',
        title: 'An error occurred',
        description: 'Failed to generate the schedule. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
            <CardTitle>Provide Context</CardTitle>
            <CardDescription>The more details you provide, the better the AI can tailor the schedule. Here are some examples to get you started.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="parentalNeeds"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Parental Needs & Availability</FormLabel>
                    <FormControl>
                      <Textarea rows={4} placeholder="e.g., Parent A works 9-5 Mon-Fri. Parent B has a flexible remote schedule but travels on weekends..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="childWellbeingFactors"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Child's Wellbeing Factors</FormLabel>
                    <FormControl>
                      <Textarea rows={4} placeholder="e.g., Harper is 8 years old, enjoys after-school soccer on Tuesdays and Thursdays. Prefers shorter transitions between homes..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="externalFactors"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>External Factors</FormLabel>
                    <FormControl>
                      <Textarea rows={4} placeholder="e.g., School events on the first Friday of each month. Regular doctor appointments..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={isLoading} size="lg" className="w-full sm:w-auto">
                {isLoading ? <Loader2 className="animate-spin" /> : <Wand2 />}
                <span>{isLoading ? 'Generating...' : 'Optimize Schedule'}</span>
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      {isLoading && (
         <div className="flex flex-col items-center justify-center text-muted-foreground pt-10">
            <Loader2 className="animate-spin h-8 w-8 mb-2" />
            <p>The AI is analyzing the details and crafting schedule options...</p>
          </div>
      )}

      {result && (
        <div className="space-y-8 pt-4">
            <Card>
                <CardHeader>
                    <CardTitle>Suggested Schedule</CardTitle>
                    <CardDescription>This is one potential schedule optimized based on the information you provided.</CardDescription>
                </CardHeader>
                <CardContent>
                    <pre className="whitespace-pre-wrap font-body text-sm bg-muted p-4 rounded-md">{result.optimizedSchedule}</pre>
                </CardContent>
            </Card>
            <Card>
                <CardHeader>
                    <CardTitle>Reasoning</CardTitle>
                     <CardDescription>Here's why the AI made these suggestions.</CardDescription>
                </CardHeader>
                <CardContent>
                     <p className="text-sm leading-relaxed whitespace-pre-wrap">{result.reasoning}</p>
                </CardContent>
            </Card>
        </div>
      )}
    </div>
  );
}
