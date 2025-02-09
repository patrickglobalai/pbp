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
import { auth, db } from "../../lib/firebase";

export function PartnerAnalytics() {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [stats, setStats] = useState({
    totalCoaches: 0,
    totalRespondents: 0,
    completionRate: 0,
    activeAssessments: 0,
    monthlyGrowth: 0,
  });

  useEffect(() => {
    if (auth?.currentUser?.uid) {
      loadAnalytics();
    }
  }, [auth?.currentUser?.uid]);

  const loadAnalytics = async () => {
    try {
      setIsLoading(true);
      const partnerId = auth.currentUser?.uid;

      // Get coaches count
      const coachesQuery = query(
        collection(db, "coaches"),
        where("partnerId", "==", partnerId)
      );
      const coachesSnapshot = await getDocs(coachesQuery);
      const coachIds = coachesSnapshot.docs.map((doc) => doc.data().userId);

      // Get total respondents
      const respondentsQuery = query(
        collection(db, "respondents"),
        where("coachId", "in", coachIds)
      );
      const respondentsSnapshot = await getDocs(respondentsQuery);
      const totalRespondents = respondentsSnapshot.size;

      // Get completed assessments
      const completedQuery = query(
        collection(db, "results"),
        where("coachId", "in", coachIds)
      );
      const completedSnapshot = await getDocs(completedQuery);
      const completedCount = completedSnapshot.size;

      // Calculate completion rate
      const completionRate = totalRespondents
        ? (completedCount / totalRespondents) * 100
        : 0;

      // Get active assessments (last 30 days)
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      const activeQuery = query(
        collection(db, "respondents"),
        where("coachId", "in", coachIds),
        where("createdAt", ">=", Timestamp.fromDate(thirtyDaysAgo))
      );
      const activeSnapshot = await getDocs(activeQuery);

      setStats({
        totalCoaches: coachesSnapshot.size,
        totalRespondents,
        completionRate: Math.round(completionRate),
        activeAssessments: activeSnapshot.size,
        monthlyGrowth: 15, // Placeholder - would need historical data
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
          to="/partner"
          className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-8 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Dashboard
        </Link>

        <div className="flex items-center gap-4 mb-8">
          <BarChart2 className="w-12 h-12 text-white" />
          <div>
            <h1 className="text-3xl font-bold text-white">Analytics</h1>
            <p className="text-white/80">
              Track your coaching network performance
            </p>
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
              {stats.activeAssessments}
            </div>
            <div className="text-white/80">Active Assessments</div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="glass-effect rounded-2xl p-6"
          >
            <BarChart2 className="w-8 h-8 text-blue-400 mb-4" />
            <div className="text-4xl font-bold text-white mb-2">
              {stats.monthlyGrowth}%
            </div>
            <div className="text-white/80">Monthly Growth</div>
          </motion.div>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Coach Performance */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="glass-effect rounded-3xl p-8"
          >
            <h2 className="text-2xl font-bold text-white mb-6">
              Coach Performance
            </h2>
            <div className="text-white/60 text-center py-8">
              Coach performance visualization coming soon...
            </div>
          </motion.div>

          {/* Assessment Trends */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="glass-effect rounded-3xl p-8"
          >
            <h2 className="text-2xl font-bold text-white mb-6">
              Assessment Trends
            </h2>
            <div className="text-white/60 text-center py-8">
              Assessment trends visualization coming soon...
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
