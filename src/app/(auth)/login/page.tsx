
'use client';

import { Button } from "@/components/ui/button";
import Link from 'next/link';

export default function LoginPage() {

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-purple-900 dark:to-indigo-900">
      <div className="flex items-center justify-center min-h-screen px-4">
        <div className="w-full max-w-md space-y-8 text-center">
          
          {/* Header Section */}
          <div className="space-y-4">
            <h1 className="font-headline uppercase bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                <span className="text-5xl font-extrabold tracking-tight">placed</span>
                <span className="text-3xl font-extrabold tracking-tight">.ca</span>
            </h1>
            <p className="text-muted-foreground text-xl font-sans">
              Two Roofs, One Home.
            </p>
          </div>

          {/* Access Options */}
          <div className="space-y-4 pt-4">
            <div className="grid grid-cols-1 gap-4">
              <Button asChild size="lg" className="w-full">
                <Link href="/signup">Create Parent Account</Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="w-full">
                 <Link href="/login-form">Parent Login</Link>
              </Button>
            </div>
            
            <div className="text-center text-sm text-muted-foreground/80 space-y-1 pt-6 font-sans">
              <p>Create an account to securely save and manage your family's information.</p>
              <p className="text-xs">Your data is encrypted, private, and court-ready.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
