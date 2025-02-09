import React from 'react';
import { motion } from 'framer-motion';
import { ClipboardCheck, BarChart2, FileText, Target } from 'lucide-react';

const steps = [
  {
    icon: ClipboardCheck,
    title: 'Take the Assessment',
    description: 'Answer engaging questions that explore your traits and emotions.'
  },
  {
    icon: BarChart2,
    title: 'Receive Your Results',
    description: 'Discover your scores in the 12 characteristics and your position on the Harmonic Scale.'
  },
  {
    icon: FileText,
    title: 'Get Your Personalized Report',
    description: 'Unlock insights and actionable steps to elevate your potential.'
  },
  {
    icon: Target,
    title: 'Apply and Transform',
    description: 'Use the recommendations to achieve your personal and professional goals.'
  }
];

export function HowItWorksSection() {
  return (
    <section id="how-it-works" className="py-20 px-4">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold text-white mb-4">
            How The NLP Potential Assessment Works
          </h2>
          <p className="text-white/80 text-lg max-w-2xl mx-auto">
            A simple yet powerful process to unlock your potential
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="glass-effect rounded-2xl p-6 text-center"
            >
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white/10 mb-4">
                <step.icon className="w-8 h-8 text-blue-400" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">
                {step.title}
              </h3>
              <p className="text-white/70">
                {step.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}