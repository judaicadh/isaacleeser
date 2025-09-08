"use client";

import { motion } from "framer-motion";

interface LetterAnimationProps {
  className?: string;
  animated?: boolean;
}

export default function LetterAnimation({
  className = "",
  animated = true,
}: LetterAnimationProps) {
  return animated ? (
    <motion.div
      className={`relative ${className} cursor-pointer`}
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{
        type: "spring",
        stiffness: 200,
        damping: 15,
        delay: 0.2,
      }}
      whileHover={{ scale: 1.1 }}
    >
      <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
        {/* Letter envelope - back */}
        <motion.rect
          x="15"
          y="25"
          width="70"
          height="50"
          fill="hsl(var(--primary) / 0.1)"
          stroke="hsl(var(--primary) / 0.3)"
          strokeWidth="1"
          rx="2"
        />

        {/* Letter content - folded paper */}
        <motion.rect
          x="20"
          y="30"
          width="60"
          height="40"
          fill="hsl(var(--primary) / 0.05)"
          stroke="hsl(var(--primary) / 0.2)"
          strokeWidth="0.5"
          rx="1"
          initial={{ y: 45, height: 25, opacity: 0 }}
          whileHover={{ y: 30, height: 40, opacity: 1 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        />

        {/* Text lines on the letter - appear on hover */}
        <motion.g
          initial={{ opacity: 0 }}
          whileHover={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.3 }}
        >
          <motion.line
            x1="25"
            y1="38"
            x2="65"
            y2="38"
            stroke="hsl(var(--primary) / 0.4)"
            strokeWidth="0.5"
            initial={{ x2: 25 }}
            whileHover={{ x2: 65 }}
            transition={{ delay: 0.3, duration: 0.2 }}
          />
          <motion.line
            x1="25"
            y1="42"
            x2="70"
            y2="42"
            stroke="hsl(var(--primary) / 0.4)"
            strokeWidth="0.5"
            initial={{ x2: 25 }}
            whileHover={{ x2: 70 }}
            transition={{ delay: 0.35, duration: 0.2 }}
          />
          <motion.line
            x1="25"
            y1="46"
            x2="60"
            y2="46"
            stroke="hsl(var(--primary) / 0.4)"
            strokeWidth="0.5"
            initial={{ x2: 25 }}
            whileHover={{ x2: 60 }}
            transition={{ delay: 0.4, duration: 0.2 }}
          />
          <motion.line
            x1="25"
            y1="50"
            x2="68"
            y2="50"
            stroke="hsl(var(--primary) / 0.4)"
            strokeWidth="0.5"
            initial={{ x2: 25 }}
            whileHover={{ x2: 68 }}
            transition={{ delay: 0.45, duration: 0.2 }}
          />
          <motion.line
            x1="25"
            y1="54"
            x2="55"
            y2="54"
            stroke="hsl(var(--primary) / 0.4)"
            strokeWidth="0.5"
            initial={{ x2: 25 }}
            whileHover={{ x2: 55 }}
            transition={{ delay: 0.5, duration: 0.2 }}
          />
        </motion.g>

        {/* Envelope flap - opens upward on hover */}
        <motion.path
          fill="hsl(var(--primary) / 0.2)"
          stroke="hsl(var(--primary) / 0.4)"
          strokeWidth="1"
          initial={{ d: "M15 25 L50 45 L85 25 L50 15 Z" }}
          whileHover={{ d: "M15 25 L50 45 L85 25 L50 5 Z" }}
          transition={{ duration: 0.4, ease: "easeInOut" }}
        />

        {/* Decorative corner elements - appear on hover */}
        <motion.circle
          cx="25"
          cy="35"
          r="1"
          fill="hsl(var(--primary) / 0.3)"
          initial={{ opacity: 0, scale: 0 }}
          whileHover={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.6, duration: 0.2 }}
        />
        <motion.circle
          cx="75"
          cy="35"
          r="1"
          fill="hsl(var(--primary) / 0.3)"
          initial={{ opacity: 0, scale: 0 }}
          whileHover={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.65, duration: 0.2 }}
        />
      </svg>
    </motion.div>
  ) : (
    <div className={`${className} cursor-pointer`}>
      <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
        {/* Letter envelope - back */}
        <rect
          x="15"
          y="25"
          width="70"
          height="50"
          fill="hsl(var(--primary) / 0.1)"
          stroke="hsl(var(--primary) / 0.3)"
          strokeWidth="1"
          rx="2"
        />

        {/* Envelope flap - closed */}
        <path
          d="M15 25 L50 45 L85 25 L50 15 Z"
          fill="hsl(var(--primary) / 0.2)"
          stroke="hsl(var(--primary) / 0.4)"
          strokeWidth="1"
        />
      </svg>
    </div>
  );
}
