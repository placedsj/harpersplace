import LogClient from './log-client';

export const dynamic = 'force-dynamic';

export type { DailyLog } from './log-client';

export default function LogPage() {
  return <LogClient />;
}
