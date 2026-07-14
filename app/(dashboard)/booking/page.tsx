"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function BookingFallbackPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/dashboard");
  }, [router]);

  return (
    <div className="flex items-center justify-center py-20">
      <p className="text-text-secondary font-bold">Redirecting to dashboard...</p>
    </div>
  );
}
