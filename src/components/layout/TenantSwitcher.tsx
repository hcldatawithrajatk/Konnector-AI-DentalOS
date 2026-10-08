"use client";

import React, { useState } from "react";
import { useDentalOS } from "@/context/DentalContext";
import { Building2, ChevronDown, Check, Plus, ShieldCheck, Sparkles } from "lucide-react";
import Link from "next/link";

export function TenantSwitcher() {
  const { clinics, activeClinic, setActiveClinicId } = useDentalOS();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-2.5 rounded-xl bg-slate-900/5 hover:bg-slate-900/10 transition border border-slate-200/80 text-left"
      >
        <div className="flex items-center gap-3 overflow-hidden">
          <div
            className="w-9 h-9 rounded-lg flex items-center justify-center font-bold text-white shadow-sm flex-shrink-0"
            style={{ backgroundColor: activeClinic.brandColor }}
          >
            {activeClinic.name.charAt(0)}
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="font-semibold text-slate-900 text-xs truncate max-w-[130px]">
                {activeClinic.name}
              </span>
              <span className="text-xs">
                {activeClinic.region === "IN" ? "🇮🇳" : "🇺🇸"}
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-[10px] text-slate-500 font-medium">
              <span>{activeClinic.city}</span>
              <span>•</span>
              <span className="uppercase text-[9px] bg-slate-200/70 px-1 py-0.2 rounded font-mono">
                {activeClinic.currency}
              </span>
              <span>•</span>
              <span className="text-[9px] text-dental-700 font-semibold">
                {activeClinic.complianceMode === "hipaa" ? "HIPAA" : "GST"}
              </span>
            </div>
          </div>
        </div>
        <ChevronDown className="w-4 h-4 text-slate-400 flex-shrink-0 ml-1" />
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute left-0 top-full mt-1.5 w-72 bg-white rounded-xl shadow-xl border border-slate-200 z-50 py-2 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-150">
            <div className="px-3 py-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              Switch Dental Practice (Multi-Tenant)
            </div>

            <div className="max-h-64 overflow-y-auto divide-y divide-slate-100">
              {clinics.map((clinic) => {
                const isSelected = clinic.id === activeClinic.id;
                return (
                  <button
                    key={clinic.id}
                    onClick={() => {
                      setActiveClinicId(clinic.id);
                      setIsOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2.5 flex items-center justify-between hover:bg-slate-50 transition ${
                      isSelected ? "bg-teal-50/60" : ""
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div
                        className="w-7 h-7 rounded-md flex items-center justify-center font-bold text-xs text-white flex-shrink-0"
                        style={{ backgroundColor: clinic.brandColor }}
                      >
                        {clinic.name.charAt(0)}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-1 text-xs font-semibold text-slate-900 truncate">
                          <span>{clinic.region === "IN" ? "🇮🇳" : "🇺🇸"}</span>
                          <span className="truncate">{clinic.name}</span>
                        </div>
                        <div className="text-[10px] text-slate-500 truncate">
                          {clinic.city}, {clinic.state} • {clinic.locationsCount} Locs •{" "}
                          <span className="font-semibold text-dental-700">
                            {clinic.currency} ({clinic.complianceMode.toUpperCase()})
                          </span>
                        </div>
                      </div>
                    </div>
                    {isSelected && <Check className="w-4 h-4 text-teal-600 flex-shrink-0 ml-2" />}
                  </button>
                );
              })}
            </div>

            <div className="p-2 border-t border-slate-100 mt-1 bg-slate-50/70">
              <Link
                href="/onboarding"
                onClick={() => setIsOpen(false)}
                className="w-full flex items-center justify-center gap-1.5 px-3 py-2 bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 text-white rounded-lg text-xs font-semibold shadow-sm transition"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>+ Onboard New Clinic (10 Min)</span>
              </Link>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
