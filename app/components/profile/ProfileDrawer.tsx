"use client";

import React from "react";
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
}

export default function ProfileDrawer({
  isOpen,
  onClose,
  userName = "John Doe",
  userAge = 21,
  userContact = "XXXXXXXXXX",
  userGender = "Male",
  history,
}: ProfileDrawerProps) {
  return (
    <Drawer isOpen={isOpen} onClose={onClose} title="Profile & Account">
      <div className="space-y-8 pb-10">
        {/* User Card info block */}
        <div>
          <ProfileCard
            name={userName}
            age={userAge}
            contact={userContact}
            gender={userGender}
          />
        </div>

        {/* History section */}
        <div className="space-y-4">
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
      </div>
    </Drawer>
  );
}
