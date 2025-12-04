"use client";

import { HalftoneConverter } from "@/components/halftone-converter";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";

export default function HalftonePage() {
  return (
    <>
      {/* Back navigation */}
      <motion.div 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="fixed left-6 top-6 z-50 sm:left-12 sm:top-12"
      >
        <Link 
          href="/"
          className="flex items-center gap-2 rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 transition-all hover:border-gray-400 hover:bg-gray-50"
          style={{ WebkitTapHighlightColor: 'transparent' }}
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back</span>
        </Link>
      </motion.div>
      
      <HalftoneConverter />
    </>
  );
}

