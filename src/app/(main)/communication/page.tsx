
// src/app/(main)/communication/page.tsx
'use client';

import * as React from 'react';
import { useSearchParams } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Wand2, Send, Sparkles, Loader2, HelpCircle, ShieldCheck, Video } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { coParentingActions } from '@/ai/flows/co-parenting-actions';
import { improveCommunication, ImproveCommunicationOutput } from '@/ai/flows/improve-communication';
import { childsBestInterestCheck, ChildsBestInterestCheckOutput } from '@/ai/flows/childs-best-interest-check';
import { useIsMobile } from '@/hooks/use-mobile';
import { VideoCall } from '@/components/video-call';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"


type Message = {
    id: number;
    user: 'Mom' | 'Dad' | 'AI_MEDIATOR' | 'AI_ADVOCATE';
    avatar: string;
    initials: string;
    text: string;
    timestamp: string;
    actions?: any[];
    advice?: ChildsBestInterestCheckOutput;
};

const initialMessages: Message[] = [
    {
        id: 1,
        user: 'Dad',
        avatar: '',
        initials: 'C',
        text: "Hey, just wanted to confirm you're picking up Harper from school today?",
        timestamp: "10:30 AM"
    },
    {
        id: 2,
        user: 'Mom',
        avatar: '',
        initials: 'E',
        text: "Yes, I'll be there to pick her up. She has her soccer practice afterwards, so I'll take her to that as well.",
        timestamp: "10:32 AM"
    },
];

function AiCoachDialog({ message, onUseSuggestion }: { message: string; onUseSuggestion: (suggestion: string) => void }) {
    const [isLoading, setIsLoading] = React.useState(true);
    const [result, setResult] = React.useState<ImproveCommunicationOutput | null>(null);

    React.useEffect(() => {
        const getSuggestion = async () => {
            setIsLoading(true);
            try {
                const output = await improveCommunication({ message });
                setResult(output);
            } catch (error) {
                console.error("AI Coach error:", error);
            } finally {
                setIsLoading(false);
            }
        };
        getSuggestion();
    }, [message]);

    return (
        <DialogContent className="max-w-2xl">
            <DialogHeader>
                <DialogTitle>AI Communication Coach</DialogTitle>
                <DialogDescription>
                    Here's a more collaborative and child-focused version of your message.
                </DialogDescription>
            </DialogHeader>
            <div className="space-y-6">
                {isLoading ? (
                    <div className="flex items-center justify-center h-40">
                        <Loader2 className="animate-spin" />
                    </div>
                ) : result ? (
                    <>
                        <div>
                            <h3 className="font-semibold mb-2 text-sm">Your Original Message</h3>
                            <p className="p-3 bg-muted rounded-md text-sm border">{message}</p>
                        </div>
                        <div>
                            <h3 className="font-semibold mb-2 text-sm text-primary">AI's Suggested Revision</h3>
                            <p className="p-3 bg-primary/10 rounded-md text-sm border border-primary/20">{result.revisedMessage}</p>
                        </div>
                        <Button onClick={() => onUseSuggestion(result.revisedMessage)} className="w-full">
                            Use This Suggestion
                        </Button>
                    </>
                ) : (
                    <p>Could not get a suggestion.</p>
                )}
            </div>
        </DialogContent>
    );
}

