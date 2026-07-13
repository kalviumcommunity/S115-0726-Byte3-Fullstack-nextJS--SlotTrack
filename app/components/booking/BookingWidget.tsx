"use client";

import React, { useState } from "react";
import Button from "../ui/Button";

export interface BookingWidgetProps {
  classId: string;
  availableSeats: number;
  totalCapacity: number;
  onBook: (classId: string) => void;
  isAlreadyBooked?: boolean;
}

export default function BookingWidget({
  classId,
  availableSeats,
  totalCapacity,
  onBook,
  isAlreadyBooked = false,
}: BookingWidgetProps) {
  const [loading, setLoading] = useState(false);
  const occupancyPercentage = ((totalCapacity - availableSeats) / totalCapacity) * 100;

  const handleBook = () => {
    setLoading(true);
    setTimeout(() => {
      onBook(classId);
      setLoading(false);
    }, 800);
  };

  return (
    <div className="bg-white border border-[#EEF2F6] rounded-[24px] p-6 shadow-[0_8px_30px_rgba(0,0,0,0.06)] space-y-5">
      <div>
        <span className="text-xs font-bold text-[#6B7280] uppercase tracking-wider">
          Class Occupancy Status
        </span>
        <div className="flex items-baseline space-x-2 mt-1">
          <span className="text-3xl font-black text-[#111827]">{availableSeats}</span>
          <span className="text-[#6B7280] text-sm font-semibold">
            seats left of {totalCapacity}
          </span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-[#EEF2F6] h-2.5 rounded-full overflow-hidden">
        <div
          className={`h-full transition-all duration-500 rounded-full ${
            availableSeats <= 5 ? "bg-red-500" : "bg-[#72BF6A]"
          }`}
          style={{ width: `${Math.min(100, Math.max(0, 100 - occupancyPercentage))}%` }}
        />
      </div>

      <Button
        variant={isAlreadyBooked ? "outline" : "primary"}
        className="w-full text-base font-bold py-3.5"
        isLoading={loading}
        onClick={handleBook}
        disabled={availableSeats <= 0 && !isAlreadyBooked}
      >
        {isAlreadyBooked ? "Cancel Booking" : availableSeats <= 0 ? "Class Full" : "Reserve A Seat"}
      </Button>
    </div>
  );
}
