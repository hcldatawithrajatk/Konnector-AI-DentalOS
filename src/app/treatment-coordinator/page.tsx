"use client";

import React, { useState } from "react";
import { useDentalOS } from "@/context/DentalContext";
import { formatCurrency } from "@/lib/utils";
import {
  TrendingUp,
  Sparkles,
  Zap,
  CheckCircle2,
  Calendar,
  MessageSquare,
  ShieldCheck,
  Play,
  ArrowRight,
  Clock,
  Layers,
  ChevronRight,
} from "lucide-react";

export default function TreatmentCoordinatorPage() {
  const { activeClinic, crmLeads, treatments } = useDentalOS();

  // High-value cases filter
  const highValueLeads = crmLeads.filter(
    (l) => l.estimatedValue >= (activeClinic.region === "US" ? 1000 : 25000)
  );

  const [selectedCase, setSelectedCase] = useState(highValueLeads[0] || crmLeads[0]);

  // Interactive acceptance predictor sliders
  const [engaged3DScan, setEngaged3DScan] = useState(true);
  const [discussedBudget, setDiscussedBudget] = useState(true);
  const [askedWarranty, setAskedWarranty] = useState(true);
  const [viewedBeforeAfter, setViewedBeforeAfter] = useState(true);

  // Dynamic Acceptance Calculation
  let predictedScore = 50;
  if (engaged3DScan) predictedScore += 20;
  if (discussedBudget) predictedScore += 12;
  if (askedWarranty) predictedScore += 8;
  if (viewedBeforeAfter) predictedScore += 8;
  predictedScore = Math.min(98, predictedScore);

  const followUpSteps = [
    {
      step: 1,
      timing: "2 Hours Post-Consultation",
      channel: "WhatsApp Interactive Card",
      title: "Personalized 3D Digital Smile / CBCT Simulation",
      description: "Vikram automatically sends a 3D digital viewer showing the exact smile progression or implant positioning.",
      status: "Dispatched & Viewed",
    },
    {
      step: 2,
      timing: "24 Hours Post-Consultation",
      channel: "WhatsApp Video Case Study",
      title: "Before & After Video Testimonial",
      description: "Shares a verified patient case study of similar age and dental condition who completed the procedure successfully.",
      status: "Scheduled",
    },
    {
      step: 3,
      timing: "48 Hours Post-Consultation",
      channel: "WhatsApp EMI Calculator",
      title: "0% Interest Flexible Financing Breakdown",
      description: `Dispatches personalized 3, 6, and 12-month payment schedules starting at ${
        activeClinic.currency === "INR" ? "₹3,200/mo" : "$149/mo"
      }.`,
      status: "Scheduled",
    },
    {
      step: 4,
      timing: "Day 4 Follow-Up",
      channel: "Concierge Priority Booking",
      title: "Direct Specialist Chair Reservation",
      description: "Offers a reserved chair reservation with Dr. Rajesh Sharma with locked-in treatment package pricing.",
      status: "Scheduled",
    },
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-50 border border-purple-200 text-purple-800 text-xs font-semibold mb-1">
            <Sparkles className="w-3.5 h-3.5 text-purple-600" />
            <span>High-Value Elective Case Acceptance Engine</span>
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            AI Treatment Coordinator (Vikram)
          </h2>
          <p className="text-xs text-slate-500">
            Nurture Implants, Invisalign, Veneers, and Smile Makeovers with predictive acceptance scoring and automated educational journeys.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <span className="px-3 py-1.5 rounded-xl bg-purple-50 border border-purple-200 text-purple-900 text-xs font-bold">
            Average High-Value Acceptance: 76.4%
          </span>
        </div>
      </div>

      {/* Main Grid: Cases & Treatment Acceptance Engine */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Active High-Value Cases (4 Cols) */}
        <div className="lg:col-span-4 space-y-3">
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider px-1">
            High-Value Treatment Pipeline
          </div>

          <div className="space-y-2.5">
            {highValueLeads.map((item) => {
              const isSelected = item.id === selectedCase?.id;
              return (
                <div
                  key={item.id}
                  onClick={() => setSelectedCase(item)}
                  className={`p-4 rounded-2xl border-2 transition cursor-pointer text-left ${
                    isSelected
                      ? "border-purple-600 bg-purple-50/40 shadow-sm"
                      : "border-slate-200 bg-white hover:border-slate-300"
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-bold text-slate-900 text-xs">{item.name}</h4>
                      <p className="text-[11px] text-slate-600 mt-0.5">{item.treatmentInterest}</p>
                    </div>
                    <span className="text-[11px] font-mono font-bold text-purple-700 bg-purple-100/60 px-2 py-0.5 rounded-full">
                      {formatCurrency(item.estimatedValue, activeClinic.currency)}
                    </span>
                  </div>

                  <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[10px]">
                    <span className="text-slate-500">Acceptance Score:</span>
                    <span className="font-bold text-emerald-600 font-mono">
                      {item.treatmentIntentScore}/100
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Treatment Acceptance Detail & Simulator (8 Cols) */}
        <div className="lg:col-span-8 space-y-6">
          {selectedCase && (
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
              {/* Selected Case Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-bold text-slate-900">{selectedCase.name}</h3>
                    <span className="px-2.5 py-0.5 bg-purple-100 text-purple-800 rounded-full text-xs font-bold">
                      {selectedCase.treatmentInterest}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Estimated Case Value:{" "}
                    <strong className="text-slate-900">
                      {formatCurrency(selectedCase.estimatedValue, activeClinic.currency)}
                    </strong>{" "}
                    • Stage: <span className="capitalize">{selectedCase.status.replace("_", " ")}</span>
                  </p>
                </div>

                {/* Score Dial */}
                <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-xl border border-purple-200">
                  <div className="text-center">
                    <div className="text-xl font-extrabold text-purple-900 font-mono">
                      {predictedScore} / 100
                    </div>
                    <div className="text-[9px] uppercase tracking-wider text-purple-700 font-bold">
                      Acceptance Probability
                    </div>
                  </div>
                </div>
              </div>

              {/* Engagement Signals Checklist Simulator */}
              <div>
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
                  AI Engagement Signals (Acceptance Score Drivers)
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
                  <label className="flex items-center gap-2 p-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={engaged3DScan}
                      onChange={(e) => setEngaged3DScan(e.target.checked)}
                      className="accent-purple-600 rounded"
                    />
                    <span className="font-medium text-slate-700">Viewed 3D Digital Simulation Video (+20%)</span>
                  </label>

                  <label className="flex items-center gap-2 p-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={discussedBudget}
                      onChange={(e) => setDiscussedBudget(e.target.checked)}
                      className="accent-purple-600 rounded"
                    />
                    <span className="font-medium text-slate-700">Explored 0% Interest EMI Options (+12%)</span>
                  </label>

                  <label className="flex items-center gap-2 p-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={askedWarranty}
                      onChange={(e) => setAskedWarranty(e.target.checked)}
                      className="accent-purple-600 rounded"
                    />
                    <span className="font-medium text-slate-700">Inquired on Manufacturer Warranty (+8%)</span>
                  </label>

                  <label className="flex items-center gap-2 p-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={viewedBeforeAfter}
                      onChange={(e) => setViewedBeforeAfter(e.target.checked)}
                      className="accent-purple-600 rounded"
                    />
                    <span className="font-medium text-slate-700">Reviewed Similar Before & After Cases (+8%)</span>
                  </label>
                </div>
              </div>

              {/* Automated Follow-Up Sequence */}
              <div>
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-3">
                  Automated High-Value Follow-Up Sequence (4-Step WhatsApp Journey)
                </h4>

                <div className="space-y-3">
                  {followUpSteps.map((step) => (
                    <div
                      key={step.step}
                      className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/50 flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs"
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-7 h-7 rounded-lg bg-purple-600 text-white flex items-center justify-center font-bold text-xs flex-shrink-0 mt-0.5">
                          {step.step}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-slate-900">{step.title}</span>
                            <span className="text-[10px] text-purple-700 font-semibold bg-purple-100 px-1.5 py-0.2 rounded">
                              {step.timing}
                            </span>
                          </div>
                          <p className="text-slate-600 text-[11px] mt-0.5">{step.description}</p>
                        </div>
                      </div>

                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 flex-shrink-0 self-start md:self-auto">
                        {step.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
