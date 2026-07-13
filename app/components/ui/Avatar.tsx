import React from "react";
import Image from "next/image";

export interface AvatarProps {
  src?: string | null;
  alt: string;
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
}

export default function Avatar({ src, alt, size = "md", className = "" }: AvatarProps) {
  const sizes = {
    sm: "w-8 h-8",
    md: "w-10 h-10",
    lg: "w-16 h-16",
    xl: "w-24 h-24"
  };

  const textSizes = {
    sm: "text-xs",
    md: "text-sm",
    lg: "text-lg",
    xl: "text-2xl"
  };

  const initials = alt
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className={`relative flex items-center justify-center rounded-full overflow-hidden bg-[#EEF2F6] border-2 border-white shadow-sm ${sizes[size]} ${className}`}>
      {src ? (
        <Image
          src={src}
          alt={alt}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      ) : (
        <span className={`font-bold text-[#6B7280] ${textSizes[size]}`}>{initials}</span>
      )}
    </div>
  );
}
