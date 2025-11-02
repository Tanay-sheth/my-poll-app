import React from 'react';
// Changed to relative path
import { AuthInfo } from './components/AuthComponents';
// Changed to relative path
import { auth } from '../auth'; // Import the auth function

// This is the main component for your homepage.
export default async function HomePage() {
  // We can 'await' the session directly in a Server Component!
  const session = await auth();

  return (
    // We'll use Tailwind classes for all our styling.
    <main className="flex min-h-screen flex-col items-center justify-between p-24 bg-gray-900 text-white">
      {/* Header Section */}
      <div className="z-10 w-full max-w-5xl items-center justify-between font-mono text-sm lg:flex">
        <p className="fixed left-0 top-0 flex w-full justify-center border-b border-gray-700 bg-gray-800/30 pb-6 pt-8 backdrop-blur-2xl lg:static lg:w-auto  lg:rounded-xl lg:border lg:border-gray-700 lg:bg-gray-800 lg:p-4">
          My Awesome Poll App
        </p>
        <div className="fixed bottom-0 left-0 flex h-48 w-full items-end justify-center bg-gradient-to-t from-black via-black lg:static lg:h-auto lg:w-auto lg:bg-none">
          {/* This component will show Login or Logout + User Info */}
          <AuthInfo />
        </div>
      </div>

      {/* Main Content Area */}
      <div className="relative flex flex-col items-center text-center">
        <h1 className="text-5xl font-bold">
          Welcome to the Polling Platform
        </h1>
        {/* Show a welcome message if the user is logged in */}
        {session?.user?.name && (
          <p className="mt-4 text-2xl text-gray-300">
            Hello, {session.user.name.split(' ')[0]}!
          </p>
        )}
      </div>

      {/* Footer / Placeholder */}
      <div className="mb-32 grid text-center lg:mb-0 lg:w-full lg:max-w-5xl lg:grid-cols-3 lg:text-left">
        <div className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-700 hover:bg-gray-800/30">
          <h2 className="mb-3 text-2xl font-semibold">Vote</h2>
          <p className="m-0 max-w-[30ch] text-sm opacity-50">
            Browse active polls and cast your vote.
          </p>
        </div>

        <div className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-700 hover:bg-gray-800/30">
          <h2 className="mb-3 text-2xl font-semibold">Admin Panel</h2>
          <p className="m-0 max-w-[30ch] text-sm opacity-50">
            Create and manage your own polls (coming soon!).
          </p>
        </div>

        <div className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-700 hover:bg-gray-800/30">
          <h2 className="mb-3 text-2xl font-semibold">Results</h2>
          <p className="m-0 max-w-[30ch] text-sm opacity-50">
            See the results of polls you have voted on.
          </p>
        </div>
      </div>
    </main>
  );
}


