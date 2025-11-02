import { auth, signIn, signOut } from '../../auth';

// This is a server-side component to get the session
export async function AuthInfo() {
  const session = await auth();
  
  if (!session?.user) {
    return <LoginButton />;
  }

  return (
    <div className="flex items-center gap-4">
      {session.user.image && (
        <img
          src={session.user.image}
          alt={session.user.name || 'User avatar'}
          width={40}
          height={40}
          className="rounded-full"
        />
      )}
      <span className="hidden sm:inline">
        {session.user.name}
      </span>
      <LogoutButton />
    </div>
  );
}

// Client component for the Login button
export function LoginButton() {
  // We use a server action to sign in
  return (
    <form
      action={async () => {
        'use server';
        await signIn('google');
      }}
    >
      <button
        type="submit"
        className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-800"
      >
        Login
      </button>
    </form>
  );
}

// Client component for the Logout button
export function LogoutButton() {
  // We use a server action to sign out
  return (
    <form
      action={async () => {
        'use server';
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

