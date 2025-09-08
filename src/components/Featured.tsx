"use client";
import { motion } from "framer-motion";

export default function FeaturedCollectionCard({
  title,
  description,
  itemCount,
  children,
}) {
  return (
    <motion.div
      className="text-primary  rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow"
      whileHover={{ y: -5 }}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
    >
      {children}
      <div className="p-5 border-t border-primary/10">
        <h3 className="font-serif text-xl font-bold text-primary mb-2">
          {title}
        </h3>
        <p className="text-primary/70 text-sm mb-4">{description}</p>
        <a
          href="#"
          className="inline-flex items-center text-sm font-medium text-primary hover:text-primary/70 transition-colors"
        >
          Explore collection
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="ml-1"
          >
            <path d="M5 12h14"></path>
            <path d="m12 5 7 7-7 7"></path>
          </svg>
        </a>
      </div>
    </motion.div>
  );
}
