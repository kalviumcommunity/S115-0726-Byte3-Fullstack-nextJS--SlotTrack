import React from "react";

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  hoverable?: boolean;
}

export default function Card({
  children,
  hoverable = false,
  className = "",
  ...props
}: CardProps) {
  return (
    <div
      className={`bg-white border border-[#EEF2F6] rounded-[20px] p-6 transition-all duration-300 ${
        hoverable
          ? "hover:translate-y-[-4px] hover:shadow-[0_12px_40px_rgba(0,0,0,0.12)] shadow-[0_8px_30px_rgba(0,0,0,0.08)]"
          : "shadow-[0_8px_30px_rgba(0,0,0,0.06)]"
      } ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
