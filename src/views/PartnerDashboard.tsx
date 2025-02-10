import { onAuthStateChanged, signOut } from "firebase/auth";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { motion } from "framer-motion";
import { AlertCircle, Brain, Key, LogOut, Users } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { isUserPartner } from "../lib/auth";
import { auth, db } from "../lib/firebase";
import { displayErrorMessage } from "../utils/functions";

export function PartnerDashboard() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [stats, setStats] = useState({
    totalCoaches: 0,
    activeAssessments: 0,
    availableCodes: 0,
  });

  useEffect(() => {
    checkPartnerAccess();
  }, []);

  const handleLogout = useCallback(async () => {
    try {
      await signOut(auth);
      navigate("/login");
    } catch (err) {
      console.error("Error signing out:", err);
    }
  }, [navigate]);

  const checkPartnerAccess = async () => {
    try {
      const unsubscribe = onAuthStateChanged(auth, async (user) => {
        if (!user) {
          navigate("/login");
          return;
        }

        const isPartner = await isUserPartner(user.uid);
        if (!isPartner) {
          navigate("/");
          return;
        }

        if (auth?.currentUser?.uid) {
          loadDashboardStats();
        }
      });

      return () => unsubscribe();
    } catch (err) {
      console.error("Partner access check failed:", err);
      navigate("/");
    }
  };

  const loadDashboardStats = async () => {
    try {
      setIsLoading(true);
      const userId = auth.currentUser?.uid;

      if (!userId) {
        setError("User not found");
        setIsLoading(false);
        return;
      }

      // get current user from db
      const userDoc = await getDoc(doc(db, "users", userId));
      const userData = userDoc.data();

      if (!userData) {
        setError("User not found");
        setIsLoading(false);
        return;
      }

      // Get coaches count

      const coachesQuery = query(
        collection(db, "coaches"),
        where("partnerId", "==", userId)
      );
      const coachesSnapshot = await getDocs(coachesQuery);
      const coachesCount = coachesSnapshot.size;

      // Get assessment codes count
      const codesQuery = query(
        collection(db, "assessment_codes"),
        where("partnerId", "==", userId),
        where("used", "==", false)
      );
      const codesSnapshot = await getDocs(codesQuery);
      const codesCount = codesSnapshot.size;

      // Get active assessments count
      const assessmentsCount = await calculateActiveAssessments(
        coachesSnapshot.docs.map((doc) => doc.id)
      );

      setStats({
        totalCoaches: coachesCount,
        activeAssessments: assessmentsCount,
        availableCodes: codesCount,
      });
    } catch (err) {
      console.error("Failed to load dashboard stats:", err);
      setError(displayErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  };

  const calculateActiveAssessments = async (coachIds: string[]) => {
    if (coachIds.length === 0) return 0;

    const assessmentsQuery = query(
      collection(db, "respondents"),
      where("coachId", "in", coachIds)
    );
    const assessmentsSnapshot = await getDocs(assessmentsQuery);
    return assessmentsSnapshot.size;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen ai-gradient-bg py-12 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <div className="text-white">Loading dashboard...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen ai-gradient-bg py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Brain className="w-12 h-12 text-white" />
            <div>
              <h1 className="text-3xl font-bold text-white">
                Partner Dashboard
              </h1>
              <p className="text-white/80">
                Manage your coaches and assessment codes
              </p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 text-white 
              hover:bg-white/20 transition-all"
          >
            <LogOut className="w-5 h-5" />
            <span>Logout</span>
          </button>
        </div>

        {error && (
          <div className="flex items-center gap-2 bg-red-500/10 text-red-400 p-4 rounded-xl mb-6">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <p>{error}</p>
          </div>
        )}

        {/* Stats Overview */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-effect rounded-2xl p-6"
          >
            <Users className="w-8 h-8 text-blue-400 mb-4" />
            <div className="text-4xl font-bold text-white mb-2">
              {stats.totalCoaches}
            </div>
            <div className="text-white/80">Active Coaches</div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="glass-effect rounded-2xl p-6"
          >
            <Key className="w-8 h-8 text-emerald-400 mb-4" />
            <div className="text-4xl font-bold text-white mb-2">
              {stats.availableCodes}
            </div>
            <div className="text-white/80">Available Codes</div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="glass-effect rounded-2xl p-6"
          >
            <Brain className="w-8 h-8 text-purple-400 mb-4" />
            <div className="text-4xl font-bold text-white mb-2">
              {stats.activeAssessments}
            </div>
            <div className="text-white/80">Total Assessments</div>
          </motion.div>
        </div>

        {/* Quick Actions */}
        <div className="glass-effect rounded-3xl p-8 mb-8">
          <h2 className="text-2xl font-bold text-white mb-6">Quick Actions</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <button
              onClick={() => navigate("/partner/coaches")}
              className="p-4 rounded-xl bg-white/10 text-white hover:bg-white/20 transition-all text-left"
            >
              <Users className="w-6 h-6 mb-2" />
              <div className="font-medium">Manage Coaches</div>
              <div className="text-sm text-white/60">
                Add, remove, and manage coach accounts
              </div>
            </button>

            <button
              onClick={() => navigate("/partner/codes")}
              className="p-4 rounded-xl bg-white/10 text-white hover:bg-white/20 transition-all text-left"
            >
              <Key className="w-6 h-6 mb-2" />
              <div className="font-medium">Assessment Codes</div>
              <div className="text-sm text-white/60">
                Generate and manage assessment codes
              </div>
            </button>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="glass-effect rounded-3xl p-8">
          <h2 className="text-2xl font-bold text-white mb-6">
            Recent Activity
          </h2>
          <div className="text-white/60 text-center py-8">
            Activity feed coming soon...
          </div>
        </div>
      </div>
    </div>
  );
}
