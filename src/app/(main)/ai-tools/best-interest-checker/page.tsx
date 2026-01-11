// src/app/(main)/ai-tools/best-interest-checker/page.tsx
'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { childsBestInterestCheck, ChildsBestInterestCheckOutput } from '@/ai/flows/childs-best-interest-check';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, Sparkles, HelpCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const formSchema = z.object({
  dilemma: z.string().min(15, 'Please describe your dilemma in more detail (at least 15 characters).'),
});

export default function BestInterestCheckerPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<ChildsBestInterestCheckOutput | null>(null);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      dilemma: "My ex wants to change the pickup time on Friday by an hour, but it will make us late for dinner. Should I fight it?",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setResult(null);
    try {
      const output = await childsBestInterestCheck(values);
      setResult(output);
    } catch (error) {
      console.error('Error checking best interest:', error);
      toast({
        variant: 'destructive',
        title: 'An error occurred',
        description: 'Failed to get advice. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-headline font-extra-bold uppercase tracking-tight">Child's Best Interest Checker</h1>
        <p className="text-muted-foreground mt-1">
          When in doubt, ask the AI advocate. Get a quick, child-focused perspective on your co-parenting dilemma.
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Describe Your Dilemma</CardTitle>
            <CardDescription>Explain the situation. The more context, the better the advice.</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="dilemma"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>The Situation</FormLabel>
                      <FormControl>
                        <Textarea rows={8} placeholder="e.g., 'The other parent wants to take Harper on an unplanned trip this weekend, but it's my scheduled time...'" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" disabled={isLoading} size="lg" className="w-full sm:w-auto">
                  {isLoading ? <Loader2 className="animate-spin" /> : <HelpCircle />}
                  <span>Get Advice</span>
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>

        <Card className="flex flex-col items-center justify-center bg-gradient-to-br from-background to-muted/30">
          <CardHeader className="text-center">
            <CardTitle>The Advocate's Advice</CardTitle>
            <CardDescription>An impartial, child-first perspective.</CardDescription>
          </CardHeader>
          <CardContent className="flex-grow flex items-center justify-center w-full">
            <div className="w-full text-center p-4">
              <AnimatePresence mode="wait">
                {isLoading && (
                  <motion.div
                    key="loading"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="flex flex-col items-center justify-center text-muted-foreground"
                  >
                    <Loader2 className="animate-spin h-10 w-10 mb-3" />
                    <p>Consulting the Best Interest Principle...</p>
                  </motion.div>
                )}
                {!isLoading && !result && (
                  <motion.div
                    key="initial"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex flex-col items-center justify-center text-muted-foreground"
                  >
                     <div className="w-24 h-24 rounded-full bg-muted flex items-center justify-center mb-4 border">
                        <HelpCircle className="h-10 w-10 text-muted-foreground/50"/>
                     </div>
                    <p>Your AI advocate is standing by.</p>
                  </motion.div>
                )}
                {result && (
                  <motion.div
                    key="result"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, type: "spring" }}
                    className="space-y-4"
                  >
                    <div className="p-6 bg-primary/10 rounded-xl border-2 border-primary/20">
                      <p className="text-lg font-semibold text-primary-dark dark:text-primary-foreground">{result.advice}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-muted-foreground tracking-wider uppercase">GUIDING PRINCIPLE</h3>
                      <p className="font-bold text-base text-foreground/80">{result.principle}</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
