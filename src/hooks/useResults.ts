import { useState, useCallback, useRef } from 'react';
import { collection, addDoc, query, where, getDocs, orderBy, limit, doc, updateDoc, Timestamp } from 'firebase/firestore';
import { db } from '../lib/firebase';
import type { AssessmentResult, ResultsContextType } from '../types/results';

const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // 1 second

export function useResults() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Cache for results
  const resultsCache = useRef<Map<string, AssessmentResult>>(new Map());

  const getResults = useCallback(async (userId: string, requestingUserId?: string, retryCount = 0): Promise<AssessmentResult | null> => {
    try {
      // Check cache first
      if (resultsCache.current.has(userId)) {
        return resultsCache.current.get(userId) || null;
      }

      setIsLoading(true);
      setError(null);

      // If requestingUserId is provided and different from userId, verify coach access
      if (requestingUserId && requestingUserId !== userId) {
        const respondentQuery = query(
          collection(db, 'respondents'),
          where('userId', '==', userId),
          where('coachId', '==', requestingUserId)
        );
        const respondentSnapshot = await getDocs(respondentQuery);
        
        if (respondentSnapshot.empty) {
          throw new Error('Unauthorized access to respondent data');
        }
      }

      const resultsQuery = query(
        collection(db, 'results'),
        where('userId', '==', userId),
        orderBy('completedAt', 'desc'),
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
        version: resultDoc.data().version || 1,
        completedAt: resultDoc.data().completedAt.toDate(),
        retakenAt: resultDoc.data().retakenAt?.toDate()
      } as AssessmentResult;

      // Cache the result
      resultsCache.current.set(userId, result);
      
      return result;

    } catch (err: any) {
      console.error('Error getting results:', err);
      
      if (retryCount < MAX_RETRIES) {
        await new Promise(resolve => setTimeout(resolve, RETRY_DELAY * (retryCount + 1)));
        return getResults(userId, requestingUserId, retryCount + 1);
      }
      
      setError('Failed to load assessment results');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const saveResults = useCallback(async (results: Omit<AssessmentResult, 'id'>) => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Get respondent document to update retake info
      const respondentQuery = query(
        collection(db, 'respondents'),
        where('userId', '==', results.userId)
      );
      const respondentSnapshot = await getDocs(respondentQuery);
      
      if (!respondentSnapshot.empty) {
        const respondentDoc = respondentSnapshot.docs[0];
        const respondentData = respondentDoc.data();
        const coachId = respondentData.coachId;

        // Check if this is a retake
        const isRetake = respondentData.totalAssessments > 0;
        
        // Get previous result if this is a retake
        let originalResultId: string | undefined;
        if (isRetake) {
          const originalResultQuery = query(
            collection(db, 'results'),
            where('userId', '==', results.userId),
            orderBy('completedAt', 'asc'),
            limit(1)
          );
          const originalResultSnapshot = await getDocs(originalResultQuery);
          if (!originalResultSnapshot.empty) {
            originalResultId = originalResultSnapshot.docs[0].id;
          }
        }

        // Create a new document in the results collection
        const docRef = await addDoc(collection(db, 'results'), {
          ...results,
          coachId,
          version: isRetake ? (respondentData.totalAssessments + 1) : 1,
          originalResultId: isRetake ? originalResultId : null,
          retakenAt: isRetake ? Timestamp.fromDate(new Date()) : null,
          completedAt: Timestamp.fromDate(new Date())
        });

        // Update respondent document with retake info using updateDoc
        const respondentRef = doc(db, 'respondents', respondentDoc.id);
        const newTotalAssessments = (respondentData.totalAssessments || 0) + 1;
        const nextRetakeDate = new Date();
        nextRetakeDate.setDate(nextRetakeDate.getDate() + 7);

        await updateDoc(respondentRef, {
          lastAssessmentDate: Timestamp.fromDate(new Date()),
          totalAssessments: newTotalAssessments,
          retakeCount: isRetake ? (respondentData.retakeCount || 0) + 1 : 0,
          nextRetakeDate: Timestamp.fromDate(nextRetakeDate)
        });

        // Update cache with new results
        resultsCache.current.set(results.userId, {
          id: docRef.id,
          ...results,
          coachId,
          version: isRetake ? (respondentData.totalAssessments + 1) : 1,
          originalResultId: isRetake ? originalResultId : undefined,
          retakenAt: isRetake ? new Date() : undefined,
          completedAt: new Date()
        });

        console.log('Results saved successfully with ID:', docRef.id);
        return true;
      } else {
        console.error('No respondent record found for user:', results.userId);
        throw new Error('No respondent record found');
      }

    } catch (err: any) {
      console.error('Error saving results:', err);
      setError('Failed to save assessment results');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    saveResults,
    getResults,
    isLoading,
    error
  };
}