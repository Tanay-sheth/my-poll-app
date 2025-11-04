// This page will use a hook (useActionState), so it must be a Client Component
"use client";

import { useActionState } from "react";
// Use the relative path from 'app/admin' to 'app/actions.ts'
import { createPoll, type CreatePollState } from "../actions";

/**
 * The form for creating a new poll.
 * It uses the 'useActionState' hook to manage form state and errors
 * from the 'createPoll' Server Action.
 */
function CreatePollForm() {
  // This is the state that will be returned from our server action
  const initialState: CreatePollState = { message: null, errors: {} };

  // `useActionState` is a React hook for Server Actions.
  // `state` holds the return value (errors or success message)
  // `formAction` is the function we pass to the <form>
  const [state, formAction] = useActionState(createPoll, initialState);

  return (
    <form action={formAction} className="space-y-6">
      <div>
        <label
          htmlFor="question"
          className="block text-sm font-medium text-gray-300"
        >
          Poll Question
        </label>
        <div className="mt-1">
          <input
            id="question"
            name="question"
            type="text"
            required
            className="w-full rounded-md border-gray-700 bg-gray-800 text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            aria-describedby="question-error"
          />
        </div>
        {/* Display question errors if they exist */}
        <div id="question-error" aria-live="polite" aria-atomic="true">
          {state.errors?.question && (
            <p className="mt-2 text-sm text-red-500">
              {state.errors.question[0]}
            </p>
          )}
        </div>
      </div>

      {/* We'll just hardcode 4 option fields for simplicity for now */}
      <div>
        <label
          htmlFor="option1"
          className="block text-sm font-medium text-gray-300"
        >
          Options (at least 2 are required)
        </label>
        <div className="mt-1 space-y-2">
          <input
            id="option1"
            name="option" // Note: all option inputs have the same 'name' attribute
            type="text"
            className="w-full rounded-md border-gray-700 bg-gray-800 text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
          <input
            id="option2"
            name="option"
            type="text"
            className="w-full rounded-md border-gray-700 bg-gray-800 text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
          <input
            id="option3"
            name="option"
            type="text"
            className="w-full rounded-md border-gray-700 bg-gray-800 text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            placeholder="Optional"
          />
          <input
            id="option4"
            name="option"
            type="text"
            className="w-full rounded-md border-gray-700 bg-gray-800 text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            placeholder="Optional"
          />
        </div>
        {/* Display option errors if they exist */}
        <div id="options-error" aria-live="polite" aria-atomic="true">
          {state.errors?.options && (
            <p className="mt-2 text-sm text-red-500">
              {state.errors.options[0]}
            </p>
          )}
        </div>
      </div>

      <div>
        <button
          type="submit"
          className="flex w-full justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-900"
        >
          Create Poll
        </button>
      </div>

      {/* Display general form errors (like 'not logged in' or db errors) */}
      <div id="form-error" aria-live="polite" aria-atomic="true">
        {state.errors?._form && (
          <p className="mt-2 text-sm text-red-500">{state.errors._form[0]}</p>
        )}
      </div>
    </form>
  );
}

// This is the main default component for the /admin page
export default function AdminPage() {
  return (
    <div className="mx-auto max-w-md">
      <h2 className="text-center text-2xl font-bold tracking-tight text-white">
        Create a New Poll
      </h2>
      <p className="mt-2 text-center text-sm text-gray-400">
        (For now, any logged-in user can create a poll)
      </p>

      <div className="mt-8 rounded-lg bg-gray-800/50 px-8 py-8 shadow-xl ring-1 ring-white/10">
        <CreatePollForm />
      </div>
    </div>
  );
}