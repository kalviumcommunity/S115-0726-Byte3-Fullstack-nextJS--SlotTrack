import React from "react";

export interface LoadingSkeletonProps {
  variant?: "card" | "list" | "sidebar";
  count?: number;
}

export default function LoadingSkeleton({ variant = "card", count = 1 }: LoadingSkeletonProps) {
  const skeletons = Array.from({ length: count });

  if (variant === "card") {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {skeletons.map((_, idx) => (
          <div key={idx} className="bg-white border border-[#EEF2F6] rounded-[20px] overflow-hidden animate-pulse">
            <div className="h-48 bg-slate-200 w-full" />
            <div className="p-6 space-y-4">
              <div className="h-6 bg-slate-200 rounded w-2/3" />
              <div className="space-y-2">
                <div className="h-4 bg-slate-200 rounded w-1/2" />
                <div className="h-4 bg-slate-200 rounded w-1/3" />
              </div>
              <div className="h-10 bg-slate-200 rounded-[14px] w-full mt-4" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (variant === "sidebar") {
    return (
      <div className="space-y-4 animate-pulse">
        <div className="h-6 bg-slate-200 rounded w-1/3 mb-6" />
        {skeletons.map((_, idx) => (
          <div key={idx} className="flex items-center space-x-4 border-b border-[#EEF2F6] pb-4">
            <div className="h-12 w-12 bg-slate-200 rounded-full" />
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-slate-200 rounded w-3/4" />
              <div className="h-3 bg-slate-200 rounded w-1/2" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4 animate-pulse">
      {skeletons.map((_, idx) => (
        <div key={idx} className="h-12 bg-slate-200 rounded-[12px] w-full" />
      ))}
    </div>
  );
}
