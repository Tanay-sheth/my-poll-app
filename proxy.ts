import { auth } from './auth';

// This file intercepts requests to manage and protect routes
// Next.js 16 renamed 'middleware.ts' to 'proxy.ts'
// The 'auth' function from Auth.js acts as this proxy/middleware
export default auth;
