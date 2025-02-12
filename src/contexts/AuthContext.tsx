import { User, onAuthStateChanged } from "firebase/auth";
import React, { createContext, useContext, useEffect, useState } from "react";
import { checkUserAgreements, saveUserAgreements } from "../lib/auth";
import { auth } from "../lib/firebase";

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  checkAgreements: (currentUserId: string) => Promise<boolean>;
  saveAgreements: (agreements: {
    privacyAccepted: boolean;
    termsAccepted: boolean;
    disclaimerAccepted: boolean;
    gdprAccepted: boolean;
  }) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const checkAgreements = async (currentUserId: string) => {
    return checkUserAgreements(currentUserId);
  };

  const handleSaveAgreements = async (agreements: {
    privacyAccepted: boolean;
    termsAccepted: boolean;
    disclaimerAccepted: boolean;
    gdprAccepted: boolean;
  }) => {
    if (!user) throw new Error("No user logged in");
    await saveUserAgreements(user.uid, agreements);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        checkAgreements,
        saveAgreements: handleSaveAgreements,
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
