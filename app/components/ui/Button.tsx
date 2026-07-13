import React from "react";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "danger" | "ghost";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
}

export default function Button({
  children,
  variant = "primary",
  size = "md",
  isLoading = false,
  className = "",
  disabled,
  ...props
}: ButtonProps) {
  const baseStyles = "inline-flex items-center justify-center font-semibold rounded-[14px] transition-all duration-300 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none disabled:active:scale-100";
  
  const variants = {
    primary: "bg-[#72BF6A] text-white hover:bg-[#61a859] hover:shadow-[0_4px_12px_rgba(114,191,106,0.3)] shadow-[0_2px_8px_rgba(114,191,106,0.15)]",
    secondary: "bg-[#EEF2F6] text-[#111827] hover:bg-[#e2e8f0]",
    outline: "border-2 border-[#E5E7EB] bg-white text-[#111827] hover:border-[#72BF6A] hover:text-[#72BF6A]",
    danger: "bg-[#EF4444] text-white hover:bg-[#dc2626] hover:shadow-[0_4px_12px_rgba(239,68,68,0.3)]",
    ghost: "bg-transparent text-[#6B7280] hover:bg-[#EEF2F6] hover:text-[#111827]"
  };

  const sizes = {
    sm: "px-4 py-2 text-sm",
    md: "px-5 py-3 text-base",
    lg: "px-6 py-4 text-lg"
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-current" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
      ) : null}
      {children}
    </button>
  );
}
