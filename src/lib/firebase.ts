import { initializeApp } from 'firebase/app';
import { getAuth, setPersistence, browserLocalPersistence } from 'firebase/auth';
import { getFirestore, enableMultiTabIndexedDbPersistence } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Initialize persistence without top-level await
const initializeFirebase = () => {
  // Set auth persistence
  setPersistence(auth, browserLocalPersistence)
    .then(() => {
      console.log('Auth persistence set to LOCAL');
      
      // Try to enable Firestore persistence
      return enableMultiTabIndexedDbPersistence(db)
        .then(() => {
          console.log('Firestore persistence enabled');
        })
        .catch((err) => {
          if (err.code === 'failed-precondition') {
            console.warn('Multiple tabs open, persistence enabled in first tab only');
          } else if (err.code === 'unimplemented') {
            console.warn('Browser doesn\'t support persistence');
          } else {
            console.error('Error enabling Firestore persistence:', err);
          }
        });
    })
    .catch((err) => {
      console.error('Error initializing Firebase:', err);
    });
};

// Initialize Firebase without waiting
initializeFirebase();

// Helper to check if Firebase is properly configured
export const isFirebaseConfigured = () => {
  return Boolean(
    firebaseConfig.apiKey &&
    firebaseConfig.authDomain &&
    firebaseConfig.projectId
  );
};

export { app, auth, db };