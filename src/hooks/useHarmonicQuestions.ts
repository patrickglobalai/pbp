import { useState, useCallback } from 'react';
import { HarmonicAnswer, HarmonicScore } from '../types/harmonic';
import { harmonicQuestions } from '../data/harmonicQuestions';
import { harmonicLevels } from '../data/harmonicLevels';

const QUESTIONS_PER_PAGE = 3;

export function useHarmonicQuestions() {
  const [answers, setAnswers] = useState<HarmonicAnswer[]>([]);

  const getCurrentQuestions = useCallback((page: number) => {
    const startIndex = page * QUESTIONS_PER_PAGE;
    const endIndex = startIndex + QUESTIONS_PER_PAGE;
    return harmonicQuestions.slice(startIndex, endIndex);
  }, []);

  const handleAnswer = useCallback((questionId: string, value: number) => {
    console.log(`[Harmonic Answer] Question ID: ${questionId}, Value: ${value}`);
    setAnswers(prev => {
      const newAnswers = [...prev];
      const existingIndex = newAnswers.findIndex(a => a.questionId === questionId);
      
      if (existingIndex !== -1) {
        newAnswers[existingIndex] = { questionId, value };
      } else {
        newAnswers.push({ questionId, value });
      }
      
      return newAnswers;
    });
  }, []);

  const calculateScores = useCallback((): HarmonicScore[] => {
    return harmonicLevels.map(level => {
      const levelAnswers = answers.filter(answer => {
        const question = harmonicQuestions.find(q => q.id === answer.questionId);
        return question?.levelId === level.id;
      });

      const raw = levelAnswers.reduce((sum, answer) => {
        const question = harmonicQuestions.find(q => q.id === answer.questionId);
        // Apply reverse scoring if question is marked as reversed
        const adjustedValue = question?.reversed ? (8 - answer.value) : answer.value;
        return sum + adjustedValue;
      }, 0);

      const maxPossible = 3 * 7; // 3 questions per level, max value of 7
      const normalized = (raw / maxPossible) * 100;

      return {
        levelId: level.id,
        raw,
        normalized: Math.max(0, Math.min(100, normalized))
      };
    });
  }, [answers]);

  const areCurrentQuestionsAnswered = useCallback((page: number): boolean => {
    const currentQuestions = getCurrentQuestions(page);
    return currentQuestions.every(question => 
      answers.some(answer => answer.questionId === question.id)
    );
  }, [answers, getCurrentQuestions]);

  return {
    answers,
    getCurrentQuestions,
    handleAnswer,
    calculateScores,
    areCurrentQuestionsAnswered
  };
}