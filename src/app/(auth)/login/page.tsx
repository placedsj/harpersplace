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
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-purple-900 dark:to-indigo-900">
      <div className="flex items-center justify-center min-h-screen px-4">
        <div className="w-full max-w-md space-y-8">
          {/* Header Section */}
          <div className="text-center space-y-4">
            <div className="mx-auto w-16 h-16 bg-primary rounded-full flex items-center justify-center mb-4">
              <span className="text-2xl font-bold text-primary-foreground">H</span>
            </div>
            <h1 className="text-4xl font-extrabold tracking-tight bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
              Harper's Place
            </h1>
            <p className="text-muted-foreground text-lg">
              Where every decision puts your child's best interests and emotional well-being first
            </p>
          </div>

          {/* Access Options */}
          <div className="space-y-4">
            <Button 
              onClick={handleGuestMode} 
              size="lg" 
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-4 text-lg shadow-lg hover:shadow-xl transition-all duration-200"
            >
              <span className="mr-2">👶</span>
              Put Your Child First
            </Button>
            
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-muted-foreground/20" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground font-medium">
                  Coming Soon
                </span>
              </div>
            </div>
            
            <div className="grid grid-cols-1 gap-3 opacity-50">
              <Button 
                disabled
                size="lg" 
                variant="outline" 
                className="w-full cursor-not-allowed"
              >
                Parent Login
              </Button>
              <Button 
                disabled
                size="lg" 
                variant="outline" 
                className="w-full cursor-not-allowed"
              >
                Create Parent Account
              </Button>
            </div>
            
            <div className="text-center text-sm text-muted-foreground/70 space-y-1">
              <p>Full authentication system launching soon.</p>
              <p className="text-xs">For now, explore child-centered co-parenting tools in guest mode.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
