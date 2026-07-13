import React from "react";

export interface BookingSummaryProps {
  classNameTitle?: string;
  classTime?: string;
  classDate?: string;
  classLocation?: string;
  totalPrice?: number;
}

export default function BookingSummary({
  classNameTitle = "Strength Training",
  classTime = "8:00 AM - 9:00 AM",
  classDate = "Monday, Jan 1",
  classLocation = "Hadapsar, Pune",
  totalPrice = 0,
}: BookingSummaryProps) {
  return (
    <div className="bg-white border border-[#EEF2F6] rounded-[20px] p-6 shadow-sm space-y-4">
      <h3 className="font-sans font-bold text-lg text-[#111827] border-b border-[#EEF2F6] pb-3">
        Booking Receipt Summary
      </h3>
      <div className="space-y-3">
        <div className="flex justify-between text-sm font-semibold">
          <span className="text-[#6B7280]">Fitness Class</span>
          <span className="text-[#111827]">{classNameTitle}</span>
        </div>
        <div className="flex justify-between text-sm font-semibold">
          <span className="text-[#6B7280]">Date & Time</span>
          <span className="text-[#111827]">
            {classDate} at {classTime}
          </span>
        </div>
        <div className="flex justify-between text-sm font-semibold">
          <span className="text-[#6B7280]">Location</span>
          <span className="text-[#111827]">{classLocation}</span>
        </div>
        <div className="flex justify-between text-sm font-semibold border-t border-[#EEF2F6] pt-3">
          <span className="text-[#111827] font-bold">Total Fees</span>
          <span className="text-[#72BF6A] font-extrabold text-base">
            {totalPrice === 0 ? "Free Membership Access" : `$${totalPrice}`}
          </span>
        </div>
      </div>
    </div>
  );
}
