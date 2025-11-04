// This is a Server Component. It fetches no data, just renders.
// Use relative paths for imports
import type { PollWithData } from '../../lib/data-access';
import { submitVote } from '../actions';
import { VoteButton } from './VoteButton';

interface PollCardProps {
  poll: PollWithData;
}

/**
 * A Server Component that displays a single poll, its options,
 * and the vote counts.
 */
export function PollCard({ poll }: PollCardProps) {
  // We get the user's vote from the poll data (it's either an array with one vote, or an empty array)
  const userVote = poll.votes[0];

  // Calculate the total number of votes for this poll
  const totalVotes = poll.options.reduce((sum: number, option) => {
    return sum + option._count.votes;
  }, 0);

  return (
    <div className="rounded-lg bg-gray-800/50 p-6 shadow-xl ring-1 ring-white/10">
      <h3 className="text-lg font-semibold text-white">
        {poll.question}
      </h3>
      <p className="mt-1 text-sm text-gray-400">
        Posted by {poll.author?.name || 'Anonymous'}
      </p>

      {/* This form wraps our list of options. When any button
          inside is clicked, it will submit the form. */}
      <form action={submitVote} className="mt-4 space-y-3">
        {/* We need to pass the pollId to our action,
            so we use a hidden input field. */}
        <input type="hidden" name="pollId" value={poll.id} />

        <div className="space-y-2">
          {poll.options.map((option) => {
            // For each option, calculate its percentage of the total votes
            const votePercentage =
              totalVotes === 0
                ? 0
                : (option._count.votes / totalVotes) * 100;

            return (
              <div key={option.id} className="relative">
                {/* This div is the "progress bar" that shows the vote share */}
                <div
                  className="absolute left-0 top-0 h-full rounded-md bg-indigo-900/50 transition-all duration-500"
                  style={{ width: `${votePercentage}%` }}
                />
                {/* This relative div sits on top of the progress bar */}
                <div className="relative flex items-center justify-between">
                  {/* The VoteButton is our interactive Client Component */}
                  <VoteButton
                    option={option}
                    userVoteId={userVote?.optionId}
                  />
                  {/* Display the vote count and percentage */}
                  <span className="z-10 pr-3 text-sm font-semibold text-gray-300">
                    {option._count.votes}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </form>

      <p className="mt-4 text-right text-xs text-gray-500">
        {totalVotes} Total Votes
      </p>
    </div>
  );
}

