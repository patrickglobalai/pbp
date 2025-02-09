import React from 'react';
import { motion } from 'framer-motion';

export function AnimatedBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* Animated gradient orbs */}
      <div className="absolute inset-0">
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full blur-3xl opacity-30"
            animate={{
              x: ["0%", "100%", "0%"],
              y: ["0%", "100%", "0%"],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 15 + i * 2,
              repeat: Infinity,
              ease: "linear",
              delay: i * -5,
            }}
            style={{
              width: "50%",
              height: "50%",
              background: i === 0 
                ? "linear-gradient(to right, #FF0080, #FF8C00)" 
                : i === 1 
                ? "linear-gradient(to right, #7928CA, #FF0080)"
                : "linear-gradient(to right, #00DFD8, #007CF0)",
              left: i === 0 ? "0%" : i === 1 ? "30%" : "60%",
              top: i === 0 ? "20%" : i === 1 ? "0%" : "40%",
            }}
          />
        ))}
      </div>
      
      {/* Overlay to soften the effect */}
      <div className="absolute inset-0 bg-black/40" />
    </div>
  );
}