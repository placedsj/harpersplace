// src/app/(main)/layout.tsx
'use client';

import { MainNav } from '@/components/main-nav';
import { UserNav } from '@/components/user-nav';
import { CoParentingTip } from '@/components/co-parenting-tip';
import { SiteFooter } from '@/components/site-footer';

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  return (
    <div className="flex flex-col min-h-screen bg-background">
        <header className="border-b bg-card/95 backdrop-blur-sm sticky top-0 z-40 shadow-sm">
          <div className="flex h-16 items-center px-4 container mx-auto">
            <MainNav />
            <div className="flex items-center space-x-3 flex-1">
              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                <span className="text-sm font-bold text-primary-foreground">H</span>
              </div>
              <h1 className="text-xl font-bold tracking-tight bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent hidden sm:block">
                Harper's Place
              </h1>
            </div>
            <div className="ml-auto flex items-center space-x-4">
              <UserNav />
            </div>
          </div>
        </header>
        <main className="flex-1 space-y-4 p-8 pt-6 container mx-auto">
          {children}
          <div className="pt-8">
            <CoParentingTip />
          </div>
        </main>
        <SiteFooter />
    </div>
  );
}
