// src/components/ai-co-parenting-actions.tsx
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
import { Badge } from '@/components/ui/badge';
import { Loader2, Wand2, CalendarCheck, ArrowRightLeft, CheckCircle } from 'lucide-react';
import { coParentingActionsAction } from './ai-co-parenting-actions/actions';
import type { CoParentingActionsOutput } from '@/ai/flows/co-parenting-actions';

const formSchema = z.object({
  text: z.string().min(10, 'Please describe the scheduling issue in more detail.'),
});

const actionTypeConfig: Record<string, { label: string; icon: React.ReactNode; color: string }> = {
  request: {
    label: 'Request',
    icon: <CalendarCheck className="w-4 h-4" />,
    color: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
  },
  confirm: {
    label: 'Confirm',
    icon: <CheckCircle className="w-4 h-4" />,
    color: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
  },
  propose_swap: {
    label: 'Propose Swap',
    icon: <ArrowRightLeft className="w-4 h-4" />,
    color: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300',
  },
};

export function AiCoParentingActions() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<CoParentingActionsOutput | null>(null);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      text: "I have a work conference on my scheduled weekend with Harper next month. Can we swap weekends?",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setResult(null);
    try {
      const output = await coParentingActionsAction(values.text);
      if (output) {
        setResult(output);
      } else {
        toast({
          variant: 'destructive',
          title: 'An error occurred',
          description: 'Failed to generate recommendations. Please try again.',
        });
      }
    } catch (error) {
      console.error('Error getting co-parenting actions:', error);
      toast({
        variant: 'destructive',
        title: 'An error occurred',
        description: 'Failed to generate recommendations. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="grid gap-8 lg:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Describe the Situation</CardTitle>
          <CardDescription>
            Describe your scheduling concern or request. The AI mediator will suggest clear, actionable steps.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="text"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Your Message</FormLabel>
                    <FormControl>
                      <Textarea rows={8} placeholder="e.g., I need to swap a weekend due to a family event..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={isLoading} size="lg" className="w-full sm:w-auto">
                {isLoading ? <Loader2 className="animate-spin" /> : <Wand2 />}
                <span>{isLoading ? 'Analyzing...' : 'Get Recommendations'}</span>
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>AI Recommendations</CardTitle>
          <CardDescription>
            Here is the AI mediator's response and any suggested scheduling actions.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {isLoading && (
            <div className="flex flex-col items-center justify-center text-muted-foreground pt-10">
              <Loader2 className="animate-spin h-8 w-8 mb-2" />
              <p>The AI mediator is analyzing your message...</p>
            </div>
          )}
          {!result && !isLoading && (
            <div className="text-center text-muted-foreground py-10">
              <p>Recommendations will appear here.</p>
            </div>
          )}
          {result && (
            <div className="space-y-6">
              <div>
                <h3 className="font-semibold text-base mb-2">Mediator Response</h3>
                <div className="p-4 bg-muted rounded-md text-sm border">
                  <p>{result.text}</p>
                </div>
              </div>
              {result.tool_requests && result.tool_requests.length > 0 && (
                <div>
                  <h3 className="font-semibold text-base mb-3">Suggested Actions</h3>
                  <div className="space-y-3">
                    {result.tool_requests.map((action, index) => {
                      const config = actionTypeConfig[action.args?.type] ?? actionTypeConfig['request'];
                      return (
                        <div
                          key={index}
                          className="p-4 border rounded-lg bg-white dark:bg-gray-800 shadow-sm"
                        >
                          <div className="flex items-center gap-2 mb-2">
                            <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${config.color}`}>
                              {config.icon}
                              {config.label}
                            </span>
                            <span className="font-semibold text-sm">{action.args?.title}</span>
                          </div>
                          <p className="text-sm text-muted-foreground">{action.args?.details}</p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
