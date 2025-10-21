'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from "@/components/ui/button";
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/use-auth';
import { useRouter } from 'next/navigation';

const formSchema = z.object({
  email: z.string()
    .email('Invalid email address.')
    .max(254, 'Email address is too long.'),
  password: z.string()
    .min(1, 'Password is required.'),
});

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  const { logIn } = useAuth();
  const { toast } = useToast();
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    try {
      await logIn(values.email, values.password);
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Login Failed',
        description: error.message,
      });
    } finally {
      setIsLoading(false);
    }
  }

  const handleGuestMode = () => {
    router.push('/dashboard');
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="w-full max-w-md space-y-8 text-center">
        <div className="text-center">
            <h1 className="text-5xl font-extrabold tracking-tight font-headline uppercase">Harper's Home</h1>
            <p className="text-muted-foreground mt-2">Please select your access type to continue.</p>
        </div>
        <div className="space-y-4 pt-4">
          <Button onClick={() => router.push('/login-form')} size="lg" className="w-full">
            Parent Login
          </Button>
           <Button onClick={() => router.push('/signup')} size="lg" variant="outline" className="w-full">
            Create Parent Account
          </Button>
          <Button onClick={handleGuestMode} size="lg" variant="secondary" className="w-full">
            Team & Guest Access
          </Button>
        </div>
      </div>
    </div>
  );
}
