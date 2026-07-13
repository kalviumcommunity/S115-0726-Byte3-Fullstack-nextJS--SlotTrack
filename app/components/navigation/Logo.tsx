import React from "react";
import Link from "next/link";
import { Dumbbell } from "lucide-react";

export default function Logo() {
  return (
    <div className="flex items-center gap-3.5 flex-shrink-0 cursor-pointer">
      <img
        src="/cure-fit-logo-removebg-preview 1.png"
        alt="Cure.fit Logo"
        className="h-6 md:h-7 w-auto object-contain"
      />
      <div className="h-6 w-px bg-gray-200"></div>
      <img
        src="/slottrack-logo-removebg-preview 1 (1).png"
        alt="SlotTrack Logo"
        className="h-8 md:h-9 w-auto object-contain"
      />
    </div>
  );
}
