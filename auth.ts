import NextAuth from 'next-auth';
import { config } from './auth.config';

// This is the main export that initializes NextAuth.js
// It imports the 'config' from auth.config.ts
export const { auth, signIn, signOut, handlers } = NextAuth(config);

