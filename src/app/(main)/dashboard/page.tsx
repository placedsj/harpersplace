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

// --- Main Dashboard Component ---
const MainDashboard = () => {
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
            <h1 className="text-3xl font-headline font-extra-bold uppercase tracking-tight">Welcome to Harper's Place</h1>
            <p className="text-muted-foreground mt-2">Where every decision, every conversation, and every action puts your child's best interests and emotional well-being first.</p>
           </div>

            <Card className="bg-gradient-to-br from-primary/10 to-purple-100 dark:from-primary/20 dark:to-purple-900/20 border border-primary/20">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <span className="text-2xl">👶</span>
                        Child-Centered Actions
                    </CardTitle>
                    <CardDescription>Tools that prioritize your child's needs and well-being</CardDescription>
                </CardHeader>
                <CardContent className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    <Button asChild variant="default" className="h-auto p-4 flex-col gap-2">
                        <Link href="/log">
                            <Utensils className="w-6 h-6" />
                            <span className="font-semibold">Child's Daily Care</span>
                            <span className="text-xs opacity-80">Monitor well-being</span>
                        </Link>
                    </Button>
                    <Button asChild variant="outline" className="h-auto p-4 flex-col gap-2">
                        <Link href="/communication">
                            <span className="text-xl">�</span>
                            <span className="font-semibold">Safe Communication</span>
                            <span className="text-xs opacity-80">Child-focused messaging</span>
                        </Link>
                    </Button>
                    <Button asChild variant="outline" className="h-auto p-4 flex-col gap-2">
                        <Link href="/fund">
                            <span className="text-xl">💰</span>
                            <span className="font-semibold">Child's Fund</span>
                            <span className="text-xs opacity-80">Transparent support</span>
                        </Link>
                    </Button>
                </CardContent>
            </Card>

            <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                <Card>
                    <CardHeader>
                        <CardTitle>Recent Activity</CardTitle>
                        <CardDescription>Latest entries and updates.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                       {logs && logs.length > 0 ? (
                         logs.slice(0, 3).map((log, index) => (
                           <div key={index} className="flex items-center gap-4">
                               <div className="p-3 bg-accent/20 rounded-lg">
                                 {log.type === 'Feeding' && <Utensils className="w-5 h-5 text-accent"/>}
                                 {log.type === 'Sleep' && <BedDouble className="w-5 h-5 text-accent"/>}
                                 {log.type === 'Diaper' && <Baby className="w-5 h-5 text-accent"/>}
                               </div>
                               <div className="flex-1">
                                   <p className="font-semibold">{log.type}</p>
                                   <p className="text-muted-foreground text-sm">
                                     {log.time} - {log.details}
                                   </p>
                               </div>
                           </div>
                         ))
                       ) : (
                         <div className="text-center text-muted-foreground py-4">
                           <p>No recent activity</p>
                           <Button asChild variant="outline" size="sm" className="mt-2">
                             <Link href="/log">Add First Entry</Link>
                           </Button>
                         </div>
                       )}
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle>Family Overview</CardTitle>
                        <CardDescription>Your Harper's Place stats.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-2 gap-4 text-center">
                            <div className="p-3 bg-muted/50 rounded-lg">
                                <p className="text-2xl font-bold text-primary">{logs?.length || 0}</p>
                                <p className="text-xs text-muted-foreground">Log Entries</p>
                            </div>
                            <div className="p-3 bg-muted/50 rounded-lg">
                                <p className="text-2xl font-bold text-primary">{journalEntries?.length || 0}</p>
                                <p className="text-xs text-muted-foreground">Journal Stories</p>
                            </div>
                        </div>
                        <div className="text-center">
                            <Button asChild variant="outline" size="sm">
                                <Link href="/profile">Manage Profile</Link>
                            </Button>
                        </div>
                    </CardContent>
                </Card>
                 <Card>
                    <CardHeader>
                        <CardTitle>Memory Journal</CardTitle>
                        <CardDescription>Latest memories and milestones</CardDescription>
                    </CardHeader>
                    <CardContent className="flex flex-col">
                        {journalLoading ? (
                            <div className="space-y-3">
                                <div className="h-4 bg-muted rounded animate-pulse"></div>
                                <div className="h-4 bg-muted rounded animate-pulse w-2/3"></div>
                            </div>
                        ) : latestStory ? (
                            <>
                                {latestStory.image && (
                                <Image src={latestStory.image} alt={latestStory.title} data-ai-hint={latestStory.dataAiHint} width={400} height={200} className="rounded-md object-cover w-full aspect-video mb-4" />
                                )}
                                <h3 className="font-semibold mb-1">{latestStory.title}</h3>
                                <p className="text-sm text-muted-foreground line-clamp-2 mb-4">{latestStory.content}</p>
                                <Button asChild variant="outline" size="sm">
                                    <Link href="/journal">View All Memories</Link>
                                </Button>
                            </>
                        ) : (
                           <div className="text-center text-muted-foreground py-4">
                               <p className="mb-2">No memories captured yet</p>
                               <Button asChild variant="outline" size="sm">
                                   <Link href="/journal">Create First Memory</Link>
                               </Button>
                           </div>
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* AI Features Showcase */}
            <Card className="border-dashed border-2 border-primary/20">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <span className="text-2xl">🤖</span>
                        Child-First AI Tools
                    </CardTitle>
                    <CardDescription>
                        Intelligent features designed to keep your child's emotional safety and best interests at the center of every decision
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        <Button asChild variant="outline" className="h-auto p-4 flex-col gap-2">
                            <Link href="/communication">
                                <span className="text-xl">�</span>
                                <span className="font-semibold text-sm">Child-Safe Communication</span>
                                <span className="text-xs text-center opacity-70">Protect emotional well-being</span>
                            </Link>
                        </Button>
                        <Button asChild variant="outline" className="h-auto p-4 flex-col gap-2">
                            <Link href="/fund">
                                <span className="text-xl">🏷️</span>
                                <span className="font-semibold text-sm">Child-Need Tracking</span>
                                <span className="text-xs text-center opacity-70">Prioritize child expenses</span>
                            </Link>
                        </Button>
                        <Button asChild variant="outline" className="h-auto p-4 flex-col gap-2">
                            <Link href="/document-analyzer">
                                <span className="text-xl">📄</span>
                                <span className="font-semibold text-sm">Child Safety Analysis</span>
                                <span className="text-xs text-center opacity-70">Protect best interests</span>
                            </Link>
                        </Button>
                        <Button asChild variant="outline" className="h-auto p-4 flex-col gap-2">
                            <Link href="/communication-platform">
                                <span className="text-xl">🚀</span>
                                <span className="font-semibold text-sm">Child-First Platform</span>
                                <span className="text-xs text-center opacity-70">Protect their future</span>
                            </Link>
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

export default function DashboardPage() {
    return <MainDashboard />;
}
