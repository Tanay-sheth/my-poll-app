import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
// --- FIX ---
// Changed from './globals.css' to use the root-based alias
// This seems to be more reliable for the build tool.
import '@/app/globals.css';
// ---

const inter = Inter({ subsets: ['latin'] });

// We update the metadata to include PWA info
export const metadata: Metadata = {
  title: 'My Poll App',
  description: 'A real-time polling app built with Next.js.',
  // --- PWA Tags ---
  manifest: '/manifest.json', // Link to the manifest

  // --- FIX for TypeScript Error ---
  // Apple-specific tags and other non-standard tags
  // must go inside the 'other' property.
  // The property names must also be in 'kebab-case'
  // to render as correct <meta> tags.
  other: {
    'apple-web-app-capable': 'yes',
    'apple-web-app-status-bar-style': 'default',
    'apple-web-app-title': 'PollApp',
  },
  // ---
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/*
          This theme-color meta tag is important.
          It tells the browser (especially on mobile) what color to
          make the top status bar, making it feel like a native app.
          It should match the 'theme_color' in your manifest.json
        */}
        <meta name="theme-color" content="#4f46e5" />
      </head>
      <body className={`${inter.className} bg-gray-900 text-gray-100`}>
        {children}
      </body>
    </html>
  );
}


