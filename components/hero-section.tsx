"use client";

import { motion } from "framer-motion";

export function HeroSection() {
  return (
    <section className="relative flex min-h-[60vh] items-center justify-center overflow-hidden py-24">
      {/* Large background text */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.1 }}
        transition={{ duration: 1 }}
        className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 whitespace-nowrap"
        style={{
          fontSize: "clamp(120px, 20vw, 800px)",
          letterSpacing: "-0.08em",
        }}
      >
        <h1 className="font-normal leading-none tracking-[-0.08em]">
          NICO GASPAR
        </h1>
      </motion.div>

      {/* Circular avatar/logo */}
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.6, type: "spring" }}
        className="relative z-10"
      >
        <div className="flex size-14 items-center justify-center rounded-full bg-gray-200 shadow-lg">
          {/* Replace with your actual image */}
          <span className="text-2xl font-bold text-gray-600">NG</span>
        </div>
      </motion.div>
    </section>
  );
}

