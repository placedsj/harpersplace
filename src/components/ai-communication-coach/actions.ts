// src/components/ai-communication-coach/actions.ts
'use server';

import { improveCommunication, ImproveCommunicationOutput } from '@/ai/flows/improve-communication';

export async function improveCommunicationAction(text: string): Promise<ImproveCommunicationOutput | null> {
  try {
    const result = await improveCommunication({ message: text });
    return result;
  } catch (error) {
    console.error("Error in improveCommunicationAction:", error);
    return null;
  }
}
