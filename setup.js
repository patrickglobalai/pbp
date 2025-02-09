const { initializeApp } = require('firebase/app');
const { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } = require('firebase/auth');
const { getFirestore, doc, setDoc } = require('firebase/firestore');

const firebaseConfig = {
  apiKey: "AIzaSyDXZbPH04FFVpVlhOQn2a6NtUqOA1aw1BY",
  authDomain: "personality-breakthrough.firebaseapp.com",
  projectId: "personality-breakthrough",
  storageBucket: "personality-breakthrough.firebasestorage.app",
  messagingSenderId: "457280795321",
  appId: "1:457280795321:web:0c2d07fe168fb68ad06168"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

async function setupAdmin() {
  try {
    // First try to sign in
    try {
      await signInWithEmailAndPassword(auth, 'naderdahdal8008@gmail.com', 'Admin123!');
      console.log('Admin user already exists, updating permissions...');
    } catch (error) {
      // If user doesn't exist, create new admin user
      if (error.code === 'auth/user-not-found') {
        await createUserWithEmailAndPassword(auth, 'naderdahdal8008@gmail.com', 'Admin123!');
        console.log('Created new admin user');
      } else {
        throw error;
      }
    }

    // Get the current user
    const user = auth.currentUser;
    if (!user) throw new Error('No user found');

    // Create or update user document with admin role
    await setDoc(doc(db, 'users', user.uid), {
      userId: user.uid,
      email: 'naderdahdal8008@gmail.com',
      fullName: 'System Administrator',
      role: 'admin',
      createdAt: new Date(),
      updatedAt: new Date()
    }, { merge: true });

    // Create or update admin permissions
    await setDoc(doc(db, 'admins', user.uid), {
      userId: user.uid,
      permissions: {
        manageUsers: true,
        manageCoaches: true,
        managePartners: true,
        manageAssessmentCodes: true,
        viewAnalytics: true,
        manageSystem: true
      },
      createdAt: new Date(),
      updatedAt: new Date()
    }, { merge: true });

    console.log('Successfully set up admin user!');
    console.log('Email: naderdahdal8008@gmail.com');
    console.log('Password: Admin123!');
    
  } catch (error) {
    console.error('Error setting up admin:', error);
  } finally {
    // Sign out after setup
    await auth.signOut();
  }
}

setupAdmin();