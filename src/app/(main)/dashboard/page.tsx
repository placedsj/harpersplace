// src/app/(main)/dashboard/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { format, differenceInMonths, parse } from 'date-fns';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Utensils, BedDouble, Baby, MessageSquare, DollarSign, BookOpen, Clock, Sparkles, Shield, Rocket, Wand2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import Link from 'next/link';
import { useAuth } from '@/hooks/use-auth';
import { useCollection, useFirestore, useDoc } from '@/firebase';
import { collection, query, orderBy, limit, doc, Timestamp } from 'firebase/firestore';
import type { JournalEntry } from '@/lib/journal-data';
import type { DailyLog } from '@/app/(main)/log/page';
import type { Profile } from '@/app/(main)/profile/page';
import DashboardCard from '@/components/dashboard-card';
import { Skeleton } from '@/components/ui/skeleton';

// --- Main Dashboard Component ---
const MainDashboard = () => {
    const { user } = useAuth();
    const { db } = useFirestore();
    const [harperAgeInMonths, setHarperAgeInMonths] = useState(0);
    
    // --- Data Fetching ---
    const { data: journalEntries, loading: journalLoading } = useCollection<JournalEntry>(
        user && db ? query(collection(db, `users/${user.uid}/journal`), orderBy('timestamp', 'desc'), limit(1)) : null
    );
    const latestStory = journalEntries?.[0];

    const { data: logs, loading: logsLoading } = useCollection<DailyLog>(
        user && db ? query(collection(db, `users/${user.uid}/daily-logs`), orderBy('timestamp', 'desc'), limit(3)) : null
    );

    const { data: profile, loading: profileLoading } = useDoc<Profile>(
        user && db ? doc(db, `users/${user.uid}/profile`, 'main') : null
    );
    
    useEffect(() => {
        if (profile?.dob) {
            // Ensure profile.dob is a valid Date object before using it.
            // Firestore Timestamps need to be converted to Dates.
            const dobDate = profile.dob instanceof Timestamp ? profile.dob.toDate() : new Date(profile.dob);
            if (!isNaN(dobDate.getTime())) {
                setHarperAgeInMonths(differenceInMonths(new Date(), dobDate));
            }
        }
    }, [profile]);
    
    // --- UI Components ---
    const actionButtonStyle = "group relative w-full p-8 rounded-xl text-white font-bold text-center text-lg shadow-2xl hover:shadow-3xl transition-all duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-[1.02] overflow-hidden uppercase font-headline";

    const ActivitySkeleton = () => (
        <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
                 <div key={i} className="flex items-center gap-4 p-3">
                    <Skeleton className="h-12 w-12 rounded-lg" />
                    <div className="flex-1 space-y-2">
                        <Skeleton className="h-4 w-1/4" />
                        <Skeleton className="h-4 w-3/4" />
                    </div>
                </div>
            ))}
        </div>
    );
    
    const JournalSkeleton = () => (
        <div className="space-y-3">
            <Skeleton className="h-48 w-full rounded-lg" />
            <Skeleton className="h-5 w-3/4" />
            <Skeleton className="h-4 w-2/3" />
        </div>
    );

    return (
        <div className="space-y-8 pb-8">
           {/* 1. WELCOME BANNER */}
           <div className="p-8 bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700">
                <div className="flex items-center justify-between">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <span className="text-2xl">🧒</span>
                            {profileLoading ? (
                                <Skeleton className="h-10 w-64" />
                            ) : (
                                <h1 className="text-3xl sm:text-4xl font-headline uppercase tracking-tight text-primary drop-shadow-md">
                                    {`${profile?.name || "Harper's"} Dashboard`}
                                </h1>
                            )}
                        </div>
                        {profileLoading ? (
                            <Skeleton className="h-6 w-48 mt-1" />
                        ) : (
                            <p className="text-base sm:text-lg font-sans text-muted-foreground tracking-wide">
                                {`A central hub for Harper, age ${harperAgeInMonths} months.`}
                            </p>
                        )}
                    </div>
                     <Avatar className="h-16 w-16 hidden sm:flex">
                        <AvatarImage src="/harper-avatar.png" alt="Harper's avatar" />
                        <AvatarFallback>H</AvatarFallback>
                    </Avatar>
                </div>
           </div>

            {/* 2. CHILD-CENTERED ACTIONS */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Link href="/log" className="block">
                    <button className={`${actionButtonStyle} bg-gradient-to-br from-purple-600 via-purple-700 to-indigo-700`}>
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent transform -skew-x-12 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
                        <BookOpen className="h-10 w-10 mx-auto mb-3" />
                        <span className="block text-xl">CHILD'S DAILY CARE</span>
                        <span className="block text-sm font-normal mt-2 opacity-90 font-sans">MONITOR WELL-BEING & MILESTONES</span>
                    </button>
                </Link>

                <Link href="/communication" className="block">
                    <button className={`${actionButtonStyle} bg-gradient-to-br from-pink-500 via-rose-500 to-red-600`}>
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent transform -skew-x-12 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
                        <MessageSquare className="h-10 w-10 mx-auto mb-3" />
                        <span className="block text-xl">SAFE COMMUNICATION</span>
                        <span className="block text-sm font-normal mt-2 opacity-90 font-sans">CHILD-FOCUSED MESSAGING & AI COACH</span>
                    </button>
                </Link>

                <Link href="/fund" className="block">
                    <button className={`${actionButtonStyle} bg-gradient-to-br from-green-500 via-emerald-600 to-teal-600`}>
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent transform -skew-x-12 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
                        <DollarSign className="h-10 w-10 mx-auto mb-3" />
                        <span className="block text-xl">CHILD'S FUND</span>
                        <span className="block text-sm font-normal mt-2 opacity-90 font-sans">TRANSPARENT SUPPORT & EXPENSE TRACKING</span>
                    </button>
                </Link>
            </div>

            {/* 3. Main Content Area (2-column layout) */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* LEFT (Wider) Column */}
                <div className="lg:col-span-2 space-y-6">
                    <DashboardCard title="RECENT ACTIVITY" description="LATEST ENTRIES AND UPDATES.">
                        {logsLoading ? <ActivitySkeleton /> : (
                            logs && logs.length > 0 ? (
                                <div className="space-y-3">
                                    {logs.map((log) => {
                                        const parsedTime = log.time ? parse(log.time, 'HH:mm', new Date()) : null;
                                        return(
                                            <div key={log.id} className="flex items-center gap-4 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                                                <div className="p-3 bg-gradient-to-br from-purple-100 to-indigo-100 dark:from-purple-900/30 dark:to-indigo-900/30 rounded-lg">
                                                    {log.type === 'Feeding' && <Utensils className="w-5 h-5 text-purple-600 dark:text-purple-400"/>}
                                                    {log.type === 'Sleep' && <BedDouble className="w-5 h-5 text-purple-600 dark:text-purple-400"/>}
                                                    {log.type === 'Diaper' && <Baby className="w-5 h-5 text-purple-600 dark:text-purple-400"/>}
                                                </div>
                                                <div className="flex-1">
                                                    <p className="font-semibold text-gray-900 dark:text-white">{log.type}</p>
                                                    <p className="text-sm text-gray-500 dark:text-gray-400">
                                                        {parsedTime ? format(parsedTime, 'p') : log.time} - {log.details}
                                                    </p>
                                                </div>
                                            </div>
                                        )
                                    })}
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
                            )
                        )}
                    </DashboardCard>
                    
                    <DashboardCard title="MEMORY JOURNAL" description="LATEST MEMORIES AND MILESTONES">
                        {journalLoading ? <JournalSkeleton /> : latestStory ? (
                            <>
                                {latestStory.image && (
                                    <Image src={latestStory.image} alt={latestStory.title} data-ai-hint={latestStory.dataAiHint} width={400} height={200} className="rounded-lg object-cover w-full aspect-video mb-4 shadow-md" />
                                )}
                                <h3 className="font-semibold text-lg mb-2 text-gray-900 dark:text-white uppercase font-headline">{latestStory.title}</h3>
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

                {/* RIGHT (Narrower) Column */}
                <div className="lg:col-span-1 space-y-6">
                    <DashboardCard title="AI Tools" description="Child-First Features">
                         <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                            Intelligent features to keep your child's best interests at the center of every decision.
                        </p>
                         <div className="grid grid-cols-2 gap-4">
                            <Link href="/ai-tools/communication-coach" className="block group">
                                <div className="p-4 bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 border border-gray-200 dark:border-gray-700 h-full">
                                    <Wand2 className="h-7 w-7 text-purple-600 dark:text-purple-400 mx-auto mb-2" />
                                    <h5 className="font-bold text-sm text-center text-gray-900 dark:text-white">Communication Coach</h5>
                                </div>
                            </Link>
                            <Link href="/ai-tools/schedule-optimizer" className="block group">
                                <div className="p-4 bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 border border-gray-200 dark:border-gray-700 h-full">
                                    <Rocket className="h-7 w-7 text-green-600 dark:text-green-400 mx-auto mb-2" />
                                    <h5 className="font-bold text-sm text-center text-gray-900 dark:text-white">Schedule Optimizer</h5>
                                </div>
                            </Link>
                             <Link href="/ai-tools/best-interest-checker" className="block group col-span-2">
                                <div className="p-4 bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 border border-gray-200 dark:border-gray-700 h-full">
                                    <Shield className="h-7 w-7 text-blue-600 dark:text-blue-400 mx-auto mb-2" />
                                    <h5 className="font-bold text-sm text-center text-gray-900 dark:text-white">Child's Best Interest Checker</h5>
                                </div>
                            </Link>
                        </div>
                    </DashboardCard>

                    <DashboardCard title="FAMILY OVERVIEW" description="YOUR PLACED.CA STATS.">
                        <div className="flex justify-around items-center mb-6">
                            <div className="text-center">
                                <p className="text-4xl font-extrabold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
                                    {logs?.length || 0}
                                </p>
                                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Log Entries</p>
                            </div>
                            <div className="text-center">
                                <p className="text-4xl font-extrabold bg-gradient-to-r from-pink-600 to-rose-600 bg-clip-text text-transparent">
                                    {journalEntries?.length || 0}
                                </p>
                                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Journal Stories</p>
                            </div>
                        </div>
                        <Button asChild variant="outline" className="w-full hover:bg-purple-50 dark:hover:bg-purple-900/20 hover:border-purple-300 dark:hover:border-purple-700 transition">
                            <Link href="/profile">Manage Profile</Link>
                        </Button>
                    </DashboardCard>
                </div>

            </div>
        </div>
    );
}

export default function DashboardPage() {
    return <MainDashboard />;
}
