import { onAuthStateChanged } from "firebase/auth";
import { collection, getDocs, query, where } from "firebase/firestore";
import { motion } from "framer-motion";
import { AlertCircle, ArrowLeft, Edit2, Trash2, Users } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { auth, db } from "../../lib/firebase";
import { displayErrorMessage } from "../../utils/functions";
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

export function PartnerCoachManagement() {
  const [coaches, setCoaches] = useState<Coach[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

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
      const partnerId = auth.currentUser?.uid;

      // Get coaches for this partner
      const coachesQuery = query(
        collection(db, "coaches"),
        where("partnerId", "==", partnerId)
      );
      const coachesSnapshot = await getDocs(coachesQuery);

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
      setError(displayErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
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
          to="/partner"
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
              <p className="text-white/80">
                View and manage your coaching team
              </p>
            </div>
          </div>
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
      </div>
    </div>
  );
}
