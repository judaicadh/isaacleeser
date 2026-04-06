"use client";
import { motion } from "framer-motion";

const hebrewText = "ללמוד וללמד, לשמור ולעשות";
const englishTranslation = "To Learn and To Teach, To Observe and To Do";

export default function HebrewMotto() {
  // Unicode-safe letter splitting
  const hebrewLetters = Array.from(hebrewText);

  // Framer Motion variants allow us to orchestrate the whole sequence cleanly
  // without needing useEffect or state timers.
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.3,
        // Stagger cascades right-to-left naturally because the text is RTL
        staggerChildren: 0.08,
      },
    },
  };

  const letterVariants = {
    hidden: { opacity: 0, y: 10, filter: "blur(4px)" },
    visible: {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      transition: { type: "spring", stiffness: 120, damping: 20 }
    },
  };

  return (
      <div className="flex flex-col items-center text-center my-12 px-4">
        <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            className="relative flex flex-col items-center"
        >
          {/* Subtle decorative top accent */}
          <motion.div
              initial={{ width: 0, opacity: 0 }}
              whileInView={{ width: "40px", opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1, duration: 1 }}
              className="h-[1px] bg-primary/20 mb-6"
          />

          {/* Hebrew Text */}
          <div
              className="text-3xl md:text-4xl lg:text-5xl font-[Bona_Nova_SC] text-primary tracking-wide mb-4"
              dir="rtl"
          >
            {hebrewLetters.map((char, i) => (
                <motion.span
                    key={i}
                    variants={letterVariants}
                    className="inline-block"
                >
                  {/* Use &nbsp; for visible spaces */}
                  {char === " " ? "\u00A0" : char}
                </motion.span>
            ))}
          </div>

          {/* English Translation */}
          <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              // Delays the English until the Hebrew is mostly finished spelling out
              transition={{ delay: 2.4, duration: 1.2, ease: "easeOut" }}
              className="flex flex-col items-center"
          >
            <p className="text-lg md:text-xl italic text-muted-foreground font-serif tracking-wide">
              "{englishTranslation}"
            </p>

            {/* Subtle decorative bottom accent */}
            <motion.div
                initial={{ width: 0, opacity: 0 }}
                whileInView={{ width: "40px", opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 2.8, duration: 1 }}
                className="h-[1px] bg-primary/20 mt-6"
            />
          </motion.div>
        </motion.div>
      </div>
  );
}