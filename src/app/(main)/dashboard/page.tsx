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
import { useCollection, useFirestore, useCount } from '@/firebase';
import { collection, query, orderBy, limit } from 'firebase/firestore';
import type { JournalEntry } from '@/lib/journal-data';
import type { DailyLog } from '@/app/(main)/log/page';

import DashboardCard from '@/components/dashboard-card';

export const dynamic = 'force-dynamic';

// --- Main Dashboard Component ---
const MainDashboard = () => {
    const { user } = useAuth();
    const { db } = useFirestore();
    
    const { data: journalEntries, loading: journalLoading } = useCollection<JournalEntry>(
        user && db ? query(collection(db, `users/${user.uid}/journal`), orderBy('timestamp', 'desc'), limit(1)) : null
    );
    const latestStory = journalEntries?.[0];

    // Fetch separate counts for overview to avoid fetching all data
    // Note: useCount uses queryEqual internally, so creating queries in render is safe.
    const { count: journalCount } = useCount(
        user && db ? query(collection(db, `users/${user.uid}/journal`)) : null
    );

    const { count: logsCount } = useCount(
        user && db ? query(collection(db, `users/${user.uid}/daily-logs`)) : null
    );

    // Limit logs fetch to 10 for performance, as we only show top 3.
    const { data: logs, loading: logsLoading } = useCollection<DailyLog>(
        user && db ? query(collection(db, `users/${user.uid}/daily-logs`), orderBy('timestamp', 'desc'), limit(10)) : null
    );

    // Reusable button style for main action cards
    const actionButtonStyle = "group relative w-full p-8 rounded-xl text-white font-bold text-center text-lg shadow-2xl hover:shadow-3xl transition-all duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-[1.02] overflow-hidden";

    return (
        <div className="space-y-8 pb-8">
           {/* 1. WELCOME BANNER */}
           <div className="p-8 bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700">
                <div className="mb-8 px-4 py-6 rounded-2xl bg-gradient-to-br from-primary/5 to-accent/5 border border-primary/10 shadow-md">
                    <div className="flex items-center gap-3 mb-2">
                        <span className="text-2xl">🧒</span>
                        <h1 className="text-3xl sm:text-4xl font-bebas font-extrabold uppercase tracking-widest text-primary drop-shadow-md">CHILD-CENTERED ACTIONS</h1>
                    </div>
                    <p className="text-base sm:text-lg font-montserrat text-muted-foreground tracking-wide">TOOLS THAT PRIORITIZE YOUR CHILD'S NEEDS AND WELL-BEING</p>
                </div>
           </div>

            {/* 2. CHILD-CENTERED ACTIONS - THE STUNNING GRADIENT BLOCK */}
            <DashboardCard
                title="👶 CHILD-CENTERED ACTIONS"
                description="TOOLS THAT PRIORITIZE YOUR CHILD'S NEEDS AND WELL-BEING"
                className="col-span-12 p-8 bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 dark:from-purple-900/20 dark:via-pink-900/20 dark:to-blue-900/20 border-2 border-purple-200 dark:border-purple-700 shadow-2xl font-montserrat"
            >
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
                    
                    {/* Child's Daily Care - THE PURPLE GRADIENT */}
                    <Link href="/log" className="block">
                        <button className={`${actionButtonStyle} bg-gradient-to-br from-purple-600 via-purple-700 to-indigo-700`}>
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent transform -skew-x-12 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
                            <BookOpen className="h-10 w-10 mx-auto mb-3" />
                            <span className="block text-xl uppercase font-bebas">CHILD'S DAILY CARE</span>
                            <span className="block text-sm font-normal mt-2 opacity-90 uppercase font-montserrat">MONITOR WELL-BEING & MILESTONES</span>
                        </button>
                    </Link>

                    {/* Safe Communication */}
                    <Link href="/communication" className="block">
                        <button className={`${actionButtonStyle} bg-gradient-to-br from-pink-500 via-rose-500 to-red-600`}>
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent transform -skew-x-12 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
                            <MessageSquare className="h-10 w-10 mx-auto mb-3" />
                            <span className="block text-xl uppercase font-bebas">SAFE COMMUNICATION</span>
                            <span className="block text-sm font-normal mt-2 opacity-90 uppercase font-montserrat">CHILD-FOCUSED MESSAGING & AI COACH</span>
                        </button>
                    </Link>

                    {/* Child's Fund */}
                    <Link href="/fund" className="block">
                        <button className={`${actionButtonStyle} bg-gradient-to-br from-green-500 via-emerald-600 to-teal-600`}>
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent transform -skew-x-12 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
                            <DollarSign className="h-10 w-10 mx-auto mb-3" />
                            <span className="block text-xl uppercase font-bebas">CHILD'S FUND</span>
                            <span className="block text-sm font-normal mt-2 opacity-90 uppercase font-montserrat">TRANSPARENT SUPPORT & EXPENSE TRACKING</span>
                        </button>
                    </Link>

                </div>
            </DashboardCard>

            {/* 3. LOWER SECTION (3-COLUMN LAYOUT) */}
            <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                <DashboardCard title="RECENT ACTIVITY" description="LATEST ENTRIES AND UPDATES.">
                    {logsLoading ? (
                        <div className="space-y-3">
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="flex items-center gap-4 p-3 rounded-lg animate-pulse">
                                    <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
                                    <div className="flex-1 space-y-2">
                                        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
                                        <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : logs && logs.length > 0 ? (
                        <div className="space-y-3">
                            {logs.slice(0, 3).map((log, index) => (
                                <div key={index} className="flex items-center gap-4 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                                    <div className="p-3 bg-gradient-to-br from-purple-100 to-indigo-100 dark:from-purple-900/30 dark:to-indigo-900/30 rounded-lg">
                                        {log.type === 'Feeding' && <Utensils className="w-5 h-5 text-purple-600 dark:text-purple-400"/>}
                                        {log.type === 'Sleep' && <BedDouble className="w-5 h-5 text-purple-600 dark:text-purple-400"/>}
                                        {log.type === 'Diaper' && <Baby className="w-5 h-5 text-purple-600 dark:text-purple-400"/>}
                                    </div>
                                    <div className="flex-1">
                                        <p className="font-semibold text-gray-900 dark:text-white">{log.type}</p>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">
                                            {log.time} - {log.details}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-12">
                            <Clock className="h-12 w-12 mx-auto mb-4 text-gray-300 dark:text-gray-600" />
                            <p className="text-gray-400 dark:text-gray-500 mb-4">No recent activity</p>
                            <Button asChild variant="default" size="sm" className="bg-purple-600 hover:bg-purple-700">
                                <Link href="/log">
                                    <Clock className="h-4 w-4 mr-2" />
                                    Add First Entry
                                </Link>
                            </Button>
                        </div>
                    )}
                </DashboardCard>

                {/* Family Overview */}
                <DashboardCard title="FAMILY OVERVIEW" description="YOUR HARPER'S PLACE STATS.">
                    <div className="flex justify-around items-center mb-6">
                        <div className="text-center">
                            <p className="text-4xl font-extrabold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
                                {logsCount || 0}
                            </p>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Log Entries</p>
                        </div>
                        <div className="text-center">
                            <p className="text-4xl font-extrabold bg-gradient-to-r from-pink-600 to-rose-600 bg-clip-text text-transparent">
                                {journalCount || 0}
                            </p>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Journal Stories</p>
                        </div>
                    </div>
                    <Button asChild variant="outline" className="w-full hover:bg-purple-50 dark:hover:bg-purple-900/20 hover:border-purple-300 dark:hover:border-purple-700 transition">
                        <Link href="/profile">Manage Profile</Link>
                    </Button>
                </DashboardCard>

                {/* Memory Journal */}
                <DashboardCard title="MEMORY JOURNAL" description="LATEST MEMORIES AND MILESTONES">
                    {journalLoading ? (
                        <div className="space-y-3">
                            <div className="h-32 bg-gray-100 dark:bg-gray-700 rounded-lg animate-pulse"></div>
                            <div className="h-4 bg-gray-100 dark:bg-gray-700 rounded animate-pulse w-3/4"></div>
                            <div className="h-4 bg-gray-100 dark:bg-gray-700 rounded animate-pulse w-2/3"></div>
                        </div>
                    ) : latestStory ? (
                        <>
                            {latestStory.image && (
                                <Image src={latestStory.image} alt={latestStory.title} data-ai-hint={latestStory.dataAiHint} width={400} height={200} className="rounded-lg object-cover w-full aspect-video mb-4 shadow-md" />
                            )}
                            <h3 className="font-semibold text-lg mb-2 text-gray-900 dark:text-white uppercase font-bebas">{latestStory.title}</h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2 mb-4">{latestStory.content}</p>
                            <Button asChild variant="default" size="sm" className="w-full bg-purple-600 hover:bg-purple-700">
                                <Link href="/journal">View All Memories</Link>
                            </Button>
                        </>
                    ) : (
                        <div className="text-center py-12">
                            <BookOpen className="h-12 w-12 mx-auto mb-4 text-gray-300 dark:text-gray-600" />
                            <p className="text-gray-400 dark:text-gray-500 mb-4">No memories captured yet</p>
                            <Button asChild variant="default" size="sm" className="bg-purple-600 hover:bg-purple-700">
                                <Link href="/journal">Create First Memory</Link>
                            </Button>
                        </div>
                    )}
                </DashboardCard>
            </div>

            {/* 4. AI TOOLS SHOWCASE */}
            <div className="p-6 bg-gradient-to-r from-purple-50 via-pink-50 to-blue-50 dark:from-purple-900/20 dark:via-pink-900/20 dark:to-blue-900/20 border-l-4 border-purple-600 dark:border-purple-400 rounded-r-xl shadow-xl">
                <div className="flex items-center mb-4">
                    <Sparkles className="h-7 w-7 text-purple-600 dark:text-purple-400 mr-3" />
                    <h4 className="text-2xl font-bold text-gray-900 dark:text-white uppercase font-montserrat tracking-widest">CHILD-FIRST AI TOOLS</h4>
                </div>
                <p className="text-base text-gray-600 dark:text-gray-400 mb-6">
                    Intelligent features designed to keep your child's emotional safety and best interests at the center of every decision.
                </p>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <Link href="/communication" className="block group">
                        <div className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-200 dark:border-gray-700">
                            <Shield className="h-8 w-8 text-blue-600 dark:text-blue-400 mx-auto mb-3" />
                            <h5 className="font-bold text-sm text-center text-gray-900 dark:text-white mb-2">Child-Safe Communication</h5>
                            <p className="text-xs text-center text-gray-500 dark:text-gray-400">Protect emotional well-being</p>
                        </div>
                    </Link>
                    
                    <Link href="/fund" className="block group">
                        <div className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-200 dark:border-gray-700">
                            <Tag className="h-8 w-8 text-purple-600 dark:text-purple-400 mx-auto mb-3" />
                            <h5 className="font-bold text-sm text-center text-gray-900 dark:text-white mb-2">Child-Need Tracking</h5>
                            <p className="text-xs text-center text-gray-500 dark:text-gray-400">Prioritize child expenses</p>
                        </div>
                    </Link>
                    
                    <Link href="/document-analyzer" className="block group">
                        <div className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-200 dark:border-gray-700">
                            <FileText className="h-8 w-8 text-amber-600 dark:text-amber-400 mx-auto mb-3" />
                            <h5 className="font-bold text-sm text-center text-gray-900 dark:text-white mb-2">Child Safety Analysis</h5>
                            <p className="text-xs text-center text-gray-500 dark:text-gray-400">Protect best interests</p>
                        </div>
                    </Link>
                    
                    <Link href="/communication-platform" className="block group">
                        <div className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-200 dark:border-gray-700">
                            <Rocket className="h-8 w-8 text-green-600 dark:text-green-400 mx-auto mb-3" />
                            <h5 className="font-bold text-sm text-center text-gray-900 dark:text-white mb-2">Child-First Platform</h5>
                            <p className="text-xs text-center text-gray-500 dark:text-gray-400">Protect their future</p>
                        </div>
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default function DashboardPage() {
    return <MainDashboard />;
}
