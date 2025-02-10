import {
  addDoc,
  collection,
  getDocs,
  limit,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import React, {
  createContext,
  useCallback,
  useContext,
  useRef,
  useState,
} from "react";
import { db } from "../lib/firebase";
import type { AssessmentResult, ResultsContextType } from "../types/results";
import { displayErrorMessage } from "../utils/functions";

const ResultsContext = createContext<ResultsContextType | undefined>(undefined);

const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // 1 second

export function ResultsProvider({ children }: { children: React.ReactNode }) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Cache for results
  const resultsCache = useRef<Map<string, AssessmentResult>>(new Map());

  const getResults = useCallback(
    async (
      userId: string,
      requestingUserId?: string,
      retryCount = 0
    ): Promise<AssessmentResult | null> => {
      try {
        // Check cache first
        if (resultsCache.current.has(userId)) {
          return resultsCache.current.get(userId) || null;
        }

        setIsLoading(true);
        setError(null);

        // If requestingUserId is provided and different from userId, verify coach access
        if (requestingUserId && requestingUserId !== userId) {
          // Get respondent document to verify coachId
          const respondentQuery = query(
            collection(db, "respondents"),
            where("userId", "==", userId),
            where("coachId", "==", requestingUserId)
          );
          const respondentSnapshot = await getDocs(respondentQuery);

          if (respondentSnapshot.empty) {
            throw new Error("Unauthorized access to respondent data");
          }
        }

        const resultsQuery = query(
          collection(db, "results"),
          where("userId", "==", userId),
          orderBy("completedAt", "desc"),
          limit(1)
        );

        const resultsSnapshot = await getDocs(resultsQuery);

        if (resultsSnapshot.empty) {
          return null;
        }

        const resultDoc = resultsSnapshot.docs[0];
        const result = {
          id: resultDoc.id,
          ...resultDoc.data(),
        } as AssessmentResult;

        // Cache the result
        resultsCache.current.set(userId, result);

        return result;
      } catch (err: any) {
        console.error("Error getting results:", err);

        if (retryCount < MAX_RETRIES) {
          await new Promise((resolve) =>
            setTimeout(resolve, RETRY_DELAY * (retryCount + 1))
          );
          return getResults(userId, requestingUserId, retryCount + 1);
        }

        setError(displayErrorMessage(err, "Failed to load assessment results"));
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  const saveResults = useCallback(
    async (results: Omit<AssessmentResult, "id">) => {
      try {
        setIsLoading(true);
        setError(null);

        // Get the coachId from respondents collection
        const respondentsQuery = query(
          collection(db, "respondents"),
          where("userId", "==", results.userId)
        );
        const respondentsSnapshot = await getDocs(respondentsQuery);

        if (!respondentsSnapshot.empty) {
          const respondentData = respondentsSnapshot.docs[0].data();
          const coachId = respondentData.coachId;

          console.log("Found coachId:", coachId); // Debug log

          // Create a new document in the results collection with coachId
          const docRef = await addDoc(collection(db, "results"), {
            ...results,
            coachId, // Add the coachId here
            completedAt: new Date(),
          });

          // Update cache with new results
          resultsCache.current.set(results.userId, {
            id: docRef.id,
            ...results,
            coachId,
            completedAt: new Date(),
          });

          console.log("Results saved successfully with ID:", docRef.id);
          return true;
        } else {
          console.error("No respondent record found for user:", results.userId);
          throw new Error("No respondent record found");
        }
      } catch (err: any) {
        console.error("Error saving results:", err);
        setError("Failed to save assessment results");
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  return (
    <ResultsContext.Provider
      value={{
        saveResults,
        getResults,
        isLoading,
        error,
      }}
    >
      {children}
    </ResultsContext.Provider>
  );
}

export function useResults() {
  const context = useContext(ResultsContext);
  if (context === undefined) {
    throw new Error("useResults must be used within a ResultsProvider");
  }
  return context;
}
