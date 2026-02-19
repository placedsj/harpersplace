import { LogClient } from './log-client';

export const dynamic = 'force-dynamic';

export type DailyLog = import('./log-client').DailyLog;

export default function LogPage() {
  return <LogClient />;
}
