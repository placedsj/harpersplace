import type { Timestamp } from 'firebase/firestore';

export type DailyLog = {
    id: string;
    time: string;
    type: 'Feeding' | 'Diaper' | 'Sleep';
    details: string;
    userId: string;
    timestamp: Timestamp;
};

export type HealthEvent = {
    id: string;
    title: string;
    date: Timestamp;
    details: string;
    type: 'Appointment' | 'Immunization' | 'Note';
    doctor?: string;
    userId: string;
    timestamp: Timestamp;
};

export type Milestone = {
    id: string;
    title: string;
    date: Timestamp;
    description: string;
    category: 'Achievement' | 'Health' | 'Growth';
    userId: string;
    timestamp: Timestamp;
};

export type GroceryItem = {
    id: string;
    name: string;
    checked: boolean;
    userId: string;
    timestamp: Timestamp;
};
