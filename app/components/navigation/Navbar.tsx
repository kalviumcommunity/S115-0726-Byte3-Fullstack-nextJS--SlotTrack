"use client";

import React from "react";
import Logo from "./Logo";
import LocationSelector from "./LocationSelector";
import ProfileDropdown from "./ProfileDropdown";

export interface NavbarProps {
  onProfileClick?: () => void;
}

export default function Navbar({ onProfileClick = () => { } }: NavbarProps) {
  return (
    <header className="fixed top-0 left-0 w-full h-[90px] md:h-[100px] bg-white border-b border-border z-40">
      <div className="max-w-7xl mx-auto h-full px-6 flex items-center justify-between">
        {/* Left Section: Logo + Location */}
        <div className="flex items-center gap-6">
          <Logo />
          <LocationSelector />
        </div>

        {/* Right Section: ProfileDropdown */}
        <div className="flex items-center gap-4">
          <ProfileDropdown onProfileClick={onProfileClick} />
        </div>
      </div>
    </header>
  );
}
