
// src/app/(main)/milestones/page.tsx
'use client';

import * as React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { format } from 'date-fns';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Trophy, Stethoscope, Ruler, PlusCircle, CalendarIcon, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/hooks/use-auth';
import { useCollection, useFirestore } from '@/firebase';
import { collection, addDoc, serverTimestamp, query, where, Timestamp } from 'firebase/firestore';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { allMilestones, MilestoneCategory } from '@/lib/milestones-data';
import { Loader2 } from 'lucide-react';

const milestoneSchema = z.object({
  title: z.string().min(1, 'Title is required.'),
  date: z.date(),
  description: z.string().min(1, 'Description is required.'),
  category: z.enum(MilestoneCategory),
});

export type Milestone = {
    id: string;
    title: string;
    date: Timestamp;
    description: string;
    category: z.infer<typeof milestoneSchema.shape.category>;
    userId: string;
    timestamp: Timestamp;
};

const iconMap: Record<Milestone['category'], React.ElementType> = {
    'Cognitive': Trophy,
    'Social & Emotional': Stethoscope,
    'Language & Communication': Ruler,
    'Motor Skills': PlusCircle,
};


export default function MilestonesPage() {
    const { user } = useAuth();
    const { db } = useFirestore();
    const { data: loggedMilestones, loading } = useCollection<Milestone>(
        user && db ? query(collection(db, `users/${user.uid}/milestones`)) : null
    );

    const [isDialogOpen, setIsDialogOpen] = React.useState(false);
    const [isSubmitting, setIsSubmitting] = React.useState(false);
    const { toast } = useToast();

    const form = useForm<z.infer<typeof milestoneSchema>>({
        resolver: zodResolver(milestoneSchema),
        defaultValues: {
            title: '',
            description: '',
            category: 'Motor Skills',
            date: new Date(),
        },
    });

    async function onSubmit(values: z.infer<typeof milestoneSchema>) {
        if (!user || !db) {
            toast({ variant: 'destructive', title: 'You must be logged in.' });
            return;
        }
        setIsSubmitting(true);
        try {
            await addDoc(collection(db, `users/${user.uid}/milestones`), {
                ...values,
                date: Timestamp.fromDate(values.date),
                userId: user.uid,
                timestamp: serverTimestamp(),
            });

            toast({
                title: "Milestone Logged!",
                description: `Successfully logged "${values.title}".`,
            });
            form.reset({
                title: '',
                description: '',
                category: 'Motor Skills',
                date: new Date(),
            });
            setIsDialogOpen(false);
        } catch (error) {
            console.error(error);
            toast({ variant: 'destructive', title: 'Error adding milestone.' });
        } finally {
            setIsSubmitting(false);
        }
    }
    
    const isMilestoneLogged = (title: string) => {
        return loggedMilestones?.some(m => m.title === title) ?? false;
    };

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-headline font-extra-bold uppercase tracking-tight">DEVELOPMENTAL MILESTONES</h1>
                    <p className="text-muted-foreground mt-1">
                        A proactive checklist and living record of Harper's growth and achievements.
                    </p>
                </div>
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                        <Button>
                            <PlusCircle />
                            <span>Log Milestone</span>
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Log a New Milestone</DialogTitle>
                            <DialogDescription>
                                Record a new achievement or event in Harper's development.
                            </DialogDescription>
                        </DialogHeader>
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                                <FormField
                                    control={form.control}
                                    name="title"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Title</FormLabel>
                                            <FormControl>
                                                <Input placeholder="e.g., Said 'dada'" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="date"
                                    render={({ field }) => (
                                        <FormItem className="flex flex-col">
                                            <FormLabel>Date</FormLabel>
                                            <Popover>
                                                <PopoverTrigger asChild>
                                                    <FormControl>
                                                        <Button
                                                            variant={"outline"}
                                                            className={cn(
                                                                "w-full pl-3 text-left font-normal",
                                                                !field.value && "text-muted-foreground"
                                                            )}
                                                        >
                                                            {field.value ? (
                                                                format(field.value, "PPP")
                                                            ) : (
                                                                <span>Pick a date</span>
                                                            )}
                                                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                                        </Button>
                                                    </FormControl>
                                                </PopoverTrigger>
                                                <PopoverContent className="w-auto p-0" align="start">
                                                    <Calendar
                                                        mode="single"
                                                        selected={field.value}
                                                        onSelect={field.onChange}
                                                        disabled={(date) => date > new Date()}
                                                        initialFocus
                                                    />
                                                </PopoverContent>
                                            </Popover>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="category"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Category</FormLabel>
                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select a category" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    {MilestoneCategory.map(cat => <SelectItem key={cat} value={cat}>{cat}</SelectItem>)}
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="description"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Description</FormLabel>
                                            <FormControl>
                                                <Textarea placeholder="Describe the milestone..." {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <DialogFooter>
                                    <DialogClose asChild>
                                        <Button type="button" variant="secondary">Cancel</Button>
                                    </DialogClose>
                                    <Button type="submit" disabled={isSubmitting}>
                                        {isSubmitting && <Loader2 className="animate-spin" />}
                                        Save Milestone
                                    </Button>
                                </DialogFooter>
                            </form>
                        </Form>
                    </DialogContent>
                </Dialog>
            </div>
            
            <Accordion type="multiple" defaultValue={['firstYear']} className="w-full">
                {Object.entries(allMilestones).map(([yearKey, yearData]) => (
                    <AccordionItem value={yearKey} key={yearKey}>
                        <AccordionTrigger className="text-2xl font-headline uppercase tracking-wide text-primary">
                            {yearData.year}
                        </AccordionTrigger>
                        <AccordionContent>
                           <Card className="border-l-4 border-accent bg-accent/10">
                                <CardContent className="p-4 text-accent-foreground/90">
                                    <p>{yearData.description}</p>
                                </CardContent>
                           </Card>
                            <Accordion type="multiple" className="w-full mt-4 space-y-4" defaultValue={[Object.keys(yearData.ageGroups)[0]]}>
                                {Object.entries(yearData.ageGroups).map(([ageKey, ageData]) => (
                                    <Card key={ageKey} className="overflow-hidden">
                                        <AccordionItem value={ageKey} className="border-b-0">
                                            <AccordionTrigger className="bg-muted hover:no-underline px-4 py-3">
                                                <h3 className="text-lg font-semibold">{ageData.range}</h3>
                                            </AccordionTrigger>
                                            <AccordionContent className="p-4">
                                                {loading ? (
                                                    <div className="flex items-center justify-center p-8">
                                                        <Loader2 className="animate-spin text-primary" />
                                                    </div>
                                                ) : (
                                                    <div className="grid gap-6 md:grid-cols-2">
                                                        {Object.entries(ageData.milestones).map(([category, milestones]) => (
                                                            <div key={category}>
                                                                <h4 className="font-semibold text-primary mb-2">{category}</h4>
                                                                <ul className="space-y-3">
                                                                    {milestones.map((milestone) => {
                                                                        const logged = isMilestoneLogged(milestone.title);
                                                                        return (
                                                                            <li key={milestone.title} className="flex items-start gap-3 text-sm">
                                                                                <CheckCircle className={cn("w-5 h-5 mt-0.5 shrink-0", logged ? 'text-green-500' : 'text-muted-foreground/30')} />
                                                                                <div>
                                                                                    <p className={cn("font-medium", logged && "text-muted-foreground line-through")}>{milestone.title}</p>
                                                                                    <p className="text-xs text-muted-foreground">{milestone.description}</p>
                                                                                </div>
                                                                            </li>
                                                                        )
                                                                    })}
                                                                </ul>
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}
                                            </AccordionContent>
                                        </AccordionItem>
                                    </Card>
                                ))}
                            </Accordion>
                        </AccordionContent>
                    </AccordionItem>
                ))}
            </Accordion>
        </div>
    );
}
