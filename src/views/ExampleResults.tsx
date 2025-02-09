import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { ResultsGraph } from '../components/ResultsGraph';
import { HarmonicGraph } from '../components/HarmonicGraph';
import { Header } from '../components/Header';

// Example data for demonstration with correct order
const exampleScores = [
  // Being
  { characteristicId: 'ambition', raw: 72, normalized: 95 },
  { characteristicId: 'boldness', raw: 65, normalized: 88 },
  { characteristicId: 'integrity', raw: 68, normalized: 90 },
  { characteristicId: 'positiveOutlook', raw: 70, normalized: 92 },
  // Doing
  { characteristicId: 'passion', raw: 69, normalized: 91 }, // Dynamic Energy
  { characteristicId: 'sociability', raw: 62, normalized: 84 },
  { characteristicId: 'communication', raw: 64, normalized: 86 },
  { characteristicId: 'wisdom', raw: 63, normalized: 85 }, // Judgment
  // Having
  { characteristicId: 'learning', raw: 67, normalized: 89 },
  { characteristicId: 'creativity', raw: 71, normalized: 93 },
  { characteristicId: 'flexibility', raw: 66, normalized: 87 }, // Adaptability
  { characteristicId: 'visionaryThinking', raw: 69, normalized: 91 }
];

const exampleHarmonicScores = [
  { levelId: 1, raw: 5, normalized: 10 },
  { levelId: 2, raw: 8, normalized: 15 },
  { levelId: 3, raw: 10, normalized: 20 },
  { levelId: 4, raw: 15, normalized: 25 },
  { levelId: 5, raw: 18, normalized: 30 },
  { levelId: 6, raw: 25, normalized: 45 },
  { levelId: 7, raw: 40, normalized: 75 },
  { levelId: 8, raw: 45, normalized: 90 },
  { levelId: 9, raw: 42, normalized: 85 },
  { levelId: 10, raw: 38, normalized: 70 },
  { levelId: 11, raw: 30, normalized: 60 },
  { levelId: 12, raw: 28, normalized: 55 }
];

export function ExampleResults() {
  return (
    <div className="min-h-screen ai-gradient-bg py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <Link 
          to="/" 
          className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-8 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Home
        </Link>

        <Header
          title="Example Assessment Results"
          subtitle="This is a demonstration of what your results could look like"
        />

        <div className="glass-effect rounded-3xl p-8 mb-8">
          <h2 className="text-2xl font-bold text-white mb-8">
            Sample Characteristic Profile
          </h2>
          <ResultsGraph scores={exampleScores} />
        </div>

        <div className="glass-effect rounded-3xl p-8">
          <h2 className="text-2xl font-bold text-white mb-8 text-center">
            Sample Harmonic Scale Profile
          </h2>
          <HarmonicGraph scores={exampleHarmonicScores} />
        </div>

        <div className="glass-effect rounded-3xl p-8 mt-8 text-center">
          <h2 className="text-2xl font-bold text-white mb-4">
            Ready to Discover Your Profile?
          </h2>
          <p className="text-white/80 mb-6">
            Take the assessment to get your personalized results and insights.
          </p>
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-xl text-white font-medium 
              bg-gradient-to-r from-blue-500 to-indigo-600 
              hover:scale-105 transition-all"
          >
            Start Your Assessment
          </Link>
        </div>
      </div>
    </div>
  );
}