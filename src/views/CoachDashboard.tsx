import { onAuthStateChanged, signOut } from "firebase/auth";
import { collection, getDocs, query, where } from "firebase/firestore";
import { motion } from "framer-motion";
import { AlertCircle, Brain, Key, LogOut, Users } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { isUserCoach } from "../lib/auth";
import { auth, db } from "../lib/firebase";

export function CoachDashboard() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [stats, setStats] = useState({
    totalRespondents: 0,
    completedAssessments: 0,
    activeRespondents: 0,
  });
  const [assessmentCode, setAssessmentCode] = useState<string>("");
  const [hasAiAccess, setHasAiAccess] = useState(false);
  const [hasManualAiAccess, setHasManualAiAccess] = useState(false);

  useEffect(() => {
    checkCoachAccess();
  }, []);

  const handleLogout = useCallback(async () => {
    try {
      await signOut(auth);
      navigate("/login");
    } catch (err) {
      console.error("Error signing out:", err);
    }
  }, [navigate]);

  const checkAIAccess = async () => {
    try {
      if (!auth.currentUser) return;

      // Get coach document to check both AI access types
      const coachQuery = query(
        collection(db, "coaches"),
        where("userId", "==", auth.currentUser.uid)
      );
      const coachSnapshot = await getDocs(coachQuery);

      if (!coachSnapshot.empty) {
        const coachData = coachSnapshot.docs[0].data();
        // Check for full AI access (advanced/partner tiers)
        setHasAiAccess(coachData.aiAnalysisAccess === true);
        // Check for manual AI access (basic plus tier)
        setHasManualAiAccess(coachData.manualAiAccess === true);
      }
    } catch (err) {
      console.error("Error checking AI access:", err);
    }
  };

  const checkCoachAccess = async () => {
    try {
      const unsubscribe = onAuthStateChanged(auth, async (user) => {
        if (!user) {
          navigate("/login");
          return;
        }

        const isCoach = await isUserCoach(user.uid);
        if (!isCoach) {
          navigate("/");
          return;
        }

        if (auth?.currentUser?.uid) {
          loadDashboardStats();
          loadAssessmentCode();
          checkAIAccess();
        }
      });

      return () => unsubscribe();
    } catch (err) {
      console.error("Coach access check failed:", err);
      navigate("/");
    }
  };

  const loadAssessmentCode = async () => {
    try {
      if (!auth.currentUser) return;

      const coachQuery = query(
        collection(db, "coaches"),
        where("userId", "==", auth.currentUser.uid)
      );
      const coachSnapshot = await getDocs(coachQuery);

      if (!coachSnapshot.empty) {
        const coachData = coachSnapshot.docs[0].data();
        setAssessmentCode(coachData.assessmentCode);
      }
    } catch (err) {
      console.error("Error loading assessment code:", err);
    }
  };

  const loadDashboardStats = async () => {
    try {
      setIsLoading(true);
      const userId = auth.currentUser?.uid;

      // Get respondents for this coach
      const respondentsQuery = query(
        collection(db, "respondents"),
        where("coachId", "==", userId)
      );
      const respondentsSnapshot = await getDocs(respondentsQuery);
      const totalRespondents = respondentsSnapshot.size;

      // Get completed assessments
      const completedQuery = query(
        collection(db, "results"),
        where("coachId", "==", userId)
      );
      const completedSnapshot = await getDocs(completedQuery);
      const completedCount = completedSnapshot.size;

      // Get active respondents (accessed in last 30 days)
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      const activeQuery = query(
        collection(db, "respondents"),
        where("coachId", "==", userId),
        where("lastAccessedAt", ">=", thirtyDaysAgo)
      );
      const activeSnapshot = await getDocs(activeQuery);

      setStats({
        totalRespondents,
        completedAssessments: completedCount,
        activeRespondents: activeSnapshot.size,
      });
    } catch (err) {
      console.error("Failed to load dashboard stats:", err);
      setError("Failed to load dashboard statistics");
    } finally {
      setIsLoading(false);
    }
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
              <h1 className="text-3xl font-bold text-white">Coach Dashboard</h1>
              <p className="text-white/80">
                Monitor your assessments and respondents
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

        <div className="glass-effect rounded-3xl p-8 mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Key className="w-8 h-8 text-blue-400" />
              <div>
                <h2 className="text-xl font-bold text-white">
                  Your Assessment Code
                </h2>
                <p className="text-white/80">
                  Share this code with your clients
                </p>
              </div>
            </div>
            <button
              onClick={() => navigator.clipboard.writeText(assessmentCode)}
              className="px-4 py-2 rounded-xl bg-white/10 text-white hover:bg-white/20 transition-all"
            >
              Copy Code
            </button>
          </div>
          <div className="mt-4 p-4 bg-white/10 rounded-xl">
            <p className="text-2xl font-mono text-white text-center">
              {assessmentCode}
            </p>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-effect rounded-2xl p-6"
          >
            <Users className="w-8 h-8 text-blue-400 mb-4" />
            <div className="text-4xl font-bold text-white mb-2">
              {stats.totalRespondents}
            </div>
            <div className="text-white/80">Total Respondents</div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="glass-effect rounded-2xl p-6"
          >
            <Key className="w-8 h-8 text-emerald-400 mb-4" />
            <div className="text-4xl font-bold text-white mb-2">
              {stats.completedAssessments}
            </div>
            <div className="flex items-center gap-2">
              <span className="text-white/80">Completed Assessments</span>
              <span className="text-xs text-yellow-300">(Coming Soon)</span>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="glass-effect rounded-2xl p-6"
          >
            <Brain className="w-8 h-8 text-purple-400 mb-4" />
            <div className="text-4xl font-bold text-white mb-2">
              {stats.activeRespondents}
            </div>
            <div className="flex items-center gap-2">
              <span className="text-white/80">Active Respondents (30d)</span>
              <span className="text-xs text-yellow-300">(Coming Soon)</span>
            </div>
          </motion.div>
        </div>

        <div className="glass-effect rounded-3xl p-8 mb-8">
          <h2 className="text-2xl font-bold text-white mb-6">Quick Actions</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <button
              onClick={() => navigate("/coach/respondents")}
              className="p-4 rounded-xl bg-white/10 text-white hover:bg-white/20 transition-all text-left"
            >
              <Users className="w-6 h-6 mb-2" />
              <div className="font-medium">View Respondents</div>
              <div className="text-sm text-white/60">
                Access your respondents' profiles and assessment results
              </div>
            </button>

            {(hasManualAiAccess || hasAiAccess) && (
              <button
                onClick={() => navigate("/coach/manual-analysis")}
                className="p-4 rounded-xl bg-white/10 text-white hover:bg-white/20 transition-all text-left"
              >
                <Brain className="w-6 h-6 mb-2" />
                <div className="font-medium">Manual AI Analysis</div>
                <div className="text-sm text-white/60">
                  Enter scores manually to get AI insights
                </div>
              </button>
            )}
          </div>
        </div>

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
