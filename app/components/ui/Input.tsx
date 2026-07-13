import React from "react";
import { cn } from "@/app/lib/utils";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export default function Input({ label, error, className, id, ...props }: InputProps) {
  return (
    <div className="flex flex-col gap-1.5 w-full">
      {label && (
        <label htmlFor={id} className="text-sm font-semibold text-text-primary font-manrope">
          {label}
        </label>
      )}
      <input
        id={id}
        className={cn(
          "w-full h-11 px-3.5 bg-surface border border-border rounded-input text-text-primary placeholder-text-secondary focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all text-sm font-manrope",
          error && "border-danger focus:ring-danger",
          className
        )}
        {...props}
      />
      {error && <span className="text-xs text-danger font-medium mt-0.5 font-manrope">{error}</span>}
    </div>
  );
}
