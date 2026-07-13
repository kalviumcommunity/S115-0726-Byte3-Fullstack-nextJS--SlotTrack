"use client";

import React from "react";
import Avatar from "../ui/Avatar";

export interface ProfileDropdownProps {
  onProfileClick: () => void;
  userName?: string;
  avatarUrl?: string;
}

export default function ProfileDropdown({
  onProfileClick,
  userName = "John Doe",
  avatarUrl = "/avatar.png", // fallback placeholder url
}: ProfileDropdownProps) {
  // Use mock initial image since we don't have static assets
  const fallbackAvatar = "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=256&auto=format&fit=crop";

  return (
    <button
      onClick={onProfileClick}
      className="flex items-center space-x-3 hover:bg-[#EEF2F6] px-4 py-2 rounded-[20px] transition-all duration-300 active:scale-[0.98] group select-none"
    >
      <div className="flex flex-col text-right hidden sm:flex">
        <span className="text-xs font-bold text-[#6B7280]">Welcome back,</span>
        <span className="text-base font-bold text-[#111827] leading-tight group-hover:text-[#72BF6A] transition-colors">
          {userName}
        </span>
      </div>
      
      <Avatar
        src={fallbackAvatar}
        alt={userName}
        size="md"
        className="group-hover:border-[#72BF6A] transition-colors"
      />

      <svg
        className="w-4 h-4 text-[#6B7280] group-hover:text-[#111827] transition-colors hidden sm:block"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        viewBox="0 0 24 24"
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
      </svg>
    </button>
  );
}
