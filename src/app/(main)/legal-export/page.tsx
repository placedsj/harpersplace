// src/app/(main)/legal-export/page.tsx
'use client';

import * as React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { format, subMonths } from 'date-fns';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';
import { CalendarIcon, Loader2, BookLock, Printer } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/use-auth';
import { useFirestore } from '@/firebase';
import { collection, query, where, orderBy, Timestamp, getDocs } from 'firebase/firestore';
import { Badge } from '@/components/ui/badge';

const reportSchema = z.object({
  startDate: z.date(),
  endDate: z.date(),
}).refine((data) => data.endDate >= data.startDate, {
  message: "End date cannot be before start date.",
  path: ["endDate"],
});

type ReportFormValues = z.infer<typeof reportSchema>;

interface EvidenceEntry {
  id: string;
  date: string;
  category: 'Communication' | 'Custody Exchange' | 'Financial' | 'Health' | 'Other';
  description: string;
  evidence: string;
  timestamp: Timestamp;
}

export default function LegalExportPage() {
    const { user } = useAuth();
    const { db } = useFirestore();
    const { toast } = useToast();
    const [isLoading, setIsLoading] = React.useState(false);
    const [reportData, setReportData] = React.useState<EvidenceEntry[] | null>(null);

    const form = useForm<ReportFormValues>({
        resolver: zodResolver(reportSchema),
        defaultValues: {
            startDate: subMonths(new Date(), 1),
            endDate: new Date(),
        },
    });

    const onSubmit = async (values: ReportFormValues) => {
        if (!user || !db) {
            toast({ variant: 'destructive', title: 'You must be logged in to generate a report.' });
            return;
        }
        setIsLoading(true);
        setReportData(null);
        try {
            const startOfDay = new Date(values.startDate);
            startOfDay.setHours(0, 0, 0, 0);
            
            const endOfDay = new Date(values.endDate);
            endOfDay.setHours(23, 59, 59, 999);

            const startTimestamp = Timestamp.fromDate(startOfDay);
            const endTimestamp = Timestamp.fromDate(endOfDay);
            
            const q = query(
                collection(db, `users/${user.uid}/evidence`),
                where('timestamp', '>=', startTimestamp),
                where('timestamp', '<=', endTimestamp),
                orderBy('timestamp', 'asc')
            );
            
            const querySnapshot = await getDocs(q);
            const results = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as EvidenceEntry));
            setReportData(results);

            if (results.length === 0) {
                 toast({ title: 'No Data Found', description: 'There are no evidence entries in the selected date range.' });
            } else {
                toast({ title: 'Report Generated', description: `Found ${results.length} entries. Click 'Print or Save' to continue.` });
            }
        } catch (error) {
            console.error(error);
            toast({ variant: 'destructive', title: 'Error', description: 'Could not generate the report.' });
        } finally {
            setIsLoading(false);
        }
    };
    
    const handleDownload = () => {
        toast({ title: 'Preparing Report...', description: 'Your browser\'s print dialog will open. Use "Save as PDF" to create a file.' });
        setTimeout(() => window.print(), 500);
    };

    return (
        <div id="legal-export-page">
            <div className="space-y-8 print:hidden">
                 <div>
                    <h1 className="text-3xl font-headline font-extrabold uppercase tracking-tight">Legal Export Center</h1>
                    <p className="text-muted-foreground mt-1">
                        Generate professional, court-ready reports from your logged data.
                    </p>
                </div>
                
                <div className="grid lg:grid-cols-3 gap-8 items-start">
                    <div className="lg:col-span-1">
                        <Card>
                            <CardHeader>
                                <CardTitle>1. Generate Report</CardTitle>
                                <CardDescription>Select a date range to generate a chronological report of all logged evidence.</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <Form {...form}>
                                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                                        <FormField
                                            control={form.control}
                                            name="startDate"
                                            render={({ field }) => (
                                            <FormItem className="flex flex-col">
                                                <FormLabel>Start Date</FormLabel>
                                                <Popover>
                                                    <PopoverTrigger asChild>
                                                        <FormControl>
                                                            <Button variant="outline" className={cn("pl-3 text-left font-normal", !field.value && "text-muted-foreground")}>
                                                                {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                                                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                                            </Button>
                                                        </FormControl>
                                                    </PopoverTrigger>
                                                    <PopoverContent className="w-auto p-0" align="start">
                                                        <Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus />
                                                    </PopoverContent>
                                                </Popover>
                                                <FormMessage />
                                            </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name="endDate"
                                            render={({ field }) => (
                                            <FormItem className="flex flex-col">
                                                <FormLabel>End Date</FormLabel>
                                                <Popover>
                                                    <PopoverTrigger asChild>
                                                        <FormControl>
                                                            <Button variant="outline" className={cn("pl-3 text-left font-normal", !field.value && "text-muted-foreground")}>
                                                                {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                                                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                                            </Button>
                                                        </FormControl>
                                                    </PopoverTrigger>
                                                    <PopoverContent className="w-auto p-0" align="start">
                                                        <Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus />
                                                    </PopoverContent>
                                                </Popover>
                                                <FormMessage />
                                            </FormItem>
                                            )}
                                        />
                                        <Button type="submit" className="w-full" disabled={isLoading}>
                                            {isLoading ? <Loader2 className="animate-spin" /> : <span>Generate Report</span>}
                                        </Button>
                                    </form>
                                </Form>
                            </CardContent>
                        </Card>
                    </div>
                    <div className="lg:col-span-2">
                        <Card>
                            <CardHeader>
                                <CardTitle>2. Preview & Save</CardTitle>
                                <CardDescription>A preview of your report will appear here. Click the button to print or save it as a PDF.</CardDescription>
                            </CardHeader>
                            <CardContent>
                                {isLoading && (
                                    <div className="flex items-center justify-center h-48">
                                        <Loader2 className="animate-spin text-primary" />
                                    </div>
                                )}
                                {!isLoading && !reportData && (
                                    <div className="text-center text-muted-foreground py-10">
                                        <BookLock className="mx-auto h-12 w-12" />
                                        <p className="mt-2 font-semibold">Select a date range to generate a report.</p>
                                    </div>
                                )}
                                {reportData && reportData.length === 0 && (
                                    <div className="text-center text-muted-foreground py-10">
                                        <BookLock className="mx-auto h-12 w-12" />
                                        <p className="mt-2 font-semibold">No evidence found in this date range.</p>
                                    </div>
                                )}
                                {reportData && reportData.length > 0 && (
                                    <div className="space-y-4">
                                        <Button className="w-full sm:w-auto" onClick={handleDownload}>
                                            <Printer />
                                            <span>Print or Save as PDF</span>
                                        </Button>
                                        <div id="report-content" className="border rounded-lg p-4 max-h-[60vh] overflow-y-auto">
                                            <div className="text-center border-b pb-4 mb-4">
                                                <h3 className="font-bold text-lg font-headline uppercase text-primary">Evidence Log Report</h3>
                                                <p className="text-sm text-muted-foreground">For {format(form.getValues('startDate'), 'PPP')} to {format(form.getValues('endDate'), 'PPP')}</p>
                                            </div>
                                            <div className="space-y-4">
                                                {reportData.map(entry => (
                                                    <div key={entry.id} className="border-b pb-3 last:border-b-0">
                                                        <p className="font-semibold text-base">{entry.description}</p>
                                                        <div className="flex items-center gap-4 text-xs text-muted-foreground mt-1">
                                                            <p><strong>Event Date:</strong> {format(new Date(entry.date), 'PP')}</p>
                                                            <p><strong>Logged:</strong> {format(entry.timestamp.toDate(), 'PPp')}</p>
                                                            <Badge variant="secondary">{entry.category}</Badge>
                                                        </div>
                                                        <div className="mt-2 text-sm whitespace-pre-wrap bg-muted/50 p-2 rounded-md">{entry.evidence}</div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>

            {/* Hidden, print-only version of the report */}
            <div className="hidden print:block">
                {reportData && reportData.length > 0 && (
                     <div id="print-report-content">
                        <div className="text-center border-b-2 border-black pb-4 mb-8">
                            <h1 className="text-2xl font-bold">Placed.ca Evidence Report</h1>
                            <p className="text-sm">CONFIDENTIAL DOCUMENT</p>
                        </div>
                        <div className="grid grid-cols-2 gap-4 mb-8 text-sm">
                            <div>
                                <p><strong>Report For:</strong> {user?.displayName}</p>
                                <p><strong>Date Generated:</strong> {format(new Date(), 'PPP')}</p>
                            </div>
                            <div className="text-right">
                                <p><strong>Reporting Period:</strong></p>
                                <p>{format(form.getValues('startDate'), 'PPP')} to {format(form.getValues('endDate'), 'PPP')}</p>
                            </div>
                        </div>
                        <h2 className="text-lg font-bold border-b border-black pb-2 mb-4">Chronological Evidence Log</h2>
                        <div className="space-y-6">
                            {reportData.map(entry => (
                                <div key={entry.id} className="avoid-break border-b border-gray-200 pb-4">
                                    <h3 className="font-bold text-base">{entry.description}</h3>
                                    <div className="grid grid-cols-3 gap-4 text-xs text-gray-600 mt-1 mb-2">
                                        <p><strong>Event Date:</strong> {format(new Date(entry.date), 'yyyy-MM-dd')}</p>
                                        <p><strong>Category:</strong> {entry.category}</p>
                                        <p><strong>Logged:</strong> {format(entry.timestamp.toDate(), 'yyyy-MM-dd, p')}</p>
                                    </div>
                                    <div className="mt-2 text-sm whitespace-pre-wrap bg-gray-50 p-3 rounded-md border border-gray-200">
                                        {entry.evidence}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
