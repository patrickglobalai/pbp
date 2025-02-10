import { initializeApp } from "firebase/app";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { collection, getDocs, query, where } from "firebase/firestore";
import { motion } from "framer-motion";
import {
  AlertCircle,
  ArrowLeft,
  Edit2,
  Plus,
  Shield,
  Trash2,
  Users,
  X,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { createCoachAccount } from "../../lib/auth";
import { auth, db } from "../../lib/firebase";

// Create a separate Firebase app instance for coach creation
const coachAuthApp = initializeApp(
  {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID,
  },
  "coachAuth"
);

// Get auth instance for coach creation
const coachAuth = getAuth(coachAuthApp);

interface Coach {
  id: string;
  userId: string;
  assessmentCode: string;
  tier: string;
  aiAnalysisAccess: boolean;
  user: {
    fullName: string;
    email: string;
  };
  stats: {
    totalRespondents: number;
    completedAssessments: number;
  };
}

export function CoachManagement() {
  const navigate = useNavigate();
  const [coaches, setCoaches] = useState<Coach[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [newCoach, setNewCoach] = useState({
    email: "",
    password: "",
    fullName: "",
    tier: "basic",
  });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user?.uid) {
        loadCoaches();
      }
    });

    return () => unsubscribe();
  }, []);

  const loadCoaches = async () => {
    try {
      setIsLoading(true);
      const coachesRef = collection(db, "coaches");
      const coachesSnapshot = await getDocs(coachesRef);

      const coachesData = await Promise.all(
        coachesSnapshot.docs.map(async (doc) => {
          const data = doc.data();

          // Get user data
          const userDoc = await getDocs(
            query(collection(db, "users"), where("userId", "==", data.userId))
          );
          const userData = userDoc.docs[0]?.data();

          // Get stats
          const respondentsQuery = query(
            collection(db, "respondents"),
            where("coachId", "==", data.userId)
          );
          const respondentsSnapshot = await getDocs(respondentsQuery);

          const completedQuery = query(
            collection(db, "results"),
            where("coachId", "==", data.userId)
          );
          const completedSnapshot = await getDocs(completedQuery);

          return {
            id: doc.id,
            userId: data.userId,
            assessmentCode: data.assessmentCode,
            tier: data.tier,
            aiAnalysisAccess: data.aiAnalysisAccess,
            user: {
              fullName: userData?.fullName || "",
              email: userData?.email || "",
            },
            stats: {
              totalRespondents: respondentsSnapshot.size,
              completedAssessments: completedSnapshot.size,
            },
          };
        })
      );

      setCoaches(coachesData);
    } catch (err) {
      console.error("Error loading coaches:", err);
      setError("Failed to load coaches");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddCoach = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsLoading(true);

      const coachId = await createCoachAccount(coachAuth, {
        ...newCoach,
        assessmentCode: generateAssessmentCode(),
        aiAnalysisAccess: ["basic_plus", "advanced", "partner"].includes(
          newCoach.tier
        ),
      });

      setShowAddModal(false);
      loadCoaches();

      // Show success message with credentials
      alert(
        `Coach account created successfully!\n\nEmail: ${newCoach.email}\nPassword: ${newCoach.password}\n\nPlease share these credentials with the coach securely.`
      );
    } catch (err) {
      console.error("Error adding coach:", err);
      setError("Failed to add coach");
    } finally {
      setIsLoading(false);
    }
  };

  const generateAssessmentCode = () => {
    return "PBP" + Math.random().toString(36).substring(2, 8).toUpperCase();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen ai-gradient-bg py-12 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <div className="text-white">Loading coaches...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen ai-gradient-bg py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <Link
          to="/admin"
          className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-8 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Dashboard
        </Link>

        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Users className="w-12 h-12 text-white" />
            <div>
              <h1 className="text-3xl font-bold text-white">
                Coach Management
              </h1>
              <p className="text-white/80">Create and manage coach accounts</p>
            </div>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r 
              from-blue-500 to-indigo-600 text-white font-medium hover:scale-105 transition-all"
          >
            <Plus className="w-5 h-5" />
            Add Coach
          </button>
        </div>

        {error && (
          <div className="flex items-center gap-2 bg-red-500/10 text-red-400 p-4 rounded-xl mb-6">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <p>{error}</p>
          </div>
        )}

        <div className="glass-effect rounded-3xl p-8">
          <div className="grid gap-4">
            {coaches.map((coach) => (
              <motion.div
                key={coach.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center justify-between p-6 rounded-xl bg-white/10"
              >
                <div className="space-y-2">
                  <div className="font-medium text-white text-lg">
                    {coach.user.fullName}
                  </div>
                  <div className="text-white/60">{coach.user.email}</div>
                  <div className="text-sm text-white/40">
                    Code: {coach.assessmentCode} • Tier: {coach.tier}
                  </div>
                  <div className="flex gap-4 text-sm text-white/60">
                    <span>{coach.stats.totalRespondents} respondents</span>
                    <span>{coach.stats.completedAssessments} completed</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      /* Handle edit */
                    }}
                    className="p-2 rounded-lg bg-white/10 text-white hover:bg-white/20 transition-all"
                  >
                    <Edit2 className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => {
                      /* Handle delete */
                    }}
                    className="p-2 rounded-lg bg-white/10 text-white hover:bg-white/20 transition-all"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Add Coach Modal */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="glass-effect rounded-3xl p-8 w-full max-w-lg mx-4"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white">Add New Coach</h2>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="p-2 rounded-lg bg-white/10 text-white hover:bg-white/20 transition-all"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <form onSubmit={handleAddCoach} className="space-y-6">
                <div>
                  <label htmlFor="fullName" className="block text-white mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    id="fullName"
                    value={newCoach.fullName}
                    onChange={(e) =>
                      setNewCoach((prev) => ({
                        ...prev,
                        fullName: e.target.value,
                      }))
                    }
                    className="w-full px-4 py-3 rounded-xl bg-white/10 text-white border border-white/20 
                      focus:border-white/40 focus:outline-none"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-white mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={newCoach.email}
                    onChange={(e) =>
                      setNewCoach((prev) => ({
                        ...prev,
                        email: e.target.value,
                      }))
                    }
                    className="w-full px-4 py-3 rounded-xl bg-white/10 text-white border border-white/20 
                      focus:border-white/40 focus:outline-none"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="password" className="block text-white mb-2">
                    Initial Password
                  </label>
                  <input
                    type="password"
                    id="password"
                    value={newCoach.password}
                    onChange={(e) =>
                      setNewCoach((prev) => ({
                        ...prev,
                        password: e.target.value,
                      }))
                    }
                    className="w-full px-4 py-3 rounded-xl bg-white/10 text-white border border-white/20 
                      focus:border-white/40 focus:outline-none"
                    required
                    minLength={8}
                    placeholder="Minimum 8 characters"
                  />
                </div>

                <div>
                  <label htmlFor="tier" className="block text-white mb-2">
                    Subscription Tier
                  </label>
                  <select
                    id="tier"
                    name="tier"
                    value={newCoach.tier}
                    onChange={(e) =>
                      setNewCoach((prev) => ({ ...prev, tier: e.target.value }))
                    }
                    className="w-full px-4 py-3 rounded-xl bg-white/10 text-white border border-white/20 
                      focus:border-white/40 focus:outline-none"
                    disabled={isLoading}
                  >
                    <option value="basic">Basic</option>
                    <option value="basic_plus">Basic Plus</option>
                    <option value="advanced">Advanced</option>
                    <option value="partner">Partner</option>
                  </select>
                </div>

                <div className="flex justify-end gap-4 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="px-6 py-3 rounded-xl bg-white/10 text-white hover:bg-white/20 transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="px-6 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 
                      text-white font-medium hover:scale-105 transition-all disabled:opacity-50
                      flex items-center gap-2"
                  >
                    <Shield className="w-5 h-5" />
                    {isLoading ? "Adding..." : "Add Coach"}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
}
