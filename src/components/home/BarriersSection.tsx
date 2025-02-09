import React from 'react';
import { motion } from 'framer-motion';
import { Unlock, Target } from 'lucide-react';

export function BarriersSection() {
  return (
    <section id="barriers" className="py-20 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold text-white mb-6">
              Reveal the Root Cause of Barriers
            </h2>
            <p className="text-white/80 text-lg mb-8">
              The NLP Potential Assessment delves deep to uncover the precise blocks holding you 
              or your clients back from achieving their goals. By identifying these barriers, 
              the assessment provides clarity on the true causes of present-time conditions, 
              paving the way for effective solutions.
            </p>
            
            <div className="space-y-6">
              <div className="glass-effect rounded-xl p-6">
                <h3 className="text-xl font-semibold text-white mb-2 flex items-center gap-2">
                  <Target className="w-6 h-6 text-blue-400" />
                  For Personal Development Seekers
                </h3>
                <p className="text-white/70">
                  Understand the underlying issues driving your challenges and receive 
                  actionable steps to overcome them.
                </p>
              </div>
              
              <div className="glass-effect rounded-xl p-6">
                <h3 className="text-xl font-semibold text-white mb-2 flex items-center gap-2">
                  <Unlock className="w-6 h-6 text-blue-400" />
                  For Coaches and Practitioners
                </h3>
                <p className="text-white/70">
                  Use the assessment as a diagnostic tool to guide your clients toward 
                  eliminating their presenting problems and achieving breakthroughs.
                </p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="glass-effect rounded-3xl p-8"
          >
            <h3 className="text-2xl font-bold text-white mb-6">
              What Makes The NLP Potential Assessment Unique?
            </h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-4">
                <div className="w-2 h-2 rounded-full bg-blue-400 mt-2" />
                <div>
                  <h4 className="text-white font-medium mb-1">
                    Integration of Traits and Emotions
                  </h4>
                  <p className="text-white/70">
                    Understand how emotional states influence your ability to take bold actions 
                    or build relationships.
                  </p>
                </div>
              </li>
              <li className="flex items-start gap-4">
                <div className="w-2 h-2 rounded-full bg-blue-400 mt-2" />
                <div>
                  <h4 className="text-white font-medium mb-1">
                    Dynamic Feedback
                  </h4>
                  <p className="text-white/70">
                    Get real-time insights that evolve with you.
                  </p>
                </div>
              </li>
              <li className="flex items-start gap-4">
                <div className="w-2 h-2 rounded-full bg-blue-400 mt-2" />
                <div>
                  <h4 className="text-white font-medium mb-1">
                    Customizable Reports
                  </h4>
                  <p className="text-white/70">
                    Tailor your experience to personal or professional contexts.
                  </p>
                </div>
              </li>
            </ul>
          </motion.div>
        </div>
      </div>
    </section>
  );
}