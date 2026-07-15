"use client";

import React, { use } from "react";
import { ArrowLeft } from "lucide-react";
import BookingDetails from "@/app/components/booking/BookingDetails";
import BookingWidget from "@/app/components/booking/BookingWidget";
import AboutClass from "@/app/components/booking/AboutClass";
import InstructorCard from "@/app/components/cards/InstructorCard";
import ContactCard from "@/app/components/booking/ContactCard";
import { useDashboard } from "@/app/(dashboard)/layout";
import { DASHBOARD_CLASSES } from "@/app/lib/mockData";
import Link from "next/link";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function DynamicBookingPage({ params }: PageProps) {
  const { id } = use(params);
  const { bookedClassIds, toggleBookClass } = useDashboard();

  // Find class details
  const currentClass = DASHBOARD_CLASSES.find((cls) => cls.id === id);

  if (!currentClass) {
    return (
      <div className="mx-auto w-full max-w-7xl px-4 py-12 text-center">
        <h1 className="text-2xl font-bold mb-4">Class Not Found</h1>
        <Link href="/dashboard" className="text-primary hover:underline font-bold">
          Return to Dashboard
        </Link>
      </div>
    );
  }

  // Calculate dynamic seats based on global booked status
  const isInitiallyBooked = id === "class-1" || id === "class-3";
  const isCurrentlyBooked = bookedClassIds.includes(id);

  let currentAvailableSeats = currentClass.availableSeats;
  if (isInitiallyBooked && !isCurrentlyBooked) {
    currentAvailableSeats = currentClass.availableSeats + 1;
  } else if (!isInitiallyBooked && isCurrentlyBooked) {
    currentAvailableSeats = currentClass.availableSeats - 1;
  }

  const currentBookedSeats = currentClass.capacity - currentAvailableSeats;

  return (
    <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-8 md:py-12 animate-fade-in">
      {/* Back Button & Title Area */}
      <div className="mb-8">
        <h1 className="font-sans text-3xl font-extrabold tracking-tight text-text-primary mb-3">
          Booking details
        </h1>
        <Link
          href="/dashboard"
          className="flex items-center gap-1.5 text-xs font-bold text-text-secondary hover:text-text-primary transition-colors cursor-pointer"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Back to Dashboard</span>
        </Link>
      </div>

      {/* Main Details and Booking Widget Card */}
      <div className="rounded-[24px] border border-border bg-white p-6 md:p-8 shadow-card mb-8">
        <div className="flex flex-col gap-8 lg:flex-row lg:justify-between lg:items-start lg:gap-12">
          {/* Details list */}
          <div className="flex-1">
            <BookingDetails
              title={currentClass.title}
              category={currentClass.category}
              image={currentClass.image}
              time={currentClass.time}
              date={currentClass.date}
              location={currentClass.location}
              bookedSeats={currentBookedSeats}
              capacity={currentClass.capacity}
            />
          </div>

          {/* Booking Widget card */}
          <div className="w-full lg:w-[310px] shrink-0">
            <BookingWidget
              classId={currentClass.id}
              availableSeats={currentAvailableSeats}
              capacity={currentClass.capacity}
              price={299.0}
              onBook={() => toggleBookClass(currentClass.id)}
              isBooked={isCurrentlyBooked}
            />
          </div>
        </div>
      </div>

      {/* About Class Section Card */}
      <div className="rounded-[24px] border border-border bg-white p-6 md:p-8 shadow-card mb-8">
        <AboutClass
          description={currentClass.description}
          duration={currentClass.duration}
          intensity={currentClass.intensity}
          equipment={currentClass.equipment}
          capacity={currentClass.capacity}
        />
      </div>

      {/* Instructor Section Card */}
      <div className="rounded-[24px] border border-border bg-white p-6 md:p-8 shadow-card mb-8">
        <InstructorCard
          name={currentClass.instructorName}
          role={currentClass.instructorRole}
          avatar={currentClass.instructorAvatar}
          bio={currentClass.instructorBio}
          experience="8+ years Experience"
          certified={true}
        />
      </div>

      {/* Contact / Support Card */}
      <ContactCard
        phone="1234567890"
        email="support.slottrack@cult.fit"
      />
    </div>
  );
}
