// import type { NextConfig } from "next";
// // Import the PWA plugin initializer

// import withPWAInit from "next-pwa";

// // Initialize the PWA plugin with its configuration
// const withPWA = withPWAInit({
//   dest: "public", // Destination directory for service worker
//   register: true, // Automatically register the service worker
//   skipWaiting: true, // Install new service worker immediately
//   disable: process.env.NODE_ENV === "development", // Disable PWA in development
// });

// // Your standard Next.js config
// const nextConfig: NextConfig = {
//   /* config options here */
// };

// // Export the config, wrapped by the PWA plugin
// export default withPWA(nextConfig);


import type { NextConfig } from "next";
// Import the PWA plugin initializer
import withPWAInit from "next-pwa";

// Initialize the PWA plugin with its configuration
const withPWA = withPWAInit({
  dest: "public", // Destination directory for service worker
  register: true, // Automatically register the service worker
  skipWaiting: true, // Install new service worker immediately
  disable: process.env.NODE_ENV === "development", // Disable PWA in development
});

// Your standard Next.js config
const nextConfig: NextConfig = {
  // --- THIS IS THE NEW LINE FOR DOCKER ---
  // This creates a minimal .next/standalone folder for efficient containerization
  output: "standalone",
};

// Export the config, wrapped by the PWA plugin
export default withPWA(nextConfig);