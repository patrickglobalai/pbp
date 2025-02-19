const { initializeApp } = require("firebase/app");
const {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} = require("firebase/auth");
const { getFirestore, doc, setDoc } = require("firebase/firestore");
const { DB_URL } = require("./src/utils/functions");
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

async function setupAdmin() {
  try {
    // First try to sign in
    try {
      await signInWithEmailAndPassword(
        auth,
        "naderdahdal8008@gmail.com",
        "Admin123!"
      );
      console.log("Admin user already exists, updating permissions...");
    } catch (error) {
      // If user doesn't exist, create new admin user
      if (error.code === "auth/user-not-found") {
        await createUserWithEmailAndPassword(
          auth,
          "naderdahdal8008@gmail.com",
          "Admin123!"
        );
        console.log("Created new admin user");
      } else {
        throw error;
      }
    }

    // Get the current user
    const user = auth.currentUser;
    if (!user) throw new Error("No user found");

    // Create or update user document with admin role
    await setDoc(
      doc(db, DB_URL.users, user.uid),
      {
        userId: user.uid,
        email: "naderdahdal8008@gmail.com",
        fullName: "System Administrator",
        role: "admin",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      { merge: true }
    );

    // Create or update admin permissions
    await setDoc(
      doc(db, DB_URL.adminss, user.uid),
      {
        userId: user.uid,
        permissions: {
          manageUsers: true,
          manageCoaches: true,
          managePartners: true,
          manageAssessmentCodes: true,
          viewAnalytics: true,
          manageSystem: true,
        },
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      { merge: true }
    );

    console.log("Successfully set up admin user!");
    console.log("Email: naderdahdal8008@gmail.com");
    console.log("Password: Admin123!");
  } catch (error) {
    console.error("Error setting up admin:", error);
  } finally {
    // Sign out after setup
    await auth.signOut();
  }
}

setupAdmin();
