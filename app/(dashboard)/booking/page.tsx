"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function BookingFallbackPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/dashboard");
  }, [router]);

  return (
    <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-8 md:py-12">
      {/* Back Button & Title Area */}
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold tracking-tight text-text-primary mb-3">
          Booking Page
        </h1>
        <button
          onClick={() => window.history.back()}
          className="flex items-center gap-1.5 text-xs font-semibold text-text-secondary hover:text-text-primary transition-colors cursor-pointer"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Back</span>
        </button>
      </div>

      {/* Main Details and Booking Widget Card */}
      <div className="rounded-[24px] border border-gray-100 bg-white p-6 md:p-8 shadow-card mb-8">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-start lg:gap-12">
          {/* Details list */}
          <div className="flex-1">
            <BookingDetails
              title="Yoga Class"
              category="Yoga"
              image="https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&q=80&w=600"
              time="09:00 AM - 10:00 AM"
              date="10 July, 2026"
              location="Studio 2, Main floor"
              bookedSeats={bookedSeats}
              capacity={25}
            />
          </div>

          {/* Booking Widget */}
          <div className="shrink-0">
            <BookingWidget
              availableSeats={availableSeats}
              capacity={25}
              price={299.00}
              onBook={handleBooking}
              isBooked={isBooked}
              isLoading={isLoading}
            />
          </div>
        </div>
      </div>

      {/* About Class Section Card */}
      <div className="rounded-[24px] border border-gray-100 bg-white p-6 md:p-8 shadow-card mb-8">
        <AboutClass
          description="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo"
          duration="60 mins"
          intensity="Medium"
          equipment="60 mins"
          capacity={25}
        />
      </div>

      {/* Instructor Section Card */}
      <div className="rounded-[24px] border border-gray-100 bg-white p-6 md:p-8 shadow-card">
        <InstructorCard
          name="Frog Eyes"
          role="Yoga Coach"
          avatar="https://images.unsplash.com/photo-1594381898411-846e7d193883?auto=format&fit=crop&q=80&w=200"
          bio="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo"
          experience="6+ years Experience"
          certified={true}
        />
      </div>
    </div>
  );
}
