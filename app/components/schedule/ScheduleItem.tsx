import React from "react";
import Badge from "../ui/Badge";

export interface ScheduleItemProps {
  id: string;
  time: string;
  title: string;
  status: "booked" | "upcoming" | "canceled";
  location?: string;
  onCancel?: (id: string) => void;
}

export default function ScheduleItem({
  id,
  time,
  title,
  status,
  location,
  onCancel,
}: ScheduleItemProps) {
  const statusLabels = {
    booked: "Booked",
    upcoming: "Upcoming",
    canceled: "Canceled",
  };

  const statusVariants: Record<
    "booked" | "upcoming" | "canceled",
    "primary" | "secondary" | "danger" | "success" | "warning"
  > = {
    booked: "success",
    upcoming: "secondary",
    canceled: "danger",
  };

  return (
    <div className="flex items-center justify-between py-4 px-1 border-b border-[#EEF2F6] hover:bg-[#F8F8FA] rounded-lg transition-all duration-200 group">
      <div className="flex flex-col space-y-1">
        <span className="font-sans font-bold text-base text-[#111827] group-hover:text-[#72BF6A] transition-colors">
          {title}
        </span>
        <div className="flex items-center space-x-2 text-xs font-semibold text-[#6B7280]">
          <span>{time}</span>
          {location && (
            <>
              <span>•</span>
              <span className="truncate max-w-[150px]">{location}</span>
            </>
          )}
        </div>
      </div>
      
      <div className="flex items-center space-x-2.5">
        <Badge variant={statusVariants[status]}>
          {statusLabels[status]}
        </Badge>
        {status === "booked" && onCancel && (
          <button
            onClick={() => onCancel(id)}
            className="text-xs text-[#EF4444] hover:text-red-700 font-bold hover:underline transition-all active:scale-95"
            title="Cancel this session"
          >
            Cancel
          </button>
        )}
      </div>
    </div>
  );
}
