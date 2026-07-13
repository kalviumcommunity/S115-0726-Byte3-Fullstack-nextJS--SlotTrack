import React from "react";
import Navbar from "../components/navigation/Navbar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen bg-[#F8FAFC]">
      <Navbar />
      <main className="flex-grow w-full">{children}</main>
    </div>
  );
}
