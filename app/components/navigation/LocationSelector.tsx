"use client";

import React, { useState, useRef, useEffect } from "react";
import { MapPin, ChevronDown, Check } from "lucide-react";
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
        aria-label={`Select location, current location is ${selectedLocation}`}
        aria-expanded={isOpen}
        title={selectedLocation}
        className="flex items-center justify-center gap-2 p-2 sm:px-5 sm:py-2.5 rounded-full hover:bg-bg-base transition-all duration-300 text-sm sm:text-base font-bold text-text-primary border border-border bg-surface cursor-pointer select-none shadow-sm"
      >
        <MapPin className="size-5 text-primary shrink-0" />
        <span className="hidden sm:inline font-bold">{selectedLocation}</span>
        <ChevronDown
          className={cn("hidden sm:block size-4 text-text-secondary transition-transform duration-300 shrink-0", isOpen && "rotate-180")}
        />
      </button>

      {isOpen && (
        <div className="absolute right-0 sm:right-auto sm:left-1/2 sm:-translate-x-1/2 mt-2 w-48 sm:w-52 bg-surface rounded-2xl sm:rounded-input border border-border shadow-card z-50 overflow-hidden py-1 animate-fade-in font-sans font-semibold">
          {/* Header on mobile showing active location context */}
          <div className="px-3.5 py-2 border-b border-border text-xs font-bold text-text-secondary uppercase tracking-wider flex items-center justify-between sm:hidden">
            <span>Location</span>
            <span className="text-primary font-extrabold">{selectedLocation}</span>
          </div>

          <div className="max-h-60 overflow-y-auto scrollbar-thin">
            {LOCATIONS.map((loc) => {
              const isSelected = selectedLocation === loc;
              return (
                <button
                  key={loc}
                  onClick={() => {
                    setSelectedLocation(loc);
                    setIsOpen(false);
                  }}
                  className={cn(
                    "w-full text-left px-3.5 py-2.5 text-sm flex items-center justify-between hover:bg-bg-base transition-colors cursor-pointer",
                    isSelected ? "text-primary bg-primary/5 font-extrabold" : "text-text-primary font-medium"
                  )}
                >
                  <span className="truncate">{loc}</span>
                  {isSelected && <Check className="size-4 text-primary shrink-0 ml-2" />}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
