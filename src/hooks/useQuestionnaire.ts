import { useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAssessment } from '../contexts/AssessmentContext';
import { useCharacteristicQuestions } from './useCharacteristicQuestions';
import { useHarmonicQuestions } from './useHarmonicQuestions';
import { harmonicQuestions } from '../data/harmonicQuestions';

const TOTAL_PAGES = 12;

export function useQuestionnaire() {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(0);
  const { setScores, setHarmonicScores } = useAssessment();

  const {
    answers: characteristicAnswers,
    getCurrentQuestions: getCurrentCharacteristicQuestions,
    handleAnswer: handleCharacteristicAnswer,
    calculateScores: calculateCharacteristicScores,
    areCurrentQuestionsAnswered: areCharacteristicQuestionsAnswered
  } = useCharacteristicQuestions();

  const {
    answers: harmonicAnswers,
    getCurrentQuestions: getCurrentHarmonicQuestions,
    handleAnswer: handleHarmonicAnswer,
    calculateScores: calculateHarmonicScores,
    areCurrentQuestionsAnswered: areHarmonicQuestionsAnswered
  } = useHarmonicQuestions();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [currentPage]);

  const getQuestionNumber = useCallback((index: number, isHarmonic: boolean = false): number => {
    const baseNumber = currentPage * 15; // 15 questions per page
    return isHarmonic ? baseNumber + 12 + index + 1 : baseNumber + index + 1;
  }, [currentPage]);

  const handleAnswer = useCallback((questionId: string, value: number) => {
    // Check if the question ID exists in harmonic questions
    const isHarmonicQuestion = harmonicQuestions.some(q => q.id === questionId);
    
    if (isHarmonicQuestion) {
      handleHarmonicAnswer(questionId, value);
    } else {
      handleCharacteristicAnswer(questionId, value);
    }
  }, [handleHarmonicAnswer, handleCharacteristicAnswer]);

  const goToNextPage = useCallback(() => {
    const characteristicAnswered = areCharacteristicQuestionsAnswered(currentPage);
    const harmonicAnswered = areHarmonicQuestionsAnswered(currentPage);

    if (!characteristicAnswered || !harmonicAnswered) {
      console.log('Not all questions answered on current page');
      return;
    }

    if (currentPage < TOTAL_PAGES - 1) {
      setCurrentPage(prev => prev + 1);
    } else {
      const finalCharacteristicScores = calculateCharacteristicScores();
      const finalHarmonicScores = calculateHarmonicScores();
      
      setScores(finalCharacteristicScores);
      setHarmonicScores(finalHarmonicScores);
      
      navigate('/results');
    }
  }, [
    currentPage,
    areCharacteristicQuestionsAnswered,
    areHarmonicQuestionsAnswered,
    calculateCharacteristicScores,
    calculateHarmonicScores,
    setScores,
    setHarmonicScores,
    navigate
  ]);

  return {
    currentPage,
    getCurrentQuestions: getCurrentCharacteristicQuestions,
    getCurrentHarmonicQuestions,
    handleAnswer,
    goToNextPage,
    answers: characteristicAnswers,
    harmonicAnswers,
    totalPages: TOTAL_PAGES,
    getQuestionNumber
  };
}