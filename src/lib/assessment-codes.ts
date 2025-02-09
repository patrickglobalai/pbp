import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from './firebase';

export async function verifyAssessmentCode(code: string): Promise<{ isValid: boolean; coachId?: string }> {
  try {
    // Query coaches collection for the assessment code
    const coachesQuery = query(
      collection(db, 'coaches'),
      where('assessmentCode', '==', code)
    );
    
    const coachesSnapshot = await getDocs(coachesQuery);
    
    if (coachesSnapshot.empty) {
      return { isValid: false };
    }

    const coachDoc = coachesSnapshot.docs[0];
    const coachData = coachDoc.data();
    
    return { 
      isValid: true,
      coachId: coachData.userId
    };
  } catch (error) {
    console.error('Error verifying assessment code:', error);
    return { isValid: false };
  }
}