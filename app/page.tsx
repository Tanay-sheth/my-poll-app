// This is a Server Component. It can fetch data directly.
import Link from 'next/link'; // Import the Link component for navigation
import { Suspense } from 'react'; // Import Suspense for streaming

// --- Use relative paths from 'app' directory ---
// './' means in the same folder (app)
// '../' means up one level (root)
import { AuthInfo } from './components/AuthComponents';
import { auth } from '../auth'; // This is in the root, so '../'
import { getPolls } from '../lib/data-access'; // This is in 'lib', so '../lib/'
import { PollList } from './components/PollList';
// ---

/**
 * A simple loading component to be shown while the polls are streaming in.
 */
function PollsLoadingSkeleton() {
  return (
    <div className="space-y-6">
      {/* Create a few placeholder "skeleton" cards */}
      {[...Array(3)].map((_, i) => (
        <div
          key={i}
          className="animate-pulse rounded-lg bg-gray-800/50 p-6 shadow-xl ring-1 ring-white/10"
        >
          <div className="h-6 w-3/4 rounded bg-gray-700"></div>
          <div className="mt-4 space-y-3">
            <div className="h-8 rounded bg-gray-700"></div>
            <div className="h-8 rounded bg-gray-700"></div>
            <div className="h-8 rounded bg-gray-700"></div>
          </div>
        </div>
      ))}
    </div>
  );
}

/**
 * This is an async Server Component that fetches the poll data
 * and renders the PollList.
 * We pass in the userId so we can check which poll they voted on.
 */
async function LatestPolls({ userId }: { userId: string | undefined }) {
  // This is a Server Component, so we can fetch data directly!
  const polls = await getPolls(userId);

  if (polls.length === 0) {
    return (
      <p className="text-center text-gray-400">
        No polls have been created yet.
      </p>
    );
  }

  return <PollList polls={polls} />;
}

/**
 * The main component for the homepage (/)
 */
export default async function Home() {
  // We can 'await' the session directly in a Server Component
  const session = await auth();

  return (
    <main className="mx-auto max-w-2xl p-6">
      <header className="mb-12 text-center">
        {/* This component will show Login/Logout buttons or user info */}
        <AuthInfo session={session} />

        <h1 className="mt-6 text-4xl font-bold tracking-tight text-white sm:text-5xl">
          Real-time Polls
        </h1>
        <p className="mt-4 text-lg text-gray-300">
          Built with Next.js, Server Actions, and Prisma
        </p>

        {/* Show the "Create Poll" link ONLY if the user is logged in */}
        {session?.user && (
          <div className="mt-6">
            <Link
              href="/admin"
              className="rounded-md bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              Create a New Poll
            </Link>
          </div>
        )}
      </header>

      {/* --- MODIFIED SECTION --- */}
      {/* Check if the user is logged in before showing the polls */}
      {session?.user ? (
        // If LOGGED IN, show the polls section
        <section>
          <h2 className="mb-6 text-center text-2xl font-semibold text-white">
            Latest Polls
          </h2>

          {/*
            Use <Suspense> to stream the poll data.
            The page will load instantly with the <PollsLoadingSkeleton>.
          */}
          <Suspense fallback={<PollsLoadingSkeleton />}>
            <LatestPolls userId={session.user.id} />
          </Suspense>
        </section>
      ) : (
        // If LOGGED OUT, show a prompt to log in
        <section className="text-center">
          <p className="rounded-lg bg-gray-800/50 px-6 py-8 text-lg text-gray-400 shadow-xl ring-1 ring-white/10">
            Please log in to view and vote on polls.
          </p>
        </section>
      )}
      {/* --- END MODIFIED SECTION --- */}
    </main>
  );
}

