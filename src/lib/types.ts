import { Timestamp } from 'firebase/firestore';

export type DailyLog = {
    id: string;
    time: string;
    type: 'Feeding' | 'Diaper' | 'Sleep';
    details: string;
    userId: string;
    timestamp: Timestamp;
};

export type JournalEntry = {
    id: string;
    title: string;
    date: Timestamp;
    content: string;
    image?: string;
    dataAiHint?: string;
    userId: string;
    timestamp: Timestamp;
  };
