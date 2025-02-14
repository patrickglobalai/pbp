import { createUserWithEmailAndPassword } from "firebase/auth";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  setDoc,
  where,
} from "firebase/firestore";
import type { UserRole } from "../types/auth";
import { db } from "./firebase";

export async function checkUserRole(userId: string): Promise<UserRole | null> {
  try {
    console.log("Checking user role for:", userId);
    const userDoc = await getDoc(doc(db, "users", userId));
    console.log("userDoc", userDoc);
    if (!userDoc.exists()) {
      console.log("User document not found");
      return null;
    }
    const role = userDoc.data().role;
    console.log("Found user role:", role);
    return role;
  } catch (error) {
    console.log("something went wrong");
    console.error("Error checking user role:", error);
    return null;
  }
}

export async function isUserCoach(userId: string): Promise<boolean> {
  try {
    console.log("Checking coach status for:", userId);

    // First check user document for role
    const userDoc = await getDoc(doc(db, "users", userId));
    if (!userDoc.exists()) {
      console.log("User document not found");
      return false;
    }

    const userData = userDoc.data();
    console.log("User data:", userData);

    if (userData.role !== "coach") {
      console.log("User role is not coach:", userData.role);
      return false;
    }

    // Then verify coach record exists
    const coachQuery = query(
      collection(db, "coaches"),
      where("userId", "==", userId)
    );
    const coachSnapshot = await getDocs(coachQuery);

    const hasCoachRecord = !coachSnapshot.empty;
    console.log("Has coach record:", hasCoachRecord);

    return hasCoachRecord;
  } catch (error) {
    console.error("Error checking coach status:", error);
    return false;
  }
}

export async function checkCoachAIAccess(coachId: string): Promise<boolean> {
  try {
    console.log("Checking AI access for coach:", coachId);
    const coachQuery = query(
      collection(db, "coaches"),
      where("userId", "==", coachId)
    );
    const coachSnapshot = await getDocs(coachQuery);

    if (coachSnapshot.empty) {
      console.log("Coach record not found");
      return false;
    }

    const coachData = coachSnapshot.docs[0].data();
    console.log("Coach data:", coachData);

    // Only allow AI access for advanced and partner tiers
    return ["advanced", "partner"].includes(coachData.tier);
  } catch (error) {
    console.error("Error checking coach AI access:", error);
    return false;
  }
}

export async function isUserAdmin(userId: string): Promise<boolean> {
  try {
    const userDoc = await getDoc(doc(db, "users", userId));
    if (!userDoc.exists()) {
      return false;
    }

    const userData = userDoc.data();
    if (userData.role !== "admin") {
      return false;
    }

    const adminQuery = query(
      collection(db, "admins"),
      where("userId", "==", userId)
    );
    const adminSnapshot = await getDocs(adminQuery);

    return !adminSnapshot.empty;
  } catch (error) {
    console.error("Error checking admin status:", error);
    return false;
  }
}

export async function isUserPartner(userId: string): Promise<boolean> {
  try {
    const userDoc = await getDoc(doc(db, "users", userId));
    if (!userDoc.exists()) {
      return false;
    }

    const userData = userDoc.data();
    if (userData.role !== "partner") {
      return false;
    }

    const partnerQuery = query(
      collection(db, "partners"),
      where("userId", "==", userId)
    );
    const partnerSnapshot = await getDocs(partnerQuery);

    return !partnerSnapshot.empty;
  } catch (error) {
    console.error("Error checking partner status:", error);
    return false;
  }
}

export async function createCoachAccount(
  auth: any,
  coachData: {
    email: string;
    password: string;
    fullName: string;
    tier: string;
    partnerId: string;
    assessmentCode: string;
  }
) {
  try {
    // Create Firebase auth user
    const { user } = await createUserWithEmailAndPassword(
      auth,
      coachData.email,
      coachData.password
    );

    // create user agreement document
    await setDoc(doc(db, "user_agreements", user.uid), {
      userId: user.uid,
      privacyAccepted: true,
      termsAccepted: true,
      disclaimerAccepted: true,
      gdprAccepted: true,
    });

    // Wait for user document to be created before continuing
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Create user document
    await setDoc(doc(db, "users", user.uid), {
      userId: user.uid,
      email: coachData.email,
      fullName: coachData.fullName,
      role: "coach",
      subscription_tier: coachData.tier,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    // Create coach record with updated AI access logic
    await setDoc(doc(db, "coaches", user.uid), {
      userId: user.uid,
      partnerId: coachData.partnerId,
      tier: coachData.tier,
      assessmentCode: coachData.assessmentCode,
      // Only advanced and partner tiers get AI access
      aiAnalysisAccess: ["advanced", "partner"].includes(coachData.tier),
      // Basic plus gets manual AI access
      manualAiAccess: coachData.tier === "basic_plus",
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    return user.uid;
  } catch (error) {
    console.error("Error creating coach account:", error);
    throw error;
  }
}

export async function checkUserAgreements(userId: string): Promise<boolean> {
  try {
    const agreementsDoc = await getDoc(doc(db, "user_agreements", userId));

    if (!agreementsDoc.exists()) {
      return false;
    }

    const data = agreementsDoc.data();
    return Boolean(
      data.privacyAccepted &&
        data.termsAccepted &&
        data.disclaimerAccepted &&
        data.gdprAccepted
    );
  } catch (error) {
    console.error("Error checking user agreements:", error);
    return false;
  }
}

export async function saveUserAgreements(
  userId: string,
  agreements: {
    privacyAccepted: boolean;
    termsAccepted: boolean;
    disclaimerAccepted: boolean;
    gdprAccepted: boolean;
  }
): Promise<void> {
  try {
    const now = new Date();
    await setDoc(doc(db, "user_agreements", userId), {
      ...agreements,
      privacyAcceptedAt: now,
      termsAcceptedAt: now,
      disclaimerAcceptedAt: now,
      gdprAcceptedAt: now,
      updatedAt: now,
    });
  } catch (error) {
    console.error("Error saving user agreements:", error);
    throw error;
  }
}
