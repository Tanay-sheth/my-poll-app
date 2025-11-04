// This file does not need "use server" at the top,
// because the actions are defined *inside* the form components.
import type { Session } from "next-auth";
// Use the relative path from 'app/components' to the root 'auth.ts'
import { signIn, signOut } from "../../auth";

/**
 * A form component that renders a "Login with Google" button.
 * Uses an inline Server Action.
 */
export function LoginButton() {
  return (
    <form
      action={async () => {
        "use server"; // This is the Server Action
        await signIn("google");
      }}
    >
      <button
        type="submit"
        className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-800"
      >
        Login with Google
      </button>
    </form>
  );
}

/**
 * A form component that renders a "Logout" button.
 * Uses an inline Server Action.
 */
export function LogoutButton() {
  return (
    <form
      action={async () => {
        "use server"; // This is the Server Action
        await signOut();
      }}
    >
      <button
        type="submit"
        className="rounded-lg bg-gray-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-gray-700 focus:outline-none focus:ring-4 focus:ring-gray-800"
      >
        Logout
      </button>
    </form>
  );
}

/**
 * A component that displays user info and a logout button if logged in,
 * or a login button if not.
 * @param { session: Session | null } props - The user's session object, passed from a Server Component.
 */
export function AuthInfo({ session }: { session: Session | null }) {
  // If the user is logged in, show their info and a SignOut button
  if (session?.user) {
    return (
      <div className="flex flex-col items-center gap-4">
        <div className="flex items-center gap-4">
          {/* We check for user.image before trying to display it */}
          {session.user.image && (
            <img
              src={session.user.image}
              alt="User avatar"
              className="h-12 w-12 rounded-full ring-2 ring-white"
            />
          )}
          <span className="text-lg text-white">
            Welcome, {session.user.name}
          </span>
        </div>
        {/* Show the LogoutButton component */}
        <LogoutButton />
      </div>
    );
  }

  // If the user is not logged in, show the LoginButton component
  return <LoginButton />;
}