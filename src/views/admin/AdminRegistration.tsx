import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Brain, Lock, AlertCircle, Shield } from 'lucide-react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '../../lib/firebase';

export function AdminRegistration() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    fullName: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      // Create Firebase auth user
      const { user } = await createUserWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );

      // Create user document with admin role
      await setDoc(doc(db, 'users', user.uid), {
        userId: user.uid,
        email: formData.email,
        fullName: formData.fullName,
        role: 'admin',
        subscription_tier: 'admin',
        createdAt: new Date(),
        updatedAt: new Date()
      });

      // Create admin permissions
      await setDoc(doc(db, 'admins', user.uid), {
        userId: user.uid,
        permissions: {
          manageUsers: true,
          manageCoaches: true,
          managePartners: true,
          manageAssessmentCodes: true,
          viewAnalytics: true,
          manageSystem: true
        },
        createdAt: new Date(),
        updatedAt: new Date()
      });

      // Navigate to admin dashboard
      navigate('/admin');

    } catch (err: any) {
      console.error('Admin registration error:', err);
      setError(err.message || 'Failed to create admin account');
    } finally {
      setIsLoading(false);
    }
  };

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
            Create Admin Account
          </h1>
          <p className="text-white/80">
            Set up a new administrator account
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
              <label htmlFor="fullName" className="block text-white mb-2">Full Name</label>
              <input
                type="text"
                id="fullName"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl bg-white/10 text-white border border-white/20 
                  focus:border-white/40 focus:outline-none"
                required
                disabled={isLoading}
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
                className="w-full px-4 py-3 rounded-xl bg-white/10 text-white border border-white/20 
                  focus:border-white/40 focus:outline-none"
                required
                disabled={isLoading}
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
                className="w-full px-4 py-3 rounded-xl bg-white/10 text-white border border-white/20 
                  focus:border-white/40 focus:outline-none"
                required
                minLength={8}
                disabled={isLoading}
              />
            </div>

            <div className="flex justify-between items-center pt-4">
              <div className="flex items-center gap-2 text-white/60">
                <Shield className="w-4 h-4" />
                <span className="text-sm">Admin Access</span>
              </div>
              <button
                type="submit"
                disabled={isLoading}
                className="px-8 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 
                  text-white font-medium hover:scale-105 transition-all disabled:opacity-50
                  flex items-center gap-2"
              >
                <Lock className="w-5 h-5" />
                {isLoading ? 'Creating Account...' : 'Create Admin Account'}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
}