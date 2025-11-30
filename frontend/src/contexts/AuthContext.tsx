import { createContext, useContext, useState, type ReactNode } from 'react';
import type { Parent, Child } from '../data/dummyData';

interface AuthContextType {
  parent: Parent | null;
  currentChild: Child | null;
  login: (parent: Parent) => void;
  logout: () => void;
  setCurrentChild: (child: Child | null) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [parent, setParent] = useState<Parent | null>(null);
  const [currentChild, setCurrentChild] = useState<Child | null>(null);

  const login = (parentData: Parent) => {
    setParent(parentData);
  };

  const logout = () => {
    setParent(null);
    setCurrentChild(null);
  };

  return (
    <AuthContext.Provider value={{ parent, currentChild, login, logout, setCurrentChild }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
