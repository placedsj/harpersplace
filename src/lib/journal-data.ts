// src/lib/journal-data.ts
import type { JournalEntry } from '@/lib/types';

// This type definition was incorrect. It was trying to be an object AND an array.
// Correcting it to be an array of objects.
export const journalEntries = [
    {
      title: "Harper's First Soccer Goal!",
      date: new Date("2025-08-26"),
      content: "So proud of Harper today! She scored her very first goal in the game against the Blue Jays. Her face lit up with so much joy. It was a beautiful moment.",
      image: "https://images.unsplash.com/photo-1552318965-6e6be7484ada?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxMHx8c29jY2VyJTIwZ29hbHxlbnwwfHx8fDE3NTkxOTU3OTJ8MA&ixlib=rb-4.1.0&q=80&w=1080",
      dataAiHint: "soccer goal"
    },
    {
      title: "Visit to the Science Museum",
      date: new Date("2025-08-15"),
      content: "We had a fantastic day exploring the science museum. Harper was fascinated by the dinosaur exhibit and the planetarium show. A day full of curiosity and learning.",
      image: "https://picsum.photos/seed/museum/400/200",
      dataAiHint: "science museum"
    },
    {
      title: "First Day of Preschool",
      date: new Date("2025-08-05"),
      content: "Harper started preschool today! She was a little nervous at first, but she made a new friend named Lily and had a great time painting. So excited for this new chapter.",
      image: "https://picsum.photos/seed/preschool/400/200",
      dataAiHint: "preschool children"
    }
].sort((a,b) => b.date.getTime() - a.date.getTime());
