import { addDoc, collection, getDocs, query, where } from "firebase/firestore";
import { motion } from "framer-motion";
import { AlertCircle, ArrowLeft, Copy, Key, Plus } from "lucide-react";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { db } from "../../lib/firebase";

interface AssessmentCode {
  id: string;
  coachId: string;
  code: string;
  createdAt: Date;
  used: boolean;
  coach: {
    user: {
      fullName: string;
      email: string;
    };
  };
}

export function AssessmentCodes() {
  const [codes, setCodes] = useState<AssessmentCode[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [showGenerateModal, setShowGenerateModal] = useState(false);
  const [selectedCoach, setSelectedCoach] = useState("");
  const [coaches, setCoaches] = useState<any[]>([]);
  const { user } = useAuth();

  useEffect(() => {
    if (user?.uid) {
      loadCodes();
      loadCoaches();
    }
  }, [user]);

  const loadCodes = async () => {
    try {
      setIsLoading(true);
      const codesRef = collection(db, "assessment_codes");
      const codesSnapshot = await getDocs(codesRef);

      const codesData = await Promise.all(
        codesSnapshot.docs.map(async (doc) => {
          const data = doc.data();

          // Get coach data
          let coachData, coachDoc;
          if (data?.coachId) {
            coachDoc = await getDocs(
              query(
                collection(db, "users"),
                where("userId", "==", data.coachId)
              )
            );
            coachData = coachDoc?.docs[0]?.data();
          }

          return {
            id: doc.id,
            coachId: data.coachId,
            code: data.code,
            createdAt: data.createdAt.toDate(),
            used: data.used,
            coach: {
              user: {
                fullName: coachData?.fullName || "",
                email: coachData?.email || "",
              },
            },
          };
        })
      );

      setCodes(codesData);
    } catch (err) {
      console.error("Error loading codes:", err);
      setError("Failed to load assessment codes");
    } finally {
      setIsLoading(false);
    }
  };

  const loadCoaches = async () => {
    try {
      const coachesRef = collection(db, "coaches");
      const coachesSnapshot = await getDocs(coachesRef);

      const coachesData = await Promise.all(
        coachesSnapshot.docs.map(async (doc) => {
          const data = doc.data();
          const userDoc = await getDocs(
            query(collection(db, "users"), where("userId", "==", data.userId))
          );
          const userData = userDoc.docs[0]?.data();

          return {
            id: doc.id,
            userId: data.userId,
            user: {
              fullName: userData?.fullName || "",
              email: userData?.email || "",
            },
          };
        })
      );

      setCoaches(coachesData);
    } catch (err) {
      console.error("Error loading coaches:", err);
    }
  };

  const generateCode = () => {
    return "PBP" + Math.random().toString(36).substring(2, 8).toUpperCase();
  };

  const handleGenerateCodes = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsLoading(true);

      const newCode = generateCode();
      await addDoc(collection(db, "assessment_codes"), {
        coachId: selectedCoach,
        code: newCode,
        used: false,
        createdAt: new Date(),
      });

      setShowGenerateModal(false);
      loadCodes();
    } catch (err) {
      console.error("Error generating code:", err);
      setError("Failed to generate assessment code");
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = (code: string) => {
    navigator.clipboard.writeText(code);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen ai-gradient-bg py-12 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <div className="text-white">Loading assessment codes...</div>
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

        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Key className="w-12 h-12 text-white" />
            <div>
              <h1 className="text-3xl font-bold text-white">
                Assessment Codes
              </h1>
              <p className="text-white/80">
                Generate and manage assessment codes
              </p>
            </div>
          </div>
          <button
            onClick={() => setShowGenerateModal(true)}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r 
              from-blue-500 to-indigo-600 text-white font-medium hover:scale-105 transition-all"
          >
            <Plus className="w-5 h-5" />
            Generate Code
          </button>
        </div>

        {error && (
          <div className="flex items-center gap-2 bg-red-500/10 text-red-400 p-4 rounded-xl mb-6">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <p>{error}</p>
          </div>
        )}

        <div className="glass-effect rounded-3xl p-8">
          <div className="grid gap-4">
            {codes.map((code) => (
              <motion.div
                key={code.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center justify-between p-4 rounded-xl bg-white/10"
              >
                <div>
                  <div className="font-medium text-white">{code.code}</div>
                  <div className="text-white/60">
                    Assigned to: {code.coach.user.fullName}
                  </div>
                  <div className="text-sm text-white/40">
                    Status: {code.used ? "Used" : "Available"}
                  </div>
                </div>
                <button
                  onClick={() => copyToClipboard(code.code)}
                  className="p-2 rounded-lg bg-white/10 text-white hover:bg-white/20 transition-all"
                >
                  <Copy className="w-5 h-5" />
                </button>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Generate Code Modal */}
        {showGenerateModal && (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="glass-effect rounded-3xl p-8 w-full max-w-lg mx-4"
            >
              <h2 className="text-2xl font-bold text-white mb-6">
                Generate Assessment Code
              </h2>
              <form onSubmit={handleGenerateCodes} className="space-y-6">
                <div>
                  <label htmlFor="coach" className="block text-white mb-2">
                    Assign to Coach
                  </label>
                  <select
                    id="coach"
                    value={selectedCoach}
                    onChange={(e) => setSelectedCoach(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-white/10 text-white border border-white/20 
                      focus:border-white/40 focus:outline-none"
                    required
                  >
                    <option value="">Select a coach</option>
                    {coaches.map((coach) => (
                      <option key={coach.id} value={coach.userId}>
                        {coach.user.fullName} ({coach.user.email})
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex justify-end gap-4 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowGenerateModal(false)}
                    className="px-6 py-3 rounded-xl bg-white/10 text-white hover:bg-white/20 transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="px-6 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 
                      text-white font-medium hover:scale-105 transition-all disabled:opacity-50"
                  >
                    {isLoading ? "Generating..." : "Generate Code"}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
}
