import React from "react";
import Image from "next/image";
import { Clock, Calendar, MapPin, Users, User } from "lucide-react";

interface BookingDetailsProps {
    title?: string;
    category?: string;
    image?: string;
    time?: string;
    date?: string;
    location?: string;
    detailedLocation?: string;
    bookedSeats?: number;
    capacity?: number;
    instructorName?: string;
}

export default function BookingDetails({
    title = "Yoga Class",
    category = "Yoga",
    image = "/yoga.jpg", // default fallback path or external default
    time = "09:00 AM - 10:00 AM",
    date = "10 July, 2026",
    location = "Studio 2, Main floor",
    detailedLocation,
    bookedSeats = 20,
    capacity = 25,
    instructorName,
}: BookingDetailsProps) {
    // Use a high-quality placeholder image if next/image cannot find the path
    const displayImage = image.startsWith("/") ? image : "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&q=80&w=600";

    return (
        <div className="flex flex-col gap-6 md:flex-row md:items-center">
            {/* Hero Image Section */}
            <div className="relative aspect-[4/3] w-full overflow-hidden rounded-[20px] md:w-1/2 lg:w-[400px] shadow-sm">
                <img
                    src={displayImage}
                    alt={title}
                    className="h-full w-full object-cover object-center transition-transform duration-500 hover:scale-105"
                />
                {/* Floating Category Badge */}
                <span className="absolute top-4 right-4 rounded-full bg-accent px-4 py-1 text-xs font-semibold text-white shadow-sm">
                    {category}
                </span>
            </div>

            {/* Class Meta text List */}
            <div className="flex flex-1 flex-col justify-center space-y-4 md:pl-2">
                <h2 className="font-display text-2xl font-bold tracking-tight text-text-primary md:text-3xl">
                    {title}
                </h2>

                <div className="space-y-3.5">
                    {instructorName && (
                        <div className="flex items-center gap-3 text-text-secondary">
                            <User className="h-5 w-5 text-text-secondary" />
                            <span className="text-sm font-medium text-text-primary">
                                Instructor: {instructorName}
                            </span>
                        </div>
                    )}

                    <div className="flex items-center gap-3 text-text-secondary">
                        <Clock className="h-5 w-5 text-text-secondary" />
                        <span className="text-sm font-medium text-text-primary">{time}</span>
                    </div>

                    <div className="flex items-center gap-3 text-text-secondary">
                        <Calendar className="h-5 w-5 text-text-secondary" />
                        <span className="text-sm font-medium text-text-primary">{date}</span>
                    </div>

                    <div className="flex items-center gap-3 text-text-secondary">
                        <MapPin className="h-5 w-5 text-text-secondary shrink-0" />
                        <span className="text-sm font-medium text-text-primary">{detailedLocation || location}</span>
                    </div>

                    <div className="flex items-center gap-3 text-text-secondary">
                        <Users className="h-5 w-5 text-text-secondary" />
                        <span className="text-sm font-medium text-text-primary">
                            {bookedSeats}/{capacity} Booked
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}
