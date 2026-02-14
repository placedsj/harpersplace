'use client';

import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import { Montserrat, Open_Sans } from 'next/font/google';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '@/lib/queryClient';
import { FirebaseProvider } from '@/firebase/provider';

const montserrat = Montserrat({
  subsets: ['latin'],
  variable: '--font-montserrat',
  weight: ['400', '600', '700', '800', '900'],
});

const openSans = Open_Sans({
  subsets: ['latin'],
  variable: '--font-open-sans',
  weight: ['400', '600'],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <title>Harper&apos;s Place</title>
        <meta name="description" content="Co-parenting and family management platform" />
        <meta name="theme-color" content="#ffffff" />
      </head>
      <body className={`antialiased ${openSans.variable} ${montserrat.variable}`}>
        <QueryClientProvider client={queryClient}>
          <FirebaseProvider>
            {children}
            <Toaster />
          </FirebaseProvider>
        </QueryClientProvider>
      </body>
    </html>
  );
}
