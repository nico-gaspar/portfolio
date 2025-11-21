"use client";

import { motion } from "framer-motion";

interface Filter {
  id: string;
  label: string;
}

interface FilterTabsProps {
  filters: Filter[];
  activeFilter: string;
  onFilterChange: (filterId: string) => void;
}

export function FilterTabs({
  filters,
  activeFilter,
  onFilterChange,
}: FilterTabsProps) {
  return (
    <div className="flex items-center justify-center gap-9 py-8">
      {filters.map((filter) => {
        const isActive = activeFilter === filter.id;
        return (
          <motion.button
            key={filter.id}
            onClick={() => onFilterChange(filter.id)}
            className={`relative rounded-full px-6 py-3 text-lg transition-all ${
              isActive
                ? "bg-white shadow-[0px_4px_34px_-12px_rgba(0,0,0,0.25)]"
                : "hover:bg-gray-50"
            }`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <span
              className={`relative z-10 ${
                isActive ? "font-medium" : "font-normal"
              }`}
            >
              {filter.label}
            </span>
          </motion.button>
        );
      })}
    </div>
  );
}

