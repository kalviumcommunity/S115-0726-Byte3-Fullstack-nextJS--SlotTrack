"use client";

import React, { useState } from "react";
import { User, LogOut, Settings, ChevronDown } from "lucide-react";
import Link from "next/link";

export default function ProfileDropdown() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-3 text-left focus:outline-none cursor-pointer"
      >
        <div className="flex items-center justify-center size-10 rounded-full bg-border text-text-primary hover:bg-primary/20 hover:text-primary transition-colors">
          <User className="size-5" />
        </div>
        <div className="hidden sm:block">
          <div className="text-sm font-semibold text-text-primary leading-tight font-manrope">Hi, John</div>
          <div className="text-xs text-text-secondary leading-tight font-manrope">Instructor</div>
        </div>
        <ChevronDown className="size-4 text-text-secondary" />
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)} />
          <div className="absolute right-0 mt-2 w-48 bg-surface rounded-input border border-border shadow-card z-20 overflow-hidden py-1">
            <Link
              href="/profile"
              className="flex items-center gap-2 px-4 py-2.5 text-sm text-text-primary hover:bg-bg-base transition-colors font-medium cursor-pointer"
              onClick={() => setIsOpen(false)}
            >
              <User className="size-4" />
              <span>My Profile</span>
            </Link>
            <Link
              href="/admin"
              className="flex items-center gap-2 px-4 py-2.5 text-sm text-text-primary hover:bg-bg-base transition-colors font-medium cursor-pointer"
              onClick={() => setIsOpen(false)}
            >
              <Settings className="size-4" />
              <span>Admin Panel</span>
            </Link>
            <hr className="border-border my-1" />
            <button
              onClick={() => {
                setIsOpen(false);
              }}
              className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-danger hover:bg-red-50 transition-colors font-medium text-left cursor-pointer"
            >
              <LogOut className="size-4" />
              <span>Logout</span>
            </button>
          </div>
        </>
      )}
    </div>
  );
}
