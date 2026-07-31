"use client";

import React from 'react';
import { SessionProvider } from 'next-auth/react';
import { ToastProvider } from '@/app/components/ui/Toast';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider basePath="/api/auth">
      <ToastProvider>{children}</ToastProvider>
    </SessionProvider>
  );
}