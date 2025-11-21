"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { MasonryGrid } from "@/components/masonry-grid";
import { HeroSection } from "@/components/hero-section";
import { FilterTabs } from "@/components/filter-tabs";

// Sample project data - replace with your actual projects
const projects = [
  {
    id: 1,
    title: "Building a brands strategy",
    subtitle: "2024 // Company Name",
    image: "/projects/project-1.jpg",
    category: "case-studies",
    height: "tall", // for masonry layout
  },
  {
    id: 2,
    title: "Designing a user experience",
    subtitle: "2024 // Project Title",
    image: "/projects/project-2.jpg",
    category: "case-studies",
    height: "medium",
  },
  {
    id: 3,
    title: "Launching a marketing campaign",
    subtitle: "2024 // Initiative Name",
    image: "/projects/project-3.jpg",
    category: "case-studies",
    height: "tall",
  },
  {
    id: 4,
    title: "Product Design System",
    subtitle: "2024 // Tech Company",
    image: "/projects/project-4.jpg",
    category: "timeline",
    height: "medium",
  },
  {
    id: 5,
    title: "Brand Identity Refresh",
    subtitle: "2024 // Startup",
    image: "/projects/project-5.jpg",
    category: "timeline",
    height: "short",
  },
  {
    id: 6,
    title: "Mobile App Redesign",
    subtitle: "2024 // E-commerce",
    image: "/projects/project-6.jpg",
    category: "flex-spot",
    height: "tall",
  },
];

const filters = [
  { id: "case-studies", label: "Case Studies" },
  { id: "timeline", label: "Timeline" },
  { id: "flex-spot", label: "Flex Spot" },
];

export default function Home() {
  const [activeFilter, setActiveFilter] = useState("case-studies");

  const filteredProjects = projects.filter(
    (project) => project.category === activeFilter
  );

  return (
    <main className="relative min-h-screen bg-white">
      {/* Hero Section */}
      <HeroSection />

      {/* Filter Tabs */}
      <FilterTabs
        filters={filters}
        activeFilter={activeFilter}
        onFilterChange={setActiveFilter}
      />

      {/* Projects Grid */}
      <section className="px-6 pb-32 pt-16 md:px-12 lg:px-24">
        <motion.div
          key={activeFilter}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.4 }}
        >
          <MasonryGrid projects={filteredProjects} />
        </motion.div>
      </section>

      {/* Contact Section */}
      <section className="flex min-h-[50vh] items-center justify-center px-8 pb-32">
        <div className="max-w-2xl space-y-8 text-center">
          <h2 className="text-4xl font-bold tracking-tight">Get In Touch</h2>
          <p className="text-xl text-gray-600">
            Feel free to reach out for collaborations or just a friendly chat.
          </p>
          <div className="pt-8">
            <a
              href="mailto:hello@nicogaspar.com"
              className="inline-flex h-12 items-center justify-center rounded-full bg-black px-8 text-sm font-medium text-white transition-all hover:scale-105 hover:bg-gray-800"
            >
              Contact Me
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
