// This file creates all the /api/auth/... routes
// (e.g., /api/auth/signin, /api/auth/callback, /api/auth/signout)
import { handlers } from '../../../../auth'; // Adjust path to root
export const { GET, POST } = handlers;
