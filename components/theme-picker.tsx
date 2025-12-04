"use client";

import { cn } from "@/lib/utils";
import {
  AnimatePresence,
  MotionValue,
  motion,
  useMotionValue,
  useSpring,
  useTransform,
} from "framer-motion";
import { useRef, useState } from "react";

interface Theme {
  title: string;
  color: string;
  bgColor: string;
  textColor: string;
}

const themes: Theme[] = [
  {
    title: "Default",
    color: "#000000",
    bgColor: "#FFFFFF",
    textColor: "#000000",
  },
  {
    title: "Blue",
    color: "#3B82F6",
    bgColor: "#EFF6FF",
    textColor: "#1E40AF",
  },
  {
    title: "Purple",
    color: "#8B5CF6",
    bgColor: "#F5F3FF",
    textColor: "#6D28D9",
  },
  {
    title: "Green",
    color: "#10B981",
    bgColor: "#ECFDF5",
    textColor: "#047857",
  },
  {
    title: "Orange",
    color: "#F97316",
    bgColor: "#FFF7ED",
    textColor: "#C2410C",
  },
];

export function ThemePicker({ className }: { className?: string }) {
  let mouseX = useMotionValue(Infinity);
  return (
    <motion.div
      onMouseMove={(e) => mouseX.set(e.pageX)}
      onMouseLeave={() => mouseX.set(Infinity)}
      className={cn(
        "fixed bottom-[calc(32px+64px)] left-1/2 z-50 flex h-16 -translate-x-1/2 items-end gap-4 px-4 pb-3",
        className,
      )}
    >
      {themes.map((theme) => (
        <ThemeColorContainer mouseX={mouseX} key={theme.title} {...theme} />
      ))}
    </motion.div>
  );
}

function ThemeColorContainer({
  mouseX,
  title,
  color,
  bgColor,
  textColor,
}: {
  mouseX: MotionValue;
  title: string;
  color: string;
  bgColor: string;
  textColor: string;
}) {
  let ref = useRef<HTMLDivElement>(null);

  let distance = useTransform(mouseX, (val) => {
    let bounds = ref.current?.getBoundingClientRect() ?? { x: 0, width: 0 };

    return val - bounds.x - bounds.width / 2;
  });

  let widthTransform = useTransform(distance, [-150, 0, 150], [40, 80, 40]);
  let heightTransform = useTransform(distance, [-150, 0, 150], [40, 80, 40]);

  let widthTransformColor = useTransform(distance, [-150, 0, 150], [20, 40, 20]);
  let heightTransformColor = useTransform(
    distance,
    [-150, 0, 150],
    [20, 40, 20],
  );

  let width = useSpring(widthTransform, {
    mass: 0.1,
    stiffness: 150,
    damping: 12,
  });
  let height = useSpring(heightTransform, {
    mass: 0.1,
    stiffness: 150,
    damping: 12,
  });

  let widthColor = useSpring(widthTransformColor, {
    mass: 0.1,
    stiffness: 150,
    damping: 12,
  });
  let heightColor = useSpring(heightTransformColor, {
    mass: 0.1,
    stiffness: 150,
    damping: 12,
  });

  const [hovered, setHovered] = useState(false);

  const handleClick = () => {
    document.documentElement.style.setProperty("--theme-bg", bgColor);
    document.documentElement.style.setProperty("--theme-text", textColor);
    document.documentElement.style.setProperty("--theme-accent", color);
  };

  return (
    <button onClick={handleClick}>
      <motion.div
        ref={ref}
        style={{ width, height }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        className="relative flex aspect-square items-center justify-center rounded-full"
      >
        <AnimatePresence>
          {hovered && (
            <motion.div
              initial={{ opacity: 0, y: 10, x: "-50%" }}
              animate={{ opacity: 1, y: 0, x: "-50%" }}
              exit={{ opacity: 0, y: 2, x: "-50%" }}
              className="absolute -top-8 left-1/2 w-fit whitespace-pre rounded-md border border-gray-200 bg-gray-100 px-2 py-0.5 text-xs text-neutral-700 dark:border-neutral-900 dark:bg-neutral-800 dark:text-white"
            >
              {title}
            </motion.div>
          )}
        </AnimatePresence>
        <motion.div
          style={{ width: widthColor, height: heightColor }}
          className="flex items-center justify-center rounded-full"
        >
          <div
            className="h-full w-full rounded-full"
            style={{ backgroundColor: color }}
          />
        </motion.div>
      </motion.div>
    </button>
  );
}

