import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Brain, AlertCircle, History, ArrowRight } from 'lucide-react';
import { collection, getDocs, query, where, orderBy } from 'firebase/firestore';
import { auth, db } from '../../lib/firebase';
import { ResultsGraph } from '../../components/ResultsGraph';
import { HarmonicGraph } from '../../components/HarmonicGraph';
import { useResults } from '../../contexts/ResultsContext';
import { checkCoachAIAccess } from '../../lib/auth';
import type { AssessmentResult } from '../../types/results';

export function RespondentResults() {
  const { userId } = useParams();
  const navigate = useNavigate();
  const { getResults, isLoading, error } = useResults();
  const [results, setResults] = useState<AssessmentResult[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [respondentInfo, setRespondentInfo] = useState<any>(null);
  const [hasAiAccess, setHasAiAccess] = useState<boolean>(false);
  const [isCheckingAccess, setIsCheckingAccess] = useState(true);

  useEffect(() => {
    const loadResults = async () => {
      if (!userId || !auth.currentUser) {
        navigate('/coach/respondents');
        return;
      }

      try {
        setIsCheckingAccess(true);
        
        // Verify coach access and AI permissions
        const coachId = auth.currentUser.uid;
        const coachQuery = query(
          collection(db, 'coaches'),
          where('userId', '==', coachId)
        );
        const coachSnapshot = await getDocs(coachQuery);
        
        if (coachSnapshot.empty) {
          navigate('/');
          return;
        }

        // Check AI access
        const aiAccess = await checkCoachAIAccess(coachId);
        setHasAiAccess(aiAccess);

        // Get respondent info
        const userDoc = await getDocs(query(
          collection(db, 'users'),
          where('userId', '==', userId)
        ));
        
        if (!userDoc.empty) {
          setRespondentInfo(userDoc.docs[0].data());
        }

        // Get all results ordered by completedAt
        const resultsQuery = query(
          collection(db, 'results'),
          where('userId', '==', userId),
          orderBy('completedAt', 'desc')
        );
        const resultsSnapshot = await getDocs(resultsQuery);
        
        if (!resultsSnapshot.empty) {
          const allResults = resultsSnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
            completedAt: doc.data().completedAt.toDate(),
            retakenAt: doc.data().retakenAt?.toDate()
          })) as AssessmentResult[];
          
          setResults(allResults);
        }
      } catch (err) {
        console.error('Error loading results:', err);
      } finally {
        setIsCheckingAccess(false);
      }
    };

    loadResults();
  }, [userId, navigate]);

  const handlePreviousResult = () => {
    if (currentPage < results.length) {
      setCurrentPage(prev => prev + 1);
    }
  };

  const handleNextResult = () => {
    if (currentPage > 1) {
      setCurrentPage(prev => prev - 1);
    }
  };

  if (isLoading || isCheckingAccess) {
    return (
      <div className="min-h-screen ai-gradient-bg py-12 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <div className="text-white">Loading results...</div>
        </div>
      </div>
    );
  }

  if (!results.length || !respondentInfo) {
    return (
      <div className="min-h-screen ai-gradient-bg py-12 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <div className="text-white">No results found</div>
          <Link
            to="/coach/respondents"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-medium hover:scale-105 transition-all"
          >
            Back to Respondents
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
        <Link 
          to="/coach/respondents" 
          className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-8 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Respondents
        </Link>

        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Brain className="w-12 h-12 text-white" />
            <div>
              <h1 className="text-3xl font-bold text-white">{respondentInfo.fullName}</h1>
              <div className="flex items-center gap-2 text-white/80">
                <span>Version {totalVersions - currentPage + 1}</span>
                {selectedResult.retakenAt && (
                  <span>• Retaken on {selectedResult.retakenAt.toLocaleDateString()}</span>
                )}
                <span>• Completed on {selectedResult.completedAt.toLocaleDateString()}</span>
              </div>
            </div>
          </div>

          {results.length > 1 && (
            <div className="flex items-center gap-4">
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
            </div>
          )}
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

        {selectedResult.aiAnalysis && (
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

        {hasAiAccess && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
            className="flex flex-col items-center gap-4"
          >
            <Link
              to={`/analysis?userId=${userId}`}
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-medium hover:scale-105 transition-all"
            >
              <Brain className="w-5 h-5" />
              Get New AI Analysis
            </Link>

            {results.length > 1 && (
              <div className="flex items-center gap-2 text-white/60 mt-4">
                <History className="w-4 h-4" />
                <span>Total Assessments: {results.length}</span>
              </div>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
}