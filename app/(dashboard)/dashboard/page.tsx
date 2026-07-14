"use client";

import React from "react";
import { useDashboard } from "../layout";
import SectionHeading from "@/app/components/ui/SectionHeading";
import ClassGrid from "@/app/components/cards/ClassGrid";
import ScheduleSidebar from "@/app/components/schedule/ScheduleSidebar";
import { ClassCardProps } from "@/app/components/cards/ClassCard";
import { DASHBOARD_CLASSES } from "@/app/lib/mockData";

export default function UserDashboardPage() {
  const { bookedClassIds, toggleBookClass } = useDashboard();

  // Combine booking status with our class properties
  const processedClasses: ClassCardProps[] = DASHBOARD_CLASSES.map((cls) => ({
    ...cls,
    isBooked: bookedClassIds.includes(cls.id),
  }));

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
        <div className="lg:col-span-8">
          <ClassGrid classes={processedClasses} onBookToggle={toggleBookClass} />
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
