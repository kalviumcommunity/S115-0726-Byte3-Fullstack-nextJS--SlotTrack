"use client";

import React from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";

export default function Logo() {
  const { data: session } = useSession();
  const href = session ? "/dashboard" : "/";

  return (
    <Link href={href} className="flex items-center gap-2 sm:gap-3.5 flex-shrink-0 cursor-pointer">
      <img
        src="/cure-fit-logo-removebg-preview 1.png"
        alt="Cure.fit Logo"
        className="h-5 sm:h-6 md:h-7 w-auto object-contain"
      />
      <div className="h-5 sm:h-6 w-px bg-gray-200"></div>
      <img
        src="/slottrack-logo-removebg-preview 1 (1).png"
        alt="SlotTrack Logo"
        className="h-7 sm:h-8 md:h-9 w-auto object-contain"
      />
    </Link>
  );
}

