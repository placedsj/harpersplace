'use client';

import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

export function useAuth() {
  const { data: user, isLoading } = useQuery({
    queryKey: ["/api/auth/user"],
    queryFn: () => apiRequest("/api/auth/user"),
    retry: false,
  });

  const logIn = async (email?: string, password?: string) => {
    // For Replit Auth, we just redirect to /api/login
    // Email/password args are ignored as this is OIDC
    window.location.href = '/api/login';
  };

  // Accepts any number of arguments to satisfy the usage in signup/page.tsx
  const signUp = async (...args: any[]) => {
    // For Replit Auth, sign up is same as login
    window.location.href = '/api/login';
  };

  const logOut = async () => {
    window.location.href = '/api/logout';
  };

  return {
    user,
    isLoading,
    loading: isLoading, // Alias for compatibility
    isAuthenticated: !!user,
    logIn,
    signUp,
    logOut,
  };
}
