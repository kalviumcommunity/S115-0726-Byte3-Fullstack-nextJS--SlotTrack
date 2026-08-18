"use client";

import React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Badge from "../ui/Badge";
import Button from "../ui/Button";

export interface ClassCardProps {
  id: string;
  title: string;
  category: string;
  image: string;
  time: string;
  date: string;
  location: string;
  detailedLocation?: string;
  price: number;
  isBooked?: boolean;
  isPending?: boolean;
  isPast?: boolean;
  onBookToggle?: (id: string) => void;
}

export default function ClassCard({
  id,
  title,
  category,
  image,
  time,
  date,
  location,
  detailedLocation,
  price,
  isBooked = false,
  isPending = false,
  isPast = false,
  onBookToggle,
}: ClassCardProps) {
  const router = useRouter();

  const handleCardClick = () => {
    router.push(`/booking/${id}`);
  };

  const isButtonDisabled = isPending || (isPast && !isBooked);

  return (
    <div
      onClick={handleCardClick}
      className={`bg-white border border-[#EEF2F6] rounded-[24px] overflow-hidden shadow-[0_8px_30px_rgba(0,0,0,0.06)] hover:shadow-[0_16px_40px_rgba(0,0,0,0.12)] hover:translate-y-[-6px] transition-all duration-500 group flex flex-col h-full cursor-pointer ${
        isPast && !isBooked ? "opacity-85" : ""
      }`}
    >
      {/* Cover Image & Category Badge */}
      <div className="relative h-48 md:h-[220px] w-full overflow-hidden">
        <Image
          src={image}
          alt={title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
        <div className="absolute top-4 left-4 z-10 flex gap-2">
          <Badge className="bg-white/95 text-[#111827] shadow-sm backdrop-blur-xs">
            {category}
          </Badge>
          {isPast && !isBooked && (
            <Badge className="bg-gray-900/80 text-white shadow-sm backdrop-blur-xs">
              Ended
            </Badge>
          )}
          {isPending && (
            <Badge className="bg-blue-500/90 text-white shadow-sm backdrop-blur-xs animate-pulse">
              Syncing...
            </Badge>
          )}
        </div>
      </div>

      {/* Curved bottom info panel */}
      <div className="relative flex-1 bg-white rounded-t-[24px] -mt-6 p-6 z-10 flex flex-col justify-between border-t border-[#EEF2F6]/50">
        <div className="mb-4">
          <h3 className="font-sans font-bold text-xl md:text-2xl text-[#111827] group-hover:text-[#72BF6A] transition-colors leading-tight mb-3">
            {title}
          </h3>

          <div className="text-lg font-extrabold text-[#111827] mb-3">
            ₹{price}
          </div>

          <div className="space-y-2 text-[#6B7280]">
            {/* Time */}
            <div className="flex items-center space-x-2.5 text-sm font-semibold">
              <svg className="w-4 h-4 text-[#72BF6A]" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{time}</span>
            </div>

            {/* Date */}
            <div className="flex items-center space-x-2.5 text-sm font-semibold">
              <svg className="w-4 h-4 text-[#72BF6A]" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5m-9-6h.008v.008H12v-.008zM12 15h.008v.008H12V15zm0 2.25h.008v.008H12v-.008zM9.75 15h.008v.008H9.75V15zm0 2.25h.008v.008H9.75v-.008zM7.5 15h.008v.008H7.5V15zm0 2.25h.008v.008H7.5v-.008zm6.75-4.5h.008v.008h-.008v-.008zm0 2.25h.008v.008h-.008V15zm0 2.25h.008v.008h-.008v-.008zm2.25-4.5h.008v.008H16.5v-.008zm0 2.25h.008v.008H16.5V15z" />
              </svg>
              <span>{date}</span>
            </div>

            {/* Location */}
            <div className="flex items-center space-x-2.5 text-sm font-semibold">
              <svg className="w-4 h-4 text-[#72BF6A]" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25s-7.5-4.108-7.5-11.25a7.5 7.5 0 1115 0z" />
              </svg>
              <span className="truncate" title={detailedLocation || location}>{detailedLocation || location}</span>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="w-full mt-2">
          <Button
            variant={isBooked ? "danger" : isPast ? "secondary" : "primary"}
            className="w-full text-base font-bold py-3 disabled:opacity-60 disabled:cursor-not-allowed"
            disabled={isButtonDisabled}
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
              if (onBookToggle && !isButtonDisabled) {
                onBookToggle(id);
              }
            }}
          >
            {isPending
              ? "Syncing..."
              : isBooked
              ? "Cancel Booking"
              : isPast
              ? "Class Ended"
              : "Book Now"}
          </Button>
        </div>
      </div>
    </div>
  );
}
