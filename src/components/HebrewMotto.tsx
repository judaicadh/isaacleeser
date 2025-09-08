"use client";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

const hebrewText = "ללמוד וללמד, לשמור ולעשות";
const englishTranslation = "To Learn and To Teach, To Observe and To Do";

export default function HebrewMotto() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 800);
    return () => clearTimeout(timer);
  }, []);

  // Unicode-safe letter splitting (including punctuation and spaces)
  const hebrewLetters = Array.from(hebrewText);

  return (
    <motion.div
      className="mb-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.5, duration: 0.8 }}
    >
      <div className="relative">
        {/* Hebrew Text */}
        <div
          className="text-2xl font-[Bona_Nova_SC] md:text-3xl font-bold mb-2 text-primary/90  "
          dir="rtl"
        >
          {hebrewLetters.map((char, i) => (
            <motion.span
              key={i}
              initial={{ opacity: 0, y: 20, scale: 0.8 }}
              animate={isVisible ? { opacity: 1, y: 0, scale: 1 } : {}}
              transition={{
                delay: 0.8 + i * 0.1,
                duration: 0.6,
                type: "spring",
                stiffness: 100,
              }}
              className="inline-block"
              style={{
                textShadow: "0 0 10px rgba(var(--primary), 0.3)",
              }}
            >
              {/* Use &nbsp; for visible spaces */}
              {char === " " ? "\u00A0" : char}
            </motion.span>
          ))}
        </div>

        {/* English Translation */}
        <motion.p
          className="text-lg italic text-foreground font-serif  px-2  "
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2.5, duration: 0.8 }}
        >
          {englishTranslation}
        </motion.p>
      </div>
    </motion.div>
  );
}
