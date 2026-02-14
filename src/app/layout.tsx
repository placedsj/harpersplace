import type {Metadata, Viewport} from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import { Montserrat, Open_Sans } from 'next/font/google';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '@/lib/queryClient';
import { FirebaseProvider } from '@/firebase';
import { Providers } from "@/components/providers";

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

export const metadata: Metadata = {
  title: "Harper's Place",
  description: "Co-parenting and family management platform",
};

export const viewport: Viewport = {
  themeColor: '#ffffff',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`antialiased ${openSans.variable} ${montserrat.variable}`}>
        <FirebaseProvider>
          <QueryClientProvider client={queryClient}>
            {children}
          </QueryClientProvider>
          <Toaster />
        </FirebaseProvider>
        <Providers>
          {children}
        </Providers>
        <Toaster />
      </body>
    </html>
  );
}
