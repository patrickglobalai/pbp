import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Brain, Lock, Shield, AlertCircle } from 'lucide-react';
import { getAuth } from 'firebase/auth';
import { initializeApp } from 'firebase/app';
import { createCoachAccount } from '../lib/auth';
import { collection, getDocs, query, where, doc, updateDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';

// Create a separate Firebase app instance for coach registration
const coachAuthApp = initializeApp({
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
}, 'coachAuth');

// Get auth instance for coach registration
const coachAuth = getAuth(coachAuthApp);

export function CoachRegistrationPage() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    fullName: '',
    assessmentCode: '',
    privacyAccepted: false,
    termsAccepted: false,
    disclaimerAccepted: false
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      setIsLoading(true);

      // Verify assessment code and get tier info
      const codesQuery = query(
        collection(db, 'assessment_codes'),
        where('code', '==', formData.assessmentCode.trim()),
        where('used', '==', false)
      );
      const codesSnapshot = await getDocs(codesQuery);
      
      if (codesSnapshot.empty) {
        throw new Error('Invalid or already used assessment code');
      }

      const codeDoc = codesSnapshot.docs[0];
      const codeData = codeDoc.data();
      const partnerId = codeData.partnerId;
      const tier = codeData.tier || 'basic';

      // Create coach account
      const coachId = await createCoachAccount(coachAuth, {
        email: formData.email,
        password: formData.password,
        fullName: formData.fullName,
        tier,
        partnerId,
        assessmentCode: formData.assessmentCode.trim()
      });

      // Mark assessment code as used
      await updateDoc(doc(db, 'assessment_codes', codeDoc.id), {
        used: true,
        usedAt: new Date(),
        usedBy: coachId
      });

      // Navigate to login
      navigate('/login');

    } catch (err: any) {
      console.error('Registration error:', err);
      setError(err.message || 'Failed to create coach account');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen ai-gradient-bg py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <Brain className="w-16 h-16 text-white mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-white mb-2">
            Coach Registration
          </h1>
          <p className="text-white/80">
            Create your coach account and start helping others discover their potential
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

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="assessmentCode" className="block text-white mb-2">Assessment Code</label>
              <input
                type="text"
                id="assessmentCode"
                name="assessmentCode"
                value={formData.assessmentCode}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 rounded-xl bg-white/10 text-white border border-white/20 
                  focus:border-white/40 focus:outline-none"
                disabled={isLoading}
                placeholder="Enter your assessment code"
              />
            </div>

            <div>
              <label htmlFor="fullName" className="block text-white mb-2">Full Name</label>
              <input
                type="text"
                id="fullName"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 rounded-xl bg-white/10 text-white border border-white/20 
                  focus:border-white/40 focus:outline-none"
                disabled={isLoading}
                placeholder="Enter your full name"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-white mb-2">Email Address</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 rounded-xl bg-white/10 text-white border border-white/20 
                  focus:border-white/40 focus:outline-none"
                disabled={isLoading}
                placeholder="Enter your email address"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-white mb-2">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                minLength={8}
                className="w-full px-4 py-3 rounded-xl bg-white/10 text-white border border-white/20 
                  focus:border-white/40 focus:outline-none"
                disabled={isLoading}
                placeholder="Choose a secure password (min. 8 characters)"
              />
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-white mb-2">Confirm Password</label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                minLength={8}
                className="w-full px-4 py-3 rounded-xl bg-white/10 text-white border border-white/20 
                  focus:border-white/40 focus:outline-none"
                disabled={isLoading}
                placeholder="Confirm your password"
              />
            </div>

            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <input
                  type="checkbox"
                  id="privacyAccepted"
                  name="privacyAccepted"
                  checked={formData.privacyAccepted}
                  onChange={handleChange}
                  required
                  className="mt-1"
                  disabled={isLoading}
                />
                <label htmlFor="privacyAccepted" className="text-white/80 text-sm">
                  I have read and agree to the <a href="/privacy" className="text-blue-400 hover:text-blue-300">Privacy Policy</a>
                </label>
              </div>

              <div className="flex items-start gap-3">
                <input
                  type="checkbox"
                  id="termsAccepted"
                  name="termsAccepted"
                  checked={formData.termsAccepted}
                  onChange={handleChange}
                  required
                  className="mt-1"
                  disabled={isLoading}
                />
                <label htmlFor="termsAccepted" className="text-white/80 text-sm">
                  I accept the <a href="/terms" className="text-blue-400 hover:text-blue-300">Terms of Service</a>
                </label>
              </div>

              <div className="flex items-start gap-3">
                <input
                  type="checkbox"
                  id="disclaimerAccepted"
                  name="disclaimerAccepted"
                  checked={formData.disclaimerAccepted}
                  onChange={handleChange}
                  required
                  className="mt-1"
                  disabled={isLoading}
                />
                <label htmlFor="disclaimerAccepted" className="text-white/80 text-sm">
                  I acknowledge and accept the <a href="/disclaimer" className="text-blue-400 hover:text-blue-300">Coach Agreement & Disclaimer</a>
                </label>
              </div>
            </div>

            <div className="flex items-center justify-between pt-4">
              <div className="flex items-center gap-2 text-white/60">
                <Shield className="w-4 h-4" />
                <span className="text-sm">Secure Registration</span>
              </div>
              <button
                type="submit"
                disabled={isLoading}
                className="px-8 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 
                  text-white font-medium hover:scale-105 transition-all disabled:opacity-50"
              >
                {isLoading ? 'Creating Account...' : 'Create Account'}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
}