"use client";

import { createContext, useContext, useState, ReactNode } from "react";
import { useRouter } from "next/navigation"; // Import useRouter

interface User {
  name: string;
  email: string;
  phone: string; // Added phone property
  address: string; // Added address property
}

interface AuthContextType {
  isLoggedIn: boolean;
  setIsLoggedIn: (isLoggedIn: boolean) => void;
  user: User | null;
  setUser: (user: User | null) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter(); // Initialize useRouter

  const logout = () => {
    setIsLoggedIn(false);
    setUser(null);
    router.push("/"); // Redirect to home page after logout
  };

  return (
    <AuthContext.Provider
      value={{ isLoggedIn, setIsLoggedIn, user, setUser, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
