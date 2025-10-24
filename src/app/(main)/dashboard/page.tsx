// src/app/(main)/dashboard/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { format, differenceInMonths, parse } from 'date-fns';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Utensils, BedDouble, Baby, MessageSquare, DollarSign, BookOpen, Clock, Sparkles, Shield, Tag, FileText, Rocket } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import Link from 'next/link';
import { useAuth } from '@/hooks/use-auth';
import { useCollection, useFirestore } from '@/firebase';
import { collection, query, orderBy, limit } from 'firebase/firestore';
import type { JournalEntry } from '@/lib/journal-data';
import type { DailyLog } from '@/app/(main)/log/page';
import DashboardCard from '@/components/dashboard-card';

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

    // Reusable button style for main action cards
    const actionButtonStyle = "group relative w-full p-8 rounded-xl text-white font-bold text-center text-lg shadow-2xl hover:shadow-3xl transition-all duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-[1.02] overflow-hidden";

    return (
        <div className="space-y-8 pb-8">
           {/* 1. WELCOME BANNER */}
           <div className="p-8 bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700">
            <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white mb-3 flex items-center gap-3">
                WELCOME TO HARPER'S PLACE 
                <span className="text-3xl">🏡</span>
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-400">
                Where every decision, every conversation, and every action puts your child's best interests and emotional well-being first.
            </p>
           </div>

            {/* 2. CHILD-CENTERED ACTIONS - THE STUNNING GRADIENT BLOCK */}
            <DashboardCard
                title="👶 Child-Centered Actions"
                description="Tools that prioritize your child's needs and well-being"
                className="col-span-12 p-8 bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 dark:from-purple-900/20 dark:via-pink-900/20 dark:to-blue-900/20 border-2 border-purple-200 dark:border-purple-700 shadow-2xl"
            >
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
                    
                    {/* Child's Daily Care - THE PURPLE GRADIENT */}
                    <Link href="/log" className="block">
                        <button className={`${actionButtonStyle} bg-gradient-to-br from-purple-600 via-purple-700 to-indigo-700`}>
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent transform -skew-x-12 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
                            <BookOpen className="h-10 w-10 mx-auto mb-3" />
                            <span className="block text-xl">Child's Daily Care</span>
                            <span className="block text-sm font-normal mt-2 opacity-90">Monitor well-being & milestones</span>
                        </button>
                    </Link>

                    {/* Safe Communication */}
                    <Link href="/communication" className="block">
                        <button className={`${actionButtonStyle} bg-gradient-to-br from-pink-500 via-rose-500 to-red-600`}>
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent transform -skew-x-12 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
                            <MessageSquare className="h-10 w-10 mx-auto mb-3" />
                            <span className="block text-xl">Safe Communication</span>
                            <span className="block text-sm font-normal mt-2 opacity-90">Child-focused messaging & AI Coach</span>
                        </button>
                    </Link>

                    {/* Child's Fund */}
                    <Link href="/fund" className="block">
                        <button className={`${actionButtonStyle} bg-gradient-to-br from-green-500 via-emerald-600 to-teal-600`}>
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent transform -skew-x-12 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
                            <DollarSign className="h-10 w-10 mx-auto mb-3" />
                            <span className="block text-xl">Child's Fund</span>
                            <span className="block text-sm font-normal mt-2 opacity-90">Transparent support & expense tracking</span>
                        </button>
                    </Link>

                </div>
            </DashboardCard>

            <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                <Card className="shadow-md hover:shadow-lg transition-shadow">
                    <CardHeader className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20">
                        <CardTitle className="text-xl">Recent Activity</CardTitle>
                        <CardDescription>Latest entries and updates.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4 pt-6">
                       {logs && logs.length > 0 ? (
                         logs.slice(0, 3).map((log, index) => (
                           <div key={index} className="flex items-center gap-4 p-3 rounded-lg hover:bg-muted/50 transition-colors">
                               <div className="p-3 bg-gradient-to-br from-primary/20 to-purple-500/20 rounded-lg">
                                 {log.type === 'Feeding' && <Utensils className="w-5 h-5 text-primary"/>}
                                 {log.type === 'Sleep' && <BedDouble className="w-5 h-5 text-primary"/>}
                                 {log.type === 'Diaper' && <Baby className="w-5 h-5 text-primary"/>}
                               </div>
                               <div className="flex-1">
                                   <p className="font-semibold text-foreground">{log.type}</p>
                                   <p className="text-muted-foreground text-sm">
                                     {log.time} - {log.details}
                                   </p>
                               </div>
                           </div>
                         ))
                       ) : (
                         <div className="text-center text-muted-foreground py-8">
                           <p className="mb-3">No recent activity</p>
                           <Button asChild variant="default" size="sm" className="shadow-md">
                             <Link href="/log">Add First Entry</Link>
                           </Button>
                         </div>
                       )}
                    </CardContent>
                </Card>
                <Card className="shadow-md hover:shadow-lg transition-shadow">
                    <CardHeader className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20">
                        <CardTitle className="text-xl">Family Overview</CardTitle>
                        <CardDescription>Your Harper's Place stats.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6 pt-6">
                        <div className="grid grid-cols-2 gap-4 text-center">
                            <div className="p-4 bg-gradient-to-br from-primary/10 to-purple-500/10 rounded-xl border border-primary/20">
                                <p className="text-3xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">{logs?.length || 0}</p>
                                <p className="text-xs text-muted-foreground mt-1">Log Entries</p>
                            </div>
                            <div className="p-4 bg-gradient-to-br from-pink-500/10 to-rose-500/10 rounded-xl border border-pink-500/20">
                                <p className="text-3xl font-bold bg-gradient-to-r from-pink-600 to-rose-600 bg-clip-text text-transparent">{journalEntries?.length || 0}</p>
                                <p className="text-xs text-muted-foreground mt-1">Journal Stories</p>
                            </div>
                        </div>
                        <div className="text-center">
                            <Button asChild variant="outline" size="sm" className="shadow-sm hover:shadow-md transition-shadow">
                                <Link href="/profile">Manage Profile</Link>
                            </Button>
                        </div>
                    </CardContent>
                </Card>
                 <Card className="shadow-md hover:shadow-lg transition-shadow">
                    <CardHeader className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20">
                        <CardTitle className="text-xl">Memory Journal</CardTitle>
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
                                <Image src={latestStory.image} alt={latestStory.title} data-ai-hint={latestStory.dataAiHint} width={400} height={200} className="rounded-lg object-cover w-full aspect-video mb-4 shadow-sm" />
                                )}
                                <h3 className="font-semibold text-lg mb-2">{latestStory.title}</h3>
                                <p className="text-sm text-muted-foreground line-clamp-2 mb-4">{latestStory.content}</p>
                                <Button asChild variant="default" size="sm" className="w-full shadow-sm">
                                    <Link href="/journal">View All Memories</Link>
                                </Button>
                            </>
                        ) : (
                           <div className="text-center text-muted-foreground py-8">
                               <p className="mb-3">No memories captured yet</p>
                               <Button asChild variant="default" size="sm" className="shadow-md">
                                   <Link href="/journal">Create First Memory</Link>
                               </Button>
                           </div>
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* AI Features Showcase */}
            <Card className="border-2 border-dashed border-primary/30 bg-gradient-to-br from-indigo-50/50 via-purple-50/50 to-pink-50/50 dark:from-indigo-900/10 dark:via-purple-900/10 dark:to-pink-900/10 shadow-lg">
                <CardHeader className="text-center">
                    <CardTitle className="flex items-center justify-center gap-3 text-2xl">
                        <span className="text-3xl">🤖</span>
                        Child-First AI Tools
                    </CardTitle>
                    <CardDescription className="text-base">
                        Intelligent features designed to keep your child's emotional safety and best interests at the center of every decision
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        <Button asChild variant="outline" className="h-auto p-6 flex-col gap-3 hover:bg-gradient-to-br hover:from-blue-50 hover:to-cyan-50 dark:hover:from-blue-900/20 dark:hover:to-cyan-900/20 hover:border-blue-400 transition-all shadow-sm hover:shadow-md">
                            <Link href="/communication">
                                <span className="text-3xl">🛡</span>
                                <span className="font-bold text-sm">Child-Safe Communication</span>
                                <span className="text-xs text-center text-muted-foreground">Protect emotional well-being</span>
                            </Link>
                        </Button>
                        <Button asChild variant="outline" className="h-auto p-6 flex-col gap-3 hover:bg-gradient-to-br hover:from-purple-50 hover:to-pink-50 dark:hover:from-purple-900/20 dark:hover:to-pink-900/20 hover:border-purple-400 transition-all shadow-sm hover:shadow-md">
                            <Link href="/fund">
                                <span className="text-3xl">🏷️</span>
                                <span className="font-bold text-sm">Child-Need Tracking</span>
                                <span className="text-xs text-center text-muted-foreground">Prioritize child expenses</span>
                            </Link>
                        </Button>
                        <Button asChild variant="outline" className="h-auto p-6 flex-col gap-3 hover:bg-gradient-to-br hover:from-amber-50 hover:to-orange-50 dark:hover:from-amber-900/20 dark:hover:to-orange-900/20 hover:border-amber-400 transition-all shadow-sm hover:shadow-md">
                            <Link href="/document-analyzer">
                                <span className="text-3xl">📄</span>
                                <span className="font-bold text-sm">Child Safety Analysis</span>
                                <span className="text-xs text-center text-muted-foreground">Protect best interests</span>
                            </Link>
                        </Button>
                        <Button asChild variant="outline" className="h-auto p-6 flex-col gap-3 hover:bg-gradient-to-br hover:from-green-50 hover:to-emerald-50 dark:hover:from-green-900/20 dark:hover:to-emerald-900/20 hover:border-green-400 transition-all shadow-sm hover:shadow-md">
                            <Link href="/communication-platform">
                                <span className="text-3xl">🚀</span>
                                <span className="font-bold text-sm">Child-First Platform</span>
                                <span className="text-xs text-center text-muted-foreground">Protect their future</span>
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
