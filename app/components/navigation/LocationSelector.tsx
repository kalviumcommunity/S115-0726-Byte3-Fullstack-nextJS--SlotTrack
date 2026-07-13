"use client";

import React, { useState, useRef, useEffect } from "react";

export default function LocationSelector() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState("Pune");
  const dropdownRef = useRef<HTMLDivElement>(null);

  const locations = ["Pune", "Mumbai", "Bangalore", "Delhi", "Hyderabad"];

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
        className="flex items-center justify-between w-[220px] md:w-[280px] h-[50px] md:h-[60px] px-5 bg-white border border-[#EEF2F6] rounded-[20px] shadow-[0_8px_32px_rgba(15,23,42,0.04)] hover:shadow-[0_12px_40px_rgba(15,23,42,0.08)] transition-all duration-300 select-none text-left"
      >
        <div className="flex items-center space-x-3">
          <svg
            className="w-5 h-5 text-[#72BF6A]"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25s-7.5-4.108-7.5-11.25a7.5 7.5 0 1115 0z"
            />
          </svg>
          <span className="font-sans font-bold text-base md:text-lg text-[#111827]">
            {selectedLocation}
          </span>
        </div>
        <svg
          className={`w-5 h-5 text-[#6B7280] transition-transform duration-300 ${
            isOpen ? "rotate-180" : ""
          }`}
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute top-[70px] left-0 w-full bg-white border border-[#EEF2F6] rounded-[20px] shadow-[0_12px_40px_rgba(0,0,0,0.12)] z-30 py-2 animate-fade-in">
          {locations.map((loc) => (
            <button
              key={loc}
              onClick={() => {
                setSelectedLocation(loc);
                setIsOpen(false);
              }}
              className={`flex items-center justify-between w-full px-5 py-3 hover:bg-[#F8F8FA] transition-colors font-sans text-base font-semibold text-left ${
                selectedLocation === loc ? "text-[#72BF6A]" : "text-[#111827]"
              }`}
            >
              {loc}
              {selectedLocation === loc && (
                <svg className="w-5 h-5 text-[#72BF6A]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
