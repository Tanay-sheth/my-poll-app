// This file is a best practice for separating data-fetching logic
// from your page components. It's clean and reusable.

import { db } from './prisma'; // Import our Prisma client

/**
 * Fetches all polls and includes rich data for the UI.
 * @param userId - The (optional) ID of the currently logged-in user.
 */
export async function getPolls(userId: string | undefined) {
  try {
    const polls = await db.poll.findMany({
      // Fetch polls in descending order (newest first)
      orderBy: {
        createdAt: 'desc',
      },
      // Include all the related data we need for the UI
      include: {
        // Get the author's name
        author: {
          select: {
            name: true,
          },
        },
        // Get all options for each poll
        options: {
          include: {
            // For each option, get a *count* of how many votes it has
            _count: {
              select: { votes: true },
            },
          },
        },
        // Get the vote for *this specific user*
        votes: {
          where: {
            userId: userId, // Only get the vote if the userId matches
          },
        },
      },
    });
    return polls;
  } catch (error) {
    console.error('Failed to fetch polls:', error);
    // In a real app, you'd handle this more gracefully
    return [];
  }
}

// We'll use this type in our components to make TypeScript happy.
// It's a complex type derived from our 'getPolls' function.
// We're essentially saying "the type of one poll is whatever 'getPolls' returns, but just one item from that array."
export type PollWithData = Awaited<
  ReturnType<typeof getPolls>
>[number];
