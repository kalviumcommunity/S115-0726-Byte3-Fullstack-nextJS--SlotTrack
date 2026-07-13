"use client";

import React, { useState } from "react";
import { useDashboard } from "../layout";
import SectionHeading from "../../components/ui/SectionHeading";
import ClassGrid from "../../components/cards/ClassGrid";
import ScheduleSidebar from "../../components/schedule/ScheduleSidebar";
import { ClassCardProps } from "../../components/cards/ClassCard";

export default function UserDashboardPage() {
  const { bookedClassIds, toggleBookClass } = useDashboard();

  // Initial available classes list
  const [classes] = useState<Omit<ClassCardProps, "isBooked" | "onBookToggle">[]>([
    {
      id: "class-1",
      title: "Strength Training",
      category: "Strength",
      image: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=800&auto=format&fit=crop",
      time: "8:00 AM - 9:00 AM",
      date: "Monday",
      location: "Hadapsar, Pune",
    },
    {
      id: "class-2",
      title: "Yoga Flow",
      category: "Yoga",
      image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=800&auto=format&fit=crop",
      time: "9:00 AM - 10:00 AM",
      date: "Monday",
      location: "Hadapsar, Pune",
    },
    {
      id: "class-3",
      title: "HIIT Cardio",
      category: "Cardio",
      image: "https://images.unsplash.com/photo-1518310383802-640c2de311b2?q=80&w=800&auto=format&fit=crop",
      time: "10:00 AM - 11:00 AM",
      date: "Monday",
      location: "Hadapsar, Pune",
    },
    {
      id: "class-4",
      title: "Meditation Zen",
      category: "Mind",
      image: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?q=80&w=800&auto=format&fit=crop",
      time: "6:00 AM - 7:00 AM",
      date: "Monday",
      location: "Hadapsar, Pune",
    },
    {
      id: "class-5",
      title: "Calisthenics Core",
      category: "Strength",
      image: "https://images.unsplash.com/photo-1598971639058-fab3c3109a00?q=80&w=800&auto=format&fit=crop",
      time: "4:00 PM - 5:00 PM",
      date: "Monday",
      location: "Hadapsar, Pune",
    },
    {
      id: "class-6",
      title: "Zumba Dance",
      category: "Cardio",
      image: "https://images.unsplash.com/photo-1524594152303-9fd13543dd6e?q=80&w=800&auto=format&fit=crop",
      time: "4:00 PM - 5:00 PM",
      date: "Monday",
      location: "Hadapsar, Pune",
    },
  ]);

  // Combine booking status with our class properties
  const processedClasses: ClassCardProps[] = classes.map((cls) => ({
    ...cls,
    isBooked: bookedClassIds.includes(cls.id),
  }));

  // Build the list of schedule items for the sidebar based on booking list state
  const sidebarScheduleItems = classes.map((cls) => {
    const isBooked = bookedClassIds.includes(cls.id);
    return {
      id: cls.id,
      title: cls.title,
      time: cls.time,
      location: cls.location,
      status: (isBooked ? "booked" : "upcoming") as "booked" | "upcoming" | "canceled",
    };
  });

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      {/* Left Main Section: Available Classes List */}
      <div className="lg:col-span-8 space-y-6">
        <SectionHeading
          title="Available Classes"
          subtitle="Choose a class that fits your energy today"
        />

        <ClassGrid classes={processedClasses} onBookToggle={toggleBookClass} />
      </div>

      {/* Right Fixed Section: Today's Schedule Sidebar */}
      <div className="lg:col-span-4 lg:sticky lg:top-[150px]">
        <ScheduleSidebar
          scheduleItems={sidebarScheduleItems}
          onCancelBooking={toggleBookClass}
        />
      </div>
    </div>
  );
}
