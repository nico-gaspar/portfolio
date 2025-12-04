"use client";

import { motion } from "framer-motion";
import { InteractiveHalftoneBg } from "./interactive-halftone-bg";

export function HeroSectionHalftone() {
  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden bg-white">
      {/* Interactive Halftone Background */}
      <div className="absolute inset-0">
        <InteractiveHalftoneBg
          dotSpacing={10}
          maxDotSize={6}
          hoverRadius={50}
          hoverScale={0.3}
          dotColor="#000000"
          backgroundColor="#ffffff"
          hoverColor="#333333"
          pattern="uniform"
        />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-5xl px-8 text-center">
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mb-6 text-6xl font-medium leading-tight tracking-tight sm:text-7xl lg:text-8xl"
        >
          Nico Gaspar
        </motion.h1>
        
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-xl text-gray-600 sm:text-2xl"
        >
          Designer & Developer
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mt-12 flex flex-wrap justify-center gap-4"
        >
          <a
            href="#work"
            className="rounded-md bg-black px-6 py-3 text-sm font-medium text-white transition-all hover:bg-gray-800"
          >
            View Work
          </a>
          <a
            href="#contact"
            className="rounded-md border border-gray-300 bg-white px-6 py-3 text-sm font-medium text-gray-900 transition-all hover:border-gray-400 hover:bg-gray-50"
          >
            Get in Touch
          </a>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 1 }}
        className="absolute bottom-12 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="flex flex-col items-center gap-2"
        >
          <span className="text-xs text-gray-500">Scroll to explore</span>
          <svg
            className="h-5 w-5 text-gray-400"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
          </svg>
        </motion.div>
      </motion.div>
    </section>
  );
}

