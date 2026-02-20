import HealthClient from './health-client';

export const dynamic = 'force-dynamic';

export type { HealthEvent } from './health-client';

export default function HealthPage() {
  return <HealthClient />;
}
