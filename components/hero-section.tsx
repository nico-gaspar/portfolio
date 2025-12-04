"use client";

import { motion } from "framer-motion";
import {
  ScrollVelocityContainer,
  ScrollVelocityRow,
} from "@/registry/magicui/scroll-based-velocity";

export function HeroSection() {
  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden">
      {/* Slower scrolling text layer - 50% opacity */}
      <div className="pointer-events-none absolute inset-0 flex items-center opacity-50">
        <ScrollVelocityContainer
          className="font-bold uppercase tracking-[-0.08em]"
          style={{ fontSize: "800px", lineHeight: "0.85" }}
        >
          <ScrollVelocityRow baseVelocity={1.5} direction={1}>
            NICO GASPAR&nbsp;&nbsp;
          </ScrollVelocityRow>
        </ScrollVelocityContainer>
      </div>

      {/* Original scrolling background text with velocity effect */}
      <div className="pointer-events-none absolute inset-0 flex items-center opacity-10">
        <ScrollVelocityContainer
          className="font-bold uppercase tracking-[-0.08em]"
          style={{ fontSize: "800px", lineHeight: "0.85" }}
        >
          <ScrollVelocityRow baseVelocity={3} direction={1}>
            NICO GASPAR&nbsp;&nbsp;
          </ScrollVelocityRow>
        </ScrollVelocityContainer>
      </div>
    </section>
  );
}

