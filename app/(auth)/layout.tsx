import React from "react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#F8F8FA] flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8 font-manrope">
      <div className="w-full max-w-[440px]">
        {children}
      </div>
    </div>
  );
}
