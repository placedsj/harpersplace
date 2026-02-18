
import { Timestamp } from 'firebase/firestore';

export type DailyLog = {
    id: string;
    time: string;
    type: 'Feeding' | 'Diaper' | 'Sleep';
    details: string;
    userId: string;
    timestamp: Timestamp;
};
