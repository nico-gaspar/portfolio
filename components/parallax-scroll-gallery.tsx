"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { ReactLenis } from "lenis/react";
import { useRef } from "react";
import { cn } from "@/lib/utils";

const images = [
  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?q=80&w=800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1488161628813-99c974fc5b76?q=80&w=800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?q=80&w=800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1513956589380-bad618211cf7?q=80&w=800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1456327102063-fb5054efe647?q=80&w=800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1581092795360-fd1ca04f0952?q=80&w=800&auto=format&fit=crop",
];

const GridItem = ({
  img,
  column,
}: {
  img: string;
  index: number;
  column: number; // 0: Left, 1: Center, 2: Right
}) => {
  const itemRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress: itemProgress } = useScroll({
    target: itemRef,
    offset: ["start end", "end start"],
  });

  // Transform values based on scroll progress and column position
  const rotateX = useTransform(itemProgress, [0, 0.5, 1], [70, 0, -50]);
  
  // Adjust rotation based on column
  // Left: positive rotation, Right: negative rotation, Center: minimal/no rotation
  const rotateZ = useTransform(
    itemProgress,
    [0, 0.5, 1],
    column === 0 ? [5, 0, -1] : column === 2 ? [-5, 0, 1] : [0, 0, 0]
  );

  // Adjust X translation based on column
  // Left: Moves left, Right: Moves right, Center: Stays center
  const x = useTransform(
    itemProgress,
    [0, 0.5, 0.7, 1],
    column === 0 
      ? ["-40%", "0%", "0%", "-10%"] 
      : column === 2 
        ? ["40%", "0%", "0%", "10%"] 
        : ["0%", "0%", "0%", "0%"]
  );

  // Adjust skew based on column
  const skewX = useTransform(
    itemProgress,
    [0, 0.5, 1],
    column === 0 
      ? [-5, 0, 5] 
      : column === 2 
        ? [5, 0, -5] 
        : [0, 0, 0]
  );

  const y = useTransform(itemProgress, [0, 0.5, 1], ["40%", "0%", "-10%"]);
  const blur = useTransform(itemProgress, [0, 0.5, 1], [7, 0, 4]);
  const brightness = useTransform(itemProgress, [0, 0.5, 1], [0, 100, 0]);
  const contrast = useTransform(itemProgress, [0, 0.5, 1], [180, 110, 180]);
  const scaleY = useTransform(itemProgress, [0, 0.5, 1], [1.8, 1, 1.1]);

  return (
    <motion.figure
      ref={itemRef}
      className="relative z-10 m-0"
      style={{
        perspective: "800px",
        willChange: "transform",
        zIndex: 300,
      }}
    >
      <motion.div
        className="relative aspect-[1/1.2] w-full overflow-hidden rounded-xl bg-muted shadow-2xl"
        style={{
          y,
          x,
          rotateX,
          rotateZ,
          skewX,
          filter: useTransform(
            [blur, brightness, contrast],
            ([b, br, c]) => `blur(${b}px) brightness(${br}%) contrast(${c}%)`,
          ),
          scaleY,
        }}
      >
        <motion.div
          className="absolute inset-0 h-full w-full bg-cover bg-center"
          style={{
            backgroundImage: `url(${img})`,
          }}
        />
      </motion.div>
    </motion.figure>
  );
};

export function ParallaxScrollGallery({ className }: { className?: string }) {
  const mainRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  return (
    <ReactLenis root>
      <div className={cn("relative w-full overflow-hidden bg-background text-foreground", className)}>
        <div ref={mainRef} className="relative w-full overflow-hidden">
          {/* Intro Section */}
          <div className="relative z-10 flex flex-col items-center justify-center py-24 text-center">
            <span className="relative mb-4 inline-block text-sm font-medium uppercase tracking-[0.2em] opacity-60">
              Selected Works
            </span>
            <div className="h-16 w-px bg-gradient-to-b from-foreground/0 via-foreground/20 to-foreground/0"></div>
          </div>

          {/* Main Grid Section */}
          <section className="relative grid w-full place-items-center pb-32">
            <div
              ref={gridRef}
              className="relative grid w-full max-w-5xl grid-cols-1 gap-8 px-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-12"
            >
              {images.map((img, index) => {
                // Determine column: 0, 1, or 2
                const column = index % 3;
                return (
                  <GridItem
                    key={index}
                    img={img}
                    index={index}
                    column={column}
                  />
                );
              })}
            </div>
          </section>
        </div>
      </div>
    </ReactLenis>
  );
}
