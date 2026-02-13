
'use client';

import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useQuery } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";

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
  const logIn = async (...args: any[]) => {
    // Placeholder for login logic.
    // In a real app, this would redirect to an auth provider or handle form submission.
    // For now, we'll just invalidate the query to simulate a refresh.
    await queryClient.invalidateQueries({ queryKey: ["/api/auth/user"] });
  };

  const logOut = async () => {
    // Placeholder for logout logic.
    await apiRequest("/api/auth/logout", { method: "POST" });
    await queryClient.invalidateQueries({ queryKey: ["/api/auth/user"] });
  };

  const signUp = async (...args: any[]) => {
      // Placeholder
      await queryClient.invalidateQueries({ queryKey: ["/api/auth/user"] });
  }

  return {
    user,
    isLoading,
    // Alias isLoading to loading for compatibility with existing code
    loading: isLoading,
    isAuthenticated: !!user,
    logIn,
    logOut,
    signUp
  };
}
