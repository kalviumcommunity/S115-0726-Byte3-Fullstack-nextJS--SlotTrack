import React from "react";

export interface BadgeProps {
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "success" | "danger" | "warning";
  className?: string;
}

export default function Badge({
  children,
  variant = "primary",
  className = "",
}: BadgeProps) {
  const baseStyles = "inline-flex items-center px-3 py-1 text-xs font-bold rounded-full uppercase tracking-wider";
  
  const variants = {
    primary: "bg-[#72BF6A]/10 text-[#72BF6A]",
    secondary: "bg-[#EEF2F6] text-[#6B7280]",
    success: "bg-green-100 text-green-800",
    danger: "bg-red-100 text-red-800",
    warning: "bg-yellow-100 text-yellow-800",
  };

  return (
    <span className={`${baseStyles} ${variants[variant]} ${className}`}>
      {children}
    </span>
  );
}
