import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, Brain, Target, Cpu, Clock } from 'lucide-react';

const benefits = [
  {
    icon: Brain,
    title: 'Holistic Insights',
    description: 'Gain a complete view of your traits and emotions and how they interact.'
  },
  {
    icon: Target,
    title: 'Actionable Strategies',
    description: 'Receive personalized growth plans aligned with your goals.'
  },
  {
    icon: Cpu,
    title: 'AI-Driven Precision',
    description: 'Leverage advanced algorithms for tailored feedback and recommendations.'
  },
  {
    icon: Clock,
    title: 'Time-Tested Frameworks',
    description: 'Rooted in proven psychological principles and breakthrough techniques.'
  }
];

export function BenefitsSection() {
  return (
    <section id="benefits" className="py-20 px-4">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold text-white mb-4">
            Why Choose The Personality Breakthrough Profile?
          </h2>
          <p className="text-white/80 text-lg max-w-2xl mx-auto">
            Whether you're a life coach or personal development enthusiast, our assessment
            offers unparalleled benefits.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8">
          {benefits.map((benefit, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="glass-effect rounded-2xl p-6 flex items-start gap-4"
            >
              <benefit.icon className="w-8 h-8 text-blue-400 flex-shrink-0" />
              <div>
                <h3 className="text-xl font-semibold text-white mb-2">
                  {benefit.title}
                </h3>
                <p className="text-white/70">
                  {benefit.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}