import { collection, doc, setDoc, getDocs, query, where } from 'firebase/firestore';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from './firebase';

export async function initializeCollections() {
  try {
    console.log('Starting collections initialization...');
    
    // Check if user is authenticated
    if (!auth.currentUser) {
      console.log('No authenticated user, skipping collection initialization');
      return false;
    }
    
    // Only try to create collections if user is admin
    const userQuery = query(
      collection(db, 'users'),
      where('userId', '==', auth.currentUser.uid),
      where('role', '==', 'admin')
    );
    
    const userSnapshot = await getDocs(userQuery);
    if (userSnapshot.empty) {
      console.log('User is not admin, skipping collection initialization');
      return false;
    }

    // Create initial collections
    await Promise.all([
      createCollection('users'),
      createCollection('admins'),
      createCollection('partners'),
      createCollection('coaches'),
      createCollection('assessment_codes'),
      createCollection('respondents'),
      createCollection('results'),
      createCollection('user_agreements')
    ]);

    console.log('Collections initialization complete');
    return true;
  } catch (error) {
    console.error('Error initializing collections:', error);
    return false;
  }
}

async function createCollection(name: string) {
  try {
    const collectionRef = collection(db, name);
    const snapshot = await getDocs(collectionRef);
    console.log(`Collection ${name} ${snapshot.empty ? 'created' : 'exists'}`);
  } catch (error) {
    // Silently handle collection creation errors
    console.log(`Collection ${name} access denied - this is expected for non-admin users`);
  }
}