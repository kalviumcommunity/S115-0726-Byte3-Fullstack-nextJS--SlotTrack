import React from "react";
import Link from "next/link";

export default function Logo() {
  return (
    <Link href="/" className="flex items-center space-x-2 select-none group">
      <div className="relative w-10 h-10 bg-[#72BF6A] rounded-[10px] flex items-center justify-center shadow-[0_4px_12px_rgba(114,191,106,0.3)] group-hover:rotate-6 transition-all duration-300">
        <svg
          className="w-6 h-6 text-white"
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M5 13l4 4L19 7"
          />
        </svg>
      </div>
      <div className="flex flex-col">
        <span className="font-sans font-black text-2xl tracking-tighter text-[#111827] leading-none">
          Slot<span className="text-[#72BF6A]">Track</span>
        </span>
        <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#6B7280]">
          Cure.fit booking
        </span>
      </div>
    </Link>
  );
}
