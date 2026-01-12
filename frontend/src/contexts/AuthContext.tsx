import {
  createContext,
  type ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { authClient } from "../lib/auth";

// Account types
export type AccountType = "PARENT" | "CHILD";

// User interface for both account types
export interface User {
  id: string;
  email: string;
  name: string;
  accountType: AccountType;
  avatar?: string;
  createdAt: string;
  // Parent-specific fields
  children?: string[]; // child user IDs
  // Child-specific fields
  parentId?: string;
  age?: number;
  points?: number;
  level?: number;
  portfolioValue?: number;
  balance?: number;
}

// Auth state
interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

// Auth context type
interface AuthContextType extends AuthState {
  login: (
    email: string,
    password: string,
  ) => Promise<{ success: boolean; error?: string }>;
  signup: (data: SignupData) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  switchToChild: (childId: string) => void;
  switchToParent: () => void;
  updateUser: (updates: Partial<User>) => void;
}

interface SignupData {
  email: string;
  password: string;
  name: string;
  accountType: AccountType;
  age?: number; // For child accounts
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Helper to map Better Auth user to our User type
const mapSessionToUser = (session: any): User | null => {
  if (!session?.user) return null;

  // Use session data directly - the backend will populate full user data
  // We'll use TanStack Query to fetch additional data when needed
  return {
    id: session.user.id,
    email: session.user.email,
    name: session.user.name,
    accountType: "parent", // Default, will be updated by useUserProfileQuery
    createdAt:
      typeof session.user.createdAt === "string"
        ? session.user.createdAt
        : session.user.createdAt?.toISOString() || new Date().toISOString(),
  };
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
  });

  // Check auth status on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const session = await authClient.getSession();
        if (session?.data) {
          const user = mapSessionToUser(session.data);
          setState({
            user,
            isAuthenticated: !!user,
            isLoading: false,
          });
        } else {
          setState({
            user: null,
            isAuthenticated: false,
            isLoading: false,
          });
        }
      } catch (error) {
        console.error("Error checking auth:", error);
        setState({
          user: null,
          isAuthenticated: false,
          isLoading: false,
        });
      }
    };

    checkAuth();
  }, []);

  const login = async (
    email: string,
    password: string,
  ): Promise<{ success: boolean; error?: string }> => {
    try {
      const result = await authClient.signIn.email({
        email,
        password,
      });

      if (result.error) {
        return { success: false, error: result.error.message };
      }

      if (result.data) {
        const user = mapSessionToUser(result.data);
        setState({
          user,
          isAuthenticated: !!user,
          isLoading: false,
        });
        return { success: true };
      }

      return { success: false, error: "Authentication failed" };
    } catch (error) {
      console.error("Login error:", error);
      return {
        success: false,
        error: (error as Error).message || "Login failed",
      };
    }
  };

  const signup = async (
    data: SignupData,
  ): Promise<{ success: boolean; error?: string }> => {
    try {
      const result = await authClient.signUp.email({
        email: data.email,
        password: data.password,
        name: data.name,
      });

      if (result.error) {
        return { success: false, error: result.error.message };
      }

      if (result.data) {
        const user = mapSessionToUser(result.data);
        setState({
          user,
          isAuthenticated: !!user,
          isLoading: false,
        });
        return { success: true };
      }

      return { success: false, error: "Registration failed" };
    } catch (error) {
      console.error("Signup error:", error);
      return {
        success: false,
        error: (error as Error).message || "Signup failed",
      };
    }
  };

  const logout = async () => {
    try {
      await authClient.signOut();
      setState({
        user: null,
        isAuthenticated: false,
        isLoading: false,
      });
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const switchToChild = (childId: string) => {
    // TODO: Implement child account switching
    console.log("Switching to child:", childId);
  };

  const switchToParent = () => {
    // TODO: Implement parent account switching
    console.log("Switching to parent");
  };

  const updateUser = (updates: Partial<User>) => {
    if (state.user) {
      const updatedUser = { ...state.user, ...updates };
      setState((prev) => ({ ...prev, user: updatedUser }));
    }
  };

  return (
    <AuthContext.Provider
      value={{
        ...state,
        login,
        signup,
        logout,
        switchToChild,
        switchToParent,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
