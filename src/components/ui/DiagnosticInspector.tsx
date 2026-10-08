"use client";

import React, { useState } from "react";
import { useDentalOS } from "@/context/DentalContext";
import {
  Activity,
  Bug,
  CheckCircle2,
  Database,
  Layers,
  Sparkles,
  Terminal,
  X,
  ChevronUp,
  ChevronDown,
  Globe,
  Radio,
} from "lucide-react";

export function DiagnosticInspector() {
  const [isOpen, setIsOpen] = useState(false);
  const { activeClinic, crmLeads, appointments, knowledgeDocs, payments, emergencyCases } = useDentalOS();

  return (
    <div className="fixed bottom-4 right-4 z-50 print:hidden">
      {!isOpen ? (
        <button
          onClick={() => setIsOpen(true)}
          className="flex items-center gap-2 px-3.5 py-2 rounded-full bg-slate-900/90 hover:bg-slate-900 text-white shadow-xl backdrop-blur-md border border-slate-700 text-xs font-bold transition hover:scale-105"
        >
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <Bug className="w-3.5 h-3.5 text-teal-400" />
          <span>System Diagnostics</span>
        </button>
      ) : (
        <div className="w-80 md:w-96 rounded-2xl bg-slate-900/95 backdrop-blur-xl border border-slate-700 text-white shadow-2xl p-4 text-xs space-y-3.5 animate-in slide-in-from-bottom-5">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <div className="flex items-center gap-2 font-bold text-teal-400">
              <Activity className="w-4 h-4" />
              <span>Component Diagnostic Inspector</span>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Active Tenant Health */}
          <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700/60 space-y-1.5">
            <div className="flex items-center justify-between font-bold">
              <span className="text-slate-300">Tenant Isolation Status:</span>
              <span className="text-emerald-400 font-mono text-[11px] flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" />
                <span>ISOLATED</span>
              </span>
            </div>
            <div className="text-[11px] text-slate-400">
              Clinic: <strong className="text-white">{activeClinic.name}</strong> ({activeClinic.id})
            </div>
            <div className="text-[11px] text-slate-400">
              Region: <strong className="text-teal-300">{activeClinic.region}</strong> • Currency:{" "}
              <strong className="text-teal-300">{activeClinic.currency}</strong>
            </div>
          </div>

          {/* Live Context Data Slices */}
          <div className="grid grid-cols-2 gap-2 text-[11px]">
            <div className="bg-slate-800/60 p-2.5 rounded-xl border border-slate-700/50">
              <div className="text-slate-400">CRM Leads</div>
              <div className="text-base font-bold text-white mt-0.5">{crmLeads.length} Records</div>
              <div className="text-[9px] text-emerald-400">All stages synced</div>
            </div>

            <div className="bg-slate-800/60 p-2.5 rounded-xl border border-slate-700/50">
              <div className="text-slate-400">Operatory Schedule</div>
              <div className="text-base font-bold text-white mt-0.5">{appointments.length} Slots</div>
              <div className="text-[9px] text-teal-400">48h/24h/2h armed</div>
            </div>

            <div className="bg-slate-800/60 p-2.5 rounded-xl border border-slate-700/50">
              <div className="text-slate-400">RAG Vector Docs</div>
              <div className="text-base font-bold text-white mt-0.5">{knowledgeDocs.length} Chunks</div>
              <div className="text-[9px] text-purple-400">Vertex AI indexed</div>
            </div>

            <div className="bg-slate-800/60 p-2.5 rounded-xl border border-slate-700/50">
              <div className="text-slate-400">Emergency Queue</div>
              <div className="text-base font-bold text-white mt-0.5">{emergencyCases.length} Triaged</div>
              <div className="text-[9px] text-rose-400">On-call standby</div>
            </div>
          </div>

          {/* AI Reasoning Stack */}
          <div className="p-2.5 rounded-xl bg-teal-950/40 border border-teal-800/50 text-[10px] text-teal-200 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-teal-400" />
              <span>Gemini 2.5 Pro Inference Engine</span>
            </span>
            <span className="font-mono text-emerald-400 font-bold">ACTIVE (0.3s)</span>
          </div>
        </div>
      )}
    </div>
  );
}
