import React from 'react';
import { motion } from 'framer-motion';
import { Users, Brain, Briefcase, GraduationCap } from 'lucide-react';

const audiences = [
  {
    icon: Brain,
    title: 'Life Coaches',
    description: 'Use this tool to uncover unconscious patterns in your clients and create impactful coaching plans.'
  },
  {
    icon: Users,
    title: 'Personal Development Seekers',
    description: 'Gain clarity on your strengths and areas for growth.'
  },
  {
    icon: Briefcase,
    title: 'HR Professionals',
    description: 'Identify and nurture talent within your teams.'
  },
  {
    icon: GraduationCap,
    title: 'Educators and Trainers',
    description: 'Empower your students or participants to unlock their potential.'
  }
];

export function AudienceSection() {
  return (
    <section id="audience" className="py-20 px-4">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold text-white mb-4">
            Who Is It For?
          </h2>
          <p className="text-white/80 text-lg max-w-2xl mx-auto">
            Designed for professionals and individuals committed to growth and transformation
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {audiences.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="glass-effect rounded-2xl p-6 text-center"
            >
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white/10 mb-4">
                <item.icon className="w-8 h-8 text-blue-400" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">
                {item.title}
              </h3>
              <p className="text-white/70">
                {item.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}