'use client';

import { useQuery } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";

export function useAuth() {
  const { data: user, isLoading } = useQuery({
    queryKey: ["/api/auth/user"],
    queryFn: () => apiRequest("/api/auth/user"),
    retry: false,
  });

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
