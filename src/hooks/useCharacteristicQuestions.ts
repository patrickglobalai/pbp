import { useState, useCallback } from 'react';
import { Answer, Score, Question } from '../types';
import { questions } from '../data/questions';
import { characteristics } from '../data/characteristics';

const QUESTIONS_PER_PAGE = 12;

export function useCharacteristicQuestions() {
  const [answers, setAnswers] = useState<Answer[]>([]);

  const getCurrentQuestions = useCallback((page: number): Question[] => {
    const startIndex = page * QUESTIONS_PER_PAGE;
    const endIndex = startIndex + QUESTIONS_PER_PAGE;
    return questions.slice(startIndex, endIndex);
  }, []);

  const handleAnswer = useCallback((questionId: string, value: number) => {
    console.log(`[Characteristic Answer] Question ID: ${questionId}, Value: ${value}`);
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

  const calculateScores = useCallback((): Score[] => {
    return characteristics.map(characteristic => {
      const characteristicAnswers = answers.filter(answer => {
        const question = questions.find(q => q.id === answer.questionId);
        return question?.characteristicId === characteristic.id;
      });

      const raw = characteristicAnswers.reduce((sum, answer) => {
        const question = questions.find(q => q.id === answer.questionId);
        // Apply reverse scoring if question is marked as reversed
        const adjustedValue = question?.reversed ? (8 - answer.value) : answer.value;
        return sum + adjustedValue;
      }, 0);

      const maxPossible = 12 * 7; // 12 questions, max value of 7
      const normalized = (raw / maxPossible) * 100;

      return {
        characteristicId: characteristic.id,
        raw,
        normalized
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