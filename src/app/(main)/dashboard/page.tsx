// src/app/(main)/dashboard/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { format, differenceInMonths, parse } from 'date-fns';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Utensils, BedDouble, Baby } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import Link from 'next/link';
import { useAuth } from '@/hooks/use-auth';
import { useCollection, useFirestore } from '@/firebase';
import { collection, query, orderBy, limit } from 'firebase/firestore';
import type { JournalEntry } from '@/lib/journal-data';
import type { DailyLog } from '@/app/(main)/log/page';

// --- Data based on Harper being 10 months old as of Sept 6, 2025 ---
const harper_dob = new Date("2024-11-12T00:00:00Z");

// --- Infant Dashboard Component (0-24 months) ---
const InfantDashboard = () => {
    const { user } = useAuth();
    const { db } = useFirestore();
    const [isClient, setIsClient] = useState(false);
    
    const { data: journalEntries, loading: journalLoading } = useCollection<JournalEntry>(
        user && db ? query(collection(db, `users/${user.uid}/journal`), orderBy('timestamp', 'desc'), limit(1)) : null
    );
    const latestStory = journalEntries?.[0];

    const { data: logs, loading: logsLoading } = useCollection<DailyLog>(
        user && db ? query(collection(db, `users/${user.uid}/daily-logs`), orderBy('timestamp', 'desc')) : null
    );

    const getLatestLog = (type: string) => logs?.find(log => log.type === type);

    const latestFeed = getLatestLog('Feeding');
    const latestNap = getLatestLog('Sleep');
    const latestDiaper = getLatestLog('Diaper');
    
    useEffect(() => {
        setIsClient(true);
    }, []);

    return (
        <div className="space-y-8">
           <div>
            <h1 className="text-3xl font-headline font-extra-bold uppercase tracking-tight">Welcome to Harper's Home!</h1>
            <p className="text-muted-foreground mt-2">Your one-stop dashboard for our amazing gal.</p>
           </div>

            <Card className="bg-gradient-to-br from-primary to-primary-dark text-primary-foreground shadow-lg">
                <CardHeader>
                    <CardTitle>Harper's Now: At-a-Glance</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-3 gap-4">
                    <div className="text-center">
                        <p className="text-sm font-semibold uppercase tracking-wider">LAST FEED</p>
                        <p className="text-2xl font-bold">{latestFeed ? format(parse(latestFeed.time, 'HH:mm', new Date()), 'p') : 'N/A'}</p>
                        <p className="text-xs opacity-80">{latestFeed?.details}</p>
                    </div>
                     <div className="text-center">
                        <p className="text-sm font-semibold uppercase tracking-wider">LAST NAP</p>
                        <p className="text-2xl font-bold">{latestNap ? format(parse(latestNap.time, 'HH:mm', new Date()), 'p') : 'N/A'}</p>
                        <p className="text-xs opacity-80">{latestNap?.details}</p>
                    </div>
                     <div className="text-center">
                        <p className="text-sm font-semibold uppercase tracking-wider">LAST DIAPER</p>
                        <p className="text-2xl font-bold">{latestDiaper ? format(parse(latestDiaper.time, 'HH:mm', new Date()), 'p') : 'N/A'}</p>
                        <p className="text-xs opacity-80">{latestDiaper?.details}</p>
                    </div>
                </CardContent>
            </Card>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                <Card>
                    <CardHeader>
                        <CardTitle>Up Next</CardTitle>
                        <CardDescription>What's coming up for Harper.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                       <div className="flex items-center gap-4">
                           <div className="p-3 bg-accent/20 rounded-lg">
                             <Utensils className="w-6 h-6 text-accent"/>
                           </div>
                           <div>
                               <p className="font-semibold">Next Feeding</p>
                               <p className="text-muted-foreground text-sm">Around 11:00 AM</p>
                           </div>
                       </div>
                       <div className="flex items-center gap-4">
                           <div className="p-3 bg-accent/20 rounded-lg">
                            <BedDouble className="w-6 h-6 text-accent"/>
                           </div>
                           <div>
                               <p className="font-semibold">Next Nap</p>
                               <p className="text-muted-foreground text-sm">Around 11:30 AM</p>
                           </div>
                       </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle>Harper's Profile</CardTitle>
                        <CardDescription>Quick details about our star.</CardDescription>
                    </CardHeader>
                    <CardContent className="flex flex-col items-center text-center">
                        <Avatar className="w-20 h-20 mb-4 border-4 border-accent/50">
                            <AvatarImage src="https://images.unsplash.com/photo-1637878314356-9f3b0338bc7c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHw0fHxjaGlsZCUyMHBvcnRyYWl0fGVufDB8fHx8MTc1OTEwNzg4MHww&ixlib=rb-4.1.0&q=80&w=1080" data-ai-hint="child portrait" />
                            <AvatarFallback>H</AvatarFallback>
                        </Avatar>
                        <p className="font-semibold text-lg">Harper Ryan</p>
                        <div className="h-4 text-sm text-muted-foreground">
                            {isClient && <p>{differenceInMonths(new Date(), harper_dob)} months old</p>}
                        </div>
                        <div className="h-3.5 text-xs text-muted-foreground">
                            {isClient && <p>{format(harper_dob, "MMMM d, yyyy")}</p>}
                        </div>
                    </CardContent>
                </Card>
                 <Card>
                    <CardHeader>
                        <CardTitle>Latest Story</CardTitle>
                        {latestStory && <CardDescription>{format(latestStory.date.toDate(), 'PPP')}</CardDescription>}
                    </CardHeader>
                    <CardContent className="flex flex-col">
                        {journalLoading && <p>Loading story...</p>}
                        {latestStory ? (
                            <>
                                {latestStory.image && (
                                <Image src={latestStory.image} alt={latestStory.title} data-ai-hint={latestStory.dataAiHint} width={400} height={200} className="rounded-md object-cover w-full aspect-video mb-4" />
                                )}
                                <h3 className="font-semibold mb-1">{latestStory.title}</h3>
                                <p className="text-sm text-muted-foreground line-clamp-2 mb-4">{latestStory.content}</p>
                                <Button asChild variant="outline" size="sm">
                                    <Link href="/journal">Read More</Link>
                                </Button>
                            </>
                        ) : (
                           !journalLoading && <p className="text-sm text-muted-foreground">No stories yet.</p>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

// --- School-Age Dashboard Component (Placeholder for future) ---
const SchoolAgeDashboard = () => (
    <Card>
        <CardHeader>
            <CardTitle>School-Age Dashboard</CardTitle>
        </CardHeader>
        <CardContent>
            <p>This dashboard will show custody schedules, school events, shared funds, etc.</p>
        </CardContent>
    </Card>
);


export default function DashboardPage() {
    const ageInMonths = differenceInMonths(new Date("2025-09-06T00:00:00Z"), harper_dob);
    
    let DashboardComponent;
    if (ageInMonths <= 24) {
        DashboardComponent = InfantDashboard;
    } else {
        DashboardComponent = SchoolAgeDashboard;
    }

    return <DashboardComponent />;
}
