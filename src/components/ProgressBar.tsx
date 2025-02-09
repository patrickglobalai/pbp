import React from 'react';
import { motion } from 'framer-motion';

interface Props {
  current: number;
  total: number;
}

export function ProgressBar({ current, total }: Props) {
  const percentage = (current / total) * 100;

  return (
    <div className="relative w-full">
      <div className="glass-effect rounded-full h-3 overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.5 }}
          className="h-full bg-gradient-to-r from-blue-400 via-indigo-500 to-purple-500"
        />
      </div>
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 text-sm text-white/80"
      >
        Question {current} of {total}
      </motion.div>
    </div>
  );
}