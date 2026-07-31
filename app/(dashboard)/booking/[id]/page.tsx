"use client";

import React, { use, useState, useEffect } from "react";
import { ArrowLeft } from "lucide-react";
import BookingDetails from "@/app/components/booking/BookingDetails";
import BookingWidget from "@/app/components/booking/BookingWidget";
import AboutClass from "@/app/components/booking/AboutClass";
import ContactCard from "@/app/components/booking/ContactCard";
import { useDashboard } from "@/app/(dashboard)/layout";
import { getClassById } from "@/app/lib/api/classes";
import { FitnessClassType } from "@/app/types/fitness-class";
import Link from "next/link";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function DynamicBookingPage({ params }: PageProps) {
  const { id } = use(params);
  const { bookedClassIds, toggleBookClass, getOptimisticAvailableSeats, pendingMutations } = useDashboard();
  const [currentClass, setCurrentClass] = useState<FitnessClassType | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchClass = async () => {
      try {
        const data = await getClassById(id);
        setCurrentClass(data);
      } catch (err) {
        console.error("Failed to load class details", err);
      } finally {
        setLoading(false);
      }
    };
    fetchClass();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <svg className="animate-spin h-10 w-10 text-[#72BF6A]" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
      </div>
    );
  }

  if (!currentClass) {
    return (
      <div className="mx-auto w-full max-w-7xl px-4 py-12 text-center">
        <h1 className="text-2xl font-bold mb-4">Class Not Found</h1>
        <Link href="/dashboard" className="text-[#72BF6A] hover:underline font-bold">
          Return to Dashboard
        </Link>
      </div>
    );
  }

  const isCurrentlyBooked = bookedClassIds.includes(id);
  const isPending = pendingMutations.has(id);
  const currentAvailableSeats = getOptimisticAvailableSeats(id, currentClass.availableSeats);
  const currentBookedSeats = currentClass.capacity - currentAvailableSeats;

  const start = new Date(currentClass.startTime);
  const end = new Date(currentClass.endTime);

  const formattedDate = start.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  const formatTimeStr = (d: Date) => {
    return d.toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };
  const timeStr = `${formatTimeStr(start)} - ${formatTimeStr(end)}`;

  const durationMs = end.getTime() - start.getTime();
  const durationMinutes = Math.round(durationMs / 60000);
  const durationStr = `${durationMinutes} Minutes`;

  const imageUrl = currentClass.imageUrl || "https://images.unsplash.com/photo-1518611012118-696072aa579a?q=80&w=600&auto=format&fit=crop";
  const instructorUser = (currentClass as any).instructorUser;
  const instructorName = instructorUser?.name || currentClass.instructor || "Instructor";
  const instructorRole = instructorUser?.role
    ? (instructorUser.role === "ADMIN" ? "Senior Trainer" : "Fitness Trainer")
    : undefined;
  const instructorExp = instructorUser?.age
    ? `${Math.max(1, instructorUser.age - 20)}+ years Experience`
    : undefined;

  const handleBookingAction = async () => {
    if (!currentClass) return;
    await toggleBookClass(currentClass.id);
    try {
      const updatedClass = await getClassById(id);
      setCurrentClass(updatedClass);
    } catch (err) {
      console.error("Failed to refresh class details", err);
    }
  };

  return (
    <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-8 md:py-12 animate-fade-in">
      {/* Back Button */}
      <div className="mb-6">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-text-secondary hover:text-text-primary transition-colors cursor-pointer font-manrope"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Back to Booking Page</span>
        </Link>
      </div>

      {/* Title Area */}
      <div className="mb-8">
        <h1 className="font-sans text-3xl font-extrabold tracking-tight text-text-primary">
          Booking details
        </h1>
      </div>

      {/* Main Details and Booking Widget Card */}
      <div className="rounded-[24px] border border-border bg-white p-6 md:p-8 shadow-card mb-8">
        <div className="flex flex-col gap-8 lg:flex-row lg:justify-between lg:items-start lg:gap-12">
          {/* Details list */}
          <div className="flex-1">
            <BookingDetails
              title={currentClass.title}
              category={currentClass.category}
              image={imageUrl}
              time={timeStr}
              date={formattedDate}
              location={currentClass.location}
              detailedLocation={currentClass.detailedLocation || currentClass.location}
              bookedSeats={currentBookedSeats}
              capacity={currentClass.capacity}
              instructorName={instructorName}
            />
          </div>

          {/* Booking Widget card */}
          <div className="w-full lg:w-[310px] shrink-0">
            <BookingWidget
              classId={currentClass.id}
              availableSeats={currentAvailableSeats}
              capacity={currentClass.capacity}
              price={currentClass.price}
              onBook={handleBookingAction}
              isBooked={isCurrentlyBooked}
              isLoading={isPending}
            />
          </div>
        </div>
      </div>

      {/* About Class Section Card */}
      <div className="rounded-[24px] border border-border bg-white p-6 md:p-8 shadow-card mb-8">
        <AboutClass
          description={currentClass.description}
          duration={durationStr}
          intensity="Medium"
          equipment="Yoga Mat, Towel, Water"
          capacity={currentClass.capacity}
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
