// This component will be a Server Component to start,
// but it will render Client Components (the buttons).

// --- FIX: Swapping to aliases for Vercel build ---
// We'll use the root-based '@/' alias for all imports
// to ensure Vercel's build process can find them.
import type { PollWithData } from "@/lib/data-access";
import { submitVote } from "@/app/actions";
import { VoteButton } from "@/app/components/VoteButton";
// ---

// --- FIX for Vercel Build Error ---
// We create a type for a single 'option' from our poll data
// This is one element from the 'poll.options' array.
type PollOption = PollWithData["options"][number];
// ---

/**
 * A component that renders a single poll, including its
 * question, options, and voting buttons.
 */
export function PollCard({ poll }: { poll: PollWithData }) {
  // Find out what this user voted for in this poll (if anything)
  // Our 'getPolls' query cleverly only returns one vote if it matches
  // the logged-in user, so we can just grab the first one.
  const userVote = poll.votes[0];

  // Calculate the total number of votes for this poll
  // --- THIS IS THE FIX for the Vercel build error ---
  // We explicitly type 'sum' as a number and 'option' with our new type
  const totalVotes = poll.options.reduce((sum: number, option: PollOption) => {
    return sum + option._count.votes;
  }, 0);

  return (
    <article className="rounded-lg bg-gray-800/50 p-6 shadow-xl ring-1 ring-white/10">
      <header className="mb-4">
        <h3 className="text-lg font-semibold text-white">{poll.question}</h3>
        <p className="text-sm text-gray-400">
          Posted by {poll.author?.name || "Anonymous"}
        </p>
      </header>

      {/*
        This is the magic!
        This <form> calls the 'submitVote' Server Action.
        The action runs on the server, not the client.
        The 'revalidatePath' in the action will cause this
        component to re-render with new data.
      */}
      <form action={submitVote} className="space-y-3">
        {/* We must include the pollId as hidden data so the action knows what poll is being voted on */}
        <input type="hidden" name="pollId" value={poll.id} />

        {poll.options.map((option) => {
          // Calculate the percentage of votes for this option
          const voteCount = option._count.votes;
          const percentage =
            totalVotes === 0 ? 0 : (voteCount / totalVotes) * 100;

          return (
            // We wrap each button in a 'results' div to show the progress bar
            <div key={option.id} className="relative">
              {/* This is the progress bar */}
              <div
                className="absolute left-0 top-0 h-full rounded-md bg-indigo-500/30 transition-all"
                style={{ width: `${percentage}%` }}
              ></div>

              {/*
                This is the text for the vote counts.
                We put it *outside* the button so you can't click it,
                and use z-index to make sure it's on top of the progress bar.
              */}
              <div className="absolute right-3 top-1/2 -translate-y-1/2 text-sm font-medium text-gray-300">
                {voteCount} vote{voteCount !== 1 ? "s" : ""}
              </div>

              {/*
                This is our Client Component button.
                It's "form-aware" and will disable itself
                when the form is submitting.
              */}
              <VoteButton option={option} userVoteId={userVote?.optionId} />
            </div>
          );
        })}
      </form>
    </article>
  );
}

