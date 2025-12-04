"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import {
  Navbar,
  NavBody,
  NavItems,
  MobileNav,
  MobileNavHeader,
  MobileNavMenu,
  MobileNavToggle,
} from "@/components/ui/resizable-navbar";

const navItems = [
  { name: "Case Studies", link: "#case-studies" },
  { name: "Timeline", link: "#timeline" },
  { name: "Flex Spot", link: "#flex-spot" },
];

interface PortfolioNavbarProps {
  activeFilter: string;
  onFilterChange: (filterId: string) => void;
}

export function PortfolioNavbar({
  activeFilter,
  onFilterChange,
}: PortfolioNavbarProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleNavItemClick = (filterId: string) => {
    onFilterChange(filterId);
  };

  const handleMobileNavItemClick = (filterId: string) => {
    onFilterChange(filterId);
    setIsOpen(false);
  };

  return (
    <Navbar className="fixed bottom-8 top-auto">
      {/* Desktop Nav */}
      <NavBody>
        <NavItems
          items={navItems}
          activeFilter={activeFilter}
          onFilterChange={onFilterChange}
          className="gap-1"
        />
      </NavBody>

      {/* Mobile Nav */}
      <MobileNav>
        <MobileNavHeader>
          <MobileNavToggle isOpen={isOpen} onClick={() => setIsOpen(!isOpen)} />
        </MobileNavHeader>
        <MobileNavMenu isOpen={isOpen} onClose={() => setIsOpen(false)}>
          {navItems.map((item, idx) => {
            const filterId = item.name.toLowerCase().replace(" ", "-");
            const isActive = activeFilter === filterId;
            return (
              <button
                key={`mobile-link-${idx}`}
                onClick={() => handleMobileNavItemClick(filterId)}
                className={cn(
                  "w-full text-left text-neutral-600 dark:text-neutral-300",
                  isActive && "font-medium"
                )}
              >
                {item.name}
              </button>
            );
          })}
        </MobileNavMenu>
      </MobileNav>
    </Navbar>
  );
}

