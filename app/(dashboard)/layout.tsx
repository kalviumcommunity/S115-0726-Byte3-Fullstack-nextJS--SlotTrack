"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import Navbar from "../components/navigation/Navbar";
import ProfileDrawer from "../components/profile/ProfileDrawer";
import { HistoryRow } from "../components/tables/HistoryTable";
import { getBookings, bookClass, cancelBooking, getBookingHistory } from "@/app/lib/api/bookings";
import { getProfile, updateProfile } from "@/app/lib/api/users";
import { BookingType } from "@/app/types/booking";

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

  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [bookings, setBookings] = useState<BookingType[]>([]);
  const [bookedClassIds, setBookedClassIds] = useState<string[]>([]);
  const [history, setHistory] = useState<HistoryRow[]>([]);
  const [profileName, setProfileName] = useState("");
  const [userAge, setUserAge] = useState<number | undefined>(undefined);
  const [userGender, setUserGender] = useState<string | undefined>(undefined);
  const [selectedLocation, setSelectedLocation] = useState("Pune");

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

  const fetchData = async (includeProfile = true) => {
    try {
      const [dbUser, activeBookings, historyData] = await Promise.all([
        includeProfile ? getProfile().catch(() => null) : Promise.resolve(null),
        getBookings(),
        getBookingHistory(1, 20),
      ]);

      if (dbUser) {
        if (dbUser.name) setProfileName(dbUser.name);
        if (dbUser.age !== undefined && dbUser.age !== null) setUserAge(dbUser.age);
        if (dbUser.gender) setUserGender(dbUser.gender);
      }

      if (activeBookings) {
        setBookings(activeBookings);
        setBookedClassIds(activeBookings.filter((b: any) => b.status === "ACTIVE").map((b: any) => b.classId));
      }

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
      fetchData(true);
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
    if (existingBooking) {
      try {
        await cancelBooking(existingBooking.id);
        await fetchData(false);
      } catch (err: any) {
        try {
          await cancelBooking(classIdOrBookingId);
          await fetchData(false);
        } catch (fallbackErr: any) {
          alert(err?.message || fallbackErr?.message || "Failed to cancel booking");
        }
      }
    } else {
      const isAlreadyBooked = bookedClassIds.includes(classIdOrBookingId);
      if (isAlreadyBooked) {
        try {
          await cancelBooking(classIdOrBookingId);
          await fetchData(false);
        } catch (err: any) {
          alert(err?.message || "Failed to cancel booking");
        }
      } else {
        try {
          await bookClass(classIdOrBookingId);
          await fetchData(false);
        } catch (err: any) {
          try {
            await cancelBooking(classIdOrBookingId);
            await fetchData(false);
          } catch (cancErr: any) {
            alert(err?.message || "Failed to book class");
          }
        }
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
      
      alert("Profile updated successfully!");
    } catch (err: any) {
      alert(err.message || "Failed to update profile");
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
