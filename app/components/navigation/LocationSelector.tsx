"use client";

import React, { useState, useRef, useEffect } from "react";
import { MapPin, ChevronDown } from "lucide-react";
import { cn } from "@/app/lib/utils";
import { useDashboard } from "../../(dashboard)/layout";

export const LOCATIONS = ["Pune", "Mumbai", "Bangalore", "Delhi", "Hyderabad", "HSR Layout", "Indiranagar", "Koramangala"];

export default function LocationSelector() {
  let selectedLocation = LOCATIONS[0];
  let setSelectedLocation = (loc: string) => {};

  const [localLoc, setLocalLoc] = useState(LOCATIONS[0]);

  try {
    const context = useDashboard();
    selectedLocation = context.selectedLocation;
    setSelectedLocation = context.setSelectedLocation;
  } catch (e) {
    selectedLocation = localLoc;
    setSelectedLocation = setLocalLoc;
  }

  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-5 py-2.5 rounded-full hover:bg-bg-base transition-all duration-300 text-base font-bold text-text-primary border border-border bg-surface cursor-pointer select-none shadow-sm"
      >
        <MapPin className="size-5 text-primary" />
        <span>{selectedLocation}</span>
        <ChevronDown
          className={cn("size-4 text-text-secondary transition-transform duration-300", isOpen && "rotate-180")}
        />
      </button>

      {isOpen && (
        <div className="absolute left-1/2 -translate-x-1/2 mt-2 w-48 bg-surface rounded-input border border-border shadow-card z-30 overflow-hidden py-1 animate-fade-in font-sans font-semibold">
          {LOCATIONS.map((loc) => (
            <button
              key={loc}
              onClick={() => {
                setSelectedLocation(loc);
                setIsOpen(false);
              }}
              className={cn(
                "w-full text-left px-4 py-2.5 text-sm hover:bg-bg-base transition-colors cursor-pointer",
                selectedLocation === loc ? "text-primary bg-primary/5 font-extrabold" : "text-text-primary font-medium"
              )}
            >
              {loc}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
