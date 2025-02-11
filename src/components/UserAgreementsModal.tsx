import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { AlertCircle, Shield } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (agreements: {
    privacyAccepted: boolean;
    termsAccepted: boolean;
    disclaimerAccepted: boolean;
    gdprAccepted: boolean;
  }) => Promise<void>;
}

export function UserAgreementsModal({ isOpen, onClose, onSubmit }: Props) {
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [agreements, setAgreements] = useState({
    privacyAccepted: false,
    termsAccepted: false,
    disclaimerAccepted: false,
    gdprAccepted: false
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!Object.values(agreements).every(Boolean)) {
      setError('Please accept all agreements to continue');
      return;
    }

    try {
      setIsLoading(true);
      await onSubmit(agreements);
      onClose();
    } catch (err: any) {
      console.error('Error saving agreements:', err);
      setError(err.message || 'Failed to save agreements');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass-effect rounded-3xl p-8 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto"
      >
        <div className="flex items-center gap-4 mb-6">
          <Shield className="w-8 h-8 text-white" />
          <h2 className="text-2xl font-bold text-white">User Agreements</h2>
        </div>

        {error && (
          <div className="flex items-center gap-2 bg-red-500/10 text-red-400 p-4 rounded-xl mb-6">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <p>{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <input
                type="checkbox"
                id="privacyAccepted"
                checked={agreements.privacyAccepted}
                onChange={(e) => setAgreements(prev => ({
                  ...prev,
                  privacyAccepted: e.target.checked
                }))}
                className="mt-1"
              />
              <label htmlFor="privacyAccepted" className="text-white/80 text-sm">
                I have read and agree to the <a href="/privacy" target="_blank" className="text-blue-400 hover:text-blue-300">Privacy Policy</a>
              </label>
            </div>

            <div className="flex items-start gap-3">
              <input
                type="checkbox"
                id="termsAccepted"
                checked={agreements.termsAccepted}
                onChange={(e) => setAgreements(prev => ({
                  ...prev,
                  termsAccepted: e.target.checked
                }))}
                className="mt-1"
              />
              <label htmlFor="termsAccepted" className="text-white/80 text-sm">
                I accept the <a href="/terms" target="_blank" className="text-blue-400 hover:text-blue-300">Terms of Service</a>
              </label>
            </div>

            <div className="flex items-start gap-3">
              <input
                type="checkbox"
                id="disclaimerAccepted"
                checked={agreements.disclaimerAccepted}
                onChange={(e) => setAgreements(prev => ({
                  ...prev,
                  disclaimerAccepted: e.target.checked
                }))}
                className="mt-1"
              />
              <label htmlFor="disclaimerAccepted" className="text-white/80 text-sm">
                I acknowledge the <a href="/disclaimer" target="_blank" className="text-blue-400 hover:text-blue-300">Disclaimer & Indemnity</a>
              </label>
            </div>

            <div className="flex items-start gap-3">
              <input
                type="checkbox"
                id="gdprAccepted"
                checked={agreements.gdprAccepted}
                onChange={(e) => setAgreements(prev => ({
                  ...prev,
                  gdprAccepted: e.target.checked
                }))}
                className="mt-1"
              />
              <label htmlFor="gdprAccepted" className="text-white/80 text-sm">
                I understand and accept how my personal data will be processed according to the <a href="/privacy" target="_blank" className="text-blue-400 hover:text-blue-300">GDPR Policy</a>
              </label>
            </div>
          </div>

          <div className="flex justify-end gap-4 pt-4">
            <button
              type="submit"
              disabled={isLoading}
              className="px-8 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 
                text-white font-medium hover:scale-105 transition-all disabled:opacity-50"
            >
              {isLoading ? 'Saving...' : 'Accept & Continue'}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}