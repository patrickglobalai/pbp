import React from 'react';
import { Header } from '../components/Header';
import { ProgressBar } from '../components/ProgressBar';
import { QuestionPage } from '../components/QuestionPage';
import type { Question, Answer } from '../types';
import type { HarmonicQuestion, HarmonicAnswer } from '../types/harmonic';

interface Props {
  currentPage: number;
  totalPages: number;
  getCurrentQuestions: (page: number) => Question[];
  handleAnswer: (questionId: string, value: number) => void;
  goToNextPage: () => void;
  answers: Answer[];
  getQuestionNumber: (index: number, isHarmonic?: boolean) => number;
  harmonicQuestions: HarmonicQuestion[];
  harmonicAnswers: HarmonicAnswer[];
  handleHarmonicAnswer: (questionId: string, value: number) => void;
}

export function QuestionnaireView({
  currentPage,
  totalPages,
  getCurrentQuestions,
  handleAnswer,
  goToNextPage,
  answers,
  getQuestionNumber,
  harmonicQuestions,
  harmonicAnswers,
  handleHarmonicAnswer,
}: Props) {
  const currentQuestions = getCurrentQuestions(currentPage);

  // Log the current view state for debugging
  console.log('\n[QuestionnaireView Render]');
  console.log('Current Questions:', currentQuestions.length);
  console.log('Harmonic Questions:', harmonicQuestions.length);

  return (
    <div className="min-h-screen ai-gradient-bg py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <Header
          title="The Personality Breakthrough Profile"
          subtitle="Discover your unique pattern across Being, Doing, and Having"
        />

        <div className="glass-effect rounded-3xl p-8 mb-12">
          <ProgressBar
            current={currentPage + 1}
            total={totalPages}
          />
        </div>

        <QuestionPage
          questions={currentQuestions}
          answers={answers}
          onAnswer={handleAnswer}
          onNext={goToNextPage}
          getQuestionNumber={getQuestionNumber}
          harmonicQuestions={harmonicQuestions}
          harmonicAnswers={harmonicAnswers}
          onHarmonicAnswer={handleHarmonicAnswer}
        />
      </div>
    </div>
  );
}