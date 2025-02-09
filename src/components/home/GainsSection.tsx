import React from 'react';
import { motion } from 'framer-motion';
import { Lightbulb, Eye, Compass } from 'lucide-react';

const gains = [
  {
    icon: Lightbulb,
    title: 'Clarity on Your Strengths',
    description: 'Identify what drives you and how to amplify it.'
  },
  {
    icon: Eye,
    title: 'Awareness of Barriers',
    description: 'Recognize emotional and behavioral patterns holding you back.'
  },
  {
    icon: Compass,
    title: 'Pathway to Success',
    description: 'Develop the traits you need to achieve your goals.'
  }
];

export function GainsSection() {
  return (
    <section id="gains" className="py-20 px-4">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold text-white mb-4">
            What You'll Gain
          </h2>
          <p className="text-white/80 text-lg max-w-2xl mx-auto">
            Transform your understanding and unlock your full potential
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {gains.map((gain, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="glass-effect rounded-2xl p-8 text-center"
            >
              <gain.icon className="w-12 h-12 text-blue-400 mb-6 mx-auto" />
              <h3 className="text-xl font-semibold text-white mb-4">
                {gain.title}
              </h3>
              <p className="text-white/70">
                {gain.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}