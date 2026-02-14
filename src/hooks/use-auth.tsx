'use client';

import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

export function useAuth() {
  const { data: user, isLoading, error } = useQuery({
    queryKey: ["/api/auth/user"],
    queryFn: () => apiRequest("/api/auth/user"),
    retry: false,
  });

  const loginMutation = useMutation({
    mutationFn: async (credentials: any) => {
      return await apiRequest('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials)
      });
    },
    onSuccess: () => {
      window.location.href = '/dashboard';
    }
  });

  const signupMutation = useMutation({
    mutationFn: async (credentials: any) => {
        return await apiRequest('/api/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(credentials)
        });
    },
     onSuccess: () => {
      window.location.href = '/dashboard';
    }
  });

  const logoutMutation = useMutation({
    mutationFn: async () => {
       return await apiRequest('/api/logout', { method: 'POST' });
    },
    onSuccess: () => {
        window.location.href = '/login';
    }
  });

  return {
    user,
    isLoading,
    loading: isLoading,
    isAuthenticated: !!user,
    error,
    logIn: loginMutation.mutateAsync,
    signUp: signupMutation.mutateAsync,
    logOut: logoutMutation.mutateAsync
  };
}
