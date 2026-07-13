import React from "react";

export interface TableProps extends React.HTMLAttributes<HTMLTableElement> {
  headers: string[];
}

export default function Table({ headers, children, className = "", ...props }: TableProps) {
  return (
    <div className="w-full overflow-x-auto rounded-xl border border-[#EEF2F6]">
      <table className={`w-full text-left border-collapse ${className}`} {...props}>
        <thead>
          <tr className="bg-[#F8F8FA] border-b border-[#EEF2F6]">
            {headers.map((header, idx) => (
              <th key={idx} className="py-4 px-6 text-sm font-semibold text-[#6B7280] uppercase tracking-wider">
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-[#EEF2F6] bg-white text-[#111827]">
          {children}
        </tbody>
      </table>
    </div>
  );
}
