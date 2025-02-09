import React from 'react';
import { motion } from 'framer-motion';
import { Quote } from 'lucide-react';

const testimonials = [
  {
    quote: "The NLP Assessment gave me insights I never thought possible. It's helped me grow personally and professionally.",
    author: "Sarah J.",
    role: "Life Coach"
  },
  {
    quote: "As a trainer, I've integrated The NLP Assessment into my programs. The results speak for themselves!",
    author: "James M.",
    role: "NLP Practitioner"
  }
];

export function TestimonialsSection() {
  return (
    <section id="testimonials" className="py-20 px-4">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold text-white mb-4">
            What Our Users Say
          </h2>
          <p className="text-white/80 text-lg max-w-2xl mx-auto">
            Real experiences from professionals who've transformed their practice
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="glass-effect rounded-2xl p-8"
            >
              <Quote className="w-12 h-12 text-blue-400 mb-4" />
              <p className="text-white/90 text-lg mb-6">
                {testimonial.quote}
              </p>
              <div>
                <p className="text-white font-medium">{testimonial.author}</p>
                <p className="text-white/60">{testimonial.role}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}