// This MUST be a Client Component because it uses a hook (useFormStatus)
"use client";

// This hook gives us the status of the form this button is inside
import { useFormStatus } from "react-dom";
// We don't need to import from '@prisma/client' anymore!
// We'll get the type from our data-access file.
import type { PollWithData } from "../../lib/data-access";

// This is the new, correct type for our option.
// It's the type of a single item in the 'options' array
// from our 'PollWithData' type.
type PollOption = PollWithData["options"][number];

interface VoteButtonProps {
  option: PollOption;
  // We pass in the user's vote to know if this button should be styled as "selected"
  userVoteId: string | undefined;
}

/**
 * A Client Component button that submits a vote.
 * It disables itself while the form is submitting.
 */
export function VoteButton({ option, userVoteId }: VoteButtonProps) {
  // 'pending' is true if the form is currently submitting
  const { pending } = useFormStatus();

  const isSelected = option.id === userVoteId;

  return (
    <button
      type="submit"
      name="optionId" // This name 'optionId' is what our Server Action looks for
      value={option.id} // The value is the ID of the option being voted for
      disabled={pending} // Disable the button while the action is running
      className={`
        w-full rounded-md px-4 py-2 text-left text-sm font-medium transition-all
        ${
          isSelected
            ? "bg-indigo-600 text-white ring-2 ring-indigo-400 ring-offset-2 ring-offset-gray-900"
            : "bg-gray-700 text-gray-200 hover:bg-gray-600"
        }
        ${
          pending
            ? "cursor-not-allowed opacity-50"
            : "focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-900"
        }
      `}
    >
      {option.text}
    </button>
  );
}

