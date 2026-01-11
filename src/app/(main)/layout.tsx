// src/app/(main)/layout.tsx
'use client';

import { MainNav } from '@/components/main-nav';
import { UserNav } from '@/components/user-nav';
import { CoParentingTip } from '@/components/co-parenting-tip';
import { SiteFooter } from '@/components/site-footer';
import { ErrorBoundary } from '@/components/error-boundary';

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900">
        <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm shadow-lg border-b border-gray-100 dark:bg-gray-900/95 dark:border-gray-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              
              {/* LEFT SIDE: Logo and Navigation */}
              <div className="flex items-center space-x-8">
                {/* Placed.ca Logo */}
                <div className="flex items-center">
                  <h1 className="font-headline uppercase bg-gradient-to-r from-primary to-purple-400 bg-clip-text text-transparent">
                    <span className="text-2xl tracking-wider">placed</span>
                    <span className="text-lg tracking-wider">.ca</span>
                  </h1>
                </div>

                {/* Desktop Navigation */}
                <MainNav />
              </div>

              {/* RIGHT SIDE: User Navigation */}
              <div className="ml-auto flex items-center space-x-4">
                <UserNav />
              </div>
            </div>
          </div>
        </header>
        <main id="main-content" className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
          <ErrorBoundary>
            {children}
          </ErrorBoundary>
          <div className="pt-8">
            <CoParentingTip />
          </div>
        </main>
        <SiteFooter />
    </div>
  );
}
