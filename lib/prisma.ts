import { PrismaClient } from '@prisma/client';

// This is a "singleton" pattern.
// It ensures that only one instance of PrismaClient is created.
// This is a best practice to avoid too many database connections,
// especially in a serverless environment like Next.js.

declare global {
  // We attach the client to the globalThis object in development
  // to preserve it across hot reloads.
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

// In production, we create a new client.
// In development, we check if a client already exists on globalThis.
// If not, we create one and attach it.
export const db = globalThis.prisma || new PrismaClient();

if (process.env.NODE_ENV !== 'production') {
  globalThis.prisma = db;
}

