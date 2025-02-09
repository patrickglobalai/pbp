import React from 'react';
import { motion } from 'framer-motion';
import { Brain, Scale, Heart, BookOpen, Target, ArrowRight } from 'lucide-react';

export function DetailedFoundationsSection() {
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
            Foundations of The NLP Potential Assessment
          </h2>
          <p className="text-white/80 text-lg max-w-3xl mx-auto">
            The NLP Potential Assessment is built on a unique, integrative framework that combines proven methodologies
            with cutting-edge insights to deliver transformative results.
          </p>
        </motion.div>

        <div className="space-y-12">
          {/* NLP Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="glass-effect rounded-2xl p-8"
          >
            <div className="flex items-start gap-6">
              <Brain className="w-12 h-12 text-blue-400 flex-shrink-0" />
              <div>
                <h3 className="text-2xl font-semibold text-white mb-4">
                  Neuro-Linguistic Programming (NLP)
                </h3>
                <div className="space-y-4 text-white/80">
                  <p>
                    Our assessment leverages core NLP principles to explore unconscious patterns,
                    identify limiting beliefs, and create alignment between emotions and behaviors
                    for sustainable growth.
                  </p>
                  <p>
                    We focus on the powerful interplay between:
                  </p>
                  <ul className="space-y-2 ml-6">
                    <li className="flex items-center gap-2">
                      <ArrowRight className="w-4 h-4 text-blue-400" />
                      <span><strong className="text-white">Being:</strong> Your mindset, beliefs, and identity</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <ArrowRight className="w-4 h-4 text-blue-400" />
                      <span><strong className="text-white">Doing:</strong> Your actions, habits, and behaviors</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <ArrowRight className="w-4 h-4 text-blue-400" />
                      <span><strong className="text-white">Having:</strong> Your results and achievements</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Dr. Barrios Research */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="glass-effect rounded-2xl p-8"
          >
            <div className="flex items-start gap-6">
              <BookOpen className="w-12 h-12 text-blue-400 flex-shrink-0" />
              <div>
                <h3 className="text-2xl font-semibold text-white mb-4">
                  Dr. Alfred Barrios' Research
                </h3>
                <div className="space-y-4 text-white/80">
                  <p>
                    Inspired by Barrios' groundbreaking "24 Characteristics of Genius" research,
                    we've distilled these insights into 12 actionable traits of potential, carefully
                    grouped into our Being, Doing, and Having categories.
                  </p>
                  <p>
                    These traits reflect essential qualities that drive personal development and success:
                  </p>
                  <div className="grid md:grid-cols-3 gap-4 mt-4">
                    <div>
                      <h4 className="text-white font-semibold mb-2">Being Traits</h4>
                      <ul className="space-y-1">
                        <li>• Ambition</li>
                        <li>• Boldness</li>
                        <li>• Positive Outlook</li>
                        <li>• Integrity</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="text-white font-semibold mb-2">Doing Traits</h4>
                      <ul className="space-y-1">
                        <li>• Wisdom</li>
                        <li>• Passion</li>
                        <li>• Communication</li>
                        <li>• Sociability</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="text-white font-semibold mb-2">Having Traits</h4>
                      <ul className="space-y-1">
                        <li>• Learning</li>
                        <li>• Creativity</li>
                        <li>• Flexibility</li>
                        <li>• Visionary Thinking</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Harmonic Scale */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="glass-effect rounded-2xl p-8"
          >
            <div className="flex items-start gap-6">
              <Scale className="w-12 h-12 text-blue-400 flex-shrink-0" />
              <div>
                <h3 className="text-2xl font-semibold text-white mb-4">
                  The Harmonic Scale
                </h3>
                <div className="space-y-4 text-white/80">
                  <p>
                    Our unique Harmonic Scale integrates emotional awareness by measuring emotional
                    states across 12 distinct levels, from lower states to higher states of consciousness.
                  </p>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="text-white font-semibold mb-2">Lower to Middle States</h4>
                      <ul className="space-y-1">
                        <li>• Shame - Feeling of unworthiness</li>
                        <li>• Guilt - Responsibility for outcomes</li>
                        <li>• Apathy - Lack of motivation</li>
                        <li>• Frustration - Feeling blocked</li>
                        <li>• Worry - Future concerns</li>
                        <li>• Neutrality - Non-attachment</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="text-white font-semibold mb-2">Higher States</h4>
                      <ul className="space-y-1">
                        <li>• Willingness - Openness to possibilities</li>
                        <li>• Optimism - Positive outlook</li>
                        <li>• Acceptance - Embracing what is</li>
                        <li>• Joy - Experience of fulfillment</li>
                        <li>• Love - Connection and compassion</li>
                        <li>• Peace - Inner tranquility</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Additional Foundations */}
          <div className="grid md:grid-cols-2 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="glass-effect rounded-2xl p-8"
            >
              <Heart className="w-12 h-12 text-blue-400 mb-4" />
              <h3 className="text-2xl font-semibold text-white mb-4">
                Psychological and Behavioral Science
              </h3>
              <div className="space-y-4 text-white/80">
                <p>
                  Our assessment incorporates insights from:
                </p>
                <ul className="space-y-2">
                  <li>• Emotional Intelligence research</li>
                  <li>• Cognitive psychology principles</li>
                  <li>• Motivation theory</li>
                  <li>• Behavioral change models</li>
                </ul>
                <p>
                  These scientific foundations help uncover unconscious blocks and align personal
                  traits and emotions for greater self-awareness and achievement.
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="glass-effect rounded-2xl p-8"
            >
              <Target className="w-12 h-12 text-blue-400 mb-4" />
              <h3 className="text-2xl font-semibold text-white mb-4">
                Practical Coaching Foundations
              </h3>
              <div className="space-y-4 text-white/80">
                <p>
                  Designed for immediate practical application by:
                </p>
                <ul className="space-y-2">
                  <li>• Professional coaches</li>
                  <li>• NLP practitioners</li>
                  <li>• Personal development enthusiasts</li>
                  <li>• HR professionals</li>
                </ul>
                <p>
                  Our assessment emphasizes measurable outcomes and provides clear strategies
                  for facilitating meaningful change.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}