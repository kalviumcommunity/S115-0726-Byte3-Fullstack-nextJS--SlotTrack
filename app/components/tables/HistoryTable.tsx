"use client";

import React, { useState } from "react";
import Badge from "../ui/Badge";

export interface HistoryRow {
  id: string;
  title: string;
  category: string;
  date: string;
  time: string;
}

export interface HistoryTableProps {
  history: HistoryRow[];
}

const ITEMS_PER_PAGE = 5;

export default function HistoryTable({ history }: HistoryTableProps) {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.max(1, Math.ceil(history.length / ITEMS_PER_PAGE));
  const activePage = Math.min(currentPage, totalPages);
  const startIndex = (activePage - 1) * ITEMS_PER_PAGE;
  const visibleHistory = history.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const getCategoryColor = (category: string) => {
    switch (category.toLowerCase()) {
      case "yoga":
        return "bg-purple-100 text-purple-800";
      case "zumba":
        return "bg-pink-100 text-pink-800";
      case "hiit cardio":
        return "bg-orange-100 text-orange-800";
      case "meditation":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-green-100 text-green-800";
    }
  };

  return (
    <div>
      <div className="w-full overflow-x-auto rounded-[20px] border border-[#EEF2F6]">
        <table className="w-full text-left border-collapse bg-white">
          <thead>
            <tr className="bg-[#F8F8FA] border-b border-[#EEF2F6]">
              <th className="py-4 px-6 text-sm font-semibold text-[#6B7280]">Class</th>
              <th className="py-4 px-6 text-sm font-semibold text-[#6B7280]">Date</th>
              <th className="py-4 px-6 text-sm font-semibold text-[#6B7280]">Time</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#EEF2F6] font-sans">
            {visibleHistory.length > 0 ? (
              visibleHistory.map((row) => (
                <tr key={row.id} className="hover:bg-[#F8F8FA] transition-colors">
                  <td className="py-4.5 px-6">
                    <div className="flex flex-col">
                      <span className="font-bold text-base text-[#111827]">{row.title}</span>
                      <span className={`inline-block text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full mt-1.5 w-max ${getCategoryColor(row.category)}`}>
                        {row.category}
                      </span>
                    </div>
                  </td>
                  <td className="py-4.5 px-6 text-sm font-bold text-[#6B7280]">
                    {row.date}
                  </td>
                  <td className="py-4.5 px-6 text-sm font-bold text-[#6B7280]">
                    {row.time}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={3} className="py-8 px-6 text-center text-[#6B7280] font-semibold">
                  No past classes recorded.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between mt-4 px-1 font-sans text-sm select-none">
        <button
          type="button"
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={activePage === 1}
          className="flex items-center gap-1 text-[#6B7280] hover:text-[#111827] disabled:opacity-40 disabled:pointer-events-none transition-colors cursor-pointer font-semibold"
        >
          ← Previous
        </button>

        <div className="flex items-center gap-1.5">
          {Array.from({ length: totalPages }, (_, idx) => idx + 1).map((page) => (
            <button
              key={page}
              type="button"
              onClick={() => setCurrentPage(page)}
              className={`flex items-center justify-center size-8 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                activePage === page
                  ? "bg-[#111827] text-white"
                  : "text-[#6B7280] hover:bg-[#F8F8FA] hover:text-[#111827]"
              }`}
            >
              {page}
            </button>
          ))}
        </div>

        <button
          type="button"
          onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
          disabled={activePage === totalPages}
          className="flex items-center gap-1 text-[#6B7280] hover:text-[#111827] disabled:opacity-40 disabled:pointer-events-none transition-colors cursor-pointer font-semibold"
        >
          Next →
        </button>
      </div>
    </div>
  );
}

