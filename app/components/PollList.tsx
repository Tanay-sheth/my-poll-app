// This is a Server Component. Its only job is to loop.
import type { PollWithData } from '@/lib/data-access';
import { PollCard } from './PollCard';

interface PollListProps {
  polls: PollWithData[];
}

/**
 * A Server Component that renders a list of PollCard components.
 */
export function PollList({ polls }: PollListProps) {
  if (polls.length === 0) {
    return (
      <div className="text-center text-gray-400">
        <p>No polls yet!</p>
        <p>
          Be the first to{' '}
          <a href="/admin" className="text-indigo-400 underline">
            create one
          </a>
          .
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {polls.map((poll) => (
        <PollCard key={poll.id} poll={poll} />
      ))}
    </div>
  );
}
