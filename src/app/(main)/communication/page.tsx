
// src/app/(main)/communication/page.tsx
'use client';

import * as React from 'react';
import { useSearchParams } from 'next/navigation';
import { useForm, useWatch } from 'react-hook-form';
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
import { useVideoCall } from '@/hooks/use-video-call';
import { useAuth, useCollection, useFirestore } from '@/firebase';
import { collection, addDoc, serverTimestamp, query, orderBy, Timestamp } from 'firebase/firestore';
import { format } from 'date-fns';


import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

type ScheduleActionArgs = {
    title: string;
    type: 'request' | 'confirm' | 'propose_swap';
    details: string;
};

type ActionPayload = {
    name: 'scheduleAction';
    args: ScheduleActionArgs;
};

type Message = {
    id: string;
    userId: string;
    userInitials: string;
    text: string;
    timestamp: Timestamp;
    type: 'USER' | 'AI_MEDIATOR' | 'AI_ADVOCATE';
    actions?: ActionPayload[];
    advice?: ChildsBestInterestCheckOutput;
};

const otherUser = {
    uid: 'jules-placeholder-uid',
    initials: 'J',
    displayName: 'Jules'
}

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

const getInitials = (name: string | null | undefined) => {
    if (!name) return 'U';
    const names = name.split(' ');
    if (names.length > 1) {
        return names[0][0] + names[names.length - 1][0];
    }
    return name.length > 0 ? name[0] : 'U';
}


