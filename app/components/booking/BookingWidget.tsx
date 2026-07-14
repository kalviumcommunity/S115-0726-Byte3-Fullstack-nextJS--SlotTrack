"use client";

import React, { useState } from "react";
import { User, Calendar } from "lucide-react";

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
    <div className="w-full rounded-2xl border border-gray-200 bg-white p-6 max-w-[360px] mx-auto md:mr-0 space-y-5">
      {/* Header */}
      <h3 className="text-center font-manrope text-base font-bold text-[#111827]">
        Book now
      </h3>

      {/* Available Seats */}
      <div className="space-y-1">
        <span className="text-xs text-gray-500 block">Available Seats</span>
        <div className="flex items-center gap-1.5">
          <User className="h-4 w-4 text-[#72BF6A]" />
          <span className="text-2xl font-extrabold text-[#72BF6A]">
            {availableSeats}/{capacity}
          </span>
        </div>
      </div>

      {/* Price */}
      <div className="space-y-0.5">
        <span className="text-xs text-gray-500 block">Total</span>
        <span className="text-2xl font-extrabold text-[#111827]">
          ₹ {price.toFixed(2)}
        </span>
      </div>

      {/* Confirm Booking Button */}
      <button
        onClick={handleBookClick}
        disabled={(availableSeats <= 0 && !isBooked) || activeLoading}
        className="w-full rounded-xl bg-[#72BF6A] py-3 text-sm font-bold text-white hover:bg-[#5eaa57] transition-colors active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none cursor-pointer"
      >
        {activeLoading ? (
          <span className="flex items-center justify-center gap-2">
            <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            Processing...
          </span>
        ) : isBooked ? "Cancel Booking" : availableSeats <= 0 ? "Class Full" : "Confirm Booking"}
      </button>

      {/* Add to Calendar */}
      <button className="flex w-full items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white py-2.5 text-sm font-semibold text-[#111827] hover:bg-gray-50 transition-colors active:scale-[0.98] cursor-pointer">
        <Calendar className="h-4 w-4 text-gray-500" />
        <span>Add to Calendar</span>
      </button>
    </div>
  );
}
