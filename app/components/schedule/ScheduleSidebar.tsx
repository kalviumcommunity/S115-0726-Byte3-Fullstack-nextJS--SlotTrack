"use client";

import React from "react";
import ScheduleItem from "./ScheduleItem";
import { Calendar, Sparkles } from "lucide-react";

export interface ScheduleSidebarProps {
  bookings: any[];
  onCancelBooking: (id: string) => void;
}

export default function ScheduleSidebar({
  bookings = [],
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

  // Helper to format intelligent day labels
  const getDayLabel = (dateStr: string) => {
    const date = new Date(dateStr);
    const today = new Date();
    const tomorrow = new Date();
    tomorrow.setDate(today.getDate() + 1);

    const isToday =
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear();

    const isTomorrow =
      date.getDate() === tomorrow.getDate() &&
      date.getMonth() === tomorrow.getMonth() &&
      date.getFullYear() === tomorrow.getFullYear();

    const day = date.getDate();
    const monthName = date.toLocaleString("en-US", { month: "long" });
    const weekday = date.toLocaleString("en-US", { weekday: "long" });

    if (isToday) {
      return `Today | ${day} ${monthName} | ${weekday}`;
    } else if (isTomorrow) {
      return `Tomorrow | ${day} ${monthName} | ${weekday}`;
    } else {
      return `${day} ${monthName} | ${weekday}`;
    }
  };

  // Helper to format class start and end time
  const formatTimeStr = (startStr: string, endStr?: string) => {
    const start = new Date(startStr);
    const fmt = (d: Date) => {
      return d.toLocaleTimeString("en-IN", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      });
    };
    if (endStr) {
      const end = new Date(endStr);
      return `${fmt(start)} - ${fmt(end)}`;
    }
    return fmt(start);
  };

  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);

  // 1. Filter: ACTIVE, class exists, startTime is today or in the future
  const activeUpcoming = bookings.filter((booking) => {
    if (booking.status !== "ACTIVE" || !booking.class) {
      return false;
    }
    const classStart = new Date(booking.class.startTime);
    return classStart.getTime() >= startOfToday.getTime();
  });

  // 2. Deduplicate: Ensure each scheduled class appears only ONCE by classId
  const seenClassIds = new Set<string>();
  const uniqueActiveUpcoming = activeUpcoming.filter((booking) => {
    const classId = booking.classId || booking.class?.id;
    if (!classId) return true;
    if (seenClassIds.has(classId)) {
      return false;
    }
    seenClassIds.add(classId);
    return true;
  });

  // 3. Sort: Date ascending, then start time ascending
  uniqueActiveUpcoming.sort((a, b) => {
    const timeA = new Date(a.class.startTime).getTime();
    const timeB = new Date(b.class.startTime).getTime();
    return timeA - timeB;
  });

  // 4. Group by calendar day
  const groups: { [dateKey: string]: { label: string; dateVal: Date; items: any[] } } = {};
  
  uniqueActiveUpcoming.forEach((booking) => {
    const classStart = new Date(booking.class.startTime);
    const dateKey = `${classStart.getFullYear()}-${classStart.getMonth() + 1}-${classStart.getDate()}`;
    
    if (!groups[dateKey]) {
      groups[dateKey] = {
        label: getDayLabel(booking.class.startTime),
        dateVal: classStart,
        items: [],
      };
    }
    groups[dateKey].items.push(booking);
  });

  // Convert groups to sorted array
  const sortedGroups = Object.values(groups).sort((a, b) => {
    return a.dateVal.getTime() - b.dateVal.getTime();
  });

  // Total count of upcoming bookings
  const totalUpcomingCount = uniqueActiveUpcoming.length;

  return (
    <div className="bg-white border border-[#EEF2F6] rounded-[24px] shadow-[0_8px_30px_rgba(0,0,0,0.06)] p-6 flex flex-col max-h-[540px]">
      {/* Sidebar Header */}
      <div className="mb-5 shrink-0">
        <h3 className="font-sans font-bold text-2xl text-[#111827] mb-1">
          Your Schedule
        </h3>
        <p className="font-sans text-sm font-semibold text-[#72BF6A]">
          {getFigmaFormattedDate()}
        </p>
      </div>

      {/* Scrollable Schedule list */}
      <div className="flex-1 flex flex-col justify-between overflow-hidden">
        <div className={`overflow-y-auto pr-1 scrollbar-thin flex-1 flex flex-col min-h-0 ${
          totalUpcomingCount === 0 ? "justify-center" : "justify-start"
        }`}>
          {totalUpcomingCount > 0 ? (
            <div className="space-y-5 w-full">
              {sortedGroups.map((group) => (
                <div key={group.label} className="space-y-2.5">
                  {/* Day Divider & Header with Date */}
                  <div className="flex items-center gap-3 pt-1">
                    <span className="text-xs font-bold uppercase tracking-wider text-[#72BF6A] bg-[#72BF6A]/10 px-3 py-1 rounded-full shrink-0">
                      {group.label}
                    </span>
                    <div className="h-[1px] flex-1 bg-gray-200" />
                  </div>

                  {/* Items of the day */}
                  <div className="space-y-2">
                    {group.items.map((booking) => (
                      <ScheduleItem
                        key={booking.classId || booking.id}
                        id={booking.classId} // Pass classId for cancel action
                        title={booking.class.title}
                        time={formatTimeStr(booking.class.startTime, booking.class.endTime)}
                        location={booking.class.location}
                        status="booked"
                        onCancel={onCancelBooking}
                      />
                    ))}
                  </div>
                </div>
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
        {totalUpcomingCount > 0 && totalUpcomingCount < 3 && (
          <div className="border border-dashed border-gray-200 bg-gray-50/50 rounded-[20px] p-5 flex flex-col items-center text-center sm:text-left sm:items-start sm:flex-row gap-4 mt-5 shrink-0">
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
