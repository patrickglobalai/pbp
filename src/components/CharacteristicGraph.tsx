import React from 'react';
import { motion } from 'framer-motion';
import { Score, Characteristic } from '../types';
import { characteristics } from '../data/characteristics';

interface Props {
  score: Score;
}

export function CharacteristicGraph({ score }: Props) {
  const characteristic = characteristics.find(
    c => c.id === score.characteristicId
  )!;

  const categoryColors = {
    being: ['from-blue-500', 'to-blue-600'],
    doing: ['from-orange-500', 'to-orange-600'],
    having: ['from-emerald-500', 'to-emerald-600']
  };

  const [fromColor, toColor] = categoryColors[characteristic.category];

  return (
    <div className="glass-effect rounded-3xl p-8">
      <div className="mb-8">
        <h3 className="text-3xl font-bold text-white mb-2">
          {characteristic.name}
        </h3>
        <p className="text-white/80">
          {characteristic.description}
        </p>
      </div>

      <div className="relative h-24">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${score.normalized}%` }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          className={`h-full rounded-xl bg-gradient-to-r ${fromColor} ${toColor}`}
        />
        <div className="absolute top-1/2 right-4 -translate-y-1/2 text-4xl font-bold text-white">
          {Math.round(score.normalized)}
        </div>
      </div>
    </div>
  );
}