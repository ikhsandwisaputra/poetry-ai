// src/context/AuthUserContext.tsx
'use client';
import React, { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth, signInWithGooglePopup, signOutUser, type User } from "../firebase/client";

type AuthContextType = {
  user: User;
  loading: boolean; // State ini sangat penting
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthUserContext = createContext<AuthContextType | undefined>(undefined);

export const AuthUserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User>(null);
  const [loading, setLoading] = useState(true); // Default-nya true saat pertama kali load

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      setLoading(false); // Set false setelah status didapatkan
    });

    return () => unsubscribe();
  }, []);

  const signInWithGoogle = async () => {
    try {
      setLoading(true);
      await signInWithGooglePopup();
    } finally {
      // onAuthStateChanged akan handle setLoading(false)
    }
  };

  const signOut = async () => {
    setLoading(true);
    await signOutUser();
    // onAuthStateChanged akan handle setUser(null) dan setLoading(false)
  };

  return (
    <AuthUserContext.Provider value={{ user, loading, signInWithGoogle, signOut }}>
      {children}
    </AuthUserContext.Provider>
  );
};

export function useAuth() {
  const ctx = useContext(AuthUserContext);
  if (!ctx) throw new Error("useAuth must be used within AuthUserProvider");
  return ctx;
}