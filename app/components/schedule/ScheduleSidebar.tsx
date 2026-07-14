"use client";

import React from "react";
import ScheduleItem, { ScheduleItemProps } from "./ScheduleItem";
import { Calendar, Sparkles } from "lucide-react";

export interface ScheduleSidebarProps {
  scheduleItems: Omit<ScheduleItemProps, "onCancel">[];
  onCancelBooking: (id: string) => void;
}

export default function ScheduleSidebar({
  scheduleItems,
  onCancelBooking,
}: ScheduleSidebarProps) {
  // Format today's date dynamically to resemble Figma: "Today | 13 July | Monday"
  const getFigmaFormattedDate = () => {
    const today = new Date();
    const day = today.getDate();
    const month = today.toLocaleString("en-US", { month: "long" });
    const weekday = today.toLocaleString("en-US", { weekday: "long" });
    return `Today | ${day} ${month} | ${weekday}`;
  };

  return (
    <div className="bg-white border border-[#EEF2F6] rounded-[24px] shadow-[0_8px_30px_rgba(0,0,0,0.06)] p-6 flex flex-col min-h-[460px] md:min-h-[540px]">
      {/* Sidebar Header */}
      <div className="mb-6">
        <h3 className="font-sans font-bold text-2xl text-[#111827] mb-1">
          Your Schedule
        </h3>
        <p className="font-sans text-sm font-semibold text-[#72BF6A]">
          {getFigmaFormattedDate()}
        </p>
      </div>

      {/* Scrollable Schedule list */}
      <div className="flex-1 flex flex-col justify-between">
        <div className={`overflow-y-auto space-y-2 max-h-[360px] md:max-h-[420px] pr-1 scrollbar-thin flex-1 flex flex-col ${
          scheduleItems.length === 0 ? "justify-center" : "justify-start"
        }`}>
          {scheduleItems.length > 0 ? (
            <div className="space-y-2 w-full">
              {scheduleItems.map((item) => (
                <ScheduleItem
                  key={item.id}
                  id={item.id}
                  title={item.title}
                  time={item.time}
                  status={item.status}
                  location={item.location}
                  onCancel={onCancelBooking}
                />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 px-4 text-center space-y-4 my-auto">
              <div className="h-16 w-16 rounded-full bg-gray-50 flex items-center justify-center text-text-secondary border border-gray-100">
                <Calendar className="h-8 w-8 text-gray-400 stroke-[1.5]" />
              </div>
              <div className="space-y-1">
                <p className="text-sm font-bold text-text-primary">Your schedule is empty</p>
                <p className="text-xs text-text-secondary max-w-[220px]">
                  Explore available classes and book a slot to start tracking your progress!
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Suggestion Card for empty slots (shown when 1 or 2 classes are booked) */}
        {scheduleItems.length > 0 && scheduleItems.length < 3 && (
          <div className="border border-dashed border-gray-200 bg-gray-50/50 rounded-[20px] p-5 flex flex-col items-center text-center sm:text-left sm:items-start sm:flex-row gap-4 mt-6 shrink-0">
            <div className="h-11 w-11 rounded-full bg-[#72BF6A]/10 flex items-center justify-center text-[#72BF6A] shrink-0">
              <Sparkles className="h-5.5 w-5.5" />
            </div>
            <div className="space-y-1">
              <h4 className="text-sm font-bold text-[#111827]">Ready for another one?</h4>
              <p className="text-xs text-[#6B7280] leading-relaxed">
                Add another class today to make the most of your routine and hit your fitness milestones!
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
