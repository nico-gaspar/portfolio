"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { MasonryGrid } from "@/components/masonry-grid";
import { HeroSection } from "@/components/hero-section";
import { PortfolioNavbar } from "@/components/portfolio-navbar";
import { ThemeColors } from "@/components/theme-colors";
import { ArrowRight } from "lucide-react";

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

export default function Home() {
  const [activeFilter, setActiveFilter] = useState("");

  const filteredProjects = activeFilter
    ? projects.filter((project) => project.category === activeFilter)
    : projects;

  return (
    <main className="relative min-h-screen bg-white">
      {/* Navbar with integrated filters */}
      <PortfolioNavbar
        activeFilter={activeFilter}
        onFilterChange={setActiveFilter}
      />

      {/* Theme Colors on the right */}
      <ThemeColors />
      
      {/* Hero Section */}
      <HeroSection />

      {/* Demos & Tools Section */}
      <section className="px-6 py-16 md:px-12 lg:px-24">
        <div className="mb-8">
          <h2 className="text-3xl font-bold tracking-tight">Demos & Tools</h2>
          <p className="mt-2 text-gray-600">Interactive experiments and creative tools</p>
        </div>
        
        <div className="grid gap-6 md:grid-cols-2">
          {/* Interactive Halftone Demo */}
          <Link href="/demo/interactive-halftone">
            <motion.div
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.2 }}
              className="group relative overflow-hidden rounded-2xl border border-gray-200 bg-gradient-to-br from-gray-50 to-white p-8 shadow-sm transition-shadow hover:shadow-md"
            >
              <div className="mb-4 flex items-center justify-between">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-black">
                  <span className="text-2xl">•</span>
                </div>
                <ArrowRight className="h-5 w-5 text-gray-400 transition-transform group-hover:translate-x-1" />
              </div>
              <h3 className="mb-2 text-xl font-semibold">Interactive Halftone</h3>
              <p className="text-sm text-gray-600">
                Explore dynamic halftone patterns with ripple hover effects. Upload images and customize colors in real-time.
              </p>
              <div className="mt-4 flex gap-2">
                <span className="rounded-full bg-gray-100 px-3 py-1 text-xs text-gray-600">Interactive</span>
                <span className="rounded-full bg-gray-100 px-3 py-1 text-xs text-gray-600">Canvas</span>
              </div>
            </motion.div>
          </Link>

          {/* Halftone Converter Tool */}
          <Link href="/tools/halftone">
            <motion.div
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.2 }}
              className="group relative overflow-hidden rounded-2xl border border-gray-200 bg-gradient-to-br from-gray-50 to-white p-8 shadow-sm transition-shadow hover:shadow-md"
            >
              <div className="mb-4 flex items-center justify-between">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-black">
                  <span className="text-2xl">⊙</span>
                </div>
                <ArrowRight className="h-5 w-5 text-gray-400 transition-transform group-hover:translate-x-1" />
              </div>
              <h3 className="mb-2 text-xl font-semibold">Halftone Converter</h3>
              <p className="text-sm text-gray-600">
                Transform images into custom halftone patterns. Professional tool with color controls and instant preview.
              </p>
              <div className="mt-4 flex gap-2">
                <span className="rounded-full bg-gray-100 px-3 py-1 text-xs text-gray-600">Tool</span>
                <span className="rounded-full bg-gray-100 px-3 py-1 text-xs text-gray-600">Image Processing</span>
              </div>
            </motion.div>
          </Link>
        </div>
      </section>

      {/* Projects Grid */}
      <section id="work" className="px-6 pb-32 pt-16 md:px-12 lg:px-24">
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
      <section id="contact" className="flex min-h-[50vh] items-center justify-center px-8 pb-32">
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
