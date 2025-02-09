import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Brain, Lock, Shield, AlertCircle } from 'lucide-react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc, collection } from 'firebase/firestore';
import { auth, db } from '../lib/firebase';
import { verifyAssessmentCode } from '../lib/assessment-codes';

export function RegistrationPage() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    fullName: '',
    assessmentCode: '',
    privacyAccepted: false,
    termsAccepted: false,
    disclaimerAccepted: false,
    gdprAccepted: false,
    marketingAccepted: false
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
    setIsLoading(true);

    try {
      // First validate the assessment code
      const { isValid, coachId } = await verifyAssessmentCode(formData.assessmentCode.trim());
      if (!isValid || !coachId) {
        throw new Error('Invalid assessment code. Please check and try again.');
      }

      // Create the user account in Firebase Auth
      const { user } = await createUserWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );

      // Create user document
      await setDoc(doc(db, 'users', user.uid), {
        userId: user.uid,
        email: formData.email,
        fullName: formData.fullName,
        role: 'respondent',
        marketingAccepted: formData.marketingAccepted,
        createdAt: new Date(),
        updatedAt: new Date()
      });

      // Create user agreements document
      await setDoc(doc(db, 'user_agreements', user.uid), {
        userId: user.uid,
        privacyAccepted: formData.privacyAccepted,
        termsAccepted: formData.termsAccepted,
        disclaimerAccepted: formData.disclaimerAccepted,
        gdprAccepted: formData.gdprAccepted,
        acceptedAt: new Date()
      });

      // Create respondent record with coach association
      await setDoc(doc(collection(db, 'respondents')), {
        userId: user.uid,
        coachId: coachId,
        assessmentCode: formData.assessmentCode.trim(),
        createdAt: new Date()
      });

      // Navigate to instructions
      navigate('/instructions');

    } catch (err: any) {
      console.error('Registration error:', err);
      setError(err.message || 'An error occurred during registration');
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
          <div className="relative inline-block">
            <Brain className="w-16 h-16 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">
            Register for the Assessment
          </h1>
          <p className="text-white/80">
            Create your account and discover yourself!
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
                  I have read and agree to the <a href="/privacy" className="text-blue-400 hover:text-blue-300">Privacy Policy</a> and <a href="/privacy" className="text-blue-400 hover:text-blue-300">GDPR</a> and understand how my personal data will be processed.
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
                  I accept the <a href="/terms" className="text-blue-400 hover:text-blue-300">Terms of Service</a> and agree to be bound by its conditions.
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
                  I acknowledge the <a href="/disclaimer" className="text-blue-400 hover:text-blue-300">Disclaimer & Indemnity</a> and understand the assessment's scope and limitations.
                </label>
              </div>

              <div className="flex items-start gap-3">
                <input
                  type="checkbox"
                  id="gdprAccepted"
                  name="gdprAccepted"
                  checked={formData.gdprAccepted}
                  onChange={handleChange}
                  required
                  className="mt-1"
                  disabled={isLoading}
                />
                <label htmlFor="gdprAccepted" className="text-white/80 text-sm">
                  By proceeding, I acknowledge that the Personality Breakthrough Profile is a coaching and personal development tool intended solely for informational and educational purposes. It is not a psychological, medical, or diagnostic test, and its results do not diagnose, treat, or predict any psychological, medical, or health conditions. I understand that the results are based on my responses and the profile's methodology and may not guarantee accuracy, completeness, or applicability. I agree to use the results at my sole discretion and assume full responsibility for any decisions made. I hereby release, indemnify, and hold harmless the creators, affiliates, independent practitioners, and any associated parties of the Personality Breakthrough Profile from all claims, liabilities, damages, or losses, including direct, indirect, or consequential damages, arising out of or related to my use of this profile and its results.
                </label>
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
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
}