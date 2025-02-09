import React from 'react';
import { CheckCircle } from 'lucide-react';

export function BenefitsList() {
  const benefits = [
    {
      title: "Comprehensive Certification Manual",
      description: "140+ pages of detailed insights, frameworks, and practical applications"
    },
    {
      title: "AI-Powered Assessment Platform",
      description: "60 days free access to our cutting-edge assessment tool"
    },
    {
      title: "12 Core Traits Framework",
      description: "Master the science behind personal and professional success"
    },
    {
      title: "Harmonic Scale Mastery",
      description: "Learn to decode emotional patterns and decision-making"
    },
    {
      title: "Practical Implementation",
      description: "Real-world case studies and hands-on practice sessions"
    },
    {
      title: "Pioneer Status",
      description: "Be among the first certified practitioners worldwide"
    }
  ];

  return (
    <div className="glass-effect rounded-3xl p-8">
      <h3 className="text-2xl font-bold text-white mb-6">What You'll Get</h3>
      <div className="grid gap-6">
        {benefits.map((benefit, index) => (
          <div key={index} className="flex items-start gap-4">
            <CheckCircle className="w-6 h-6 text-emerald-400 flex-shrink-0 mt-1" />
            <div>
              <h4 className="text-white font-medium">{benefit.title}</h4>
              <p className="text-white/70">{benefit.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}