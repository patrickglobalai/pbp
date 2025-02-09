import { useState, useCallback } from 'react';
import { HarmonicAnswer, HarmonicScore } from '../types/harmonic';
import { harmonicQuestions } from '../data/harmonicQuestions';
import { harmonicLevels } from '../data/harmonicLevels';

export function useHarmonicQuestionnaire() {
  const [harmonicAnswers, setHarmonicAnswers] = useState<HarmonicAnswer[]>([]);
  const [harmonicScores, setHarmonicScores] = useState<HarmonicScore[]>();

  const handleHarmonicAnswer = useCallback((questionId: string, value: number) => {
    setHarmonicAnswers(prev => {
      const existing = prev.findIndex(a => a.questionId === questionId);
      if (existing !== -1) {
        const newAnswers = [...prev];
        newAnswers[existing] = { questionId, value };
        return newAnswers;
      }
      return [...prev, { questionId, value }];
    });
  }, []);

  const calculateHarmonicScores = useCallback(() => {
    const scores = harmonicLevels.map(level => {
      const levelAnswers = harmonicAnswers.filter(answer => {
        const question = harmonicQuestions.find(q => q.id === answer.questionId);
        return question?.levelId === level.id;
      });

      const raw = levelAnswers.reduce((sum, answer) => sum + answer.value, 0);
      const normalized = (raw / (3 * 7)) * 100;

      return {
        levelId: level.id,
        raw,
        normalized
      };
    });

    setHarmonicScores(scores);
  }, [harmonicAnswers]);

  return {
    harmonicAnswers,
    harmonicScores,
    handleHarmonicAnswer,
    calculateHarmonicScores
  };
}