import type {Metadata, Viewport} from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from '@/hooks/use-auth';
import { FirebaseProvider } from '@/firebase';

export const metadata: Metadata = {
  title: "Placed.ca - Two Roofs, One Home",
  description: 'A comprehensive family management platform for co-parenting. Track custody schedules, milestones, finances, and more with secure, collaborative tools.',
  keywords: ['co-parenting', 'family management', 'custody calendar', 'child development', 'parenting app', 'new brunswick'],
  authors: [{ name: "Placed.ca Team" }],
  openGraph: {
    title: "Placed.ca",
    description: 'Two Roofs, One Home. The modern co-parenting platform.',
    type: 'website',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Fredoka+One&family=Open+Sans:wght@400;600&display=swap" rel="stylesheet" />
      </head>
      <body className="antialiased font-sans" suppressHydrationWarning>
        <FirebaseProvider>
          <AuthProvider>
            {children}
          </AuthProvider>
        </FirebaseProvider>
        <Toaster />
      </body>
    </html>
  );
}
