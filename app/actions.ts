// This line marks all functions in this file as Server Actions.
// They can be called from client or server components.
"use server";

import { z } from 'zod'; // Zod for validation
import { revalidatePath } from 'next/cache'; // To refresh the page
import { redirect } from 'next/navigation'; // To send the user to a new page

// --- Use relative paths from 'app' directory ---
import { auth } from '../auth'; // This is in the root, so '../'
import { db } from '../lib/prisma'; // This is in 'lib', so '../lib/'
import { CreatePollSchema } from '../lib/definitions'; // This is in 'lib', so '../lib/'
// ---

// This is a type for the state we'll return from the action
// It can either have a list of errors, or a success message.
export type CreatePollState = {
  errors?: {
    question?: string[];
    options?: string[];
    _form?: string[];
  };
  message?: string | null;
};

// This is the Server Action!
// It takes the previous state of the form (for displaying errors)
// and the form data.
export async function createPoll(
  prevState: CreatePollState,
  formData: FormData,
): Promise<CreatePollState> {
  // --- 1. AUTHENTICATION ---
  // Check if the user is logged in
  const session = await auth();
  if (!session?.user?.id) {
    return {
      errors: {
        _form: ['You must be logged in to create a poll.'],
      },
    };
  }
  const userId = session.user.id;

  // --- 2. VALIDATION ---
  // Get all the "option" fields from the form
  const options = formData
    .getAll('option')
    .map(String)
    .filter((option) => option.trim().length > 0); // Remove empty options

  // Validate the data using our Zod schema
  // We use the 'PollFormSchema' we imported
  const validatedFields = CreatePollSchema.safeParse({
    question: formData.get('question'),
    options: options,
  });

  // If validation fails, return the errors
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  // Get the safe, validated data
  const { question } = validatedFields.data;

  // --- 3. DATABASE UPDATE ---
  try {
    // We use a Prisma transaction to ensure that we either create
    // the Poll AND its Options, or we create nothing.
    // This prevents "orphaned" data.
    await db.poll.create({
      data: {
        question: question,
        authorId: userId,
        // Create the related PollOption records
        options: {
          create: options.map((optionText) => ({
            text: optionText,
          })),
        },
      },
    });
  } catch (error) {
    // Handle database errors
    return {
      errors: {
        _form: ['Database Error: Failed to create poll.'],
      },
    };
  }

  // --- 4. REVALIDATE & REDIRECT ---
  // Revalidate the cache for the homepage, so it shows the new poll
  revalidatePath('/');

  // Redirect the user back to the homepage to see their new poll
  redirect('/');
}

// -----------------------------------------------------------------
// --- NEW VOTE ACTION ---
// -----------------------------------------------------------------

/**
 * A Server Action to submit a user's vote.
 * This action is called from the PollCard form.
 * @param formData The form data, which must contain 'pollId' and 'optionId'
 */
export async function submitVote(formData: FormData) {
  // --- 1. AUTHENTICATION ---
  const session = await auth();
  if (!session?.user?.id) {
    // This should, in theory, not be hit if the UI hides the button,
    // but it's crucial for server-side security.
    throw new Error('You must be logged in to vote.');
  }
  const userId = session.user.id;

  // --- 2. VALIDATION ---
  const pollId = formData.get('pollId');
  const optionId = formData.get('optionId');

  // Check that we got the data we need
  if (
    !pollId ||
    !optionId ||
    typeof pollId !== 'string' ||
    typeof optionId !== 'string'
  ) {
    throw new Error('Invalid form data. Poll ID and Option ID are required.');
  }

  // --- 3. DATABASE UPDATE ---
  try {
    // We use "upsert" to handle the "one vote per user per poll" rule.
    // This is based on the 'userId_pollId' unique index we created in our schema.
    await db.vote.upsert({
      where: {
        // Find a vote that matches this user AND this poll
        userId_pollId: {
          userId: userId,
          pollId: pollId,
        },
      },
      // If a vote doesn't exist...
      create: {
        userId: userId,
        pollId: pollId,
        optionId: optionId, // ...create a new vote with this option
      },
      // If a vote *does* exist...
      update: {
        optionId: optionId, // ...update the existing vote to this new option
      },
    });
  } catch (error) {
    console.error('Database Error: Failed to submit vote.', error);
    // In a real app, we might return this error to the UI
    throw new Error('Database Error: Failed to submit vote.');
  }

  // --- 4. REVALIDATE ---
  // Revalidate the cache for the homepage, so it shows the new vote counts
  revalidatePath('/');
  // We don't redirect, as this action happens on the homepage itself.
  // The page will just refresh with the new data.
}

