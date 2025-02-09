import React from 'react';
import { Question } from '../types';
import { motion } from 'framer-motion';

const SCALE_OPTIONS = [
  { value: 1, label: 'Strongly Disagree' },
  { value: 2, label: 'Disagree' },
  { value: 3, label: 'Somewhat Disagree' },
  { value: 4, label: 'Neutral' },
  { value: 5, label: 'Somewhat Agree' },
  { value: 6, label: 'Agree' },
  { value: 7, label: 'Strongly Agree' },
];

interface Props {
  question: Question;
  questionNumber: number;
  value: number;
  onChange: (value: number) => void;
  delay?: number;
}

export function ScaleQuestion({ question, questionNumber, value, onChange, delay = 0 }: Props) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      className="w-full max-w-3xl mx-auto p-8"
    >
      <h3 className="text-2xl font-medium text-white mb-8 text-center leading-relaxed">
        <span className="text-blue-300 mr-2">Question {questionNumber}:</span>
        {question.text}
      </h3>
      <div className="grid grid-cols-7 gap-4">
        {SCALE_OPTIONS.map((option) => (
          <button
            key={option.value}
            onClick={() => onChange(option.value)}
            className={`scale-option rounded-2xl p-6 transition-all duration-300 flex flex-col items-center justify-center ${
              value === option.value 
                ? 'bg-gradient-to-b from-blue-500 to-indigo-600 border-4 border-white shadow-[0_0_20px_rgba(99,102,241,0.5)] transform -translate-y-2' 
                : 'glass-effect border border-white/20 hover:bg-white/10'
            }`}
          >
            <div className={`text-2xl font-bold mb-2 ${
              value === option.value ? 'text-white' : 'text-white/90'
            }`}>
              {option.value}
            </div>
            <div className={`text-xs text-center ${
              value === option.value ? 'text-white' : 'text-white/70'
            }`}>
              {option.label}
            </div>
          </button>
        ))}
      </div>
    </motion.div>
  );
}