"use client";

import React, { useState } from "react";
import { useDentalOS } from "@/context/DentalContext";
import { formatCurrency } from "@/lib/utils";
import {
  BarChart3,
  TrendingUp,
  Download,
  Calendar,
  Building2,
  Users,
  MessageSquare,
  Sparkles,
  PieChart,
  ArrowUpRight,
  ShieldCheck,
} from "lucide-react";

export default function AnalyticsPage() {
  const { activeClinic, stats } = useDentalOS();

  const [timeRange, setTimeRange] = useState<"30d" | "90d" | "1y">("30d");

  // Channel attribution breakdown
  const channelData = [
    { channel: "Universal Smart Clinic QR", share: "38%", leads: 92, convRate: "34.8%" },
    { channel: "WhatsApp Direct Inbound", share: "29%", leads: 70, convRate: "41.2%" },
    { channel: "Google Review QR Funnel", share: "18%", leads: 43, convRate: "72.4%" },
    { channel: "Patient Referral QR Program", share: "15%", leads: 36, convRate: "52.0%" },
  ];

  // Treatment Revenue Share
  const treatmentShare = [
    { name: "Dental Implants & All-on-4", share: "42%", color: "bg-teal-500" },
    { name: "Invisalign & Clear Aligners", share: "28%", color: "bg-purple-500" },
    { name: "Cosmetic Veneers & Crowns", share: "16%", color: "bg-indigo-500" },
    { name: "Root Canal & Restorations", share: "9%", color: "bg-amber-500" },
    { name: "Preventive Hygiene & Scaling", share: "5%", color: "bg-emerald-500" },
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-50 border border-teal-200 text-teal-800 text-xs font-semibold mb-1">
            <BarChart3 className="w-3.5 h-3.5 text-teal-600" />
            <span>Practice Performance Intelligence</span>
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Executive Analytics & Multi-Location Rollup
          </h2>
          <p className="text-xs text-slate-500">
            Real-time attribution, revenue influenced by AI employees, and chair productivity metrics for {activeClinic.name}.
          </p>
        </div>

        {/* Time range selector */}
        <div className="flex items-center gap-2">
          <div className="p-1 bg-white rounded-xl border border-slate-200 shadow-xs flex">
            {(["30d", "90d", "1y"] as const).map((r) => (
              <button
                key={r}
                onClick={() => setTimeRange(r)}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition uppercase ${
                  timeRange === r ? "bg-slate-900 text-white shadow-xs" : "text-slate-600 hover:text-slate-900"
                }`}
              >
                {r}
              </button>
            ))}
          </div>

          <button
            onClick={() => window.print()}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-bold transition shadow-sm"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Executive PDF</span>
          </button>
        </div>
      </div>

      {/* KPI Cards Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="text-slate-500 text-xs font-medium">Net Influenced Practice Revenue</div>
          <div className="text-2xl font-extrabold text-slate-900 mt-1">
            {formatCurrency(stats.revenueInfluenced, activeClinic.currency)}
          </div>
          <div className="text-[11px] text-emerald-600 font-semibold mt-1 flex items-center gap-1">
            <TrendingUp className="w-3 h-3" />
            <span>+{stats.roiMultiplier}x ROI on Software</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="text-slate-500 text-xs font-medium">AI Inquiries Handled</div>
          <div className="text-2xl font-extrabold text-teal-700 mt-1">
            {stats.aiConversationsResolved}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">
            91.4% Autonomous resolution
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="text-slate-500 text-xs font-medium">Appointments Booked by AI</div>
          <div className="text-2xl font-extrabold text-emerald-600 mt-1">
            {stats.appointmentsBooked}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">
            Across Google & Outlook Cal
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="text-slate-500 text-xs font-medium">Staff Labor Saved</div>
          <div className="text-2xl font-extrabold text-purple-600 mt-1">
            {stats.hoursSaved} Hours
          </div>
          <div className="text-[11px] text-purple-700 font-semibold mt-1">
            ≈ 2.5 full-time front desk
          </div>
        </div>
      </div>

      {/* Two Column Visual Breakdowns */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Channel Attribution */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-slate-900 text-sm">Patient Acquisition by Touchpoint</h3>
            <span className="text-xs text-slate-400">QR & Digital Channels</span>
          </div>

          <div className="space-y-3">
            {channelData.map((item, idx) => (
              <div key={idx} className="p-3 rounded-xl border border-slate-100 bg-slate-50/50 space-y-1.5 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900">{item.channel}</span>
                  <span className="font-bold font-mono text-teal-700">{item.share}</span>
                </div>
                <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                  <div className="h-full bg-teal-600 rounded-full" style={{ width: item.share }} />
                </div>
                <div className="flex items-center justify-between text-[10px] text-slate-500 pt-1">
                  <span>{item.leads} Qualified Leads</span>
                  <span className="text-emerald-700 font-semibold">{item.convRate} Conversion</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Treatment Revenue Distribution */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-slate-900 text-sm">Revenue Distribution by Procedure</h3>
            <span className="text-xs text-slate-400">High-Value Concentration</span>
          </div>

          <div className="space-y-3">
            {treatmentShare.map((item, idx) => (
              <div key={idx} className="space-y-1 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-slate-800">{item.name}</span>
                  <span className="font-bold font-mono text-slate-900">{item.share}</span>
                </div>
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div className={`h-full ${item.color} rounded-full`} style={{ width: item.share }} />
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 p-3 bg-teal-50/60 rounded-xl border border-teal-100 text-xs text-teal-900 leading-relaxed">
            💡 <strong>Insight:</strong> 70% of clinic revenue is generated by Implant & Clear Aligner procedures nurtured by <strong>Vikram (AI Treatment Coordinator)</strong>.
          </div>
        </div>
      </div>
    </div>
  );
}
