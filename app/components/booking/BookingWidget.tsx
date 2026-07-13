import React from "react";
import { User, Calendar, Loader2 } from "lucide-react";

interface BookingWidgetProps {
  availableSeats?: number;
  capacity?: number;
  price?: number;
  onBook?: () => void;
  isBooked?: boolean;
  isLoading?: boolean;
}

export default function BookingWidget({
  availableSeats = 5,
  capacity = 25,
  price = 299.00,
  onBook,
  isBooked = false,
  isLoading = false,
}: BookingWidgetProps) {
  return (
    <div className="w-full rounded-[24px] border border-gray-100 bg-white p-6 shadow-card max-w-[420px] mx-auto md:mr-0">
      <h3 className="text-center font-display text-base font-bold text-text-primary mb-4">
        Book now
      </h3>

      {/* Available Seats Block */}
      <div className="mb-5 border-b border-gray-50 pb-5 text-center">
        <span className="text-xs font-semibold text-text-secondary block mb-1.5 grayscale-50">
          Available Seats
        </span>
        <div className="flex items-center justify-center gap-2 text-2xl font-black text-accent">
          <User className="h-6 w-6 stroke-[3]" />
          <span>{availableSeats}/{capacity}</span>
        </div>
      </div>

      {/* Pricing block */}
      <div className="mb-6 text-center">
        <span className="text-xs font-semibold text-text-secondary block mb-1">
          Total
        </span>
        <span className="text-3xl font-extrabold text-text-primary tracking-tight">
          ₹ {price.toFixed(2)}
        </span>
      </div>

      {/* Actions */}
      <div className="space-y-3">
        <button
          onClick={onBook}
          disabled={isLoading || isBooked || availableSeats === 0}
          className={`flex w-full items-center justify-center gap-2 rounded-xl py-3.5 text-sm font-bold text-white transition-all bg-accent hover:brightness-105 active:scale-[0.98] ${(isLoading || isBooked || availableSeats === 0)
            ? "opacity-60 cursor-not-allowed bg-gray-400 hover:brightness-100 active:scale-100"
            : ""
            }`}
        >
          {isLoading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Processing...</span>
            </>
          ) : isBooked ? (
            <span>Class Booked!</span>
          ) : (
            <span>Confirm Booking</span>
          )}
        </button>

        <button
          className="flex w-full items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white py-3.5 text-sm font-bold text-text-primary shadow-[0px_2px_4px_rgba(0,0,0,0.01)] transition-colors hover:bg-gray-50 active:scale-[0.98]"
        >
          <Calendar className="h-4 w-4 text-text-primary" />
          <span>Add to Calendar</span>
        </button>
      </div>
    </div>
  );
}
