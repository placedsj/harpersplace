import type {Metadata} from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from '@/hooks/use-auth';
import { Montserrat, Open_Sans } from 'next/font/google';
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
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 5,
  },
};

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
      <body className={`antialiased ${openSans.variable} ${montserrat.variable}`}>
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
