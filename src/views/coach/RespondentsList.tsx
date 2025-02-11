import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { Users, ArrowLeft, AlertCircle, Eye } from 'lucide-react';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { auth, db } from '../../lib/firebase';

interface Respondent {
  id: string;
  userId: string;
  fullName: string;
  email: string;
  assessmentStatus: 'pending' | 'completed';
  completedAt?: Date;
}

export function RespondentsList() {
  const navigate = useNavigate();
  const [respondents, setRespondents] = useState<Respondent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadRespondents = async () => {
      if (!auth.currentUser) {
        navigate('/login');
        return;
      }

      try {
        setIsLoading(true);
        const coachId = auth.currentUser.uid;
        
        // Get respondents for this coach
        const respondentsQuery = query(
          collection(db, 'respondents'),
          where('coachId', '==', coachId)
        );
        const respondentsSnapshot = await getDocs(respondentsQuery);
        
        // Get user data and results for each respondent
        const respondentsData = await Promise.all(respondentsSnapshot.docs.map(async (doc) => {
          const data = doc.data();
          
          // Get user data
          const userDoc = await getDocs(query(
            collection(db, 'users'),
            where('userId', '==', data.userId)
          ));
          const userData = userDoc.docs[0]?.data();
          
          // Get results if completed
          const resultsQuery = query(
            collection(db, 'results'),
            where('userId', '==', data.userId)
          );
          const resultsSnapshot = await getDocs(resultsQuery);
          const hasResults = !resultsSnapshot.empty;
          const results = hasResults ? resultsSnapshot.docs[0].data() : null;

          return {
            id: doc.id,
            userId: data.userId,
            fullName: userData?.fullName || '',
            email: userData?.email || '',
            assessmentStatus: hasResults ? 'completed' : 'pending',
            completedAt: results?.completedAt?.toDate()
          };
        }));

        setRespondents(respondentsData);
      } catch (err) {
        console.error('Error loading respondents:', err);
        setError('Failed to load respondents');
      } finally {
        setIsLoading(false);
      }
    };

    loadRespondents();
  }, [navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen ai-gradient-bg py-12 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <div className="text-white">Loading respondents...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen ai-gradient-bg py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <Link 
          to="/coach" 
          className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-8 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Dashboard
        </Link>

        <div className="flex items-center gap-4 mb-8">
          <Users className="w-12 h-12 text-white" />
          <div>
            <h1 className="text-3xl font-bold text-white">Respondents</h1>
            <p className="text-white/80">View and manage your assessment respondents</p>
          </div>
        </div>

        {error && (
          <div className="flex items-center gap-2 bg-red-500/10 text-red-400 p-4 rounded-xl mb-6">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <p>{error}</p>
          </div>
        )}

        <div className="glass-effect rounded-3xl p-8">
          {respondents.length === 0 ? (
            <div className="text-center text-white/60 py-8">
              No respondents found
            </div>
          ) : (
            <div className="grid gap-4">
              {respondents.map((respondent) => (
                <motion.div
                  key={respondent.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center justify-between p-6 rounded-xl bg-white/10"
                >
                  <div className="space-y-2">
                    <div className="font-medium text-white text-lg">
                      {respondent.fullName}
                    </div>
                    <div className="text-white/60">{respondent.email}</div>
                    <div className="flex items-center gap-4">
                      <span className={`text-sm ${
                        respondent.assessmentStatus === 'completed' 
                          ? 'text-emerald-400' 
                          : 'text-yellow-300'
                      }`}>
                        {respondent.assessmentStatus === 'completed' ? 'Completed' : 'Pending'}
                      </span>
                      {respondent.completedAt && (
                        <span className="text-sm text-white/40">
                          Completed on {respondent.completedAt.toLocaleDateString()}
                        </span>
                      )}
                    </div>
                  </div>
                  {respondent.assessmentStatus === 'completed' && (
                    <Link
                      to={`/coach/results/${respondent.userId}`}
                      className="p-2 rounded-lg bg-white/10 text-white hover:bg-white/20 transition-all"
                    >
                      <Eye className="w-5 h-5" />
                    </Link>
                  )}
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}