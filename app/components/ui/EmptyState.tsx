import React from "react";

export interface EmptyStateProps {
  title: string;
  description: string;
  icon?: React.ReactNode;
  action?: React.ReactNode;
}

export default function EmptyState({ title, description, icon, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center text-center p-8 bg-white border border-[#EEF2F6] rounded-[20px] shadow-[0_8px_30px_rgba(0,0,0,0.04)]">
      {icon && <div className="mb-4 text-[#6B7280]">{icon}</div>}
      <h3 className="text-lg font-bold text-[#111827] mb-1">{title}</h3>
      <p className="text-sm text-[#6B7280] max-w-sm mb-4">{description}</p>
      {action && <div>{action}</div>}
    </div>
  );
}
