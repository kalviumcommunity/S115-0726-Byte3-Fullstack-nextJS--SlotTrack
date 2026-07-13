"use client";

import React, { useState } from "react";
import { User, Calendar, Loader2 } from "lucide-react";
import Button from "../ui/Button";

export interface BookingWidgetProps {
  classId?: string;
  availableSeats?: number;
  capacity?: number;
  price?: number;
  onBook?: (classId?: string) => void;
  isBooked?: boolean;
  isLoading?: boolean;
}

export default function BookingWidget({
  classId = "",
  availableSeats = 5,
  capacity = 25,
  price = 299.00,
  onBook,
  isBooked = false,
  isLoading = false,
}: BookingWidgetProps) {
  const [internalLoading, setInternalLoading] = useState(false);
  const occupancyPercentage = ((capacity - availableSeats) / capacity) * 100;

  const handleBookClick = () => {
    if (!onBook) return;
    setInternalLoading(true);
    setTimeout(() => {
      onBook(classId);
      setInternalLoading(false);
    }, 600);
  };

  const activeLoading = isLoading || internalLoading;

  return (
    <div className="w-full rounded-[24px] border border-gray-100 bg-white p-6 shadow-card max-w-[420px] mx-auto md:mr-0 space-y-6">
      <h3 className="text-center font-display text-base font-bold text-text-primary border-b border-gray-50 pb-2">
        Class Booking
      </h3>

      {/* Available Seats Block & Progress Bar */}
      <div className="space-y-3">
        <div className="flex justify-between items-baseline">
          <span className="text-xs font-semibold text-text-secondary uppercase tracking-wider">
            Occupancy Status
          </span>
          <div className="flex items-center gap-1.5 text-lg font-black text-primary">
            <User className="h-4 w-4 stroke-[3]" />
            <span>{availableSeats} left of {capacity}</span>
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
      </div>

      {/* Pricing block */}
      <div className="text-center bg-gray-50/50 py-3.5 rounded-[16px] border border-gray-100">
        <span className="text-xs font-bold text-text-secondary block mb-1 uppercase tracking-wider">
          Total Fee
        </span>
        <span className="text-3xl font-extrabold text-[#111827] tracking-tight">
          ₹ {price.toFixed(2)}
        </span>
      </div>

      {/* Actions */}
      <div className="space-y-3">
        <Button
          variant={isBooked ? "outline" : "primary"}
          className="w-full font-bold py-3.5 text-sm"
          isLoading={activeLoading}
          onClick={handleBookClick}
          disabled={availableSeats <= 0 && !isBooked}
        >
          {isBooked ? "Cancel Booking" : availableSeats <= 0 ? "Class Full" : "Reserve A Seat"}
        </Button>

        <button
          className="flex w-full items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white py-3.5 text-sm font-bold text-text-primary shadow-[0px_2px_4px_rgba(0,0,0,0.01)] transition-colors hover:bg-gray-50 active:scale-[0.98] cursor-pointer"
        >
          <Calendar className="h-4 w-4 text-text-primary" />
          <span>Add to Calendar</span>
        </button>
      </div>
    </div>
  );
}
