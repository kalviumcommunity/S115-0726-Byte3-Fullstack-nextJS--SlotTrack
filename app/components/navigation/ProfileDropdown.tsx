"use client";

import React from "react";
import Avatar from "../ui/Avatar";

export interface ProfileDropdownProps {
  onProfileClick: () => void;
  userName?: string;
  avatarUrl?: string;
  role?: string;
}

export default function ProfileDropdown({
  onProfileClick,
  userName = "John Doe",
  avatarUrl = "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=256&auto=format&fit=crop",
  role = "MEMBER",
}: ProfileDropdownProps) {
  const displayRole = role === "ADMIN" ? "Instructor" : "Member";

  return (
    <div className="relative shrink-0">
      <button
        onClick={onProfileClick}
        aria-label="Open profile drawer"
        className="flex items-center gap-2 sm:gap-3 text-left focus:outline-none cursor-pointer hover:bg-bg-base/50 p-1 sm:p-2 rounded-input transition-colors duration-200"
      >
        <Avatar
          src={avatarUrl}
          alt={userName}
          size="md"
          className="hover:border-primary transition-colors duration-200"
        />
        <div className="hidden sm:block font-sans">
          <div className="text-sm font-bold text-text-primary leading-tight font-manrope">Hi, {userName}</div>
          <div className="text-xs text-text-secondary font-semibold leading-tight font-manrope">{displayRole}</div>
        </div>
      </button>
    </div>
  );
}
