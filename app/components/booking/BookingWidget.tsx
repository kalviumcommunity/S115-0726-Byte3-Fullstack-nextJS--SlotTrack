"use client";

import React, { useState } from "react";
import { User, Calendar } from "lucide-react";

export interface BookingWidgetProps {
  classId?: string;
  availableSeats?: number;
  capacity?: number;
  price?: number;
  onBook?: (classId?: string) => Promise<void> | void;
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

  const handleBookClick = async () => {
    if (!onBook) return;
    setInternalLoading(true);
    try {
      await onBook(classId);
    } catch (err) {
      console.error("Booking action failed", err);
    } finally {
      setInternalLoading(false);
    }
  };

  const activeLoading = isLoading || internalLoading;

  return (
    <div className="w-full rounded-[24px] border border-gray-200 bg-white p-6 shadow-[0px_8px_30px_rgba(0,0,0,0.04)] max-w-[310px] mx-auto md:mr-0 space-y-4">
      {/* Header */}
      <h3 className="text-center font-display text-base font-bold text-[#111827]">
        Book now
      </h3>

      {/* Available Seats Block */}
      <div className="space-y-1">
        <span className="text-xs font-semibold text-text-secondary block">
          Available Seats
        </span>
        <div className="flex items-center gap-1.5 text-2xl font-black text-[#72BF6A]">
          <User className="h-6 w-6 text-[#72BF6A] fill-current" />
          <span>{availableSeats}/{capacity}</span>
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-gray-100 my-2" />

      {/* Pricing block */}
      <div className="space-y-1">
        <span className="text-xs font-semibold text-text-secondary block">
          Total
        </span>
        <span className="text-2xl font-extrabold text-[#111827] tracking-tight block">
          ₹ {price.toFixed(2)}
        </span>
      </div>

      {/* Actions */}
      <div className="space-y-3.5 pt-2">
        <button
          onClick={handleBookClick}
          disabled={(availableSeats <= 0 && !isBooked) || activeLoading}
          className={`w-full rounded-xl py-3 text-sm font-bold text-white transition-colors active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none cursor-pointer flex items-center justify-center ${
            isBooked
              ? "bg-danger hover:bg-red-600 shadow-[0_2px_8px_rgba(239,68,68,0.12)] hover:shadow-[0_4px_12px_rgba(239,68,68,0.25)]"
              : "bg-[#72BF6A] hover:bg-[#5eaa57]"
          }`}
        >
          {activeLoading ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Processing...
            </span>
          ) : isBooked ? "Cancel Booking" : availableSeats <= 0 ? "Class Full" : "Book Now"}
        </button>

        <button className="flex w-full items-center justify-center gap-2 rounded-xl border border-gray-250 bg-white py-2.5 text-sm font-bold text-[#111827] shadow-[0px_2px_4px_rgba(0,0,0,0.01)] transition-colors hover:bg-gray-50 active:scale-[0.98] cursor-pointer">
          <Calendar className="h-4 w-4 text-text-secondary" />
          <span>Add to Calendar</span>
        </button>
      </div>
    </div>
  );
}
