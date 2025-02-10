import { initializeApp } from "firebase/app";
import {
  createUserWithEmailAndPassword,
  getAuth,
  onAuthStateChanged,
} from "firebase/auth";
import {
  collection,
  doc,
  getDocs,
  query,
  setDoc,
  where,
} from "firebase/firestore";
import { motion } from "framer-motion";
import {
  AlertCircle,
  ArrowLeft,
  Edit2,
  Plus,
  Shield,
  Trash2,
  Users,
  X,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { auth, db } from "../../lib/firebase";

// Create a separate Firebase app instance for partner creation
const partnerAuthApp = initializeApp(
  {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID,
  },
  "partnerAuth"
);

// Get auth instance for partner creation
const partnerAuth = getAuth(partnerAuthApp);

interface Partner {
  id: string;
  userId: string;
  maxCoaches: number;
  stats: {
    totalCoaches: number;
    totalRespondents: number;
  };
  user: {
    fullName: string;
    email: string;
  };
  permissions: {
    manageCoaches: boolean;
    createAssessmentCodes: boolean;
  };
}

export function PartnerManagement() {
  const navigate = useNavigate();
  const [partners, setPartners] = useState<Partner[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedPartner, setSelectedPartner] = useState<Partner | null>(null);
  const [editForm, setEditForm] = useState({
    maxCoaches: 5,
    permissions: {
      manageCoaches: true,
      createAssessmentCodes: true,
    },
  });
  const [newPartner, setNewPartner] = useState({
    email: "",
    password: "",
    fullName: "",
    maxCoaches: 5,
    permissions: {
      manageCoaches: true,
      createAssessmentCodes: true,
    },
  });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user?.uid) {
        loadPartners();
      }
    });

    return () => unsubscribe();
  }, []);

  const loadPartners = async () => {
    try {
      setIsLoading(true);
      const partnersQuery = query(collection(db, "partners"));
      const partnersSnapshot = await getDocs(partnersQuery);

      const partnersData = await Promise.all(
        partnersSnapshot.docs.map(async (doc) => {
          const data = doc.data();

          // Get user data
          const userDoc = await getDocs(
            query(collection(db, "users"), where("userId", "==", data.userId))
          );
          const userData = userDoc.docs[0]?.data();

          // Get coaches count
          const coachesQuery = query(
            collection(db, "coaches"),
            where("partnerId", "==", data.userId)
          );
          const coachesSnapshot = await getDocs(coachesQuery);
          const coachIds = coachesSnapshot.docs.map((doc) => doc.data().userId);

          // Get total respondents only if there are coaches
          let respondentsCount = 0;
          if (coachIds.length > 0) {
            const respondentsQuery = query(
              collection(db, "respondents"),
              where("coachId", "in", coachIds)
            );
            const respondentsSnapshot = await getDocs(respondentsQuery);
            respondentsCount = respondentsSnapshot.size;
          }

          return {
            id: doc.id,
            userId: data.userId,
            maxCoaches: data.maxCoaches,
            permissions: data.permissions || {
              manageCoaches: true,
              createAssessmentCodes: true,
            },
            stats: {
              totalCoaches: coachesSnapshot.size,
              totalRespondents: respondentsCount,
            },
            user: {
              fullName: userData?.fullName || "",
              email: userData?.email || "",
            },
          };
        })
      );

      setPartners(partnersData);
    } catch (err) {
      console.error("Error loading partners:", err);
      setError("Failed to load partners");
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditClick = (partner: Partner) => {
    setSelectedPartner(partner);
    setEditForm({
      maxCoaches: partner.maxCoaches,
      permissions: { ...partner.permissions },
    });
    setShowEditModal(true);
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPartner) return;

    try {
      setIsLoading(true);
      setError("");

      // Update partner document
      const partnerRef = doc(db, "partners", selectedPartner.id);
      await setDoc(
        partnerRef,
        {
          maxCoaches: editForm.maxCoaches,
          permissions: editForm.permissions,
          updatedAt: new Date(),
        },
        { merge: true }
      );

      setShowEditModal(false);
      await loadPartners();
    } catch (err) {
      console.error("Error updating partner:", err);
      setError("Failed to update partner");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddPartner = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      const adminId = auth.currentUser?.uid;

      // Verify admin status using the current admin's ID
      const adminQuery = query(
        collection(db, "users"),
        where("userId", "==", adminId),
        where("role", "==", "admin")
      );
      const adminSnapshot = await getDocs(adminQuery);

      if (adminSnapshot.empty) {
        throw new Error("Insufficient permissions");
      }

      // Create Firebase auth user for partner using separate auth instance
      const { user: partnerUser } = await createUserWithEmailAndPassword(
        partnerAuth,
        newPartner.email,
        newPartner.password
      );

      // Create user document with proper role using setDoc with auth UID
      await setDoc(doc(db, "users", partnerUser.uid), {
        userId: partnerUser.uid,
        email: newPartner.email,
        fullName: newPartner.fullName,
        role: "partner",
        subscription_tier: "partner",
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      // Create partner record using setDoc with auth UID
      await setDoc(doc(db, "partners", partnerUser.uid), {
        userId: partnerUser.uid,
        maxCoaches: newPartner.maxCoaches,
        permissions: newPartner.permissions,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      // Sign out the partner user from the secondary auth instance
      await partnerAuth.signOut();

      setShowAddModal(false);
      loadPartners();

      // Show success message with credentials
      alert(
        `Partner account created successfully!\n\nEmail: ${newPartner.email}\nPassword: ${newPartner.password}\n\nPlease share these credentials with the partner securely.`
      );
    } catch (err) {
      console.error("Error adding partner:", err);
      setError("Failed to add partner");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen ai-gradient-bg py-12 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <div className="text-white">Loading partners...</div>
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
            <Users className="w-12 h-12 text-white" />
            <div>
              <h1 className="text-3xl font-bold text-white">
                Partner Management
              </h1>
              <p className="text-white/80">
                Create and manage partner accounts
              </p>
            </div>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r 
              from-blue-500 to-indigo-600 text-white font-medium hover:scale-105 transition-all"
          >
            <Plus className="w-5 h-5" />
            Add Partner
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
            {partners.map((partner) => (
              <motion.div
                key={partner.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center justify-between p-6 rounded-xl bg-white/10"
              >
                <div className="space-y-2">
                  <div className="font-medium text-white text-lg">
                    {partner.user.fullName}
                  </div>
                  <div className="text-white/60">{partner.user.email}</div>
                  <div className="text-sm text-white/40">
                    Max Coaches: {partner.maxCoaches}
                  </div>
                  <div className="flex gap-4 text-sm text-white/60">
                    <span>{partner.stats.totalCoaches} coaches</span>
                    <span>{partner.stats.totalRespondents} respondents</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleEditClick(partner)}
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

        {/* Add Partner Modal */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="glass-effect rounded-3xl p-8 w-full max-w-lg mx-4"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white">
                  Add New Partner
                </h2>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="p-2 rounded-lg bg-white/10 text-white hover:bg-white/20 transition-all"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <form onSubmit={handleAddPartner} className="space-y-6">
                <div>
                  <label htmlFor="fullName" className="block text-white mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    id="fullName"
                    value={newPartner.fullName}
                    onChange={(e) =>
                      setNewPartner((prev) => ({
                        ...prev,
                        fullName: e.target.value,
                      }))
                    }
                    className="w-full px-4 py-3 rounded-xl bg-white/10 text-white border border-white/20 
                      focus:border-white/40 focus:outline-none"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-white mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={newPartner.email}
                    onChange={(e) =>
                      setNewPartner((prev) => ({
                        ...prev,
                        email: e.target.value,
                      }))
                    }
                    className="w-full px-4 py-3 rounded-xl bg-white/10 text-white border border-white/20 
                      focus:border-white/40 focus:outline-none"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="password" className="block text-white mb-2">
                    Initial Password
                  </label>
                  <input
                    type="password"
                    id="password"
                    value={newPartner.password}
                    onChange={(e) =>
                      setNewPartner((prev) => ({
                        ...prev,
                        password: e.target.value,
                      }))
                    }
                    className="w-full px-4 py-3 rounded-xl bg-white/10 text-white border border-white/20 
                      focus:border-white/40 focus:outline-none"
                    required
                    minLength={8}
                    placeholder="Minimum 8 characters"
                  />
                </div>

                <div>
                  <label htmlFor="maxCoaches" className="block text-white mb-2">
                    Maximum Coaches
                  </label>
                  <input
                    type="number"
                    id="maxCoaches"
                    min="1"
                    value={newPartner.maxCoaches}
                    onChange={(e) =>
                      setNewPartner((prev) => ({
                        ...prev,
                        maxCoaches: parseInt(e.target.value),
                      }))
                    }
                    className="w-full px-4 py-3 rounded-xl bg-white/10 text-white border border-white/20 
                      focus:border-white/40 focus:outline-none"
                    required
                  />
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      id="manageCoaches"
                      checked={newPartner.permissions.manageCoaches}
                      onChange={(e) =>
                        setNewPartner((prev) => ({
                          ...prev,
                          permissions: {
                            ...prev.permissions,
                            manageCoaches: e.target.checked,
                          },
                        }))
                      }
                      className="rounded border-white/20"
                    />
                    <label htmlFor="manageCoaches" className="text-white">
                      Can manage coaches
                    </label>
                  </div>

                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      id="createCodes"
                      checked={newPartner.permissions.createAssessmentCodes}
                      onChange={(e) =>
                        setNewPartner((prev) => ({
                          ...prev,
                          permissions: {
                            ...prev.permissions,
                            createAssessmentCodes: e.target.checked,
                          },
                        }))
                      }
                      className="rounded border-white/20"
                    />
                    <label htmlFor="createCodes" className="text-white">
                      Can create assessment codes
                    </label>
                  </div>
                </div>

                <div className="flex justify-end gap-4 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="px-6 py-3 rounded-xl bg-white/10 text-white hover:bg-white/20 transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="px-6 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 
                      text-white font-medium hover:scale-105 transition-all disabled:opacity-50
                      flex items-center gap-2"
                  >
                    <Shield className="w-5 h-5" />
                    {isLoading ? "Adding..." : "Add Partner"}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}

        {/* Edit Partner Modal */}
        {showEditModal && selectedPartner && (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="glass-effect rounded-3xl p-8 w-full max-w-lg mx-4"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white">Edit Partner</h2>
                <button
                  onClick={() => setShowEditModal(false)}
                  className="p-2 rounded-lg bg-white/10 text-white hover:bg-white/20 transition-all"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <form onSubmit={handleEditSubmit} className="space-y-6">
                <div>
                  <label
                    htmlFor="editMaxCoaches"
                    className="block text-white mb-2"
                  >
                    Maximum Coaches
                  </label>
                  <input
                    type="number"
                    id="editMaxCoaches"
                    min="1"
                    value={editForm.maxCoaches}
                    onChange={(e) =>
                      setEditForm((prev) => ({
                        ...prev,
                        maxCoaches: parseInt(e.target.value),
                      }))
                    }
                    className="w-full px-4 py-3 rounded-xl bg-white/10 text-white border border-white/20 
                      focus:border-white/40 focus:outline-none"
                    required
                  />
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      id="editManageCoaches"
                      checked={editForm.permissions.manageCoaches}
                      onChange={(e) =>
                        setEditForm((prev) => ({
                          ...prev,
                          permissions: {
                            ...prev.permissions,
                            manageCoaches: e.target.checked,
                          },
                        }))
                      }
                      className="rounded border-white/20"
                    />
                    <label htmlFor="editManageCoaches" className="text-white">
                      Can manage coaches
                    </label>
                  </div>

                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      id="editCreateCodes"
                      checked={editForm.permissions.createAssessmentCodes}
                      onChange={(e) =>
                        setEditForm((prev) => ({
                          ...prev,
                          permissions: {
                            ...prev.permissions,
                            createAssessmentCodes: e.target.checked,
                          },
                        }))
                      }
                      className="rounded border-white/20"
                    />
                    <label htmlFor="editCreateCodes" className="text-white">
                      Can create assessment codes
                    </label>
                  </div>
                </div>

                <div className="flex justify-end gap-4 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowEditModal(false)}
                    className="px-6 py-3 rounded-xl bg-white/10 text-white hover:bg-white/20 transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="px-6 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 
                      text-white font-medium hover:scale-105 transition-all disabled:opacity-50
                      flex items-center gap-2"
                  >
                    <Shield className="w-5 h-5" />
                    {isLoading ? "Saving..." : "Save Changes"}
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
