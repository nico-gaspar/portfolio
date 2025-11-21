"use client";

import {
  motion,
  useAnimationFrame,
  useMotionValue,
  useScroll,
  useSpring,
  useTransform,
  useVelocity,
  wrap,
} from "framer-motion";
import React, { ReactNode, useEffect, useRef, useState } from "react";

import { cn } from "@/lib/utils";

interface ScrollVelocityContainerProps {
  children: ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export function ScrollVelocityContainer({
  children,
  className,
  style,
}: ScrollVelocityContainerProps) {
  return (
    <section className={cn("relative w-full", className)} style={style}>
      <div className="relative w-full overflow-hidden">{children}</div>
    </section>
  );
}

interface ScrollVelocityRowProps {
  children: ReactNode;
  baseVelocity?: number;
  direction?: number;
  className?: string;
}

export function ScrollVelocityRow({
  children,
  baseVelocity = 5,
  direction = 1,
  className,
}: ScrollVelocityRowProps) {
  const baseX = useMotionValue(0);
  const { scrollY } = useScroll();
  const scrollVelocity = useVelocity(scrollY);
  const smoothVelocity = useSpring(scrollVelocity, {
    damping: 50,
    stiffness: 400,
  });

  const velocityFactor = useTransform(smoothVelocity, [0, 1000], [0, 5], {
    clamp: false,
  });

  const [repetitions, setRepetitions] = useState(1);
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const calculateRepetitions = () => {
      if (containerRef.current && textRef.current) {
        const containerWidth = containerRef.current.offsetWidth;
        const textWidth = textRef.current.offsetWidth;
        const newRepetitions = Math.ceil(containerWidth / textWidth) + 2;
        setRepetitions(newRepetitions);
      }
    };

    calculateRepetitions();

    window.addEventListener("resize", calculateRepetitions);
    return () => window.removeEventListener("resize", calculateRepetitions);
  }, [children]);

  const directionNormalized = direction >= 0 ? 1 : -1;

  const x = useTransform(baseX, (v) => `${wrap(-100 / repetitions, 0, v)}%`);

  useAnimationFrame((t, delta) => {
    let moveBy =
      directionNormalized * baseVelocity * (delta / 1000) * -1;

    moveBy += directionNormalized * moveBy * velocityFactor.get();

    baseX.set(baseX.get() + moveBy);
  });

  return (
    <div
      className="relative m-0 flex w-full overflow-hidden whitespace-nowrap leading-[0.8]"
      ref={containerRef}
    >
      <motion.div className="flex whitespace-nowrap" style={{ x }}>
        {Array.from({ length: repetitions }).map((_, i) => (
          <span
            key={i}
            ref={i === 0 ? textRef : null}
            className={cn("block pr-4", className)}
          >
            {children}
          </span>
        ))}
      </motion.div>
    </div>
  );
}

