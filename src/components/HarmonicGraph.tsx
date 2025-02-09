import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { HarmonicScore } from '../types/harmonic';
import { harmonicLevels } from '../data/harmonicLevels';

interface Props {
  scores: HarmonicScore[];
  compact?: boolean;
}

export function HarmonicGraph({ scores, compact = false }: Props) {
  const navigate = useNavigate();
  
  const orderedScores = [...harmonicLevels]
    .reverse()
    .map(level => {
      return scores.find(score => score.levelId === level.id)!;
    });

  return (
    <div className="space-y-2">
      {orderedScores.map((score, index) => {
        const level = harmonicLevels.find(l => l.id === score.levelId)!;
        return (
          <motion.div
            key={level.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="relative group"
          >
            <div className="flex items-center gap-1">
              <div className={`${compact ? 'w-24' : 'w-32'} text-right`}>
                <div className={`font-medium text-white ${compact ? 'text-sm' : ''}`}>
                  {level.name}
                </div>
                {!compact && (
                  <div className="text-xs text-white/60">
                    Level {level.id}
                  </div>
                )}
              </div>
              
              <div className={`flex-1 ${compact ? 'h-4' : 'h-6'} glass-effect rounded-xl overflow-hidden`}>
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${score.normalized}%` }}
                  transition={{ duration: 1, delay: index * 0.1 }}
                  className="h-full"
                  style={{ background: level.color }}
                />
              </div>
              
              <div className={`${compact ? 'w-12 text-lg' : 'w-12 text-xl'} font-bold text-white text-right`}>
                {Math.round(score.normalized)}
              </div>
            </div>
            
            {!compact && (
              <div className="opacity-0 group-hover:opacity-100 absolute left-1/2 -translate-x-1/2 top-full mt-2 
                            glass-effect rounded-lg p-4 text-white text-sm transition-all duration-300 z-10 w-64">
                {level.description}
              </div>
            )}
          </motion.div>
        );
      })}
    </div>
  );
}