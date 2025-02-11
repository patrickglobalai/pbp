import { collection, getDocs, query, where } from "firebase/firestore";
import { motion } from "framer-motion";
import { AlertCircle, Brain, Key, Users } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { db } from "../lib/firebase";
import { isUserAdmin } from "../lib/firebase-admin";

export function AdminDashboard() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const { isLoading: isAuthLoading, user } = useAuth();
  const [stats, setStats] = useState({
    totalCoaches: 0,
    totalPartners: 0,
    totalRespondents: 0,
    activeAssessments: 0,
  });

  useEffect(() => {
    if (!isAuthLoading && !user) {
      navigate("/login");
    }
    if (!isAuthLoading && user) {
      checkAdminAccess();
    }
  }, [isAuthLoading, user, navigate]);

  const checkAdminAccess = async () => {
    try {
      if (!user) return;

      const isAdmin = await isUserAdmin(user.uid);
      if (!isAdmin) {
        navigate("/");
        return;
      }

      if (user?.uid) {
        loadDashboardStats();
      }
    } catch (err) {
      console.error("Admin access check failed:", err);
      navigate("/");
    }
  };

  const loadDashboardStats = async () => {
    try {
      setIsLoading(true);

      // Get coaches count
      const coachesSnapshot = await getDocs(collection(db, "coaches"));
      const coachesCount = coachesSnapshot.size;

      // Get partners count
      const partnersSnapshot = await getDocs(collection(db, "partners"));
      const partnersCount = partnersSnapshot.size;

      // Get respondents count
      const respondentsSnapshot = await getDocs(collection(db, "respondents"));
      const respondentsCount = respondentsSnapshot.size;

      // Get active assessments (completed in last 30 days)
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      const activeQuery = query(
        collection(db, "respondents"),
        where("createdAt", ">=", thirtyDaysAgo)
      );
      const activeSnapshot = await getDocs(activeQuery);
      const activeCount = activeSnapshot.size;

      setStats({
        totalCoaches: coachesCount,
        totalPartners: partnersCount,
        totalRespondents: respondentsCount,
        activeAssessments: activeCount,
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
        <div className="flex items-center gap-4 mb-8">
          <Brain className="w-12 h-12 text-white" />
          <div>
            <h1 className="text-3xl font-bold text-white">Admin Dashboard</h1>
            <p className="text-white/80">Manage your assessment system</p>
          </div>
        </div>

        {error && (
          <div className="flex items-center gap-2 bg-red-500/10 text-red-400 p-4 rounded-xl mb-6">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <p>{error}</p>
          </div>
        )}

        {/* Stats Overview */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
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
            <Users className="w-8 h-8 text-purple-400 mb-4" />
            <div className="text-4xl font-bold text-white mb-2">
              {stats.totalPartners}
            </div>
            <div className="text-white/80">Active Partners</div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="glass-effect rounded-2xl p-6"
          >
            <Key className="w-8 h-8 text-emerald-400 mb-4" />
            <div className="text-4xl font-bold text-white mb-2">
              {stats.totalRespondents}
            </div>
            <div className="text-white/80">Total Respondents</div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="glass-effect rounded-2xl p-6"
          >
            <Brain className="w-8 h-8 text-blue-400 mb-4" />
            <div className="text-4xl font-bold text-white mb-2">
              {stats.activeAssessments}
            </div>
            <div className="text-white/80">Assessments (30d)</div>
          </motion.div>
        </div>

        {/* Quick Actions */}
        <div className="glass-effect rounded-3xl p-8 mb-8">
          <h2 className="text-2xl font-bold text-white mb-6">Quick Actions</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            <button
              onClick={() => navigate("/admin/partners")}
              className="p-4 rounded-xl bg-white/10 text-white hover:bg-white/20 transition-all text-left"
            >
              <Users className="w-6 h-6 mb-2" />
              <div className="font-medium">Manage Partners</div>
              <div className="text-sm text-white/60">
                Create and manage partner accounts
              </div>
            </button>

            <button
              onClick={() => navigate("/admin/coaches")}
              className="p-4 rounded-xl bg-white/10 text-white hover:bg-white/20 transition-all text-left"
            >
              <Users className="w-6 h-6 mb-2" />
              <div className="font-medium">Manage Coaches</div>
              <div className="text-sm text-white/60">
                Create and manage coach accounts
              </div>
            </button>

            <button
              onClick={() => navigate("/admin/codes")}
              className="p-4 rounded-xl bg-white/10 text-white hover:bg-white/20 transition-all text-left"
            >
              <Key className="w-6 h-6 mb-2" />
              <div className="font-medium">Assessment Codes</div>
              <div className="text-sm text-white/60">
                Generate and track assessment codes
              </div>
            </button>

            <button
              onClick={() => navigate("/admin/analytics")}
              className="p-4 rounded-xl bg-white/10 text-white hover:bg-white/20 transition-all text-left"
            >
              <Brain className="w-6 h-6 mb-2" />
              <div className="font-medium">Analytics</div>
              <div className="text-sm text-white/60">
                View detailed system analytics
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
