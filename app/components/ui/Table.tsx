import React from "react";
import { cn } from "@/app/lib/utils";

export interface TableProps extends React.HTMLAttributes<HTMLTableElement> {
  headers?: string[];
}

export default function Table({ children, headers, className, ...props }: TableProps) {
  if (headers) {
    return (
      <div className="w-full overflow-x-auto rounded-xl border border-[#EEF2F6]">
        <table className={cn("w-full text-left border-collapse", className)} {...props}>
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

  return (
    <div className="w-full overflow-x-auto">
      <table
        className={cn("w-full text-left border-collapse text-sm text-text-primary", className)}
        {...props}
      >
        {children}
      </table>
    </div>
  );
}

export function TableHeader({
  children,
  className,
  ...props
}: React.HTMLAttributes<HTMLTableSectionElement>) {
  return (
    <thead className={cn("border-b border-border bg-transparent", className)} {...props}>
      {children}
    </thead>
  );
}

export function TableBody({
  children,
  className,
  ...props
}: React.HTMLAttributes<HTMLTableSectionElement>) {
  return (
    <tbody className={cn("divide-y divide-border", className)} {...props}>
      {children}
    </tbody>
  );
}

export function TableRow({
  children,
  className,
  ...props
}: React.HTMLAttributes<HTMLTableRowElement>) {
  return (
    <tr
      className={cn("transition-colors hover:bg-bg-base/50", className)}
      {...props}
    >
      {children}
    </tr>
  );
}

export function TableHead({
  children,
  className,
  ...props
}: React.ThHTMLAttributes<HTMLTableCellElement>) {
  return (
    <th
      className={cn(
        "py-4 px-6 font-semibold font-manrope text-text-secondary text-base uppercase tracking-wider",
        className
      )}
      {...props}
    >
      {children}
    </th>
  );
}

export function TableCell({
  children,
  className,
  ...props
}: React.TdHTMLAttributes<HTMLTableCellElement>) {
  return (
    <td className={cn("py-4 px-6 text-base font-semibold text-[#111827]/80 align-middle", className)} {...props}>
      {children}
    </td>
  );
}
