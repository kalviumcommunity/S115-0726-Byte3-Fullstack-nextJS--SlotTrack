import React from "react";
import Logo from "./Logo";
import LocationSelector from "./LocationSelector";
import ProfileDropdown from "./ProfileDropdown";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-border bg-surface/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-6">
          <Logo />
        </div>
        <div className="flex items-center justify-center flex-1">
          <LocationSelector />
        </div>
        <div className="flex items-center gap-4">
          <ProfileDropdown />
        </div>
      </div>
    </header>
  );
}
