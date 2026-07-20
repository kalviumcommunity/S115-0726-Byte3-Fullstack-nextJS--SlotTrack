"use client";

import React from "react";
import Link from "next/link";
import { Settings, LogOut } from "lucide-react";
import { signOut } from "next-auth/react";
import Drawer from "../ui/Drawer";
import ProfileCard from "./ProfileCard";
import HistoryTable, { HistoryRow } from "../tables/HistoryTable";

export interface ProfileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  userName?: string;
  userAge?: number;
  userContact?: string;
  userGender?: string;
  history: HistoryRow[];
  onProfileUpdate?: (name: string, gender?: string) => void;
}

export default function ProfileDrawer({
  isOpen,
  onClose,
  userName = "John Doe",
  userAge = 21,
  userContact = "XXXXXXXXXX",
  userGender = "Male",
  history,
  onProfileUpdate,
}: ProfileDrawerProps) {
  return (
    <Drawer isOpen={isOpen} onClose={onClose} title="Profile & Account">
      <div className="space-y-8 pb-10 flex flex-col h-full">
        {/* User Card info block */}
        <div>
          <ProfileCard
            name={userName}
            age={userAge}
            contact={userContact}
            gender={userGender}
            onEditToggle={onProfileUpdate}
          />
        </div>

        {/* History section */}
        <div className="space-y-4 flex-1">
          <div>
            <h3 className="font-sans font-bold text-2xl text-[#111827]">
              Your History
            </h3>
            <p className="font-sans text-sm font-semibold text-[#6B7280]">
              View all the classes you have attended
            </p>
          </div>

          <HistoryTable history={history} />
        </div>

        {/* Account Actions Section */}
        <div className="pt-6 border-t border-border flex flex-col sm:flex-row gap-4">
          <Link
            href="/admin"
            onClick={onClose}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-surface border border-border text-text-primary rounded-input hover:bg-bg-base transition-all duration-200 font-bold text-sm"
          >
            <Settings className="size-4 text-text-secondary" />
            <span>Instructor Panel</span>
          </Link>
          <button
            onClick={() => {
              onClose();
              signOut({ callbackUrl: "/login" });
            }}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-danger/10 text-danger rounded-input hover:bg-danger/20 transition-all duration-200 font-bold text-sm cursor-pointer"
          >
            <LogOut className="size-4" />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </Drawer>
  );
}
