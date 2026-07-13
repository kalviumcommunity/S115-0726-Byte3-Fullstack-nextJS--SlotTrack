import React from "react";
import { cn } from "@/app/lib/utils";

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  hoverable?: boolean;
}

export default function Card({ children, hoverable = false, className, ...props }: CardProps) {
  return (
    <div
      className={cn(
        "bg-surface rounded-card border border-border p-6 transition-all duration-300",
        hoverable
          ? "hover:translate-y-[-4px] hover:shadow-card-hover shadow-[0_8px_30px_rgba(0,0,0,0.08)]"
          : "shadow-card",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
