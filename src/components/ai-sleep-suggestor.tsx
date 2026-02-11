'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { suggestSleepScheduleAction } from '@/components/ai-sleep-suggestor-actions';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Loader2, Wand2, Forward } from 'lucide-react';
import { Textarea } from './ui/textarea';
import { differenceInMonths } from 'date-fns';

// Import type only
import type { SuggestSleepScheduleOutput } from '@/ai/flows/suggest-sleep-schedule';

const formSchema = z.object({
  ageInMonths: z.coerce.number().min(0, 'Age must be a positive number.'),
  desiredSchedule: z.string().optional(),
});

interface AiSleepSuggestorProps {
    recentLogs: string;
}

const harper_dob = new Date("2024-11-12T00:00:00Z");

export function AiSleepSuggestor({ recentLogs }: AiSleepSuggestorProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<SuggestSleepScheduleOutput | null>(null);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      ageInMonths: differenceInMonths(new Date("2025-09-06T00:00:00Z"), harper_dob),
      desiredSchedule: '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setResult(null);
    try {
      const input = { ...values, recentLogs };
      const output = await suggestSleepScheduleAction(input);
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
      console.error('Error suggesting sleep schedule:', error);
      toast({
        variant: 'destructive',
        title: 'An error occurred',
        description: 'Failed to generate the schedule. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  }

  // Automatically trigger the form submission on initial load
  useEffect(() => {
    if (recentLogs) {
        onSubmit(form.getValues());
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [recentLogs]);


  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>AI Sleep Suggestions</CardTitle>
        <CardDescription>Get AI-powered recommendations for Harper's sleep schedule.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="ageInMonths"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Harper's Age (in months)</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
             <FormField
              control={form.control}
              name="desiredSchedule"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Schedule Goals (Optional)</FormLabel>
                  <FormControl>
                    <Textarea rows={2} placeholder="e.g., trying to set a 7 PM bedtime..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={isLoading} className="w-full">
              {isLoading ? <Loader2 className="animate-spin" /> : <Wand2 />}
              <span>{isLoading ? 'Thinking...' : 'Get New Suggestions'}</span>
            </Button>
          </form>
        </Form>
        
        {result && !isLoading && (
            <div className="mt-6 space-y-4">
                <div className="p-4 bg-primary/10 rounded-lg">
                    <h3 className="font-semibold text-primary-foreground flex items-center gap-2"><Forward />Next Up</h3>
                    <p className="text-sm">Nap: <span className="font-bold">{result.nextNapTime}</span></p>
                    <p className="text-sm">Feed: <span className="font-bold">{result.nextFeedTime}</span></p>
                </div>
                <div>
                    <h3 className="font-semibold">Suggested Schedule</h3>
                    <p className="text-sm text-muted-foreground whitespace-pre-wrap">{result.suggestedSchedule}</p>
                </div>
                 <div>
                    <h3 className="font-semibold">Sleep Tips</h3>
                    <p className="text-sm text-muted-foreground whitespace-pre-wrap">{result.sleepTips}</p>
                </div>
            </div>
        )}

      </CardContent>
    </Card>
  );
}
