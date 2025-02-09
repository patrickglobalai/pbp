import React from 'react';
import { QuestionnaireView } from '../views/QuestionnaireView';
import { useQuestionnaire } from '../hooks/useQuestionnaire';

export function QuestionnaireContainer() {
  const {
    currentPage,
    getCurrentQuestions,
    getCurrentHarmonicQuestions,
    handleAnswer,
    goToNextPage,
    answers,
    harmonicAnswers,
    totalPages,
    getQuestionNumber
  } = useQuestionnaire();

  // Log the current state for debugging
  console.log('\n[QuestionnaireContainer Render]');
  console.log('Current Page:', currentPage);
  console.log('Total Pages:', totalPages);
  console.log('Characteristic Answers:', answers.length);
  console.log('Harmonic Answers:', harmonicAnswers.length);

  return (
    <QuestionnaireView
      currentPage={currentPage}
      totalPages={totalPages}
      getCurrentQuestions={getCurrentQuestions}
      handleAnswer={handleAnswer}
      goToNextPage={goToNextPage}
      answers={answers}
      getQuestionNumber={getQuestionNumber}
      harmonicQuestions={getCurrentHarmonicQuestions(currentPage)}
      harmonicAnswers={harmonicAnswers}
      handleHarmonicAnswer={handleAnswer}
    />
  );
}