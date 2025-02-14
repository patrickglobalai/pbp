import {
  onAuthStateChanged,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { motion } from "framer-motion";
import { AlertCircle, Brain, Lock, Mail } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserAgreementsModal } from "../components/UserAgreementsModal";
import { useAuth } from "../contexts/AuthContext";
import { checkUserAgreements, checkUserRole } from "../lib/auth";
import { auth } from "../lib/firebase";

export function LoginPage() {
  const navigate = useNavigate();
  const { checkAgreements, saveAgreements } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [resetSuccess, setResetSuccess] = useState(false);
  const [showAgreements, setShowAgreements] = useState(false);
  const [hasUserInput, setHasUserInput] = useState(false);
  const [credentials, setCredentials] = useState({
    email: "",
    password: "",
  });

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setHasUserInput(true);
    setIsLoading(true);

    try {
      // Sign in with Firebase Auth
      const { user } = await signInWithEmailAndPassword(
        auth,
        credentials.email,
        credentials.password
      );

      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Check user role
      const role = await checkUserRole(user.uid);
      if (!role) {
        await auth.signOut();
        throw new Error("User role not found");
      }
    } catch (err: any) {
      console.error("Login error:", err);

      if (err.code === "auth/invalid-credential") {
        setError("Invalid email or password");
      } else if (err.code === "auth/user-not-found") {
        setError("No account found with this email");
      } else if (err.code === "auth/wrong-password") {
        setError("Incorrect password");
      } else {
        setError(err.message || "Failed to log in");
      }

      // Sign out if there was an error
      await auth.signOut();
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);
    setResetSuccess(false);

    try {
      await sendPasswordResetEmail(auth, resetEmail);
      setResetSuccess(true);
    } catch (err: any) {
      console.error("Password reset error:", err);
      if (err.code === "auth/user-not-found") {
        setError("No account found with this email");
      } else {
        setError("Failed to send password reset email");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleAgreementsSubmit = async (agreements: {
    privacyAccepted: boolean;
    termsAccepted: boolean;
    disclaimerAccepted: boolean;
    gdprAccepted: boolean;
  }) => {
    try {
      await saveAgreements(agreements);

      // Get user role again and redirect
      if (auth.currentUser) {
        const role = await checkUserRole(auth.currentUser.uid);
        switch (role) {
          case "admin":
            navigate("/admin");
            break;
          case "partner":
            navigate("/partner");
            break;
          case "coach":
            navigate("/coach");
            break;
          case "respondent":
            navigate("/dashboard");
            break;
        }
      }
    } catch (err) {
      console.error("Error saving agreements:", err);
      throw err;
    }
  };

  const handleUserLoggedIn = async (uid: string) => {
    try {
      setIsLoading(true);

      // Check user agreements
      const hasAgreements = await checkUserAgreements(uid);
      if (!hasAgreements) {
        setShowAgreements(true);
        return;
      }
      // 1 SECOND DELAY
      await new Promise((resolve) => setTimeout(resolve, 1000));
      const role = await checkUserRole(uid);
      switch (role) {
        case "admin":
          navigate("/admin");
          break;
        case "partner":
          navigate("/partner");
          break;
        case "coach":
          navigate("/coach");
          break;
        case "respondent":
          navigate("/dashboard");
          break;
      }
    } catch (err) {
      console.error("Error handling user logged in:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user?.uid && hasUserInput) {
        if (credentials.email === "" && credentials.password === "") {
          await auth.signOut();
        }
        handleUserLoggedIn(user?.uid);
      }
    });

    return () => unsubscribe();
  }, [hasUserInput]);

  return (
    <div className="min-h-screen ai-gradient-bg py-12 px-4">
      <div className="max-w-md mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <Brain className="w-16 h-16 text-white mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-white mb-2">
            {showForgotPassword ? "Reset Password" : "Sign In"}
          </h1>
          <p className="text-white/80">
            {showForgotPassword
              ? "Enter your email to receive reset instructions"
              : "Access your dashboard"}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-effect rounded-3xl p-8"
        >
          {error && (
            <div className="flex items-center gap-2 bg-red-500/10 text-red-400 p-4 rounded-xl mb-6">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <p>{error}</p>
            </div>
          )}

          {resetSuccess && (
            <div className="flex items-center gap-2 bg-emerald-500/10 text-emerald-400 p-4 rounded-xl mb-6">
              <Mail className="w-5 h-5 flex-shrink-0" />
              <p>Password reset email sent! Check your inbox.</p>
            </div>
          )}

          {showForgotPassword ? (
            <form onSubmit={handleForgotPassword} className="space-y-6">
              <div>
                <label htmlFor="resetEmail" className="block text-white mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  id="resetEmail"
                  value={resetEmail}
                  onChange={(e) => setResetEmail(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-white/10 text-white border border-white/20 
                    focus:border-white/40 focus:outline-none"
                  required
                  disabled={isLoading}
                  placeholder="Enter your email address"
                />
              </div>

              <div className="flex justify-between items-center pt-4">
                <button
                  type="button"
                  onClick={() => setShowForgotPassword(false)}
                  className="text-white/80 hover:text-white transition-colors"
                >
                  Back to Login
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="px-8 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 
                    text-white font-medium hover:scale-105 transition-all disabled:opacity-50
                    flex items-center gap-2"
                >
                  <Mail className="w-5 h-5" />
                  {isLoading ? "Sending..." : "Send Reset Link"}
                </button>
              </div>
            </form>
          ) : (
            <form onSubmit={handleLogin} className="space-y-6">
              <div>
                <label htmlFor="email" className="block text-white mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  value={credentials.email}
                  onChange={(e) =>
                    setCredentials((prev) => ({
                      ...prev,
                      email: e.target.value,
                    }))
                  }
                  className="w-full px-4 py-3 rounded-xl bg-white/10 text-white border border-white/20 
                    focus:border-white/40 focus:outline-none"
                  required
                  disabled={isLoading}
                  placeholder="Enter your email address"
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-white mb-2">
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  value={credentials.password}
                  onChange={(e) =>
                    setCredentials((prev) => ({
                      ...prev,
                      password: e.target.value,
                    }))
                  }
                  className="w-full px-4 py-3 rounded-xl bg-white/10 text-white border border-white/20 
                    focus:border-white/40 focus:outline-none"
                  required
                  disabled={isLoading}
                  placeholder="Enter your password"
                />
              </div>

              <div className="flex justify-between items-center pt-4">
                <button
                  type="button"
                  onClick={() => setShowForgotPassword(true)}
                  className="text-white/80 hover:text-white transition-colors"
                >
                  Forgot Password?
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="px-8 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 
                    text-white font-medium hover:scale-105 transition-all disabled:opacity-50
                    flex items-center gap-2"
                >
                  <Lock className="w-5 h-5" />
                  {isLoading ? "Signing in..." : "Sign In"}
                </button>
              </div>
            </form>
          )}
        </motion.div>
      </div>

      <UserAgreementsModal
        isOpen={showAgreements}
        onClose={() => setShowAgreements(false)}
        onSubmit={handleAgreementsSubmit}
      />
    </div>
  );
}
