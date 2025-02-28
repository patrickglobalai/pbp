import { motion } from "framer-motion";
import { Brain } from "lucide-react";

interface Props {
  enabled: boolean;
  onToggle: () => void;
  isLoading?: boolean;
}

export function AIAccessToggle({
  enabled,
  onToggle,
  isLoading = false,
}: Props) {
  return (
    <motion.button
      onClick={onToggle}
      disabled={isLoading}
      className={`relative inline-flex items-center gap-2 px-4 py-2 rounded-xl 
        ${
          enabled
            ? "bg-gradient-to-r from-blue-500 to-indigo-600 text-white"
            : "bg-white/10 text-white/60"
        } transition-all hover:scale-105 disabled:opacity-50`}
    >
      <Brain className="w-5 h-5" />
      <span>AI Analysis {enabled ? "Enabled" : "Disabled"}</span>
      {isLoading && (
        <motion.div
          className="absolute inset-0 bg-white/10 rounded-xl"
          animate={{ opacity: [0.5, 0.2] }}
          transition={{ duration: 1, repeat: Infinity }}
        />
      )}
    </motion.button>
  );
}
