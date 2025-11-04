import type { NextAuthConfig } from 'next-auth';
import Google from 'next-auth/providers/google';
// Import the Prisma client
import { db } from './lib/prisma';

// This is your config object
export const config = {
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  // Auth.js v5 uses session strategies.
  // "jwt" is the default and recommended for most apps.
  session: {
    strategy: 'jwt',
  },
  callbacks: {
    /**
     * This callback runs on sign-in and is where we create/update the user in our database.
     */
    async signIn({ user, account }) {
      // This runs every time a user logs in.
      // We'll "upsert" (update or insert) the user in our own User table.
      if (account?.provider === 'google' && user.id) {
        try {
          await db.user.upsert({
            where: { id: user.id }, // Find user by their Google ID
            create: {
              // If they don't exist, create them
              id: user.id,
              name: user.name,
              email: user.email,
              image: user.image,
            },
            update: {
              // If they do exist, update their info
              name: user.name,
              image: user.image,
            },
          });
          return true; // Continue with sign in
        } catch (error) {
          console.error('Error in signIn callback:', error);
          return false; // Stop sign in if database operation fails
        }
      }
      return true; // Continue for other sign-in types
    },
    /**
     * This callback runs first when a JWT is created.
     * We take the 'sub' (the user's ID from Google) and add it to the token.
     */
    async jwt({ token }) {
      // 'token.sub' is the user's ID from the provider (Google)
      // We're adding it to the token as 'id'
      if (token.sub) {
        token.id = token.sub;
      }
      return token;
    },
    /**
     * This callback runs when a session is checked.
     * We take the 'id' we added in the 'jwt' callback and put it
     * on the session.user object.
     */
    async session({ session, token }) {
      // 'token.id' is what we added in the 'jwt' callback
      // We're adding it to the session object
      if (token.id && session.user) {
        session.user.id = token.id as string;
      }
      return session;
    },
  },
} satisfies NextAuthConfig;

