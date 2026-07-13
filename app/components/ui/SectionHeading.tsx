import React from "react";

export interface SectionHeadingProps {
  title: string;
  subtitle?: string;
  className?: string;
}

export default function SectionHeading({ title, subtitle, className = "" }: SectionHeadingProps) {
  return (
    <div className={`mb-6 ${className}`}>
      <h2 className="font-sans font-bold text-3xl md:text-[32px] tracking-tight text-[#111827] leading-none mb-2">
        {title}
      </h2>
      {subtitle && (
        <p className="font-sans text-sm md:text-base font-medium text-[#6B7280]">
          {subtitle}
        </p>
      )}
    </div>
  );
}
