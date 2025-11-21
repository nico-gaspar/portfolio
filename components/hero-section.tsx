"use client";

import { motion } from "framer-motion";
import {
  ScrollVelocityContainer,
  ScrollVelocityRow,
} from "@/registry/magicui/scroll-based-velocity";

export function HeroSection() {
  return (
    <section className="relative flex min-h-[60vh] items-center justify-center overflow-hidden py-24">
      {/* Scrolling background text with velocity effect */}
      <div className="pointer-events-none absolute left-0 top-1/2 w-full -translate-y-1/2 opacity-10">
        <ScrollVelocityContainer
          className="font-bold uppercase tracking-[-0.08em]"
          style={{ fontSize: "clamp(120px, 20vw, 800px)", lineHeight: "0.85" }}
        >
          <ScrollVelocityRow baseVelocity={1} direction={1}>
            NICO GASPAR&nbsp;&nbsp;
          </ScrollVelocityRow>
        </ScrollVelocityContainer>
      </div>
    </section>
  );
}

