"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function BookingFallbackPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/dashboard");
  }, [router]);

  return (
    <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-8 md:py-12">
      <div className="text-center py-12">
        <p className="text-text-secondary">Redirecting to dashboard...</p>
      </div>
    </div>
  );
}
