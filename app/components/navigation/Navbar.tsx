import React from "react";
import Logo from "./Logo";
import ProfileDropdown from "./ProfileDropdown";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-100 bg-white shadow-[0px_2px_8px_rgba(0,0,0,0.02)]">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Logo />
        <ProfileDropdown />
      </div>
    </header>
  );
}
