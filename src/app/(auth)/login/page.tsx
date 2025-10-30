'use client';

import { Button } from "@/components/ui/button";
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function LoginPage() {
  const router = useRouter();

  const handleGuestMode = () => {
    router.push('/dashboard');
  };


  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-purple-900 dark:to-indigo-900">
      <div className="flex items-center justify-center min-h-screen px-4">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center space-y-4">
            <h1 className="text-6xl font-extrabold tracking-tight uppercase bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
              PLACED
            </h1>
            <p className="text-xl font-semibold text-foreground">Your team, our home</p>
            <p className="text-muted-foreground">
              Welcome to your legal place. Your data's home. Let us worry about the data, you just worry about their best interest.
            </p>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-1 gap-3">
              <Button asChild size="lg" className="w-full">
                <Link href="/api/login">Parent Login</Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="w-full">
                <Link href="/api/login">Create Parent Account</Link>
              </Button>
              <Button onClick={handleGuestMode} size="lg" variant="secondary" className="w-full">
                Team & Guest Access
              </Button>
            </div>
            
            <div className="text-center text-sm text-muted-foreground/70 space-y-1 pt-4">
              <p>Create an account to securely save and manage your family's information.</p>
              <p className="text-xs">Your data is encrypted and private.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
