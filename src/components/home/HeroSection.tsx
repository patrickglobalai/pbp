import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Brain } from 'lucide-react';
import { AnimatedBackground } from './AnimatedBackground';

export function HeroSection() {
  return (
    <div className="relative min-h-screen flex items-center justify-center py-20 px-4 overflow-hidden">
      <AnimatedBackground />
      
      <div className="relative z-10 max-w-4xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Brain className="w-16 h-16 text-white mx-auto mb-6" />
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-2 whitespace-nowrap">
            Discover your true potential.
          </h1>
          <h2 className="text-3xl md:text-5xl font-bold text-white/90 mb-8">
            Personality Breakthrough Profile
          </h2>
          <p className="text-xl text-white/80 mb-8 leading-relaxed max-w-3xl mx-auto">
            Unlock a deeper understanding of yourself and take control of your personal and professional growth. 
            Our breakthrough assessment is designed for life coaches, personal development seekers, 
            and anyone striving for excellence.
          </p>
          <div className="flex gap-4 justify-center">
            <Link 
              to="/register"
              className="relative px-8 py-4 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-medium 
                hover:scale-105 transition-all overflow-hidden group"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 opacity-0 
                group-hover:opacity-100 transition-opacity" />
              <span className="relative z-10">Start Your Assessment</span>
            </Link>
            <a 
              href="#foundations"
              className="px-8 py-4 rounded-xl bg-white/10 text-white font-medium hover:bg-white/20 transition-all
                backdrop-blur-sm"
            >
              Learn More
            </a>
          </div>
        </motion.div>
      </div>
    </div>
  );
}