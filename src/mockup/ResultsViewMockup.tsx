import React from 'react';
import { Header } from '../components/Header';
import { ResultsGraph } from '../components/ResultsGraph';
import { HarmonicGraph } from '../components/HarmonicGraph';

// Sample mock data
const mockScores = [
  { characteristicId: 'ambition', raw: 65, normalized: 85 },
  { characteristicId: 'boldness', raw: 58, normalized: 78 },
  { characteristicId: 'positiveOutlook', raw: 70, normalized: 92 },
  { characteristicId: 'integrity', raw: 62, normalized: 82 },
  { characteristicId: 'wisdom', raw: 55, normalized: 75 },
  { characteristicId: 'passion', raw: 68, normalized: 89 },
  { characteristicId: 'communication', raw: 59, normalized: 79 },
  { characteristicId: 'sociability', raw: 52, normalized: 72 },
  { characteristicId: 'learning', raw: 63, normalized: 83 },
  { characteristicId: 'creativity', raw: 66, normalized: 86 },
  { characteristicId: 'flexibility', raw: 57, normalized: 77 },
  { characteristicId: 'visionaryThinking', raw: 64, normalized: 84 }
];

const mockHarmonicScores = [
  { levelId: 1, raw: 10, normalized: 20 },
  { levelId: 2, raw: 12, normalized: 25 },
  { levelId: 3, raw: 15, normalized: 30 },
  { levelId: 4, raw: 18, normalized: 35 },
  { levelId: 5, raw: 20, normalized: 40 },
  { levelId: 6, raw: 25, normalized: 50 },
  { levelId: 7, raw: 35, normalized: 70 },
  { levelId: 8, raw: 40, normalized: 85 },
  { levelId: 9, raw: 38, normalized: 80 },
  { levelId: 10, raw: 32, normalized: 65 },
  { levelId: 11, raw: 28, normalized: 55 },
  { levelId: 12, raw: 22, normalized: 45 }
];

export function ResultsViewMockup() {
  return (
    <div className="min-h-screen ai-gradient-bg py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <Header
          title="Your NLP Potential Assessment Results"
          subtitle="Sample Visualization of Your Characteristics"
        />

        <div className="glass-effect rounded-3xl p-8 mb-8">
          <h2 className="text-2xl font-bold text-white mb-8">
            Characteristic Profile
          </h2>
          <ResultsGraph scores={mockScores} />
        </div>

        <div className="glass-effect rounded-3xl p-8">
          <h2 className="text-2xl font-bold text-white mb-8 text-center">
            Your Harmonic Scale Profile
          </h2>
          <HarmonicGraph scores={mockHarmonicScores} />
        </div>
      </div>
    </div>
  );
}