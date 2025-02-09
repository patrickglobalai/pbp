import React, { createContext, useContext, useState } from 'react';
import type { Score } from '../types';
import type { HarmonicScore } from '../types/harmonic';
import { characteristics } from '../data/characteristics';
import { harmonicLevels } from '../data/harmonicLevels';

interface AssessmentContextType {
  scores: Score[] | undefined;
  setScores: (scores: Score[]) => void;
  harmonicScores: HarmonicScore[] | undefined;
  setHarmonicScores: (scores: HarmonicScore[]) => void;
  formatDataForAI: (prompt: string) => string;
}

const AssessmentContext = createContext<AssessmentContextType | undefined>(undefined);

export function AssessmentProvider({ children }: { children: React.ReactNode }) {
  const [scores, setScores] = useState<Score[]>();
  const [harmonicScores, setHarmonicScores] = useState<HarmonicScore[]>();

  const formatDataForAI = (prompt: string) => {
    if (!scores || !harmonicScores) {
      return prompt;
    }

    // Format characteristic scores
    const characteristicDetails = scores.map(score => {
      const characteristic = characteristics.find(c => c.id === score.characteristicId);
      return `${characteristic?.name}: ${Math.round(score.normalized)}%`;
    }).join('\n');

    // Get dominant harmonic level
    const dominantHarmonic = harmonicScores.reduce((prev, current) => 
      current.normalized > prev.normalized ? current : prev
    );
    const dominantLevel = harmonicLevels.find(level => level.id === dominantHarmonic.levelId);

    // Format all harmonic scores
    const harmonicDetails = harmonicScores
      .sort((a, b) => b.normalized - a.normalized)
      .map(score => {
        const level = harmonicLevels.find(l => l.id === score.levelId);
        return `${level?.name}: ${Math.round(score.normalized)}%`;
      }).join('\n');

    return `
Assessment Results:

Characteristics:
${characteristicDetails}

Harmonic Scale:
Dominant Level: ${dominantLevel?.name} (${Math.round(dominantHarmonic.normalized)}%)

Detailed Harmonic Levels:
${harmonicDetails}

Based on these results, ${prompt}
`;
  };

  return (
    <AssessmentContext.Provider value={{
      scores,
      setScores,
      harmonicScores,
      setHarmonicScores,
      formatDataForAI
    }}>
      {children}
    </AssessmentContext.Provider>
  );
}

export function useAssessment() {
  const context = useContext(AssessmentContext);
  if (context === undefined) {
    throw new Error('useAssessment must be used within an AssessmentProvider');
  }
  return context;
}