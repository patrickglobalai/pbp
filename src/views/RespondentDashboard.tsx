import { onAuthStateChanged, signOut } from "firebase/auth";
import { collection, getDocs, orderBy, query, where } from "firebase/firestore";
import { motion } from "framer-motion";
import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  Brain,
  History,
  LogOut,
} from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { HarmonicGraph } from "../components/HarmonicGraph";
import { ResultsGraph } from "../components/ResultsGraph";
import { useAuth } from "../contexts/AuthContext";
import { useResults } from "../contexts/ResultsContext";
import { auth, db } from "../lib/firebase";
import type { AssessmentResult } from "../types/results";

export function RespondentDashboard() {
  const navigate = useNavigate();
  const { hasAIAccess } = useAuth();
  const { getResults, isLoading: isLoadingResults, error } = useResults();
  const [results, setResults] = useState<AssessmentResult[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isAuthChecking, setIsAuthChecking] = useState(true);
  const [canRetake, setCanRetake] = useState(false);
  const [nextRetakeDate, setNextRetakeDate] = useState<Date | null>(null);

  const handleLogout = useCallback(async () => {
    try {
      await signOut(auth);
      navigate("/login");
    } catch (err) {
      console.error("Error signing out:", err);
    }
  }, [navigate]);

  const loadResults = useCallback(async (userId: string) => {
    try {
      // Get all results ordered by completedAt
      const resultsQuery = query(
        collection(db, "results"),
        where("userId", "==", userId),
        orderBy("completedAt", "desc")
      );
      const resultsSnapshot = await getDocs(resultsQuery);

      if (!resultsSnapshot.empty) {
        const allResults = resultsSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
          completedAt: doc.data().completedAt.toDate(),
          retakenAt: doc.data().retakenAt?.toDate(),
        })) as AssessmentResult[];

        setResults(allResults);

        // Get respondent's coach info to check AI access
        const respondentQuery = query(
          collection(db, "respondents"),
          where("userId", "==", userId)
        );
        const respondentSnapshot = await getDocs(respondentQuery);

        if (!respondentSnapshot.empty) {
          const respondentData = respondentSnapshot.docs[0].data();
          const nextRetake = respondentData.nextRetakeDate?.toDate();
          const retakeEnabled = respondentData.retakeEnabled !== false;

          setCanRetake(
            retakeEnabled && (!nextRetake || nextRetake <= new Date())
          );
          setNextRetakeDate(nextRetake || null);
        }
      }
    } catch (err) {
      console.error("Error loading results:", err);
    }
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      try {
        if (!user) {
          navigate("/login");
          return;
        }

        console.log("user", user);

        await loadResults(user.uid);
      } finally {
        setIsAuthChecking(false);
      }
    });

    return () => unsubscribe();
  }, [navigate, loadResults]);

  const handlePreviousResult = () => {
    if (currentPage < results.length) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  const handleNextResult = () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  if (isAuthChecking || isLoadingResults) {
    return (
      <div className="min-h-screen ai-gradient-bg py-12 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <div className="text-white">Loading your results...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen ai-gradient-bg py-12 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex items-center gap-2 bg-red-500/10 text-red-400 p-4 rounded-xl mb-6">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <p>{error}</p>
          </div>
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

  if (results.length === 0) {
    return (
      <div className="min-h-screen ai-gradient-bg py-12 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <div className="text-white mb-4">No assessment results found</div>
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

  const selectedResult = results[currentPage - 1];
  const totalVersions = results.length;

  return (
    <div className="min-h-screen ai-gradient-bg py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Brain className="w-12 h-12 text-white" />
            <div>
              <h1 className="text-3xl font-bold text-white">
                Your Assessment Results
              </h1>
              <div className="flex items-center gap-2 text-white/80">
                <span>Version {totalVersions - currentPage + 1}</span>
                {selectedResult.retakenAt && (
                  <span>
                    • Retaken on {selectedResult.retakenAt.toLocaleDateString()}
                  </span>
                )}
                <span>
                  • Completed on{" "}
                  {selectedResult.completedAt.toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {results.length > 1 && (
              <>
                <button
                  onClick={handleNextResult}
                  disabled={currentPage <= 1}
                  className="p-2 rounded-lg bg-white/10 text-white hover:bg-white/20 transition-all disabled:opacity-50"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
                <div className="text-white/80">
                  {currentPage} of {totalVersions}
                </div>
                <button
                  onClick={handlePreviousResult}
                  disabled={currentPage >= totalVersions}
                  className="p-2 rounded-lg bg-white/10 text-white hover:bg-white/20 transition-all disabled:opacity-50"
                >
                  <ArrowRight className="w-5 h-5" />
                </button>
              </>
            )}
            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 text-white hover:bg-white/20 transition-all"
            >
              <LogOut className="w-5 h-5" />
              <span>Logout</span>
            </button>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-effect rounded-3xl p-8"
          >
            <h2 className="text-2xl font-bold text-white mb-8">
              Characteristic Profile
            </h2>
            <ResultsGraph scores={selectedResult.scores} />
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
            <HarmonicGraph scores={selectedResult.harmonicScores} />
          </motion.div>
        </div>

        {selectedResult.aiAnalysis && hasAIAccess && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="glass-effect rounded-3xl p-8 mb-8"
          >
            <h2 className="text-2xl font-bold text-white mb-6">AI Analysis</h2>
            <div className="prose prose-invert">
              <div className="text-white/90 whitespace-pre-wrap">
                {selectedResult.aiAnalysis}
              </div>
            </div>
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
          className="flex flex-col items-center gap-4"
        >
          {canRetake && (
            <Link
              to="/assessment"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-medium hover:scale-105 transition-all"
            >
              Retake Assessment
            </Link>
          )}

          {!canRetake && nextRetakeDate && (
            <div className="text-white/80 text-center">
              Next retake available on: {nextRetakeDate.toLocaleDateString()}
            </div>
          )}

          {hasAIAccess && (
            <Link
              to="/analysis"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-medium hover:scale-105 transition-all"
            >
              <Brain className="w-5 h-5" />
              Get New AI Analysis
            </Link>
          )}

          {!hasAIAccess && (
            <div className="text-white/60 text-center">
              AI Analysis is not available with your current plan. Please
              contact your coach for more information.
            </div>
          )}

          {results.length > 1 && (
            <div className="flex items-center gap-2 text-white/60 mt-4">
              <History className="w-4 h-4" />
              <span>Total Assessments: {results.length}</span>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
