"use client";

import React, { useState, useMemo, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Plus, Edit3, Trash2, MoreHorizontal, ArrowRight, ArrowLeft, Dumbbell, Flame, Flower2, Activity, Sparkles, HelpCircle } from "lucide-react";
import Card from "@/app/components/ui/Card";
import Button from "@/app/components/ui/Button";
import Modal from "@/app/components/ui/Modal";
import CreateClassModal from "@/app/components/feedback/CreateClassModal";
import EditClassForm from "@/app/components/forms/EditClassForm";
import Table, { TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/app/components/ui/Table";
import { FitnessClass } from "@/app/interfaces/class";
import { formatDisplayDate } from "@/app/lib/mockData";
import { cn } from "@/app/lib/utils";
import { getClasses, createClass, updateClass, deleteClass } from "@/app/lib/api/classes";
import Link from "next/link";

import { useToast } from "@/app/components/ui/Toast";

const ITEMS_PER_PAGE = 5;

const convertToISO = (dateStr: string, timeStr: string) => {
  const [year, month, day] = dateStr.split("-").map(Number);
  const [time, modifier] = timeStr.split(" ");
  let [hours, minutes] = time.split(":").map(Number);
  
  if (modifier) {
    if (modifier.toUpperCase() === "PM" && hours < 12) {
      hours += 12;
    }
    if (modifier.toUpperCase() === "AM" && hours === 12) {
      hours = 0;
    }
  }
  
  const date = new Date(year, month - 1, day, hours, minutes, 0, 0);
  return date.toISOString();
};

const mapDbClassToUI = (cls: any): FitnessClass => {
  const start = new Date(cls.startTime);
  const end = new Date(cls.endTime);
  
  const year = start.getFullYear();
  const month = String(start.getMonth() + 1).padStart(2, "0");
  const day = String(start.getDate()).padStart(2, "0");
  const dateStr = `${year}-${month}-${day}`;

  const formatTime = (d: Date) => {
    return d.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  return {
    id: cls.id,
    title: cls.title,
    category: cls.category,
    instructor: cls.instructor,
    startTime: formatTime(start),
    endTime: formatTime(end),
    date: dateStr,
    capacity: cls.capacity,
    availableSeats: cls.availableSeats,
    location: cls.location,
    detailedLocation: cls.detailedLocation,
    price: cls.price,
  };
};

export function getCategoryIcon(categoryOrTitle: string) {
  const norm = categoryOrTitle.toLowerCase();
  if (norm.includes("strength") || norm.includes("lift") || norm.includes("pilates")) {
    return <Dumbbell className="size-6" />;
  }
  if (norm.includes("yoga")) {
    return <Flower2 className="size-6" />;
  }
  if (norm.includes("cardio") || norm.includes("hiit") || norm.includes("run") || norm.includes("zumba")) {
    return <Flame className="size-6" />;
  }
  if (norm.includes("calisthenics") || norm.includes("gymnastic") || norm.includes("bodyweight")) {
    return <Activity className="size-6" />;
  }
  if (norm.includes("meditation") || norm.includes("nidra") || norm.includes("relax")) {
    return <Sparkles className="size-6" />;
  }
  return <HelpCircle className="size-6" />;
}

export default function AdminDashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { toast } = useToast();

  const [classes, setClasses] = useState<FitnessClass[]>([]);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingClass, setEditingClass] = useState<FitnessClass | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [currentTime, setCurrentTime] = useState<Date>(new Date());
  const [pendingMutations, setPendingMutations] = useState<Set<string>>(new Set());

  const fetchAdminClasses = async () => {
    setLoading(true);
    try {
      const instructorId = (session?.user as any)?.id;
      const data = await getClasses({ instructorId, includePast: true });
      setClasses(data.map(mapDbClassToUI));
    } catch (err) {
      console.error("Failed to load admin classes", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (status === "unauthenticated") {
      router.replace("/login");
    } else if (status === "authenticated") {
      const userRole = (session?.user as any)?.role;
      if (userRole !== "ADMIN") {
        router.replace("/dashboard");
      } else {
        fetchAdminClasses();
      }
    }
  }, [status, session]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const scheduleClasses = useMemo(() => {
    return classes.filter((cls) => {
      const endTimeDate = new Date(convertToISO(cls.date, cls.endTime));
      return currentTime < endTimeDate;
    });
  }, [classes, currentTime]);

  const historyClasses = useMemo(() => {
    return classes
      .filter((cls) => {
        const endTimeDate = new Date(convertToISO(cls.date, cls.endTime));
        return currentTime >= endTimeDate;
      })
      .sort((a, b) => b.date.localeCompare(a.date));
  }, [classes, currentTime]);

  const paginatedClasses = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return historyClasses.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [historyClasses, currentPage]);

  const totalPages = Math.ceil(historyClasses.length / ITEMS_PER_PAGE);

  const handleCreateSubmit = async (data: {
    title: string;
    category: string;
    location: string;
    detailedLocation?: string;
    startTime: string;
    endTime: string;
    date: string;
    capacity: number;
    price: number;
  }) => {
    // Close modal immediately
    setIsCreateOpen(false);

    const tempId = `temp-class-${Date.now()}`;
    const tempClass: FitnessClass = {
      id: tempId,
      title: data.title,
      category: data.category,
      instructor: session?.user?.name || "Instructor",
      startTime: data.startTime,
      endTime: data.endTime,
      date: data.date,
      capacity: Number(data.capacity),
      availableSeats: Number(data.capacity),
      location: data.location,
      detailedLocation: data.detailedLocation,
      price: Number(data.price),
      isSyncing: true,
    };

    // Save snapshot before mutation
    const prevClasses = [...classes];

    // Optimistic update
    setClasses((prev) => [tempClass, ...prev]);
    setPendingMutations((prev) => new Set(prev).add(tempId));

    try {
      const startISO = convertToISO(data.date, data.startTime);
      const endISO = convertToISO(data.date, data.endTime);
      
      const created = await createClass({
        title: data.title,
        category: data.category,
        startTime: startISO,
        endTime: endISO,
        capacity: Number(data.capacity),
        instructor: session?.user?.name || "Instructor",
        description: `Join this premium ${data.title} class to boost your fitness, flexibility, and general well-being.`,
        location: data.location,
        detailedLocation: data.detailedLocation,
        price: data.price,
        imageUrl: "https://images.unsplash.com/photo-1518611012118-696072aa579a?q=80&w=600&auto=format&fit=crop",
      });
      
      const mapped = mapDbClassToUI(created);
      setClasses((prev) => prev.map((c) => (c.id === tempId ? mapped : c)));
    } catch (err: any) {
      // Rollback snapshot on failure
      setClasses(prevClasses);
      toast.error(
        "Class creation failed",
        err?.message || "Your class could not be created. Please try again."
      );
    } finally {
      setPendingMutations((prev) => {
        const next = new Set(prev);
        next.delete(tempId);
        return next;
      });
    }
  };

  const handleEditSubmit = async (data: {
    id: string;
    title: string;
    category: string;
    location: string;
    detailedLocation?: string;
    startTime: string;
    endTime: string;
    date: string;
    capacity: number;
    price: number;
  }) => {
    if (pendingMutations.has(data.id)) return;

    // Close modal immediately
    setEditingClass(null);

    // Save snapshot before mutation
    const prevClasses = [...classes];

    const currentItem = classes.find((c) => c.id === data.id);
    if (!currentItem) return;

    const updatedOptimisticClass: FitnessClass = {
      ...currentItem,
      title: data.title,
      category: data.category,
      location: data.location,
      detailedLocation: data.detailedLocation,
      startTime: data.startTime,
      endTime: data.endTime,
      date: data.date,
      capacity: Number(data.capacity),
      price: Number(data.price),
      isSyncing: true,
    };

    // Optimistic update
    setClasses((prev) => prev.map((cls) => (cls.id === data.id ? updatedOptimisticClass : cls)));
    setPendingMutations((prev) => new Set(prev).add(data.id));

    try {
      const startISO = convertToISO(data.date, data.startTime);
      const endISO = convertToISO(data.date, data.endTime);

      const updated = await updateClass(data.id, {
        title: data.title,
        category: data.category,
        location: data.location,
        detailedLocation: data.detailedLocation,
        startTime: startISO,
        endTime: endISO,
        capacity: Number(data.capacity),
        price: data.price,
      });

      const mapped = mapDbClassToUI(updated);
      setClasses((prev) => prev.map((cls) => (cls.id === data.id ? mapped : cls)));
    } catch (err: any) {
      // Rollback snapshot on failure
      setClasses(prevClasses);
      toast.error(
        "Class update failed",
        err?.message || "Your class could not be updated. Please try again."
      );
    } finally {
      setPendingMutations((prev) => {
        const next = new Set(prev);
        next.delete(data.id);
        return next;
      });
    }
  };

  const handleDeleteClass = async (id: string) => {
    if (pendingMutations.has(id)) return;

    if (confirm("Are you sure you want to delete this class?")) {
      // Save snapshot before mutation
      const prevClasses = [...classes];

      // Optimistically remove class
      const updatedClasses = classes.filter((cls) => cls.id !== id);
      setClasses(updatedClasses);

      const updatedTotalPages = Math.ceil(updatedClasses.length / ITEMS_PER_PAGE);
      if (currentPage > updatedTotalPages && updatedTotalPages > 0) {
        setCurrentPage(updatedTotalPages);
      }

      setPendingMutations((prev) => new Set(prev).add(id));

      try {
        await deleteClass(id);
      } catch (err: any) {
        // Rollback snapshot on failure
        setClasses(prevClasses);
        toast.error(
          "Class deletion failed",
          err?.message || "The class could not be deleted. Please try again."
        );
      } finally {
        setPendingMutations((prev) => {
          const next = new Set(prev);
          next.delete(id);
          return next;
        });
      }
    }
  };

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F8F8FA]">
        <div className="flex flex-col items-center gap-4">
          <svg className="animate-spin h-10 w-10 text-primary" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          <span className="font-semibold text-text-secondary font-manrope">Loading instructor dashboard...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-full py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto flex flex-col gap-8">
      {/* Back Button */}
      <div className="-mb-2">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-text-secondary hover:text-text-primary transition-colors cursor-pointer font-manrope"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Back to Booking Page</span>
        </Link>
      </div>

      <div className="flex items-center justify-between">
        <h1 className="text-4xl font-bold font-sora text-text-primary">Instructor Dashboard</h1>
      </div>

      <Card>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h2 className="text-2xl font-bold font-sora text-text-primary">Schedule</h2>
            <p className="text-sm font-medium text-text-secondary mt-1 font-manrope">
              You have {scheduleClasses.length} class{scheduleClasses.length === 1 ? "" : "es"} scheduled.
            </p>
          </div>
          <Button
            onClick={() => setIsCreateOpen(true)}
            className="flex items-center gap-2 cursor-pointer bg-primary hover:bg-primary-hover border-0 text-[#111827]"
          >
            <Plus className="size-5" />
            <span>Create New Class</span>
          </Button>
        </div>

        {scheduleClasses.length === 0 ? (
          <div className="text-center py-12 border border-dashed border-border rounded-card bg-bg-base/30">
            <p className="text-text-secondary font-medium font-manrope">No upcoming classes scheduled.</p>
          </div>
        ) : (
          <div className="flex gap-6 overflow-x-auto pb-4 scrollbar-thin scrollbar-thumb-border scrollbar-track-transparent">
            {scheduleClasses.map((cls) => {
              const booked = cls.capacity - cls.availableSeats;
              return (
                <div
                  key={cls.id}
                  className="flex-shrink-0 w-[220px] h-[220px] bg-surface border border-border rounded-card shadow-sm hover:shadow-card-hover transition-all p-6 flex flex-col justify-between relative group"
                >
                  <div className="absolute top-3 right-3 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => setEditingClass(cls)}
                      className="p-1 rounded bg-bg-base text-text-secondary hover:text-text-primary hover:bg-border transition-colors cursor-pointer"
                      title="Edit"
                    >
                      <Edit3 className="size-3.5" />
                    </button>
                    <button
                      onClick={() => handleDeleteClass(cls.id)}
                      className="p-1 rounded bg-red-50 text-danger hover:bg-red-100 transition-colors cursor-pointer"
                      title="Delete"
                    >
                      <Trash2 className="size-3.5" />
                    </button>
                  </div>

                  <div className="flex items-center justify-center size-12 rounded-xl bg-bg-base text-text-primary self-start border border-border shadow-[0px_2px_8px_0px_rgba(0,0,0,0.05)]">
                    {getCategoryIcon(cls.category || cls.title)}
                  </div>

                  <div className="flex flex-col gap-1 w-full">
                    <h3 className="font-bold text-lg text-text-primary font-sora truncate leading-tight" title={cls.title}>
                      {cls.title}
                    </h3>
                    <p className="text-xs font-semibold text-text-secondary font-manrope">
                      {cls.startTime} - {cls.endTime}
                    </p>
                    <p className="text-[11px] font-semibold text-text-secondary font-manrope truncate" title={cls.detailedLocation || cls.location}>
                      📍 {cls.detailedLocation || cls.location}
                    </p>
                    <p className="text-xs font-bold text-text-primary font-manrope flex items-center justify-between">
                      <span>{booked}/{cls.capacity} Booked • ₹{cls.price}</span>
                      {cls.isSyncing && (
                        <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded animate-pulse">
                          Syncing...
                        </span>
                      )}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </Card>

      <Card>
        <div className="mb-6">
          <h2 className="text-2xl font-bold font-sora text-text-primary">Class history</h2>
          <p className="text-sm font-medium text-text-secondary mt-1 font-manrope">
            View all the classes you have created.
          </p>
        </div>

        <div className="border border-border rounded-xl overflow-hidden bg-surface">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Class Name</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Time</TableHead>
                <TableHead>Capacity</TableHead>
                <TableHead>Booked</TableHead>
                <TableHead>Price</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedClasses.map((cls) => {
                const booked = cls.capacity - cls.availableSeats;
                return (
                  <TableRow key={cls.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="flex items-center justify-center size-9 rounded-lg bg-bg-base text-text-primary border border-border shadow-[0px_1px_4px_0px_rgba(0,0,0,0.03)]">
                          {getCategoryIcon(cls.category || cls.title)}
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-text-primary font-sora">{cls.title}</span>
                          {cls.isSyncing && (
                            <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded animate-pulse">
                              Syncing...
                            </span>
                          )}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="font-semibold text-text-secondary font-manrope text-xs max-w-[150px] truncate" title={cls.detailedLocation || cls.location}>
                      {cls.detailedLocation || cls.location}
                    </TableCell>
                    <TableCell className="font-semibold text-text-secondary font-manrope">
                      {formatDisplayDate(cls.date)}
                    </TableCell>
                    <TableCell className="font-semibold text-text-secondary font-manrope">
                      {cls.startTime} - {cls.endTime}
                    </TableCell>
                    <TableCell className="font-semibold text-text-secondary font-manrope">
                      {cls.capacity}
                    </TableCell>
                    <TableCell className="font-semibold text-text-secondary font-manrope">
                      {booked}
                    </TableCell>
                    <TableCell className="font-semibold text-text-primary font-manrope">
                      ₹{cls.price}
                    </TableCell>
                    <TableCell className="text-right">
                      <ActionMenu
                        onEdit={() => setEditingClass(cls)}
                        onDelete={() => handleDeleteClass(cls.id)}
                      />
                    </TableCell>
                  </TableRow>
                );
              })}
              {paginatedClasses.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-text-secondary font-medium font-manrope">
                    No classes found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-6 font-manrope">
            {Array.from({ length: totalPages }).map((_, index) => {
              const pageNum = index + 1;
              const isActive = pageNum === currentPage;
              return (
                <button
                  key={pageNum}
                  onClick={() => setCurrentPage(pageNum)}
                  className={cn(
                    "flex items-center justify-center size-8 rounded-lg text-sm font-semibold transition-colors cursor-pointer",
                    isActive
                      ? "bg-[#111827] text-white"
                      : "text-text-secondary hover:bg-bg-base hover:text-text-primary"
                  )}
                >
                  {pageNum}
                </button>
              );
            })}
            {currentPage < totalPages && (
              <button
                onClick={() => setCurrentPage(currentPage + 1)}
                className="flex items-center gap-1 text-sm font-semibold text-text-secondary hover:text-text-primary ml-2 transition-colors cursor-pointer"
              >
                <span>Next</span>
                <ArrowRight className="size-4" />
              </button>
            )}
          </div>
        )}
      </Card>

      <CreateClassModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onSubmit={handleCreateSubmit}
      />

      {editingClass && (
        <Modal
          isOpen={!!editingClass}
          onClose={() => setEditingClass(null)}
          title="Edit Class"
        >
          <EditClassForm
            initialClass={editingClass}
            onSubmit={handleEditSubmit}
            onCancel={() => setEditingClass(null)}
          />
        </Modal>
      )}
    </div>
  );
}

function ActionMenu({ onEdit, onDelete }: { onEdit: () => void; onDelete: () => void }) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="relative inline-block text-left">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-1.5 rounded-full hover:bg-bg-base text-text-secondary hover:text-text-primary transition-colors cursor-pointer"
      >
        <MoreHorizontal className="size-5" />
      </button>
      {isOpen && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)} />
          <div className="absolute right-0 mt-1 w-28 bg-surface rounded-lg border border-border shadow-card z-20 py-1 overflow-hidden">
            <button
              onClick={() => {
                onEdit();
                setIsOpen(false);
              }}
              className="w-full text-left px-3 py-1.5 text-sm hover:bg-bg-base text-text-primary font-medium transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Edit3 className="size-3.5" />
              <span>Edit</span>
            </button>
            <button
              onClick={() => {
                onDelete();
                setIsOpen(false);
              }}
              className="w-full text-left px-3 py-1.5 text-sm hover:bg-red-50 text-danger font-medium transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Trash2 className="size-3.5" />
              <span>Delete</span>
            </button>
          </div>
        </>
      )}
    </div>
  );
}
