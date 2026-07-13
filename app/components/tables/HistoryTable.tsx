import React from "react";
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

export default function HistoryTable({ history }: HistoryTableProps) {
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
          {history.length > 0 ? (
            history.map((row) => (
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
  );
}
