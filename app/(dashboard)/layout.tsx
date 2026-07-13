import React from "react";
import Navbar from "../components/navigation/Navbar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Navbar />
      <main className="flex-1 flex flex-col justify-start">
        {children}
      </main>
    </div>
  );
}
