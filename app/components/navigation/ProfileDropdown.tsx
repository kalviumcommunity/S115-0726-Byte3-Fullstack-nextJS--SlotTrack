"use client";

import React, { useState } from "react";
import { User, LogOut, Settings, ChevronDown } from "lucide-react";
import Link from "next/link";
import Avatar from "../ui/Avatar";

export interface ProfileDropdownProps {
  onProfileClick: () => void;
  userName?: string;
  avatarUrl?: string;
}

export default function ProfileDropdown({
  onProfileClick,
  userName = "John Doe",
  avatarUrl = "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=256&auto=format&fit=crop",
}: ProfileDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-3 text-left focus:outline-none cursor-pointer hover:bg-bg-base/50 p-2 rounded-input transition-colors duration-200"
      >
        <Avatar
          src={avatarUrl}
          alt={userName}
          size="md"
          className="hover:border-primary transition-colors duration-200"
        />
        <div className="hidden sm:block font-sans">
          <div className="text-sm font-bold text-text-primary leading-tight font-manrope">Hi, {userName}</div>
          <div className="text-xs text-text-secondary font-semibold leading-tight font-manrope">Member</div>
        </div>
        <ChevronDown className="size-4 text-text-secondary" />
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)} />
          <div className="absolute right-0 mt-2 w-48 bg-surface rounded-input border border-border shadow-card z-20 overflow-hidden py-1 font-sans font-semibold">
            <button
              onClick={() => {
                onProfileClick();
                setIsOpen(false);
              }}
              className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-text-primary hover:bg-bg-base transition-colors font-medium text-left cursor-pointer"
            >
              <User className="size-4" />
              <span>My Profile Drawer</span>
            </button>
            <Link
              href="/admin"
              className="flex items-center gap-2 px-4 py-2.5 text-sm text-text-primary hover:bg-bg-base transition-colors font-medium cursor-pointer"
              onClick={() => setIsOpen(false)}
            >
              <Settings className="size-4" />
              <span>Instructor Panel</span>
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
