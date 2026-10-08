"use client";

import React, { useState } from "react";
import { useDentalOS } from "@/context/DentalContext";
import {
  Bell,
  Search,
  Sparkles,
  ExternalLink,
  MessageSquare,
  QrCode,
  Shield,
  Activity,
  AlertCircle,
} from "lucide-react";
import Link from "next/link";

export function Header() {
  const { activeClinic, emergencyCases, smartQRs } = useDentalOS();
  const [showQRModal, setShowQRModal] = useState(false);

  const activeEmergencies = emergencyCases.filter((e) => e.status !== "Resolved");
  const universalQR = smartQRs.find((q) => q.type === "universal");

  return (
    <header className="h-16 bg-white border-b border-slate-200 sticky top-0 z-20 px-6 flex items-center justify-between">
      {/* Left side: Clinic Info & Status */}
      <div className="flex items-center gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-sm font-bold text-slate-900 tracking-tight">
              {activeClinic.name}
            </h1>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-teal-50 text-teal-700 border border-teal-200/60">
              <span className="w-1.5 h-1.5 rounded-full bg-teal-500 animate-pulse"></span>
              Gemini 2.5 Pro Live
            </span>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-slate-100 text-slate-700">
              {activeClinic.region === "IN" ? "🇮🇳 India (GST + UPI)" : "🇺🇸 USA (HIPAA + Stripe)"}
            </span>
          </div>
          <p className="text-[11px] text-slate-500 hidden sm:block">
            {activeClinic.tagline} • {activeClinic.city}, {activeClinic.state}
          </p>
        </div>
      </div>

      {/* Right side: Growth Actions & Status */}
      <div className="flex items-center gap-2.5">
        {/* Emergency Alert Badge */}
        {activeEmergencies.length > 0 && (
          <Link
            href="/emergency-triage"
            className="flex items-center gap-1.5 px-2.5 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-lg text-xs font-semibold animate-pulse transition"
          >
            <AlertCircle className="w-3.5 h-3.5 text-rose-600" />
            <span>{activeEmergencies.length} Triage Urgent</span>
          </Link>
        )}

        {/* WhatsApp Workforce Simulator Button */}
        <Link
          href="/ai-workforce"
          className="hidden md:flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 rounded-lg text-xs font-semibold transition"
        >
          <MessageSquare className="w-3.5 h-3.5 text-emerald-600" />
          <span>WhatsApp Simulator</span>
        </Link>

        {/* Universal Smart Clinic QR Patient Portal Preview */}
        {universalQR && (
          <Link
            href={universalQR.targetUrl}
            target="_blank"
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-medium shadow-sm transition"
          >
            <QrCode className="w-3.5 h-3.5 text-teal-400" />
            <span>Scan Portal (Patient View)</span>
            <ExternalLink className="w-3 h-3 text-slate-400" />
          </Link>
        )}

        {/* Growth Starter Kit Link */}
        <Link
          href="/starter-kit"
          className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 text-white rounded-lg text-xs font-semibold shadow-sm transition"
        >
          <Sparkles className="w-3.5 h-3.5 text-teal-200" />
          <span>Starter Kit Posters</span>
        </Link>
      </div>
    </header>
  );
}
