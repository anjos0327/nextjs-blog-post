"use client";

import { createContext, useContext, ReactNode } from "react";
import { useRouter } from "next/navigation";
import { useAuthCheck } from "./hooks";
import type { User } from "./models";

interface AuthContextType {
  user: User | null;
  login: (email: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
  isLoggingOut: boolean;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

/**
 * Authentication Provider - Provides authentication state throughout the app
 *
 * This provider uses the useAuthCheck hook internally for cleaner separation of concerns.
 * The hook handles all authentication logic while the provider exposes a stable API.
 */
export function AuthProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const { user, isLoading, isLoggingOut, isAuthenticated, login, logout } =
    useAuthCheck();

  // Enhanced logout to include navigation
  const handleLogout = async () => {
    await logout(); // Wait for logout to complete
    router.push("/");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout: handleLogout,
        isLoading,
        isLoggingOut,
        isAuthenticated,
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
