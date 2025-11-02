import type { NextAuthConfig } from 'next-auth';
import Google from 'next-auth/providers/google';

// Notice this is only an object, not a full NextAuth call
export const config = {
  // We'll define our authentication providers here
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  // We'll add custom pages, callbacks, and other logic here later
} satisfies NextAuthConfig;

