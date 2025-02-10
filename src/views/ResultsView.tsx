import { collection, getDocs, query, where } from "firebase/firestore";
import { motion } from "framer-motion";
import { AlertCircle, Brain, Save } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { HarmonicGraph } from "../components/HarmonicGraph";
import { Header } from "../components/Header";
import { ResultsGraph } from "../components/ResultsGraph";
import { useAssessment } from "../contexts/AssessmentContext";
import { useResults } from "../hooks/useResults";
import { auth, db } from "../lib/firebase";

export function ResultsView() {
  const { scores, harmonicScores } = useAssessment();
  const { saveResults, isLoading, error } = useResults();
  const [hasAiAccess, setHasAiAccess] = useState<boolean | null>(null);
  const [isCheckingAccess, setIsCheckingAccess] = useState(true);
  const [isSaved, setIsSaved] = useState(false);

  const checkAccess = async () => {
    if (!auth.currentUser) return;

    try {
      // Get the respondent's info
      const respondentQuery = query(
        collection(db, "respondents"),
        where("userId", "==", auth.currentUser.uid)
      );
      const respondentDocs = await getDocs(respondentQuery);

      if (!respondentDocs.empty) {
        const respondentData = respondentDocs.docs[0].data();
        const coachId = respondentData.coachId;

        // Check if results are already saved
        setIsSaved(Boolean(respondentData.lastAssessmentDate));

        // Check AI access
        if (coachId) {
          const coachQuery = query(
            collection(db, "coaches"),
            where("userId", "==", coachId)
          );
          const coachDocs = await getDocs(coachQuery);

          if (!coachDocs.empty) {
            const coachData = coachDocs.docs[0].data();
            // Only show AI access for advanced and partner tiers
            setHasAiAccess(
              coachData.tier === "advanced" || coachData.tier === "partner"
            );
          } else {
            setHasAiAccess(false);
          }
        } else {
          setHasAiAccess(false);
        }
      } else {
        setHasAiAccess(false);
      }
    } catch (err) {
      console.error("Error checking access:", err);
      setHasAiAccess(false);
    } finally {
      setIsCheckingAccess(false);
    }
  };

  useEffect(() => {
    checkAccess();
  }, [auth?.currentUser]);

  const handleSave = async () => {
    if (!auth.currentUser) return;

    try {
      await saveResults({
        userId: auth.currentUser.uid,
        scores: scores!,
        harmonicScores: harmonicScores!,
        completedAt: new Date(),
      });
      setIsSaved(true);
    } catch (err) {
      console.error("Error saving results:", err);
    }
  };

  if (!scores || !harmonicScores) {
    return (
      <div className="min-h-screen ai-gradient-bg py-12 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <Header
            title="No Assessment Results Found"
            subtitle="Please complete the assessment first to get your results"
          />
          <Link
            to="/assessment"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-medium hover:scale-105 transition-all"
          >
            Take Assessment
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen ai-gradient-bg py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <Header
          title="Your Personality Breakthrough Profile Results"
          subtitle="Detailed analysis of your characteristics"
        />

        {error && (
          <div className="flex items-center gap-2 bg-red-500/10 text-red-400 p-4 rounded-xl mb-6">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <p>{error}</p>
          </div>
        )}

        <div className="grid md:grid-cols-2 gap-8 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-effect rounded-3xl p-8"
          >
            <h2 className="text-2xl font-bold text-white mb-8">
              Characteristic Profile
            </h2>
            <ResultsGraph scores={scores} />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="glass-effect rounded-3xl p-8"
          >
            <h2 className="text-2xl font-bold text-white mb-8">
              Harmonic Scale Profile
            </h2>
            <HarmonicGraph scores={harmonicScores} />
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="flex flex-col items-center gap-4"
        >
          {!isSaved && !isLoading && !error && (
            <button
              onClick={handleSave}
              disabled={isLoading}
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 
                text-white font-medium hover:scale-105 transition-all disabled:opacity-50"
            >
              <Save className="w-5 h-5" />
              {isLoading ? "Saving Results..." : "Save Results"}
            </button>
          )}

          {!isCheckingAccess && hasAiAccess && (
            <Link
              to="/analysis"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 
                text-white font-medium hover:scale-105 transition-all"
            >
              <Brain className="w-5 h-5" />
              Get AI Analysis
            </Link>
          )}

          {!isCheckingAccess && !hasAiAccess && (
            <div className="text-white/60 text-center">
              AI Analysis is not available with your current plan. Please
              contact your coach for more information.
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
