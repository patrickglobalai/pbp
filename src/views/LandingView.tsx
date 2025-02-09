import React from 'react';
import { motion } from 'framer-motion';
import { Header } from '../components/Header';
import { ArrowRight } from 'lucide-react';

interface Props {
  onStart: () => void;
}

export function LandingView({ onStart }: Props) {
  return (
    <div className="min-h-screen ai-gradient-bg py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <Header
          title="Welcome to NLP Potential Scale"
          subtitle="Discover your unique characteristics and potential"
        />
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="glass-effect rounded-3xl p-8 text-center"
        >
          <p className="text-white/90 text-lg mb-8 leading-relaxed">
            This assessment will help you understand your patterns across three key dimensions:
            <br />
            <span className="font-semibold">Being</span> - Your core characteristics and values
            <br />
            <span className="font-semibold">Doing</span> - Your actions and behaviors
            <br />
            <span className="font-semibold">Having</span> - Your achievements and capabilities
          </p>
          
          <div className="space-y-4 text-white/80 mb-8">
            <p>• The assessment takes approximately 15-20 minutes to complete</p>
            <p>• You'll answer questions about different aspects of your personality</p>
            <p>• Your results will be available immediately after completion</p>
          </div>

          <button
            onClick={onStart}
            className="px-8 py-4 rounded-xl text-white font-medium 
              bg-gradient-to-r from-blue-500 to-indigo-600 
              hover:scale-105 transition-all
              inline-flex items-center gap-2"
          >
            Start Assessment
            <ArrowRight className="w-5 h-5" />
          </button>
        </motion.div>
      </div>
    </div>
  );
}