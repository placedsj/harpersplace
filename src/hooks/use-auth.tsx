
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
      // Assuming apiRequest handles the fetch
      return await apiRequest('POST', '/api/login', credentials);
    },
    onSuccess: () => {
      // Invalidate queries or redirect
      window.location.href = '/dashboard';
    }
  });

  const signupMutation = useMutation({
    mutationFn: async (credentials: any) => {
        return await apiRequest('POST', '/api/register', credentials);
    },
     onSuccess: () => {
      window.location.href = '/dashboard';
    }
  });

  const logoutMutation = useMutation({
    mutationFn: async () => {
       return await apiRequest('POST', '/api/logout');
    },
    onSuccess: () => {
        window.location.href = '/login';
    }
  });


  return {
    user,
    isLoading, // Standard react-query
    loading: isLoading, // Alias for backward compatibility
    isAuthenticated: !!user,
    error,
    logIn: loginMutation.mutateAsync,
    signUp: signupMutation.mutateAsync,
    logOut: logoutMutation.mutateAsync
  };
}
