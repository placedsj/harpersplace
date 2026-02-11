// src/components/ai-schedule-optimizer/actions.ts
'use server';

import { optimizeCustodySchedule, OptimizeCustodyScheduleOutput, OptimizeCustodyScheduleInput } from '@/ai/flows/optimize-custody-schedule';

export async function optimizeCustodyScheduleAction(input: OptimizeCustodyScheduleInput): Promise<OptimizeCustodyScheduleOutput | null> {
  try {
    const result = await optimizeCustodySchedule(input);
    return result;
  } catch (error) {
    console.error("Error in optimizeCustodyScheduleAction:", error);
    return null;
  }
}
