import React from "react";
import Link from "next/link";
import { Dumbbell } from "lucide-react";

export default function Logo() {
  return (
    <Link href="/" className="flex items-center gap-2 font-sora font-bold text-xl text-[#111827] cursor-pointer">
      <div className="flex items-center justify-center size-9 rounded-xl bg-primary text-[#111827]">
        <Dumbbell className="size-5" />
      </div>
      <span>SlotTrack</span>
    </Link>
  );
}
