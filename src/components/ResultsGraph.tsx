import React from 'react';
import { motion } from 'framer-motion';
import { Score, Characteristic } from '../types';
import { characteristics } from '../data/characteristics';

const categoryGradients = {
  being: 'from-blue-500 to-blue-600',
  doing: 'from-orange-500 to-orange-600',
  having: 'from-emerald-500 to-emerald-600',
};

interface Props {
  scores: Score[];
  compact?: boolean;
}

export function ResultsGraph({ scores, compact = false }: Props) {
  const orderedScores = characteristics.map(characteristic => {
    return scores.find(score => score.characteristicId === characteristic.id)!;
  });

  return (
    <div className="space-y-2">
      {orderedScores.map((score, index) => {
        const characteristic = characteristics[index];
        return (
          <motion.div
            key={characteristic.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="relative group"
          >
            <div className="flex items-center gap-1">
              <div className={`${compact ? 'w-24' : 'w-32'} text-right`}>
                <div className={`font-medium text-white ${compact ? 'text-sm' : ''}`}>
                  {characteristic.name}
                </div>
                {!compact && (
                  <div className="text-xs text-white/60">
                    {characteristic.category.charAt(0).toUpperCase() + 
                     characteristic.category.slice(1)}
                  </div>
                )}
              </div>
              
              <div className={`flex-1 ${compact ? 'h-4' : 'h-6'} glass-effect rounded-xl overflow-hidden`}>
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${score.normalized}%` }}
                  transition={{ duration: 1, delay: index * 0.1 }}
                  className={`h-full bg-gradient-to-r ${
                    categoryGradients[characteristic.category]
                  }`}
                />
              </div>
              
              <div className={`${compact ? 'w-12 text-lg' : 'w-12 text-xl'} font-bold text-white text-right`}>
                {Math.round(score.normalized)}
              </div>
            </div>
            
            {!compact && (
              <div className="opacity-0 group-hover:opacity-100 absolute left-1/2 -translate-x-1/2 top-full mt-2 
                            glass-effect rounded-lg p-4 text-white text-sm transition-all duration-300 z-10 w-64">
                {characteristic.description}
              </div>
            )}
          </motion.div>
        );
      })}
      
      {!compact && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="mt-12 flex justify-center gap-12"
        >
          {Object.entries(categoryGradients).map(([category, gradient]) => (
            <div key={category} className="flex items-center gap-3">
              <div className={`w-6 h-6 rounded-lg bg-gradient-to-r ${gradient}`} />
              <div className="text-white capitalize">{category}</div>
            </div>
          ))}
        </motion.div>
      )}
    </div>
  );
}