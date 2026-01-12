
// src/app/(main)/evidence-ai/page.tsx
'use client';

import { useState, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Upload, Wand2, FilePlus, FileText } from 'lucide-react';
import { processEvidenceImage, ProcessEvidenceImageOutput } from '@/ai/flows/process-evidence-image';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

export default function EvidenceAiPage() {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<ProcessEvidenceImageOutput | null>(null);
  const { toast } = useToast();
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setResult(null);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const handleAnalyze = async () => {
    if (!file || !previewUrl) {
      toast({
        variant: 'destructive',
        title: 'No file selected',
        description: 'Please select an image file to analyze.',
      });
      return;
    }

    setIsLoading(true);
    setResult(null);

    try {
      const output = await processEvidenceImage({ imageDataUri: previewUrl });
      setResult(output);
    } catch (error) {
      console.error('Error processing evidence:', error);
      toast({
        variant: 'destructive',
        title: 'Analysis Failed',
        description: 'There was an error analyzing your image. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleAddToLog = () => {
    if (!result) return;
    const query = new URLSearchParams({
        category: result.suggestedCategory,
        description: result.suggestedTitle, // Use the more concise title for the log summary
        evidence: `AI-Extracted Text: "${result.extractedText}"\n\nAI Summary: "${result.summary}"`,
    });
    router.push(`/evidence-log?${query.toString()}`);
  };

  const triggerFileSelect = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-headline font-extra-bold uppercase tracking-tight">Evidence AI Assistant</h1>
        <p className="text-muted-foreground mt-1">
          Upload an image (screenshot, receipt, etc.) to automatically extract text and categorize it for your evidence log.
        </p>
      </div>
      <div className="grid gap-6 lg:grid-cols-2 items-start">
        <Card>
          <CardHeader>
            <CardTitle>1. Upload Evidence</CardTitle>
            <CardDescription>Select an image file from your device.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div 
              className="border-2 border-dashed border-muted-foreground/30 rounded-lg p-8 text-center cursor-pointer hover:bg-accent/50 transition-colors"
              onClick={triggerFileSelect}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
              {previewUrl ? (
                <Image src={previewUrl} alt="Selected preview" width={400} height={200} className="mx-auto rounded-md object-contain max-h-48" />
              ) : (
                <div className="flex flex-col items-center gap-2 text-muted-foreground">
                    <Upload className="w-10 h-10" />
                    <p className="font-semibold">Click to browse or drag & drop</p>
                    <p className="text-xs">PNG, JPG, GIF accepted</p>
                </div>
              )}
            </div>
            {file && <p className="text-sm text-center text-muted-foreground">Selected: {file.name}</p>}
            <Button onClick={handleAnalyze} disabled={isLoading || !file} className="w-full">
              {isLoading ? <Loader2 className="animate-spin" /> : <Wand2 />}
              <span>Analyze Image</span>
            </Button>
          </CardContent>
        </Card>

        <Card className={!result && !isLoading ? 'flex items-center justify-center' : ''}>
          <CardHeader>
            <CardTitle>2. AI Analysis</CardTitle>
            <CardDescription>Review the AI's analysis before adding to your log.</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading && (
              <div className="flex flex-col items-center justify-center h-full text-muted-foreground pt-10">
                <Loader2 className="animate-spin h-8 w-8 mb-2" />
                <p>Analyzing your image...</p>
              </div>
            )}
            {!result && !isLoading && (
              <div className="text-center text-muted-foreground py-10">
                <FileText className="mx-auto h-12 w-12" />
                <p className="mt-2 font-semibold">Your analysis will appear here.</p>
                <p className="text-sm">Upload an image and click analyze to get started.</p>
              </div>
            )}
            {result && (
              <div className="space-y-6">
                <div>
                    <h3 className="font-semibold mb-1 text-sm text-muted-foreground">Suggested Title</h3>
                    <p className="p-3 bg-muted rounded-md text-sm border">{result.suggestedTitle}</p>
                </div>
                <div>
                    <h3 className="font-semibold mb-1 text-sm text-muted-foreground">Suggested Category</h3>
                    <p className="p-3 bg-muted rounded-md text-sm border">{result.suggestedCategory}</p>
                </div>
                <div>
                  <h3 className="font-semibold mb-1 text-sm text-muted-foreground">Summary</h3>
                  <p className="p-3 bg-muted rounded-md text-sm border">{result.summary}</p>
                </div>
                <div>
                  <h3 className="font-semibold mb-1 text-sm text-muted-foreground">Extracted Text (OCR)</h3>
                  <div className="p-3 bg-muted rounded-md text-sm max-h-32 overflow-y-auto border">
                    <p className="whitespace-pre-wrap">{result.extractedText || "No text found."}</p>
                  </div>
                </div>
                <Button onClick={handleAddToLog} className="w-full">
                    <FilePlus />
                    <span>Add to Evidence Log</span>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
