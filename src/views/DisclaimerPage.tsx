import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowLeft, AlertTriangle } from 'lucide-react';

export function DisclaimerPage() {
  return (
    <div className="min-h-screen ai-gradient-bg py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <Link 
          to="/register" 
          className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-8 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Registration
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-effect rounded-3xl p-8 mb-8"
        >
          <div className="flex items-center gap-4 mb-8">
            <AlertTriangle className="w-12 h-12 text-white" />
            <h1 className="text-3xl font-bold text-white">
              Personality Breakthrough Profile Disclaimer & Indemnity
            </h1>
          </div>

          <div className="prose prose-invert max-w-none space-y-6">
            <h2 className="text-2xl font-bold text-white">Disclaimer</h2>
            <p className="text-white/80">
              The information provided in this Personality Breakthrough Profile is intended solely for educational and coaching purposes. It should not be construed as psychological, medical, financial, legal, or diagnostic advice. The insights and recommendations are derived from the responses provided by the individual and the methodology of the coaching inventory tool.
            </p>
            <p className="text-white/80">
              This profile is not a psychological or medical test, and the results do not diagnose, treat, or predict any mental health condition or other psychological or physical issues. Users are encouraged to seek appropriate professional advice for any such concerns.
            </p>
            <p className="text-white/80">
              The Personality Breakthrough Profile, its creators, affiliates, and practitioners do not warrant the accuracy, completeness, or applicability of the information contained in this profile. The use of this profile and any decisions made based on the information provided are at the sole discretion and risk of the recipient.
            </p>

            <h2 className="text-2xl font-bold text-white mt-12">Limitations of Use</h2>
            <p className="text-white/80">
              This profile tool and its results are not a substitute for professional advice, therapy, or diagnostic services. The findings should not be used as the sole basis for making significant decisions regarding employment, personal relationships, health, or well-being. Users are strongly encouraged to consult qualified professionals before making decisions based on the profile results.
            </p>

            <h2 className="text-2xl font-bold text-white mt-12">Liability</h2>
            <p className="text-white/80">
              The Personality Breakthrough Profile, its creators, affiliates, employees, and associated practitioners expressly disclaim any and all liability for any direct, indirect, incidental, special, consequential, or other damages arising out of or in connection with the use of this profile or the results of the profile.
            </p>
            <p className="text-white/80">
              By using this profile, the recipient agrees to indemnify, defend, and hold harmless the Personality Breakthrough Profile, its creators, affiliates, employees, practitioners, and associated parties from any claims, liabilities, losses, damages, or costs (including legal fees) arising from the use or misuse of the profile or its results.
            </p>

            <h2 className="text-2xl font-bold text-white mt-12">Privacy</h2>
            <p className="text-white/80">
              The Personality Breakthrough Profile is committed to protecting the privacy and confidentiality of all individuals. Personal data collected during the profile process will be handled in accordance with our privacy policy, which adheres to relevant data protection regulations, including the General Data Protection Regulation (GDPR) and other applicable privacy laws.
            </p>
            <p className="text-white/80">
              All data collected will be used solely for the purpose of generating this profile and delivering associated services. No personal data will be shared, sold, or disclosed to third parties without explicit consent unless required by law.
            </p>

            <h2 className="text-2xl font-bold text-white mt-12">Acceptance</h2>
            <p className="text-white/80">
              By using this profile, the recipient acknowledges and accepts the terms of this Disclaimer & Indemnity. If you do not agree to these terms, please refrain from using this profile or any associated services. Continued use of this profile constitutes full agreement to these terms.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}