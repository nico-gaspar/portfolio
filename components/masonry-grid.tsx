"use client";

import { motion } from "framer-motion";
import { useState } from "react";

interface Project {
  id: number;
  title: string;
  subtitle: string;
  image: string;
  category: string;
  height: "short" | "medium" | "tall";
}

interface MasonryGridProps {
  projects: Project[];
}

const heightClasses = {
  short: "h-[276px]",
  medium: "h-[400px]",
  tall: "h-[683px]",
};

export function MasonryGrid({ projects }: MasonryGridProps) {
  return (
    <div className="columns-1 gap-6 space-y-6 md:columns-2 lg:columns-3">
      {projects.map((project, index) => (
        <ProjectCard key={project.id} project={project} index={index} />
      ))}
    </div>
  );
}

function ProjectCard({
  project,
  index,
}: {
  project: Project;
  index: number;
}) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      className="group relative mb-6 break-inside-avoid overflow-hidden rounded-lg bg-gray-200"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className={`relative w-full ${heightClasses[project.height]}`}>
        {/* Placeholder for image */}
        <div className="absolute inset-0 bg-gradient-to-br from-gray-300 to-gray-200">
          {/* Replace with actual image: */}
          {/* <img 
            src={project.image} 
            alt={project.title}
            className="h-full w-full object-cover"
          /> */}
        </div>

        {/* Overlay with project info */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: isHovered ? 1 : 0 }}
          transition={{ duration: 0.3 }}
          className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black/80 via-black/40 to-transparent p-6"
        >
          <h3 className="mb-2 text-xl font-semibold text-white">
            {project.title}
          </h3>
          <p className="text-sm text-white/80">{project.subtitle}</p>
        </motion.div>

        {/* Static info at bottom (visible by default) */}
        {!isHovered && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-6"
          >
            <h3 className="mb-1 text-lg font-medium text-white">
              {project.title}
            </h3>
            <p className="text-sm text-white/80">{project.subtitle}</p>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}