function CommunicationPageInternal() {
    const [messages, setMessages] = React.useState<Message[]>(initialMessages);
    const [newMessage, setNewMessage] = React.useState('');
    const [isSending, setIsSending] = React.useState(false);
    const [isCoachOpen, setIsCoachOpen] = React.useState(false);
    const [isVideoOpen, setIsVideoOpen] = React.useState(false);
    const { toast } = useToast();
    const searchParams = useSearchParams();
    const isMobile = useIsMobile();

    React.useEffect(() => {
        const draftMessage = searchParams.get('draft');
        if (draftMessage) {
            setNewMessage(draftMessage);
        }
    }, [searchParams]);

    const handleSendMessage = async () => {
        if (newMessage.trim() === '') return;
        setIsSending(true);

        const userMessage: Message = {
            id: messages.length + 1,
            user: 'Dad', // Assuming 'Dad' is the current user for demo
            avatar: '',
            initials: 'C',
            text: newMessage,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };

        setMessages(prev => [...prev, userMessage]);
        setNewMessage('');

        try {
            const result = await coParentingActions({ text: userMessage.text });
            const aiResponse: Message = {
                id: messages.length + 2,
                user: 'AI_MEDIATOR',
                avatar: '',
                initials: 'AI',
                text: result.text,
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                actions: result.tool_requests
            };
            setMessages(prev => [...prev, aiResponse]);
        } catch (error) {
            console.error("Error with co-parenting actions:", error);
            toast({
                variant: 'destructive',
                title: 'AI Mediator Error',
                description: 'Could not get a response from the AI mediator.'
            });
        } finally {
            setIsSending(false);
        }
    };
    
    const handleAskAdvocate = async () => {
        if (newMessage.trim() === '') return;
        setIsSending(true);
        const dilemma = newMessage;
        setNewMessage('');

        try {
            const result = await childsBestInterestCheck({ dilemma });
            const aiAdvocateResponse: Message = {
                id: messages.length + 1,
                user: 'AI_ADVOCATE',
                avatar: '',
                initials: 'AD',
                text: '', // Text is unused for advocate messages
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                advice: result,
            };
            setMessages(prev => [...prev, aiAdvocateResponse]);

        } catch (error) {
            console.error("Error with AI Advocate:", error);
            toast({
                variant: 'destructive',
                title: 'AI Advocate Error',
                description: 'Could not get advice from the AI advocate.'
            });
        } finally {
            setIsSending(false);
        }
    };
    
    const handleActionClick = (tool: string, args: any) => {
        toast({
            title: "Action Logged!",
            description: `Your proposal '${args.title}' has been officially logged.`
        });
    }
    
    const handleUseSuggestion = (suggestion: string) => {
        setNewMessage(suggestion);
        setIsCoachOpen(false);
    };

    const currentUser = 'Dad'; // For styling purposes
    
    const VideoCallDialog = isMobile ? Sheet : Dialog;
    const VideoCallTrigger = isMobile ? SheetTrigger : DialogTrigger;
    const VideoCallContent = isMobile ? SheetContent : DialogContent;


  return (
    <div className="space-y-8">
        <div>
            <h1 className="text-4xl font-headline uppercase tracking-tight text-primary drop-shadow-md">COMMUNICATION HUB</h1>
            <p className="text-lg font-sans text-accent mt-1 tracking-wide">
                A secure, AI-mediated channel for all co-parenting communication.
            </p>
        </div>
        <Card className="shadow-lg border-2 border-primary/40">
            <CardHeader className="flex flex-row items-center justify-between">
                <div>
                    <CardTitle className="font-headline uppercase text-primary tracking-widest">CONVERSATION WITH EMMA</CardTitle>
                    <CardDescription className="font-sans text-accent">All messages are timestamped and analyzed by the AI Mediator to suggest actions and improvements.</CardDescription>
                </div>
                 <VideoCallDialog open={isVideoOpen} onOpenChange={setIsVideoOpen}>
                    <VideoCallTrigger asChild>
                        <Button variant="outline">
                            <Video />
                            <span>Video Call</span>
                        </Button>
                    </VideoCallTrigger>
                    <VideoCallContent className={isMobile ? "w-full h-full p-0" : "max-w-4xl p-0"} onInteractOutside={(e) => e.preventDefault()}>
                        <VideoCall onCallEnd={() => setIsVideoOpen(false)}/>
                    </VideoCallContent>
                </VideoCallDialog>

            </CardHeader>
            <CardContent className="flex flex-col h-[65vh]">
                <div className="flex-grow space-y-6 overflow-y-auto p-4 border rounded-md bg-muted/20">
                    {messages.map(msg => (
                        <div key={msg.id}>
                            <div className={cn(
                                "flex items-end gap-3",
                                msg.user === currentUser ? "justify-end" : "justify-start"
                            )}>
                                 {msg.user !== currentUser && (
                                    <Avatar className="h-8 w-8">
                                        <AvatarFallback className={cn(
                                            (msg.user === 'AI_MEDIATOR' || msg.user === 'AI_ADVOCATE') && 'bg-primary/20 text-primary'
                                        )}>{msg.initials}</AvatarFallback>
                                    </Avatar>
                                 )}
                                 <div className={cn(
                                    "max-w-xs md:max-w-md lg:max-w-lg p-3 rounded-lg",
                                    msg.user === currentUser && "bg-primary text-primary-foreground",
                                    msg.user === 'Mom' && "bg-muted",
                                    msg.user === 'AI_MEDIATOR' && "bg-accent text-accent-foreground",
                                    msg.user === 'AI_ADVOCATE' && "bg-transparent border-none p-0"
                                 )}>
                                    {msg.user === 'AI_ADVOCATE' && msg.advice ? (
                                        <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border-l-4 border-blue-400 w-full">
                                            <h4 className="font-semibold text-blue-800 dark:text-blue-200 flex items-center gap-2"><ShieldCheck className="w-5 h-5"/> AI Advocate's Perspective</h4>
                                            <p className="text-base text-blue-900 dark:text-blue-100 my-2">{msg.advice.advice}</p>
                                            <p className="text-xs text-blue-700 dark:text-blue-300"><strong>Principle:</strong> {msg.advice.principle}</p>
                                        </div>
                                    ) : (
                                        <p className="text-sm">{msg.text}</p>
                                    )}
                                    <p className="text-xs mt-1 text-right opacity-70">{msg.timestamp}</p>
                                 </div>
                                 {msg.user === currentUser && (
                                    <Avatar className="h-8 w-8">
                                        <AvatarFallback>{msg.initials}</AvatarFallback>
                                    </Avatar>
                                 )}
                            </div>
                            {msg.actions && msg.actions.length > 0 && (
                                <div className="flex justify-start mt-2">
                                    <div className="ml-11 p-3 bg-muted rounded-md space-y-2 border-l-4 border-primary">
                                        <p className="text-sm font-semibold flex items-center gap-2"><Sparkles className="w-4 h-4 text-primary" /> AI Suggested Actions</p>
                                        <p className="text-xs text-muted-foreground">The AI mediator detected an actionable item in the conversation. You can use these buttons to create a formal log entry.</p>
                                        <div className="flex flex-wrap gap-2 pt-2">
                                            {msg.actions.map((tool, index) => (
                                                <Button key={index} size="sm" variant="outline" onClick={() => handleActionClick(tool.name, tool.args)}>
                                                    {tool.args.title}
                                                </Button>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                     {isSending && (
                        <div className="flex items-end gap-3 justify-start">
                             <Avatar className="h-8 w-8">
                                <AvatarFallback>AI</AvatarFallback>
                            </Avatar>
                            <div className="max-w-xs md:max-w-md lg:max-w-lg p-3 rounded-lg bg-muted">
                                <div className="flex items-center gap-2">
                                    <Loader2 className="animate-spin h-4 w-4" />
                                    <p className="text-sm">Thinking...</p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
                <div className="mt-4 flex items-center gap-2">
                    <Input 
                        placeholder="Type your message or dilemma..."
                        className="flex-grow"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && !isSending && handleSendMessage()}
                        disabled={isSending}
                    />
                    <Dialog open={isCoachOpen} onOpenChange={setIsCoachOpen}>
                        <DialogTrigger asChild>
                            <Button variant="outline" size="icon" aria-label="AI Coach" disabled={newMessage.trim().length < 10}>
                                <Wand2 />
                            </Button>
                        </DialogTrigger>
                        {isCoachOpen && <AiCoachDialog message={newMessage} onUseSuggestion={handleUseSuggestion} />}
                    </Dialog>
                     <Button variant="outline" size="icon" onClick={handleAskAdvocate} aria-label="Ask AI Advocate" disabled={isSending || newMessage.trim().length < 10}>
                        <HelpCircle />
                    </Button>
                    <Button size="icon" onClick={handleSendMessage} aria-label="Send Message" disabled={isSending}>
                        <Send />
                    </Button>
                </div>
            </CardContent>
        </Card>
    </div>
  );
}

// Wrap the component in a Suspense boundary to use useSearchParams
export default function CommunicationPage() {
    return (
        <React.Suspense fallback={<div>Loading...</div>}>
            <CommunicationPageInternal />
        </React.Suspense>
    );
}

    