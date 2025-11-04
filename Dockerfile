# --- STAGE 1: The "Builder" ---
# This stage builds the app. It's a temporary container
# that will be thrown away, taking all the build tools with it.
FROM node:20-alpine AS builder

# Set the working directory
WORKDIR /app

# Copy the package.json and lockfile
COPY package*.json ./

# Install all dependencies (including devDependencies for Prisma and building)
RUN npm ci

# Copy the rest of your application source code
COPY . .

# --- THIS IS THE FIX ---
# We must securely provide the database URLs for Prisma to generate the client.
# We mount them as 'secrets' so they are never saved in the image layers.
RUN --mount=type=secret,id=DATABASE_URL \
    --mount=type=secret,id=DIRECT_DATABASE_URL \
    DATABASE_URL=$(cat /run/secrets/DATABASE_URL) \
    DIRECT_DATABASE_URL=$(cat /run/secrets/DIRECT_DATABASE_URL) \
    npx prisma generate

# Build the app using the --webpack flag (as we set up in package.json)
# This will create the .next folder, including .next/standalone
RUN npm run build --webpack

# --- STAGE 2: The "Runner" ---
# This is the final, small, secure image that will be deployed.
# It starts from a fresh, lightweight Node.js image.
FROM node:20-alpine

WORKDIR /app

# --- This is the key to a small image ---
# Copy ONLY the necessary files from the "builder" stage

# 1. Copy the 'standalone' app output
# This contains your minimal server.js and necessary node_modules
COPY --from=builder /app/.next/standalone .

# 2. Copy the 'public' folder (for PWA manifest, icons, etc.)
COPY --from=builder /app/public ./public

# 3. Copy the '.next/static' folder (for CSS, client-side JS, etc.)
COPY --from=builder /app/.next/static ./.next/static

# Expose port 3000 (which Next.js uses)
EXPOSE 3000

# --- THIS IS THE FIX ---
# The command to run your app
# The 'server.js' file is now at the root of our /app directory,
# not in '.next/standalone'.
CMD ["node", "server.js"]