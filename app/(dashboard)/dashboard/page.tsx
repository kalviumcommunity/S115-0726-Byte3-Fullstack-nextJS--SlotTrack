"use client";

import React, { useState, useEffect } from "react";
import { useDashboard } from "../layout";
import SectionHeading from "@/app/components/ui/SectionHeading";
import ClassGrid from "@/app/components/cards/ClassGrid";
import ScheduleSidebar from "@/app/components/schedule/ScheduleSidebar";
import { ClassCardProps } from "@/app/components/cards/ClassCard";
import { getClasses } from "@/app/lib/api/classes";
import { FitnessClassType } from "@/app/types/fitness-class";

export default function UserDashboardPage() {
  const { bookedClassIds, toggleBookClass, selectedLocation } = useDashboard();
  const [classes, setClasses] = useState<FitnessClassType[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchClasses = async () => {
      setLoading(true);
      try {
        const data = await getClasses({ location: selectedLocation });
        setClasses(data);
      } catch (err) {
        console.error("Failed to fetch classes", err);
      } finally {
        setLoading(false);
      }
    };
    fetchClasses();
  }, [selectedLocation]);

  // Combine booking status with our class properties
  const processedClasses: ClassCardProps[] = classes.map((cls) => {
    const start = new Date(cls.startTime);
    const end = new Date(cls.endTime);
    
    const formattedDate = start.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });

    const formatTimeStr = (d: Date) => {
      return d.toLocaleTimeString("en-IN", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      });
    };
    const timeStr = `${formatTimeStr(start)} - ${formatTimeStr(end)}`;

    return {
      id: cls.id,
      title: cls.title,
      category: cls.category,
      image: cls.imageUrl || "https://images.unsplash.com/photo-1518611012118-696072aa579a?q=80&w=600&auto=format&fit=crop",
      date: formattedDate,
      time: timeStr,
      location: cls.location,
      price: cls.price,
      isBooked: bookedClassIds.includes(cls.id),
    };
  });

  // Extract unique categories dynamically from classes
  const categories = ["All", ...Array.from(new Set(classes.map((cls) => cls.category)))];

  // Filter classes based on selected category
  const filteredClasses = processedClasses.filter(
    (cls) => selectedCategory === "All" || cls.category === selectedCategory
  );

  // Build the list of schedule items for the sidebar based on booking list state
  const sidebarScheduleItems = processedClasses
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

          {loading ? (
            <div className="min-h-[300px] flex items-center justify-center">
              <svg className="animate-spin h-8 w-8 text-[#72BF6A]" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
            </div>
          ) : (
            <ClassGrid classes={filteredClasses} onBookToggle={toggleBookClass} />
          )}
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
