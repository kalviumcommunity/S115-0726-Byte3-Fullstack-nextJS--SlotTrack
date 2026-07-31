"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import Navbar from "../components/navigation/Navbar";
import ProfileDrawer from "../components/profile/ProfileDrawer";
import { HistoryRow } from "../components/tables/HistoryTable";
import { getBookings, bookClass, cancelBooking, getBookingHistory } from "@/app/lib/api/bookings";
import { getProfile, updateProfile } from "@/app/lib/api/users";
import { BookingType } from "@/app/types/booking";
import { useToast } from "@/app/components/ui/Toast";

// Define the dashboard state context
interface DashboardContextType {
  isProfileOpen: boolean;
  setIsProfileOpen: (open: boolean) => void;
  bookedClassIds: string[];
  bookings: BookingType[];
  toggleBookClass: (id: string) => Promise<void>;
  history: HistoryRow[];
  refreshData: () => Promise<void>;
  selectedLocation: string;
  setSelectedLocation: (loc: string) => void;
  pendingMutations: Set<string>;
  optimisticSeatDeltas: Record<string, number>;
  getOptimisticAvailableSeats: (classId: string, baseAvailableSeats: number) => number;
}

const DashboardContext = createContext<DashboardContextType | undefined>(undefined);

export function useDashboard() {
  const context = useContext(DashboardContext);
  if (!context) {
    throw new Error("useDashboard must be used within a DashboardProvider");
  }
  return context;
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session, status, update: updateSession } = useSession();
  const router = useRouter();
  const { toast } = useToast();

  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [bookings, setBookings] = useState<BookingType[]>([]);
  const [bookedClassIds, setBookedClassIds] = useState<string[]>([]);
  const [history, setHistory] = useState<HistoryRow[]>([]);
  const [profileName, setProfileName] = useState("");
  const [userAge, setUserAge] = useState<number | undefined>(undefined);
  const [userGender, setUserGender] = useState<string | undefined>(undefined);
  const [selectedLocation, setSelectedLocation] = useState("Pune");
  const [pendingMutations, setPendingMutations] = useState<Set<string>>(new Set());
  const [optimisticSeatDeltas, setOptimisticSeatDeltas] = useState<Record<string, number>>({});

  const getOptimisticAvailableSeats = useCallback((classId: string, baseAvailableSeats: number) => {
    const delta = optimisticSeatDeltas[classId] || 0;
    return Math.max(0, baseAvailableSeats + delta);
  }, [optimisticSeatDeltas]);

  const fetchUserProfile = async () => {
    try {
      const dbUser = await getProfile();
      if (dbUser) {
        if (dbUser.name) setProfileName(dbUser.name);
        if (dbUser.age !== undefined && dbUser.age !== null) setUserAge(dbUser.age);
        if (dbUser.gender) setUserGender(dbUser.gender);
      }
    } catch (err: any) {
      console.error("Failed to fetch user profile", err);
      if (err?.message?.includes("User not found") || err?.status === 404) {
        signOut({ callbackUrl: "/login" });
      }
    }
  };

  const fetchData = async () => {
    try {
      await fetchUserProfile();
      const activeBookings = await getBookings();
      setBookings(activeBookings);
      setBookedClassIds(activeBookings.filter((b) => b.status === "ACTIVE").map((b) => b.classId));

      const historyData = await getBookingHistory(1, 20);
      const records = historyData?.records || [];
      const mapped = records
        .filter((b: any) => {
          if (b.class) {
            if (b.status === "CANCELLED") return true;
            const start = new Date(b.class.startTime);
            return start.getTime() <= Date.now();
          } else if (b.startTime) {
            const start = new Date(b.startTime);
            return start.getTime() <= Date.now();
          }
          return false;
        })
        .map((b: any) => {
          const cls = b.class || b;
          const start = new Date(cls.startTime);
          const end = cls.endTime ? new Date(cls.endTime) : null;
          
          const formattedDate = start.toLocaleDateString("en-IN", {
            day: "numeric",
            month: "short",
            year: "numeric",
          });

          const formatTimeStr = (d: Date) => {
            return d.toLocaleTimeString("en-IN", {
              hour: "2-digit",
              minute: "2-digit",
              hour12: true,
            });
          };
          const timeStr = end ? `${formatTimeStr(start)} - ${formatTimeStr(end)}` : formatTimeStr(start);

          return {
            id: b.id,
            title: cls.title,
            category: cls.category || "Class",
            date: formattedDate,
            time: timeStr,
          };
        });
      setHistory(mapped);
    } catch (err: any) {
      console.error("Failed to load user bookings/history", err);
      if (err?.message?.includes("User not found") || err?.status === 404) {
        signOut({ callbackUrl: "/login" });
      }
    }
  };

  useEffect(() => {
    if (status === "unauthenticated") {
      router.replace("/login");
    } else if (status === "authenticated") {
      fetchData();
      if (session?.user?.name) {
        setProfileName(session.user.name);
      }
      if ((session?.user as any)?.age !== undefined) {
        setUserAge((session.user as any).age);
      }
      if ((session?.user as any)?.gender) {
        setUserGender((session.user as any).gender);
      }
    }
  }, [status, session]);

  const toggleBookClass = async (classIdOrBookingId: string) => {
    const existingBooking = bookings.find(
      (b) => (b.classId === classIdOrBookingId || b.id === classIdOrBookingId) && b.status === "ACTIVE"
    );

    const isBooked = !!existingBooking || bookedClassIds.includes(classIdOrBookingId);
    const targetClassId = existingBooking ? existingBooking.classId : classIdOrBookingId;
    const targetBookingId = existingBooking ? existingBooking.id : classIdOrBookingId;

    // Prevent duplicate request while mutation is pending
    if (pendingMutations.has(targetClassId) || pendingMutations.has(targetBookingId)) {
      return;
    }

    setPendingMutations((prev) => {
      const next = new Set(prev);
      next.add(targetClassId);
      next.add(targetBookingId);
      return next;
    });

    // Save previous snapshot for rollback
    const prevBookings = [...bookings];
    const prevBookedClassIds = [...bookedClassIds];
    const prevDeltas = { ...optimisticSeatDeltas };

    if (isBooked) {
      // --- OPTIMISTIC CANCEL ---
      setBookedClassIds((prev) => prev.filter((id) => id !== targetClassId && id !== classIdOrBookingId));
      setBookings((prev) => prev.filter((b) => b.classId !== targetClassId && b.id !== targetBookingId));
      setOptimisticSeatDeltas((prev) => ({
        ...prev,
        [targetClassId]: (prev[targetClassId] || 0) + 1,
      }));

      try {
        await cancelBooking(targetBookingId);
        const freshBookings = await getBookings();
        setBookings(freshBookings);
        setBookedClassIds(freshBookings.filter((b) => b.status === "ACTIVE").map((b) => b.classId));
        setOptimisticSeatDeltas((prev) => {
          const next = { ...prev };
          delete next[targetClassId];
          return next;
        });
      } catch (err: any) {
        // Rollback
        setBookings(prevBookings);
        setBookedClassIds(prevBookedClassIds);
        setOptimisticSeatDeltas(prevDeltas);
        toast.error(
          "Cancellation failed",
          err?.message || "The booking could not be cancelled. Please retry."
        );
      } finally {
        setPendingMutations((prev) => {
          const next = new Set(prev);
          next.delete(targetClassId);
          next.delete(targetBookingId);
          return next;
        });
      }
    } else {
      const tempBookingId = `temp-booking-${targetClassId}-${Date.now()}`;
      const tempBooking: any = {
        id: tempBookingId,
        userId: (session?.user as any)?.id || "temp-user",
        classId: targetClassId,
        status: "ACTIVE",
        bookedAt: new Date(),
        cancelledAt: null,
        createdAt: new Date(),
        updatedAt: new Date(),
        class: {
          id: targetClassId,
          title: "Booked Class",
          startTime: new Date().toISOString(),
          endTime: new Date(Date.now() + 3600000).toISOString(),
          location: "Location",
          category: "Class",
        },
      };

      setBookedClassIds((prev) => (prev.includes(targetClassId) ? prev : [...prev, targetClassId]));
      setBookings((prev) => [tempBooking, ...prev]);
      setOptimisticSeatDeltas((prev) => ({
        ...prev,
        [targetClassId]: (prev[targetClassId] || 0) - 1,
      }));

      try {
        const result = await bookClass(targetClassId);
        if (result?.booking) {
          setBookings((prev) => prev.map((b) => (b.id === tempBookingId ? result.booking : b)));
        }
        const freshBookings = await getBookings();
        setBookings(freshBookings);
        setBookedClassIds(freshBookings.filter((b) => b.status === "ACTIVE").map((b) => b.classId));
        setOptimisticSeatDeltas((prev) => {
          const next = { ...prev };
          delete next[targetClassId];
          return next;
        });
      } catch (err: any) {
        // Rollback
        setBookings(prevBookings);
        setBookedClassIds(prevBookedClassIds);
        setOptimisticSeatDeltas(prevDeltas);
        toast.error(
          "Booking failed",
          err?.message || "Your booking could not be completed. Please try again."
        );
      } finally {
        setPendingMutations((prev) => {
          const next = new Set(prev);
          next.delete(targetClassId);
          return next;
        });
      }
    }
  };

  const handleProfileUpdate = async (newName: string, newAge?: number, newGender?: string) => {
    try {
      const updatedUser = await updateProfile({ name: newName, age: newAge, gender: newGender });
      if (updatedUser.name) setProfileName(updatedUser.name);
      if (updatedUser.age !== undefined && updatedUser.age !== null) setUserAge(updatedUser.age);
      if (updatedUser.gender) setUserGender(updatedUser.gender);
      
      // Update session so it propagates to header/navbar
      if (updateSession) {
        await updateSession({
          ...session,
          user: {
            ...session?.user,
            name: updatedUser.name,
            gender: updatedUser.gender,
            age: updatedUser.age,
          },
        });
      }
      
      toast.success("Profile updated successfully!");
    } catch (err: any) {
      toast.error("Profile update failed", err.message || "Failed to update profile");
    }
  };

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F8F8FA]">
        <div className="flex flex-col items-center gap-4">
          <svg className="animate-spin h-10 w-10 text-primary" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          <span className="font-semibold text-text-secondary">Loading your profile...</span>
        </div>
      </div>
    );
  }

  const nameToDisplay = profileName || session?.user?.name || "John Doe";
  const userRole = (session?.user as any)?.role || "MEMBER";

  return (
    <DashboardContext.Provider
      value={{
        isProfileOpen,
        setIsProfileOpen,
        bookedClassIds,
        bookings,
        toggleBookClass,
        history,
        refreshData: fetchData,
        selectedLocation,
        setSelectedLocation,
        pendingMutations,
        optimisticSeatDeltas,
        getOptimisticAvailableSeats,
      }}
    >
      <div className="min-h-screen bg-[#F8F8FA] flex flex-col font-sans antialiased text-[#111827]">
        {/* Navigation header bar */}
        <Navbar
          onProfileClick={() => setIsProfileOpen(true)}
          userName={nameToDisplay}
          role={userRole}
        />

        {/* Spacing for fixed Navbar (height ~72px) */}
        <div className="h-[64px] md:h-[72px] shrink-0" />

        {/* Content area */}
        <main className="flex-1 w-full max-w-7xl mx-auto px-6 py-8 md:py-12">
          {children}
        </main>

        {/* Profile Drawer component */}
        <ProfileDrawer
          isOpen={isProfileOpen}
          onClose={() => setIsProfileOpen(false)}
          userName={nameToDisplay}
          userAge={userAge ?? (session?.user as any)?.age ?? 21}
          userContact={session?.user?.email || ""}
          userGender={userGender || (session?.user as any)?.gender || "Male"}
          history={history}
          onProfileUpdate={handleProfileUpdate}
          role={userRole}
        />
      </div>
    </DashboardContext.Provider>
  );
}
