"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { TenantSwitcher } from "./TenantSwitcher";
import {
  LayoutDashboard,
  Sparkles,
  QrCode,
  Users,
  MessageSquare,
  TrendingUp,
  Clock,
  CreditCard,
  AlertTriangle,
  BrainCircuit,
  Workflow,
  BarChart3,
  Settings,
  CheckCircle2,
  PackageCheck,
  Stethoscope,
} from "lucide-react";
import { useDentalOS } from "@/context/DentalContext";

export function Sidebar() {
  const pathname = usePathname();
  const { activeClinic } = useDentalOS();

  const navGroups = [
    {
      title: "OVERVIEW",
      items: [
        {
          label: "30-Day Quick Win",
          href: "/",
          icon: LayoutDashboard,
          badge: "ROI",
          badgeColor: "bg-emerald-100 text-emerald-800",
        },
        {
          label: "Onboarding Wizard",
          href: "/onboarding",
          icon: Sparkles,
          badge: "10 Min",
          badgeColor: "bg-teal-100 text-teal-800",
        },
        {
          label: "Growth Starter Kit",
          href: "/starter-kit",
          icon: PackageCheck,
          badge: "Print Posters",
          badgeColor: "bg-indigo-100 text-indigo-800",
        },
      ],
    },
    {
      title: "GROWTH & CONVERSION",
      items: [
        {
          label: "Smart QR Connect Hub",
          href: "/smart-qrs",
          icon: QrCode,
          badge: "11 QRs",
          badgeColor: "bg-amber-100 text-amber-800",
        },
        {
          label: "Dental CRM & Pipeline",
          href: "/crm",
          icon: Users,
        },
        {
          label: "AI Treatment Coordinator",
          href: "/treatment-coordinator",
          icon: TrendingUp,
          badge: "High Value",
          badgeColor: "bg-purple-100 text-purple-800",
        },
      ],
    },
    {
      title: "AI DIGITAL WORKFORCE",
      items: [
        {
          label: "WhatsApp Simulator",
          href: "/ai-workforce",
          icon: MessageSquare,
          badge: "6 AI Emps",
          badgeColor: "bg-emerald-100 text-emerald-800",
        },
        {
          label: "AI Recall & No-Show Engine",
          href: "/recall-manager",
          icon: Clock,
        },
        {
          label: "Dental Emergency Triage",
          href: "/emergency-triage",
          icon: AlertTriangle,
          badge: "24/7",
          badgeColor: "bg-rose-100 text-rose-800",
        },
      ],
    },
    {
      title: "FINANCIALS & OPS",
      items: [
        {
          label: activeClinic.region === "US" ? "US Insurance & Payments" : "India GST & UPI Billing",
          href: "/insurance-billing",
          icon: CreditCard,
        },
        {
          label: "RAG Knowledge Base",
          href: "/rag-knowledge",
          icon: BrainCircuit,
        },
        {
          label: "Workflow Automations",
          href: "/workflows",
          icon: Workflow,
        },
        {
          label: "Executive Analytics",
          href: "/analytics",
          icon: BarChart3,
        },
        {
          label: "Settings & Compliance",
          href: "/settings",
          icon: Settings,
        },
      ],
    },
  ];

  return (
    <aside className="w-64 bg-white border-r border-slate-200 flex flex-col h-screen fixed left-0 top-0 z-30 select-none">
      {/* Brand Header */}
      <div className="p-4 border-b border-slate-100">
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-teal-600 via-teal-500 to-emerald-400 flex items-center justify-center text-white shadow-md shadow-teal-500/20 group-hover:scale-105 transition">
            <Stethoscope className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-slate-900 tracking-tight text-sm">
                Konnector AI
              </span>
              <span className="bg-teal-500 text-white text-[9px] font-extrabold px-1.5 py-0.2 rounded-full uppercase">
                DentalOS
              </span>
            </div>
            <p className="text-[10px] text-slate-500 font-medium leading-none mt-0.5">
              AI Dental Growth Platform
            </p>
          </div>
        </Link>

        {/* Tenant Switcher dropdown */}
        <div className="mt-3">
          <TenantSwitcher />
        </div>
      </div>

      {/* Navigation Links */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-5">
        {navGroups.map((group) => (
          <div key={group.title}>
            <div className="px-3 mb-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              {group.title}
            </div>
            <div className="space-y-0.5">
              {group.items.map((item) => {
                const isActive = pathname === item.href;
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition ${
                      isActive
                        ? "bg-teal-50 text-teal-800 font-semibold"
                        : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon
                        className={`w-4 h-4 ${
                          isActive ? "text-teal-600" : "text-slate-400"
                        }`}
                      />
                      <span>{item.label}</span>
                    </div>
                    {item.badge && (
                      <span
                        className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${
                          item.badgeColor || "bg-slate-100 text-slate-600"
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* AI Workforce Live Status Footer */}
      <div className="p-3 border-t border-slate-100 bg-slate-50/70">
        <div className="p-2.5 rounded-xl bg-white border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between mb-1.5">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[11px] font-semibold text-slate-800">
                6 AI Employees Online
              </span>
            </div>
            <span className="text-[10px] font-mono text-emerald-600 font-bold">
              96.2%
            </span>
          </div>
          <p className="text-[10px] text-slate-500 leading-tight">
            Aria, Vikram, Tara, Marcus, Zara & Chloe active 24/7 on WhatsApp.
          </p>
        </div>
      </div>
    </aside>
  );
}
