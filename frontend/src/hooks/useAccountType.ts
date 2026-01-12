import { useAuth } from "../contexts/AuthContext";

// Hook to check if user is a parent
export function useIsParent() {
  const { user } = useAuth();
  return user?.accountType === "parent";
}

// Hook to check if user is a child
export function useIsChild() {
  const { user } = useAuth();
  return user?.accountType === "child";
}

// Get the accent color based on account type
export function useAccountColor() {
  const { user } = useAuth();
  if (!user) return "blue";
  return user.accountType === "parent" ? "yellow" : "blue";
}
