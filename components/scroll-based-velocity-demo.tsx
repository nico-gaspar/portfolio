"use client";

import {
  ScrollVelocityContainer,
  ScrollVelocityRow,
} from "@/registry/magicui/scroll-based-velocity";

export function ScrollBasedVelocityDemo() {
  return (
    <div className="relative flex h-screen w-full flex-col items-center justify-center overflow-hidden">
      <ScrollVelocityContainer 
        className="font-bold tracking-[-0.02em] uppercase text-primary" 
        style={{ fontSize: '800px', lineHeight: '0.85' }}
      >
        <ScrollVelocityRow baseVelocity={1} direction={1}>
          Nico Gaspar&nbsp;&nbsp;
        </ScrollVelocityRow>
      </ScrollVelocityContainer>
      <div className="from-background pointer-events-none absolute inset-y-0 left-0 w-1/4 bg-gradient-to-r"></div>
      <div className="from-background pointer-events-none absolute inset-y-0 right-0 w-1/4 bg-gradient-to-l"></div>
    </div>
  );
}

