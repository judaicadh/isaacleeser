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
          // Added 'group' to coordinate hover effects across the whole card
          className="group flex flex-col bg-white border border-stone-200 rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer"
          whileHover={{ y: -4 }}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          // Adjusted easing for a slightly more natural, fluid lift
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      >
        {/* Image/Media Container:
        Forces a consistent 4:3 aspect ratio so your grid stays uniform
        even if the source images vary in size.
      */}
        <div className="relative w-full aspect-[4/3] bg-stone-50 overflow-hidden border-b border-stone-100">
          {children}
        </div>

        <div className="flex flex-col flex-grow p-6">
          <div className="flex justify-between items-start gap-4 mb-3">
            <h3 className="font-serif text-2xl font-semibold text-stone-900 tracking-tight leading-snug">
              {title}
            </h3>

            {/* Implemented the itemCount prop as a refined metadata badge */}
            {itemCount && (
                <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-stone-100 text-stone-600 border border-stone-200 whitespace-nowrap mt-1">
              {itemCount} items
            </span>
            )}
          </div>

          <p className="text-stone-600 text-sm leading-relaxed mb-6 flex-grow">
            {description}
          </p>

          {/* Separated the call-to-action to pin it to the bottom */}
          <div className="mt-auto pt-4 border-t border-stone-100">
            <a
                href="#"
                className="inline-flex items-center text-sm font-medium text-stone-900 transition-colors"
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
                  // The arrow now smoothly slides to the right on card hover
                  className="ml-1.5 transition-transform duration-300 ease-out group-hover:translate-x-1"
              >
                <path d="M5 12h14"></path>
                <path d="m12 5 7 7-7 7"></path>
              </svg>
            </a>
          </div>
        </div>
      </motion.div>
  );
}