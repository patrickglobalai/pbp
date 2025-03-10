import {
  collection,
  getDocs,
  query,
  Timestamp,
  where,
} from "firebase/firestore";
import { motion } from "framer-motion";
import {
  AlertCircle,
  ArrowLeft,
  BarChart2,
  Clock,
  TrendingUp,
  Users,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { db } from "../../lib/firebase";
import { DB_URL } from "../../utils/functions";

export function Analytics() {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalAssessments: 0,
    completionRate: 0,
    averageTime: 0,
    activeUsers: 0,
    monthlyGrowth: 0,
    dailyAssessments: [],
  });

  useEffect(() => {
    if (user?.uid) {
      loadAnalytics();
    }
  }, [user]);

  const loadAnalytics = async () => {
    try {
      setIsLoading(true);

      // Get total assessments
      const assessmentsRef = collection(db, DB_URL.respondents);
      const totalSnapshot = await getDocs(assessmentsRef);
      const totalCount = totalSnapshot.size;

      // Get completed assessments
      const completedQuery = query(
        assessmentsRef,
        where(DB_URL.results, "!=", {})
      );
      const completedSnapshot = await getDocs(completedQuery);
      const completedCount = completedSnapshot.size;

      // Calculate completion rate
      const completionRate = totalCount
        ? (completedCount / totalCount) * 100
        : 0;

      // Get active users (last 30 days)
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      const activeQuery = query(
        assessmentsRef,
        where("created_at", ">=", Timestamp.fromDate(thirtyDaysAgo))
      );
      const activeSnapshot = await getDocs(activeQuery);
      const activeCount = activeSnapshot.size;

      setStats({
        totalAssessments: totalCount,
        completionRate: Math.round(completionRate),
        averageTime: 25, // Placeholder - would need actual timing data
        activeUsers: activeCount,
        monthlyGrowth: 15, // Placeholder - would need historical data
        dailyAssessments: [], // Placeholder - would need daily aggregation
      });
    } catch (err) {
      console.error("Error loading analytics:", err);
      setError("Failed to load analytics data");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen ai-gradient-bg py-12 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <div className="text-white">Loading analytics...</div>
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

        <div className="flex items-center gap-4 mb-8">
          <BarChart2 className="w-12 h-12 text-white" />
          <div>
            <h1 className="text-3xl font-bold text-white">Analytics</h1>
            <p className="text-white/80">Track system performance and usage</p>
          </div>
        </div>

        {error && (
          <div className="flex items-center gap-2 bg-red-500/10 text-red-400 p-4 rounded-xl mb-6">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <p>{error}</p>
          </div>
        )}

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-effect rounded-2xl p-6"
          >
            <BarChart2 className="w-8 h-8 text-blue-400 mb-4" />
            <div className="text-4xl font-bold text-white mb-2">
              {stats.totalAssessments}
            </div>
            <div className="text-white/80">Total Assessments</div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="glass-effect rounded-2xl p-6"
          >
            <TrendingUp className="w-8 h-8 text-emerald-400 mb-4" />
            <div className="text-4xl font-bold text-white mb-2">
              {stats.completionRate}%
            </div>
            <div className="text-white/80">Completion Rate</div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="glass-effect rounded-2xl p-6"
          >
            <Clock className="w-8 h-8 text-purple-400 mb-4" />
            <div className="text-4xl font-bold text-white mb-2">
              {stats.averageTime}m
            </div>
            <div className="text-white/80">Average Time</div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="glass-effect rounded-2xl p-6"
          >
            <Users className="w-8 h-8 text-blue-400 mb-4" />
            <div className="text-4xl font-bold text-white mb-2">
              {stats.activeUsers}
            </div>
            <div className="text-white/80">Active Users (30d)</div>
          </motion.div>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Growth Trends */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="glass-effect rounded-3xl p-8"
          >
            <h2 className="text-2xl font-bold text-white mb-6">
              Growth Trends
            </h2>
            <div className="text-white/60 text-center py-8">
              Growth visualization coming soon...
            </div>
          </motion.div>

          {/* Usage Patterns */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="glass-effect rounded-3xl p-8"
          >
            <h2 className="text-2xl font-bold text-white mb-6">
              Usage Patterns
            </h2>
            <div className="text-white/60 text-center py-8">
              Usage pattern visualization coming soon...
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
