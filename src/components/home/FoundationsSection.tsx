import React from 'react';
import { motion } from 'framer-motion';
import { Brain, BookOpen, Scale, Heart, Target } from 'lucide-react';

const foundations = [
  {
    icon: Brain,
    title: 'Psychological Foundations',
    description: [
      'Leverages proven principles to explore unconscious patterns, identify limiting beliefs, and align emotions and behaviors for growth.',
      'Focuses on the interplay between mindset (Being), actions (Doing), and outcomes (Having), creating a holistic approach to understanding personal potential.'
    ]
  },
  {
    icon: BookOpen,
    title: 'Research-Based Framework',
    description: [
      'Built on extensive research into the characteristics of high achievers and breakthrough performers.',
      'Distills key insights into 12 actionable traits of potential, grouped into Being, Doing, and Having categories.'
    ]
  },
  {
    icon: Scale,
    title: 'The Harmonic Scale',
    description: [
      'Integrates emotional awareness by measuring emotional states across 12 levels, from lower states like Shame and Guilt to higher states like Joy and Peace.',
      'Highlights how emotional patterns influence behaviors and decisions, identifying areas for recalibration.'
    ]
  },
  {
    icon: Heart,
    title: 'Psychological and Behavioral Science',
    description: [
      'Incorporates insights from emotional intelligence, cognitive psychology, and motivation theory.',
      'Helps uncover unconscious blocks and align personal traits and emotions for greater self-awareness and achievement.'
    ]
  },
  {
    icon: Target,
    title: 'Practical Coaching Foundations',
    description: [
      'Designed for use by coaches, practitioners, and individuals, the assessment is action-oriented, offering clear strategies for personal and professional growth.',
      'Emphasizes measurable outcomes, making it a powerful tool for facilitating meaningful change.'
    ]
  }
];

export function FoundationsSection() {
  return (
    <section id="foundations" className="py-20 px-4">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold text-white mb-4">
            Foundations of The Personality Breakthrough Profile
          </h2>
          <p className="text-white/80 text-lg max-w-3xl mx-auto">
            Built on a unique, integrative framework that combines:
          </p>
        </motion.div>

        <div className="space-y-8">
          {foundations.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="glass-effect rounded-2xl p-8"
            >
              <div className="flex items-start gap-6">
                <item.icon className="w-12 h-12 text-blue-400 flex-shrink-0" />
                <div>
                  <h3 className="text-2xl font-semibold text-white mb-4">
                    {item.title}
                  </h3>
                  <div className="space-y-4 text-white/80">
                    {item.description.map((text, i) => (
                      <p key={i}>{text}</p>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}