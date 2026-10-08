"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { Sidebar } from "./Sidebar";
import { Header } from "./Header";
import { ErrorBoundary } from "@/components/ui/ErrorBoundary";
import { DiagnosticInspector } from "@/components/ui/DiagnosticInspector";

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // If viewing patient-facing portal pages (e.g. /portal/...), render clean mobile view
  const isPortal = pathname.startsWith("/portal");

  if (isPortal) {
    return (
      <div className="min-h-screen bg-slate-50 text-slate-900 antialiased font-sans">
        <ErrorBoundary componentName="Patient Portal Subsystem">
          {children}
        </ErrorBoundary>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Admin Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 ml-64 flex flex-col min-w-0">
        <Header />
        <main className="flex-1 p-6 overflow-y-auto">
          <ErrorBoundary componentName="Active Page Subsystem">
            {children}
          </ErrorBoundary>
        </main>
      </div>

      {/* Component-wise Diagnostic Inspector */}
      <DiagnosticInspector />
    </div>
  );
}
