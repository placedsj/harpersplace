'use client';

import React, { useState, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Clipboard, ClipboardCheck, X, Upload } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';
import Image from 'next/image';
import { generateSummaryAction, getSignedUrlAction } from './actions';

const formSchema = z.object({
  ramble: z.string().min(10, 'Please provide a bit more detail about your day.'),
});

type FormValues = z.infer<typeof formSchema>;

type Summary = {
    title: string;
    childsMood: string;
    activities: string[];
    healthAndWellness: string;
    headsUpForTheWeek: string;
    fullSummary: string;
    mediaUrls?: string[];
}

export default function TransitionSummaryPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [summary, setSummary] = useState<Summary | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [hasCopied, setHasCopied] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<string[]>([]);
  const [filePreviews, setFilePreviews] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { ramble: '' },
  });
  
  const removeImage = (index: number) => {
    setFilePreviews(prev => prev.filter((_, i) => i !== index));
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
  }

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!user) {
        toast({ variant: 'destructive', title: 'Authentication Error', description: 'You must be logged in to upload files.' });
        return;
    }
    const files = Array.from(event.target.files || []);
    if (!files.length) return;

    const newPreviews = files.map(file => URL.createObjectURL(file));
    setFilePreviews(prev => [...prev, ...newPreviews]);

    const uploadPromises = files.map(async file => {
        try {
            const { signedUrl, publicUrl } = await getSignedUrlAction(file.name, file.type, user.uid);

            await fetch(signedUrl, {
                method: 'PUT',
                body: file,
                headers: { 'Content-Type': file.type },
            });
            return publicUrl;
        } catch (error) {
            console.error('Upload failed for', file.name, error);
            toast({ variant: 'destructive', title: 'Upload Failed', description: `Could not upload ${file.name}. Please try again.` });
            return null;
        }
    });

    const results = await Promise.all(uploadPromises);
    const successfulUploads = results.filter((url): url is string => url !== null);
    setUploadedFiles(prev => [...prev, ...successfulUploads]);
  };

  const onSubmit = async (values: FormValues) => {
    setIsLoading(true);
    setSummary(null);
    try {
      const result = await generateSummaryAction(values.ramble, uploadedFiles);
      setSummary(result);
    } catch (error) {
      console.error('Failed to generate summary:', error);
      toast({ variant: 'destructive', title: 'Error', description: 'Could not generate the summary. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = () => {
    if (!summary) return;
    let textToCopy = `
**${summary.title}**

**Mood:** ${summary.childsMood}

**Activities:**
${summary.activities.map(a => `- ${a}`).join('\n')}

**Health & Wellness:** ${summary.healthAndWellness}

**Heads up for the week:** ${summary.headsUpForTheWeek}

**Summary:**
${summary.fullSummary}
    `;
    if (summary.mediaUrls && summary.mediaUrls.length > 0) {
        textToCopy += `\n**Attachments:**\n${summary.mediaUrls.join('\n')}`;
    }
    navigator.clipboard.writeText(textToCopy.trim());
    setHasCopied(true);
    toast({ title: 'Copied to Clipboard!' });
    setTimeout(() => setHasCopied(false), 2000);
  }

  return (
    <div className="space-y-8">
        <div>
            <h1 className="text-3xl font-headline font-extra-bold uppercase tracking-tight">Transition Summary Generator</h1>
            <p className="text-muted-foreground mt-1">
                Turn your notes, and photos, into a clear, neutral summary for your co-parent.
            </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
            <Card>
                <CardHeader>
                    <CardTitle>Your Notes & Photos</CardTitle>
                    <CardDescription>Ramble on about your day. Add some photos. The AI will handle the rest.</CardDescription>
                </CardHeader>
                <CardContent>
                     <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                             <FormField
                                control={form.control}
                                name="ramble"
                                render={({ field }) => (
                                    <FormItem>
                                    <FormControl>
                                        <Textarea {...field} rows={10} placeholder="Tell me about your day..." />
                                    </FormControl>
                                    <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <div className="space-y-2">
                                <FormLabel>Add Photos</FormLabel>
                                <div 
                                    className="border-2 border-dashed border-muted rounded-lg p-6 text-center cursor-pointer hover:border-primary/50 transition-colors"
                                    onClick={() => fileInputRef.current?.click()}
                                >
                                    <Upload className="mx-auto h-8 w-8 text-muted-foreground"/>
                                    <p className="mt-2 text-sm text-muted-foreground">Click or tap to upload photos</p>
                                </div>
                                <input 
                                    type="file" 
                                    ref={fileInputRef} 
                                    onChange={handleFileChange} 
                                    className="hidden" 
                                    accept="image/*" 
                                    multiple 
                                />
                            </div>
                             {filePreviews.length > 0 && (
                                <div className="grid grid-cols-3 gap-2">
                                    {filePreviews.map((src, index) => (
                                        <div key={index} className="relative group">
                                            <Image src={src} alt={`preview ${index}`} width={150} height={150} className="rounded-md object-cover w-full h-auto" />
                                            <Button variant="destructive" size="icon" className="absolute top-1 right-1 h-6 w-6 opacity-0 group-hover:opacity-100" onClick={() => removeImage(index)}><X className="h-4 w-4"/></Button>
                                        </div>
                                    ))}
                                </div>
                            )}
                            <Button type="submit" disabled={isLoading || (fileInputRef.current?.files?.length || 0) > uploadedFiles.length} className='w-full'>
                                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />} 
                                Generate Summary
                            </Button>
                        </form>
                    </Form>
                </CardContent>
            </Card>

            {summary && (
                 <Card>
                    <CardHeader className='flex-row items-start justify-between'>
                        <div>
                            <CardTitle>AI-Generated Summary</CardTitle>
                            <CardDescription>Ready to send to your co-parent.</CardDescription>
                        </div>
                        <Button variant="outline" size="icon" onClick={handleCopy} disabled={hasCopied}>
                            {hasCopied ? <ClipboardCheck className="h-4 w-4" /> : <Clipboard className="h-4 w-4"/>}
                        </Button>
                    </CardHeader>
                    <CardContent className="space-y-4 text-sm">
                        {summary.mediaUrls && summary.mediaUrls.length > 0 && (
                            <div className="grid grid-cols-3 gap-2">
                                {summary.mediaUrls.map((url, i) => <a key={i} href={url} target="_blank" rel="noopener noreferrer"><Image src={url} alt={`uploaded media ${i}`} width={150} height={150} className="rounded-md object-cover w-full h-auto" /></a>)}
                            </div>
                        )}
                        <div className="space-y-1">
                            <h3 className="font-bold text-lg">{summary.title}</h3>
                            <p><span className="font-semibold">Mood:</span> {summary.childsMood}</p>
                        </div>
                         <div className="space-y-1">
                            <h3 className="font-semibold">Activities:</h3>
                            <ul className="list-disc list-inside pl-2">
                                {summary.activities.map((activity, i) => <li key={i}>{activity}</li>)}
                            </ul>
                        </div>
                        <div className="space-y-1">
                            <h3 className="font-semibold">Health & Wellness:</h3>
                            <p>{summary.healthAndWellness}</p>
                        </div>
                         <div className="space-y-1">
                            <h3 className="font-semibold">Heads up for the week:</h3>
                            <p>{summary.headsUpForTheWeek}</p>
                        </div>
                         <div className="space-y-1 bg-slate-50 dark:bg-slate-800/50 p-3 rounded-md">
                            <h3 className="font-semibold">Full Summary:</h3>
                            <p className='whitespace-pre-wrap'>{summary.fullSummary}</p>
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    </div>
  );
}
