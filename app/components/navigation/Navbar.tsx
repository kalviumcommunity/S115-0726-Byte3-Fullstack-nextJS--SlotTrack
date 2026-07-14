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
<<<<<<< HEAD
    <header className="fixed top-0 left-0 w-full h-[64px] md:h-[72px] bg-surface border-b border-border z-40 transition-all duration-300">
=======
    <header className="fixed top-0 left-0 w-full h-[90px] md:h-[100px] bg-white border-b border-border z-40">
>>>>>>> 4ce35372faae420b5c2dbf557b577884f7fc7d6d
      <div className="max-w-7xl mx-auto h-full px-6 flex items-center justify-between">
        {/* Left Section: Logo + Location */}
        <div className="flex items-center gap-6">
          <Logo />
<<<<<<< HEAD
        </div>

        {/* Right Section: Location Selector and Profile Dropdown side-by-side */}
        <div className="flex items-center gap-4 md:gap-6">
=======
>>>>>>> 4ce35372faae420b5c2dbf557b577884f7fc7d6d
          <LocationSelector />
          <ProfileDropdown onProfileClick={onProfileClick} />
        </div>
      </div>
    </header>
  );
}
