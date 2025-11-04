import { z } from 'zod';

// This is a Zod schema. It defines the "shape" of the data
// we expect from our "create poll" form.
// This provides powerful server-side validation.

export const CreatePollSchema = z.object({
  // The poll must have a question that is a string and at least 3 chars long
  question: z.string().min(3, { message: 'Question must be at least 3 characters long.' }),

  // The poll must have at least 2 options
  // We use an array of strings, and each string must be at least 1 char long
  options: z.array(
    z.string().min(1, { message: 'Option cannot be empty.' })
  ).min(2, { message: 'Must have at least 2 options.' }),
});

// We'll add more schemas here later, like for voting.
