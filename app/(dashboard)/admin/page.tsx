"use client";

import React, { useState, useMemo } from "react";
import { Plus, Edit3, Trash2, MoreHorizontal, ArrowRight, Dumbbell, Flame, Flower2, Activity, Sparkles, HelpCircle } from "lucide-react";
import Card from "@/app/components/ui/Card";
import Button from "@/app/components/ui/Button";
import Modal from "@/app/components/ui/Modal";
import CreateClassModal from "@/app/components/feedback/CreateClassModal";
import EditClassForm from "@/app/components/forms/EditClassForm";
import Table, { TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/app/components/ui/Table";
import { FitnessClass } from "@/app/interfaces/class";
import { INITIAL_CLASSES, getTodayDateString, formatDisplayDate } from "@/app/lib/mockData";
import { cn } from "@/app/lib/utils";

const ITEMS_PER_PAGE = 5;

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
  const [classes, setClasses] = useState<FitnessClass[]>(INITIAL_CLASSES);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingClass, setEditingClass] = useState<FitnessClass | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  const todayStr = getTodayDateString();

  const todayClasses = useMemo(() => {
    return classes.filter((cls) => cls.date === todayStr);
  }, [classes, todayStr]);

  const historyClasses = useMemo(() => {
    return [...classes].sort((a, b) => b.date.localeCompare(a.date));
  }, [classes]);

  const paginatedClasses = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return historyClasses.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [historyClasses, currentPage]);

  const totalPages = Math.ceil(historyClasses.length / ITEMS_PER_PAGE);

  const handleCreateSubmit = (data: {
    title: string;
    category: string;
    startTime: string;
    endTime: string;
    date: string;
    capacity: number;
  }) => {
    const newClass: FitnessClass = {
      id: `class-${Date.now()}`,
      title: data.title,
      category: data.category,
      instructor: "John",
      startTime: data.startTime,
      endTime: data.endTime,
      date: data.date,
      capacity: data.capacity,
      availableSeats: data.capacity,
    };
    setClasses((prev) => [newClass, ...prev]);
    setIsCreateOpen(false);
  };

  const handleEditSubmit = (data: {
    id: string;
    title: string;
    category: string;
    startTime: string;
    endTime: string;
    date: string;
    capacity: number;
  }) => {
    setClasses((prev) =>
      prev.map((cls) => {
        if (cls.id === data.id) {
          const booked = cls.capacity - cls.availableSeats;
          const newAvailable = Math.max(0, data.capacity - booked);
          return {
            ...cls,
            title: data.title,
            category: data.category,
            startTime: data.startTime,
            endTime: data.endTime,
            date: data.date,
            capacity: data.capacity,
            availableSeats: newAvailable,
          };
        }
        return cls;
      })
    );
    setEditingClass(null);
  };

  const handleDeleteClass = (id: string) => {
    if (confirm("Are you sure you want to delete this class?")) {
      setClasses((prev) => prev.filter((cls) => cls.id !== id));
      const updatedTotalPages = Math.ceil((classes.length - 1) / ITEMS_PER_PAGE);
      if (currentPage > updatedTotalPages && updatedTotalPages > 0) {
        setCurrentPage(updatedTotalPages);
      }
    }
  };

  return (
    <div className="min-h-full py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto flex flex-col gap-8">
      <div className="flex items-center justify-between">
        <h1 className="text-4xl font-bold font-sora text-text-primary">Instructor Dashboard</h1>
        <button
          onClick={() => {
            if (confirm("Reset class list to original design mockup values?")) {
              setClasses(INITIAL_CLASSES);
              setCurrentPage(1);
            }
          }}
          className="text-xs font-semibold text-text-secondary hover:text-primary transition-colors cursor-pointer font-manrope"
        >
          Reset Mocks
        </button>
      </div>

      <Card>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h2 className="text-2xl font-bold font-sora text-text-primary">Schedule</h2>
            <p className="text-sm font-medium text-text-secondary mt-1 font-manrope">
              You have created {todayClasses.length} class{todayClasses.length === 1 ? "" : "es"} today.
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

        {todayClasses.length === 0 ? (
          <div className="text-center py-12 border border-dashed border-border rounded-card bg-bg-base/30">
            <p className="text-text-secondary font-medium font-manrope">No classes scheduled for today.</p>
          </div>
        ) : (
          <div className="flex gap-6 overflow-x-auto pb-4 scrollbar-thin scrollbar-thumb-border scrollbar-track-transparent">
            {todayClasses.map((cls) => {
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

                  <div className="flex flex-col gap-1.5 w-full">
                    <h3 className="font-bold text-lg text-text-primary font-sora truncate leading-tight" title={cls.title}>
                      {cls.title}
                    </h3>
                    <p className="text-xs font-semibold text-text-secondary font-manrope">
                      {cls.startTime} - {cls.endTime}
                    </p>
                    <p className="text-xs font-bold text-text-primary font-manrope">
                      {booked}/{cls.capacity} Booked
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
                <TableHead>Date</TableHead>
                <TableHead>Time</TableHead>
                <TableHead>Capacity</TableHead>
                <TableHead>Booked</TableHead>
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
                        <span className="font-bold text-text-primary font-sora">{cls.title}</span>
                      </div>
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
                  <TableCell colSpan={6} className="text-center py-8 text-text-secondary font-medium font-manrope">
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
