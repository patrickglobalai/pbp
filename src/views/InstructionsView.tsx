import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Brain, Clock, CheckCircle, AlertTriangle, ArrowRight } from 'lucide-react';

export function InstructionsView() {
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
            Welcome to The Personality Breakthrough Profile!
          </h1>
          <p className="text-white/80">
            Please review these important instructions before beginning
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-effect rounded-3xl p-8 mb-8"
        >
          <h2 className="text-2xl font-bold text-white mb-6">
            Before You Begin:
          </h2>
          
          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <CheckCircle className="w-6 h-6 text-emerald-400 flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-white font-medium mb-1">Answer Honestly</h3>
                <p className="text-white/80">
                  The more truthful your responses, the more accurate and insightful your results will be.
                  Respond based on how you truly operate now, not how you wish to be.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <AlertTriangle className="w-6 h-6 text-yellow-300 flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-white font-medium mb-1">Find a Quiet Space</h3>
                <p className="text-white/80">
                  Choose a calm, distraction-free environment to ensure focus.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <Brain className="w-6 h-6 text-blue-400 flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-white font-medium mb-1">Be Present</h3>
                <p className="text-white/80">
                  Approach each question mindfully and thoughtfully. Take your time, but avoid overthinking your responses.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <Clock className="w-6 h-6 text-purple-400 flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-white font-medium mb-1">Complete in One Sitting</h3>
                <p className="text-white/80">
                  The assessment takes approximately 20–40 minutes. Staying engaged throughout will enhance the experience.
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass-effect rounded-3xl p-8 mb-8"
        >
          <h2 className="text-2xl font-bold text-white mb-6">
            How It Works:
          </h2>
          <p className="text-white/80 mb-6">
            For each statement, select the response that best reflects you, from Strongly Disagree to Strongly Agree.
            Your assessment will cover various aspects of your personality and potential across multiple dimensions.
          </p>
          <div className="flex justify-center">
            <Link
              to="/assessment"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 
                text-white font-medium hover:scale-105 transition-all"
            >
              <span>Start Assessment</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}