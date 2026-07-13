import React from "react";
import { MapPin, ChevronDown } from "lucide-react";

export default function LocationSelector() {
  return (
    <div className="flex items-center gap-2 rounded-2xl bg-white px-4 py-2 border border-gray-100 shadow-[0px_4px_12px_rgba(0,0,0,0.03)] cursor-pointer hover:bg-gray-50 transition-colors">
      <MapPin className="h-4 w-4 text-accent" />
      <span className="text-sm font-medium text-text-primary">Studio 2, Main floor</span>
      <ChevronDown className="h-3.5 w-3.5 text-text-secondary" />
    </div>
  );
}
