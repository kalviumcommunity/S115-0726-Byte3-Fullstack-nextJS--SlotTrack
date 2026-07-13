import React from "react";
import { User, LogOut, Settings, Calendar } from "lucide-react";

export default function ProfileDropdown() {
  return (
    <div className="flex items-center gap-3 cursor-pointer group relative">
      <div className="flex flex-col items-end hidden md:flex">
        <span className="text-sm font-semibold text-text-primary">Ruhaan</span>
        <span className="text-xs text-text-secondary">Member</span>
      </div>
      <div className="relative h-10 w-10 overflow-hidden rounded-full border-2 border-white ring-2 ring-gray-150 bg-gray-100 flex items-center justify-center transition-all hover:ring-accent">
        <span className="text-sm font-bold text-gray-700">R</span>
        <div className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-white bg-green-500"></div>
      </div>
    </div>
  );
}
