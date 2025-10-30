// src/app/(main)/communication/page.tsx
'use client';

import * as React from 'react';
import { useSearchParams } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Wand2, Send, Sparkles, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { coParentingActions, CoParentingActionsOutput } from '@/ai/flows/co-parenting-actions';

type Message = {
    id: number;
    user: 'Mom' | 'Dad';
    avatar: string;
    initials: string;
    text: string;
    timestamp: string;
    actions?: any[];
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


function CommunicationPageInternal() {
    const [messages, setMessages] = React.useState<Message[]>(initialMessages);
    const [newMessage, setNewMessage] = React.useState('');
    const [isLoading, setIsLoading] = React.useState(false);
    const { toast } = useToast();
    const searchParams = useSearchParams();

    React.useEffect(() => {
        const draftMessage = searchParams.get('draft');
        if (draftMessage) {
            setNewMessage(draftMessage);
        }
    }, [searchParams]);

    const handleSendMessage = async () => {
        if (newMessage.trim() === '') return;
        setIsLoading(true);

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
                user: 'Mom', // Simulating response from the other parent / AI mediator
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
            setIsLoading(false);
        }
    };
    
    const handleActionClick = (tool: string, args: any) => {
        toast({
            title: "Action Logged!",
            description: `Your proposal '${args.title}' has been officially logged.`
        });
    }

    const currentUser = 'Dad'; // For styling purposes

  return (
    <div className="space-y-8">
        <div>
            <h1 className="text-4xl font-bebas font-extrabold uppercase tracking-widest text-primary drop-shadow-md">COMMUNICATION HUB</h1>
            <p className="text-lg font-montserrat text-accent mt-1 tracking-wide">
                A secure, AI-mediated channel for all co-parenting communication.
            </p>
        </div>
        <Card className="shadow-lg border-2 border-primary/40">
            <CardHeader>
                <CardTitle className="font-bebas uppercase text-primary tracking-widest">CONVERSATION WITH EMMA</CardTitle>
                <CardDescription className="font-montserrat text-accent">All messages are timestamped and analyzed by the AI Mediator to suggest actions.</CardDescription>
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
                                        <AvatarFallback>{msg.initials}</AvatarFallback>
                                    </Avatar>
                                 )}
                                 <div className={cn(
                                    "max-w-xs md:max-w-md lg:max-w-lg p-3 rounded-lg",
                                    msg.user === currentUser ? "bg-primary text-primary-foreground" : (msg.initials === 'AI' ? "bg-accent text-accent-foreground" : "bg-muted")
                                 )}>
                                    <p className="text-sm">{msg.text}</p>
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
                     {isLoading && (
                        <div className="flex items-end gap-3 justify-start">
                             <Avatar className="h-8 w-8">
                                <AvatarFallback>AI</AvatarFallback>
                            </Avatar>
                            <div className="max-w-xs md:max-w-md lg:max-w-lg p-3 rounded-lg bg-accent text-accent-foreground">
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
                        placeholder="Type your message..."
                        className="flex-grow"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && !isLoading && handleSendMessage()}
                        disabled={isLoading}
                    />
                    <Button size="icon" onClick={handleSendMessage} aria-label="Send Message" disabled={isLoading}>
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
