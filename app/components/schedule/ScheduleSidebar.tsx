"use client";

import React, { useState } from "react";
import ScheduleItem, { ScheduleItemProps } from "./ScheduleItem";
import Modal from "../ui/Modal";

export interface ScheduleSidebarProps {
  scheduleItems: Omit<ScheduleItemProps, "onCancel">[];
  onCancelBooking: (id: string) => void;
}

export default function ScheduleSidebar({
  scheduleItems,
  onCancelBooking,
}: ScheduleSidebarProps) {
  const [isFullScheduleOpen, setIsFullScheduleOpen] = useState(false);

  // Format today's date dynamically to resemble Figma: "Today | 13 July | Monday"
  const getFigmaFormattedDate = () => {
    const today = new Date();
    const day = today.getDate();
    const month = today.toLocaleString("en-US", { month: "long" });
    const weekday = today.toLocaleString("en-US", { weekday: "long" });
    return `Today | ${day} ${month} | ${weekday}`;
  };

  return (
    <div className="bg-white border border-[#EEF2F6] rounded-[24px] shadow-[0_8px_30px_rgba(0,0,0,0.06)] p-6 flex flex-col h-full">
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
      <div className="flex-1 overflow-y-auto space-y-2 max-h-[380px] md:max-h-[500px] pr-1 scrollbar-thin">
        {scheduleItems.length > 0 ? (
          scheduleItems.map((item) => (
            <ScheduleItem
              key={item.id}
              id={item.id}
              title={item.title}
              time={item.time}
              status={item.status}
              location={item.location}
              onCancel={onCancelBooking}
            />
          ))
        ) : (
          <div className="text-center py-8 text-[#6B7280]">
            <p className="text-sm font-semibold">No classes scheduled today</p>
            <p className="text-xs mt-1">Book some sessions to see them here.</p>
          </div>
        )}
      </div>

      {/* View Full Schedule Button */}
      <button
        onClick={() => setIsFullScheduleOpen(true)}
        className="w-full mt-6 bg-[#EEF2F6] hover:bg-[#e2e8f0] text-[#111827] font-bold py-3.5 px-4 rounded-[14px] transition-colors duration-300 text-sm active:scale-[0.98]"
      >
        View Full Schedule
      </button>

      {/* Full Schedule Modal */}
      <Modal
        isOpen={isFullScheduleOpen}
        onClose={() => setIsFullScheduleOpen(false)}
        title="Full Timetable Schedule"
      >
        <div className="space-y-4 max-h-[400px] overflow-y-auto pr-1">
          <p className="text-sm text-[#6B7280] font-medium mb-2">
            Weekly slots showing all available fitness classes.
          </p>
          {scheduleItems.map((item, idx) => (
            <div
              key={idx}
              className="flex justify-between items-center py-3 border-b border-[#EEF2F6]"
            >
              <div>
                <h4 className="font-bold text-[#111827]">{item.title}</h4>
                <p className="text-xs text-[#6B7280] font-medium">
                  {item.time} • {item.location}
                </p>
              </div>
              <span className="text-xs font-bold text-[#72BF6A] uppercase bg-[#72BF6A]/10 px-2.5 py-1 rounded-full">
                Available
              </span>
            </div>
          ))}
        </div>
      </Modal>
    </div>
  );
}