function CommunicationPageInternal() {
    const { user } = useAuth();
    const { db } = useFirestore();
    const [isSending, setIsSending] = React.useState(false);
    const [isCoachOpen, setIsCoachOpen] = React.useState(false);
    const { toast } = useToast();
    const searchParams = useSearchParams();
    const { setIsVideoOpen } = useVideoCall();
    const [newMessage, setNewMessage] = React.useState('');
    
    const conversationId = React.useMemo(() => {
        if (!user) return null;
        return [user.uid, otherUser.uid].sort().join('_');
    }, [user]);

    const messagesQuery = React.useMemo(() => {
        if (!db || !conversationId) return null;
        return query(collection(db, 'conversations', conversationId, 'messages'), orderBy('timestamp', 'asc'));
    }, [db, conversationId]);

    const { data: messages, loading: messagesLoading } = useCollection<Message>(messagesQuery);
    
    React.useEffect(() => {
        const draftMessage = searchParams.get('draft');
        if (draftMessage) {
            setNewMessage(draftMessage);
        }
    }, [searchParams]);

    const addMessageToFirestore = async (messageData: Omit<Message, 'id' | 'timestamp'> & { timestamp: any }) => {
        if (!db || !conversationId) return;
        try {
            await addDoc(collection(db, 'conversations', conversationId, 'messages'), messageData);
        } catch (error) {
             console.error("Error adding message to firestore:", error);
             toast({
                variant: 'destructive',
                title: 'Message Error',
                description: 'Could not save message.'
            });
        }
    };

    const handleSendMessage = async () => {
        if (newMessage.trim() === '' || !user) return;
        setIsSending(true);

        const userMessageData = {
            userId: user.uid,
            userInitials: getInitials(user.displayName),
            text: newMessage,
            timestamp: serverTimestamp(),
            type: 'USER' as const,
        };

        setNewMessage('');
        await addMessageToFirestore(userMessageData);

        try {
            const result = await coParentingActions({ text: userMessageData.text });
            const aiResponseData = {
                userId: 'AI_MEDIATOR',
                userInitials: 'AI',
                text: result.text,
                timestamp: serverTimestamp(),
                type: 'AI_MEDIATOR' as const,
                actions: result.tool_requests
            };
            await addMessageToFirestore(aiResponseData as any);
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
            const aiAdvocateResponseData = {
                userId: 'AI_ADVOCATE',
                userInitials: 'AD',
                text: '',
                timestamp: serverTimestamp(),
                type: 'AI_ADVOCATE' as const,
                advice: result,
            };
            await addMessageToFirestore(aiAdvocateResponseData);

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
    
    const handleActionClick = async (tool: string, args: ScheduleActionArgs) => {
        if (!user || !db) {
            toast({ variant: 'destructive', title: 'Error', description: 'You must be logged in to perform this action.' });
            return;
        }

        const evidenceEntry = {
            date: format(new Date(), 'yyyy-MM-dd'),
            category: 'Communication' as const,
            description: `Scheduling Action: ${args.title}`,
            evidence: `The following action was proposed in the Communication Hub:\n\nDetails: ${args.details}`,
            loggedBy: user.displayName || 'User',
            userId: user.uid,
            timestamp: serverTimestamp(),
        };

        try {
            const evidenceColRef = collection(db, `users/${user.uid}/evidence`);
            await addDoc(evidenceColRef, evidenceEntry);
            toast({
                title: "Action Logged!",
                description: `Your proposal has been formally recorded in the Evidence Log.`
            });
        } catch (error) {
            console.error("Error logging action to evidence:", error);
            toast({
                variant: "destructive",
                title: "Logging Error",
                description: "Could not log this action to the evidence log.",
            });
        }
    };
    
    const handleUseSuggestion = (suggestion: string) => {
        setNewMessage(suggestion);
        setIsCoachOpen(false);
    };

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
                    <CardTitle className="font-headline uppercase text-primary tracking-widest">CONVERSATION WITH {otherUser.displayName.toUpperCase()}</CardTitle>
                    <CardDescription className="font-sans text-accent">All messages are timestamped and analyzed by the AI Mediator to suggest actions and improvements.</CardDescription>
                </div>
                <Button variant="outline" onClick={() => setIsVideoOpen(true)}>
                    <Video />
                    <span>Video Call</span>
                </Button>
            </CardHeader>
            <CardContent className="flex flex-col h-[65vh]">
                <div className="flex-grow space-y-6 overflow-y-auto p-4 border rounded-md bg-muted/20">
                    {messagesLoading && (
                        <div className="flex justify-center items-center h-full">
                            <Loader2 className="animate-spin text-primary" />
                        </div>
                    )}
                    {!messagesLoading && messages?.map(msg => (
                        <div key={msg.id}>
                            <div className={cn(
                                "flex items-end gap-3",
                                msg.userId === user?.uid ? "justify-end" : "justify-start"
                            )}>
                                 {msg.userId !== user?.uid && (
                                    <Avatar className="h-8 w-8">
                                        <AvatarFallback className={cn(
                                            (msg.type === 'AI_MEDIATOR' || msg.type === 'AI_ADVOCATE') && 'bg-primary/20 text-primary'
                                        )}>{msg.userInitials}</AvatarFallback>
                                    </Avatar>
                                 )}
                                 <div className={cn(
                                    "max-w-xs md:max-w-md lg:max-w-lg p-3 rounded-lg",
                                    msg.userId === user?.uid && "bg-primary text-primary-foreground",
                                    msg.userId === otherUser.uid && "bg-muted",
                                    msg.type === 'AI_MEDIATOR' && "bg-accent text-accent-foreground",
                                    msg.type === 'AI_ADVOCATE' && "bg-transparent border-none p-0"
                                 )}>
                                    {msg.type === 'AI_ADVOCATE' && msg.advice ? (
                                        <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border-l-4 border-blue-400 w-full">
                                            <h4 className="font-semibold text-blue-800 dark:text-blue-200 flex items-center gap-2"><ShieldCheck className="w-5 h-5"/> AI Advocate's Perspective</h4>
                                            <p className="text-base text-blue-900 dark:text-blue-100 my-2">{msg.advice.advice}</p>
                                            <p className="text-xs text-blue-700 dark:text-blue-300"><strong>Principle:</strong> {msg.advice.principle}</p>
                                        </div>
                                    ) : (
                                        <p className="text-sm">{msg.text}</p>
                                    )}
                                    <p className="text-xs mt-1 text-right opacity-70">{msg.timestamp ? format(msg.timestamp.toDate(), 'p') : ''}</p>
                                 </div>
                                 {msg.userId === user?.uid && (
                                    <Avatar className="h-8 w-8">
                                        <AvatarFallback>{msg.userInitials}</AvatarFallback>
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
