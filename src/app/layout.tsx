import type {Metadata, Viewport} from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from '@/hooks/use-auth';
import { FirebaseProvider } from '@/firebase';

export const metadata: Metadata = {
  title: "Harper's Place - Modern Co-Parenting & Family Management",
  description: 'A comprehensive family management platform for New Brunswick families. Track custody schedules, milestones, finances, and more with secure, collaborative tools.',
  keywords: ['co-parenting', 'family management', 'New Brunswick', 'custody calendar', 'child development', 'parenting app'],
  authors: [{ name: "Harper's Place Team" }],
  openGraph: {
    title: "Harper's Place",
    description: 'Modern co-parenting and family management platform',
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
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Montserrat:wght@400;600;700;800;900&family=Open+Sans:wght@400;600&display=swap" rel="stylesheet" />
      </head>
      <body className="antialiased font-sans">
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
