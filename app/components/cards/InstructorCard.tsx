import React from "react";
import { Award, ShieldCheck } from "lucide-react";

interface InstructorCardProps {
  name?: string;
  role?: string;
  avatar?: string;
  bio?: string;
  experience?: string;
  certified?: boolean;
}

export default function InstructorCard({
  name = "Instructor",
  role,
  avatar = "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=256&auto=format&fit=crop",
  bio,
  experience,
  certified,
}: InstructorCardProps) {
  return (
    <div className="w-full">
      <h3 className="font-display text-lg font-bold text-text-primary mb-5">
        About the Instructor
      </h3>

      <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
        {/* Left Side: Avatar, Name, Title, and Bio Description */}
        <div className="flex flex-1 flex-col gap-4 sm:flex-row sm:items-start">
          {/* Avatar Container */}
          <div className="relative h-[120px] w-[120px] shrink-0 overflow-hidden rounded-[20px] bg-emerald-50 border border-emerald-100 flex items-center justify-center">
            <img
              src={avatar}
              alt={name}
              className="h-full w-full object-cover"
            />
          </div>

          {/* Details */}
          <div className="flex-1 space-y-2">
            <div>
              <h4 className="font-display text-md font-bold text-text-primary">
                {name}
              </h4>
              {role && (
                <p className="text-sm font-semibold text-accent mt-0.5">
                  {role}
                </p>
              )}
            </div>
            {bio && (
              <p className="text-sm leading-relaxed text-text-secondary select-text">
                {bio}
              </p>
            )}
          </div>
        </div>

        {/* Right Side: Instructor badges / certifications */}
        {(certified || experience) && (
          <div className="flex shrink-0 flex-col gap-4 self-stretch justify-center md:self-start md:border-l md:border-gray-150 md:pl-8 lg:pl-12 min-w-[200px]">
            {certified && (
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-50 text-orange-500">
                  <Award className="h-5 w-5" />
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-bold text-text-primary">Certified</span>
                  <span className="text-xs text-text-secondary">Fitness Instructor</span>
                </div>
              </div>
            )}

            {experience && (
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-500">
                  <ShieldCheck className="h-5 w-5" />
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-bold text-text-primary">{experience.split(' ')[0]}</span>
                  <span className="text-xs text-text-secondary">{experience.split(' ').slice(1).join(' ')}</span>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
