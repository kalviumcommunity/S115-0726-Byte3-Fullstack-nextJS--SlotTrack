"use client";

import React, { createContext, useContext, useState } from "react";
import Navbar from "../components/navigation/Navbar";
import ProfileDrawer from "../components/profile/ProfileDrawer";
import { HistoryRow } from "../components/tables/HistoryTable";

// Define the dashboard state context
interface DashboardContextType {
  isProfileOpen: boolean;
  setIsProfileOpen: (open: boolean) => void;
  bookedClassIds: string[];
  toggleBookClass: (id: string) => void;
  history: HistoryRow[];
}

const DashboardContext = createContext<DashboardContextType | undefined>(undefined);

export function useDashboard() {
  const context = useContext(DashboardContext);
  if (!context) {
    throw new Error("useDashboard must be used within a DashboardProvider");
  }
  return context;
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [bookedClassIds, setBookedClassIds] = useState<string[]>(["class-1", "class-3"]);

  // Mock static history rows
  const [history] = useState<HistoryRow[]>([
    {
      id: "hist-1",
      title: "Strength Training",
      category: "Strength",
      date: "10 Jul 2026",
      time: "08:00 AM - 09:00 AM",
    },
    {
      id: "hist-2",
      title: "Yoga",
      category: "Yoga",
      date: "10 Jul 2026",
      time: "09:00 AM - 10:00 AM",
    },
    {
      id: "hist-3",
      title: "HIIT Cardio",
      category: "Cardio",
      date: "10 Jul 2026",
      time: "10:00 AM - 11:00 AM",
    },
    {
      id: "hist-4",
      title: "Meditation",
      category: "Mind",
      date: "10 Jul 2026",
      time: "06:00 AM - 07:00 AM",
    },
    {
      id: "hist-5",
      title: "Calisthenics",
      category: "Strength",
      date: "9 Jul 2026",
      time: "04:00 PM - 06:00 PM",
    },
  ]);

  const toggleBookClass = (id: string) => {
    setBookedClassIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  return (
    <DashboardContext.Provider
      value={{
        isProfileOpen,
        setIsProfileOpen,
        bookedClassIds,
        toggleBookClass,
        history,
      }}
    >
      <div className="min-h-screen bg-[#F8F8FA] flex flex-col font-sans antialiased text-[#111827]">
        {/* Navigation header bar */}
        <Navbar onProfileClick={() => setIsProfileOpen(true)} />

        {/* Spacing for fixed Navbar (height ~72px) */}
        <div className="h-[64px] md:h-[72px] shrink-0" />

        {/* Content area */}
        <main className="flex-1 w-full max-w-7xl mx-auto px-6 py-8 md:py-12">
          {children}
        </main>

        {/* Profile Drawer component */}
        <ProfileDrawer
          isOpen={isProfileOpen}
          onClose={() => setIsProfileOpen(false)}
          userName="John Doe"
          userAge={21}
          userContact="9876543210"
          userGender="Male"
          history={history}
        />
      </div>
    </DashboardContext.Provider>
  );
}
