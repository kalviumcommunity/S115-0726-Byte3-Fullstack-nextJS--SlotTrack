"use client";

import React, { useState } from "react";
import { MapPin, ChevronDown } from "lucide-react";

const LOCATIONS = ["HSR Layout", "Indiranagar", "Koramangala", "Jayanagar", "Whitefield"];

export default function LocationSelector() {
  const [selectedLocation, setSelectedLocation] = useState(LOCATIONS[0]);
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-full hover:bg-bg-base transition-colors text-sm font-semibold text-text-primary border border-border bg-surface cursor-pointer"
      >
        <MapPin className="size-4 text-primary" />
        <span>{selectedLocation}</span>
        <ChevronDown className="size-3.5 text-text-secondary" />
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)} />
          <div className="absolute left-1/2 -translate-x-1/2 mt-2 w-48 bg-surface rounded-input border border-border shadow-card z-20 overflow-hidden py-1">
            {LOCATIONS.map((loc) => (
              <button
                key={loc}
                onClick={() => {
                  setSelectedLocation(loc);
                  setIsOpen(false);
                }}
                className="w-full text-left px-4 py-2 text-sm hover:bg-bg-base transition-colors text-text-primary font-medium cursor-pointer"
              >
                {loc}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
