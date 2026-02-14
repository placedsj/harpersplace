// src/components/ai-communication-coach.tsx
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
import { Loader2, Wand2, ArrowRight } from 'lucide-react';
import { improveCommunicationAction } from './ai-communication-coach/actions';
import type { ImproveCommunicationOutput } from '@/ai/flows/improve-communication';

const formSchema = z.object({
  message: z.string().min(10, 'Please enter a message of at least 10 characters.'),
});

export function AiCommunicationCoach() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<ImproveCommunicationOutput | null>(null);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      message: "Why are you always late for pickup? It's not fair to Harper.",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setResult(null);
    try {
      const output = await improveCommunicationAction(values.message);
      if (output) {
        setResult(output);
      } else {
        toast({
            variant: 'destructive',
            title: 'An error occurred',
            description: 'Failed to analyze the message. Please try again.',
        });
      }
    } catch (error) {
      console.error('Error improving communication:', error);
      toast({
        variant: 'destructive',
        title: 'An error occurred',
        description: 'Failed to analyze the message. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="grid gap-8 lg:grid-cols-2">
      <Card>
        <CardHeader>
            <CardTitle>Draft Your Message</CardTitle>
            <CardDescription>Enter the message you want to send. The AI will provide a revised, more constructive version.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="message"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Original Message</FormLabel>
                    <FormControl>
                      <Textarea rows={8} placeholder="Type your message here..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={isLoading} size="lg" className="w-full sm:w-auto">
                {isLoading ? <Loader2 className="animate-spin" /> : <Wand2 />}
                <span>{isLoading ? 'Analyzing...' : 'Improve Message'}</span>
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
            <CardTitle>AI Suggestions</CardTitle>
            <CardDescription>Here is a more collaborative version of your message and the reasoning behind the changes.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
            {isLoading && (
                <div className="flex flex-col items-center justify-center text-muted-foreground pt-10">
                    <Loader2 className="animate-spin h-8 w-8 mb-2" />
                    <p>The AI is refining your message...</p>
                </div>
            )}
            {!result && !isLoading && (
                <div className="text-center text-muted-foreground py-10">
                    <p>Suggestions will appear here.</p>
                </div>
            )}
            {result && (
                <div className="space-y-6">
                    <div>
                        <h3 className="font-semibold text-base mb-2">Revised Message</h3>
                        <div className="p-4 bg-muted rounded-md text-sm border">
                            <p>{result.revisedMessage}</p>
                        </div>
                    </div>
                     <div>
                        <h3 className="font-semibold text-base mb-2">Key Changes</h3>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                           {result.keyChanges.map((change, index) => (
                                <li key={index} className="flex items-start gap-2">
                                    <ArrowRight className="w-4 h-4 mt-1 text-primary shrink-0"/>
                                    <span>{change}</span>
                                </li>
                           ))}
                        </ul>
                    </div>
                </div>
            )}
        </CardContent>
      </Card>
    </div>
  );
}
