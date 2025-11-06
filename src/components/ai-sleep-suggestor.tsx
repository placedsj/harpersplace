// src/components/ai-sleep-suggestor.tsx
'use client';

import { useState, useEffect } from 'react';
import { suggestSleepSchedule, SuggestSleepScheduleOutput } from '@/ai/flows/suggest-sleep-schedule';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Loader2, Wand2, Forward } from 'lucide-react';
import { differenceInMonths } from 'date-fns';

interface AiSleepSuggestorProps {
    recentLogs: string;
}

const harper_dob = new Date("2024-11-12T00:00:00Z");

export function AiSleepSuggestor({ recentLogs }: AiSleepSuggestorProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<SuggestSleepScheduleOutput | null>(null);
  const { toast } = useToast();

  // Automatically trigger the form submission on initial load or when logs change
  useEffect(() => {
    const getSuggestions = async () => {
        if (!recentLogs) return;

        setIsLoading(true);
        setResult(null);
        try {
            const ageInMonths = differenceInMonths(new Date(), harper_dob);
            const input = { ageInMonths, recentLogs };
            const output = await suggestSleepSchedule(input);
            setResult(output);
        } catch (error) {
            console.error('Error suggesting sleep schedule:', error);
            toast({
                variant: 'destructive',
                title: 'AI Suggestion Error',
                description: 'Failed to generate a new sleep schedule.',
            });
        } finally {
            setIsLoading(false);
        }
    };
    
    getSuggestions();
    
  // We only want to re-run this when the logs change.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [recentLogs]);


  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="font-headline uppercase">AI Sleep Suggestions</CardTitle>
        <CardDescription>AI-powered recommendations based on today's logs.</CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading && (
             <div className="flex flex-col items-center justify-center text-muted-foreground pt-10">
                <Loader2 className="animate-spin h-8 w-8 mb-2" />
                <p>Analyzing logs...</p>
            </div>
        )}
        
        {result && !isLoading && (
            <div className="mt-6 space-y-4">
                <div className="p-4 bg-primary/10 rounded-lg">
                    <h3 className="font-semibold text-primary flex items-center gap-2 font-headline uppercase"><Forward />Next Up</h3>
                    <p className="text-sm">Nap: <span className="font-bold">{result.nextNapTime}</span></p>
                    <p className="text-sm">Feed: <span className="font-bold">{result.nextFeedTime}</span></p>
                </div>
                <div>
                    <h3 className="font-semibold font-headline uppercase">Suggested Schedule</h3>
                    <p className="text-sm text-muted-foreground whitespace-pre-wrap">{result.suggestedSchedule}</p>
                </div>
                 <div>
                    <h3 className="font-semibold font-headline uppercase">Sleep Tips</h3>
                    <p className="text-sm text-muted-foreground whitespace-pre-wrap">{result.sleepTips}</p>
                </div>
            </div>
        )}

      </CardContent>
    </Card>
  );
}
