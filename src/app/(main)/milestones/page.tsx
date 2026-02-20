import MilestonesClient from './milestones-client';

export const dynamic = 'force-dynamic';

export type { Milestone } from './milestones-client';

export default function MilestonesPage() {
  return <MilestonesClient />;
}
