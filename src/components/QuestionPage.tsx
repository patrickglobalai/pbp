import React from 'react';
import { motion } from 'framer-motion';
import { Question, Answer } from '../types';
import { HarmonicQuestion, HarmonicAnswer } from '../types/harmonic';
import { ScaleQuestion } from './ScaleQuestion';

interface Props {
  questions: Question[];
  answers: Answer[];
  onAnswer: (questionId: string, value: number) => void;
  onNext: () => void;
  getQuestionNumber: (index: number, isHarmonic?: boolean) => number;
  harmonicQuestions: HarmonicQuestion[];
  harmonicAnswers: HarmonicAnswer[];
  onHarmonicAnswer: (questionId: string, value: number) => void;
}

export function QuestionPage({ 
  questions, 
  answers, 
  onAnswer, 
  onNext,
  getQuestionNumber,
  harmonicQuestions,
  harmonicAnswers,
  onHarmonicAnswer
}: Props) {
  // Log the questions and answers being rendered
  console.log('\n[QuestionPage Render]');
  console.log('Characteristic Questions:', questions);
  console.log('Characteristic Answers:', answers);
  console.log('Harmonic Questions:', harmonicQuestions);
  console.log('Harmonic Answers:', harmonicAnswers);

  const allQuestionsAnswered = questions.every(
    question => answers.some(a => a.questionId === question.id)
  );

  const allHarmonicQuestionsAnswered = harmonicQuestions.every(
    question => harmonicAnswers.some(a => a.questionId === question.id)
  );

  const allAnswered = allQuestionsAnswered && allHarmonicQuestionsAnswered;

  return (
    <div className="space-y-8">
      {questions.map((question, index) => (
        <ScaleQuestion
          key={question.id}
          question={question}
          questionNumber={getQuestionNumber(index)}
          value={answers.find(a => a.questionId === question.id)?.value || 0}
          onChange={value => onAnswer(question.id, value)}
          delay={index * 0.1}
        />
      ))}

      {harmonicQuestions.map((question, index) => (
        <ScaleQuestion
          key={question.id}
          question={question}
          questionNumber={getQuestionNumber(index, true)}
          value={harmonicAnswers.find(a => a.questionId === question.id)?.value || 0}
          onChange={value => onHarmonicAnswer(question.id, value)} // Fixed: Now using onHarmonicAnswer
          delay={(questions.length + index) * 0.1}
        />
      ))}

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="flex justify-center"
      >
        <button
          onClick={onNext}
          disabled={!allAnswered}
          className={`px-8 py-4 rounded-xl text-white font-medium transition-all
            ${allAnswered
              ? 'bg-gradient-to-r from-blue-500 to-indigo-600 hover:scale-105'
              : 'bg-gray-500 cursor-not-allowed'
            }`}
        >
          Continue
        </button>
      </motion.div>
    </div>
  );
}