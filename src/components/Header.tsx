import React from 'react';
import { Brain, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

interface Props {
  title: string;
  subtitle: string;
}

export function Header({ title, subtitle }: Props) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="text-center mb-16"
    >
      <div className="relative inline-block">
        <Brain className="w-20 h-20 text-white mb-6" />
        <Sparkles className="w-6 h-6 text-yellow-300 absolute -top-2 -right-2" />
      </div>
      <h1 className="text-5xl font-bold text-white mb-4">
        {title}
      </h1>
      <p className="text-xl text-white/80">
        {subtitle}
      </p>
    </motion.div>
  );
}