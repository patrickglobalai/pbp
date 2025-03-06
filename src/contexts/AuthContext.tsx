import { User, onAuthStateChanged } from "firebase/auth";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import React, { createContext, useContext, useEffect, useState } from "react";
import {
  checkCoachAIAccess,
  checkUserAgreements,
  saveUserAgreements,
} from "../lib/auth";
import { auth, db } from "../lib/firebase";
import { DB_URL } from "../utils/functions";

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  hasAIAccess: boolean;
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
  const [hasAIAccess, setHasAIAccess] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user);
      if (user) {
        // get user role from firestore
        const userDoc = await getDoc(doc(db, DB_URL.users, user.uid));
        const userData = userDoc.data();
        const userRole = userData?.role;

        if (userRole === "coach") {
          const aiAccess = await checkCoachAIAccess(user.uid);
          setHasAIAccess(aiAccess);
        }
        if (userRole === "respondent") {
          const resQuery = query(
            collection(db, DB_URL.respondents),
            where("userId", "==", user.uid)
          );
          const respondentDoc = await getDocs(resQuery);
          const respondentData = respondentDoc.docs[0].data();
          const respondentAIAccess = respondentData?.aiAccessEnabled;

          setHasAIAccess(respondentAIAccess);
        }
      } else {
        setHasAIAccess(false);
      }
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
        hasAIAccess,
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
