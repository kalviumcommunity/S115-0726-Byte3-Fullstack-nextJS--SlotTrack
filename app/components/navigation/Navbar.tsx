"use client";

import React from "react";
import Logo from "./Logo";
import LocationSelector from "./LocationSelector";
import ProfileDropdown from "./ProfileDropdown";

export interface NavbarProps {
  onProfileClick: () => void;
}

export default function Navbar({ onProfileClick }: NavbarProps) {
  return (
    <header className="fixed top-0 left-0 w-full h-[90px] md:h-[120px] bg-white border-b border-[#EEF2F6] z-40 transition-all duration-300">
      <div className="max-w-7xl mx-auto h-full px-6 flex items-center justify-between">
        {/* Left Section: Logo */}
        <div className="flex items-center">
          <Logo />
        </div>

        {/* Right Section: Location + Profile */}
        <div className="flex items-center space-x-3 md:space-x-6">
          <LocationSelector />
          <ProfileDropdown onProfileClick={onProfileClick} />
        </div>
      </div>
    </header>
  );
}
