import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { usersAPI } from "../../lib/api";

// Query keys factory - React Compiler friendly
export const userKeys = {
  all: ["users"] as const,
  profile: () => [...userKeys.all, "profile"] as const,
  detail: (userId: string) => [...userKeys.all, "detail", userId] as const,
  children: () => [...userKeys.all, "children"] as const,
};

// Get current user profile
export function useUserProfileQuery() {
  return useQuery({
    queryKey: userKeys.profile(),
    queryFn: () => usersAPI.getProfile(),
    staleTime: 60_000, // 1 minute
  });
}

// Get user by ID
export function useUserQuery(userId: string) {
  return useQuery({
    queryKey: userKeys.detail(userId),
    queryFn: () => usersAPI.getById(userId),
    enabled: Boolean(userId),
    staleTime: 60_000, // 1 minute
  });
}

// Get children (parent only)
export function useChildrenQuery() {
  return useQuery({
    queryKey: userKeys.children(),
    queryFn: () => usersAPI.getChildren(),
    staleTime: 60_000, // 1 minute
  });
}

// Create child mutation (parent only)
export function useCreateChildMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: {
      name: string;
      age: number;
      email: string;
      password: string;
    }) => usersAPI.createChild(data),
    onSuccess: () => {
      // Invalidate children list
      queryClient.invalidateQueries({ queryKey: userKeys.children() });
    },
  });
}
