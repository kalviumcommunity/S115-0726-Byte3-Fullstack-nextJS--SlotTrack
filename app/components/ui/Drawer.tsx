import React from "react";
import { X } from "lucide-react";

export interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
  children?: React.ReactNode;
  title?: string;
}

export default function Drawer({ isOpen, onClose, children, title }: DrawerProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden font-manrope">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity cursor-pointer" onClick={onClose} />
      
      <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
        <div className="pointer-events-auto w-screen max-w-md bg-surface shadow-card border-l border-border flex flex-col h-full">
          <div className="flex items-center justify-between p-6 border-b border-border">
            {title ? (
              <h3 className="text-xl font-bold font-sora text-text-primary">{title}</h3>
            ) : (
              <div />
            )}
            <button
              onClick={onClose}
              className="p-1.5 rounded-full hover:bg-bg-base text-text-secondary hover:text-text-primary transition-colors cursor-pointer"
            >
              <X className="size-5" />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto p-6">{children}</div>
        </div>
      </div>
    </div>
  );
}
