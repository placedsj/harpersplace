// src/components/ai-sleep-suggestor/actions.ts
'use server';

import { suggestSleepSchedule, SuggestSleepScheduleOutput, SuggestSleepScheduleInput } from '@/ai/flows/suggest-sleep-schedule';

export async function suggestSleepScheduleAction(input: SuggestSleepScheduleInput): Promise<SuggestSleepScheduleOutput | null> {
  try {
    const result = await suggestSleepSchedule(input);
    return result;
  } catch (error) {
    console.error("Error in suggestSleepScheduleAction:", error);
    return null;
  }
}
