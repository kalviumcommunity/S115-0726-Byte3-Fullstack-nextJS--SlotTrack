"use client";

import React, { useState } from "react";
import { useDashboard } from "../layout";
import SectionHeading from "@/app/components/ui/SectionHeading";
import ClassGrid from "@/app/components/cards/ClassGrid";
import ScheduleSidebar from "@/app/components/schedule/ScheduleSidebar";
import { ClassCardProps } from "@/app/components/cards/ClassCard";
import { DASHBOARD_CLASSES } from "@/app/lib/mockData";

export default function UserDashboardPage() {
  const { bookedClassIds, toggleBookClass } = useDashboard();
  const [selectedCategory, setSelectedCategory] = useState("All");

  // Combine booking status with our class properties
  const processedClasses: ClassCardProps[] = DASHBOARD_CLASSES.map((cls) => ({
    ...cls,
    isBooked: bookedClassIds.includes(cls.id),
  }));

  // Extract unique categories dynamically from DASHBOARD_CLASSES
  const categories = ["All", ...Array.from(new Set(DASHBOARD_CLASSES.map((cls) => cls.category)))];

  // Filter classes based on selected category
  const filteredClasses = processedClasses.filter(
    (cls) => selectedCategory === "All" || cls.category === selectedCategory
  );

  // Build the list of schedule items for the sidebar based on booking list state
  const sidebarScheduleItems = DASHBOARD_CLASSES
    .filter((cls) => bookedClassIds.includes(cls.id))
    .map((cls) => ({
      id: cls.id,
      title: cls.title,
      time: cls.time,
      location: cls.location,
      status: "booked" as const,
    }));

  return (
    <div className="space-y-6">
      {/* Header Section outside of the columns to align them top-horizontally */}
      <SectionHeading
        title="Available Classes"
        subtitle="Choose a class that fits your energy today"
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Main Section: Available Classes List */}
        <div className="lg:col-span-8 space-y-6">
          {/* Dynamic Horizontal Filter Bar */}
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1 select-none flex-nowrap">
            {categories.map((category) => {
              const isActive = selectedCategory === category;
              return (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-1.5 text-xs rounded-full transition-all duration-300 cursor-pointer border whitespace-nowrap uppercase tracking-wider select-none ${
                    isActive
                      ? "bg-white border-[#72BF6A] text-[#72BF6A] font-bold"
                      : "bg-white border-[#EEF2F6] text-[#111827] font-semibold hover:bg-[#F8F8FA]"
                  }`}
                >
                  {category}
                </button>
              );
            })}
          </div>

          <ClassGrid classes={filteredClasses} onBookToggle={toggleBookClass} />
        </div>

        {/* Right Fixed Section: Today's Schedule Sidebar */}
        <div className="lg:col-span-4 lg:sticky lg:top-[112px]">
          <ScheduleSidebar
            scheduleItems={sidebarScheduleItems}
            onCancelBooking={toggleBookClass}
          />
        </div>
      </div>
    </div>
  );
}
