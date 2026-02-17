import { Timestamp } from 'firebase/firestore';

export interface Event {
    id: string;
    eventDate: string;
    category: string;
    description: string;
    partiesInvolved?: string;
    response?: string;
    loggedBy: string;
    userId: string;
    timestamp?: Timestamp;
}
