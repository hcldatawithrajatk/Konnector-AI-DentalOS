"use client";

import React, { useState } from "react";
import { useDentalOS } from "@/context/DentalContext";
import { EmergencyTriageCase } from "@/types";
import {
  AlertTriangle,
  Sparkles,
  ShieldAlert,
  Clock,
  Phone,
  CheckCircle2,
  CalendarCheck,
  Stethoscope,
  Send,
  Plus,
} from "lucide-react";

export default function EmergencyTriagePage() {
  const { activeClinic, emergencyCases, submitEmergencyCase, doctors } = useDentalOS();

  const [patientName, setPatientName] = useState("");
  const [phone, setPhone] = useState("");
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([
    "Severe Throbbing Tooth Pain",
    "Facial Swelling on Left Cheek",
  ]);
  const [triagedCase, setTriagedCase] = useState<EmergencyTriageCase | null>(null);

  const symptomOptions = [
    "Severe Throbbing Tooth Pain",
    "Facial Swelling / Abscess",
    "Broken / Fractured Tooth",
    "Continuous Gum / Tooth Bleeding",
    "Sports Trauma / Knocked Out Tooth",
    "Lost Crown / Bridge",
    "Fever & Difficulty Swallowing",
    "Severe Cold/Hot Sensitivity",
  ];

  const handleToggleSymptom = (symptom: string) => {
    if (selectedSymptoms.includes(symptom)) {
      setSelectedSymptoms(selectedSymptoms.filter((s) => s !== symptom));
    } else {
      setSelectedSymptoms([...selectedSymptoms, symptom]);
    }
  };

  const handleRunTriage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!patientName || !phone) return;

    const res = submitEmergencyCase({
      patientName,
      phone,
      symptoms: selectedSymptoms,
    });

    setTriagedCase(res);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold mb-1">
            <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
            <span>24/7 Clinical Emergency Protocol</span>
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Dental Emergency Triage & Escalation
          </h2>
          <p className="text-xs text-slate-500">
            Automated clinical severity scoring (1-10) for severe pain, dental trauma, facial swellings, and bleeding.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-900 text-xs font-bold flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-rose-600 animate-pulse" />
            <span>On-Call Doctor: {doctors[0]?.name || "Dr. Lead Surgeon"}</span>
          </span>
        </div>
      </div>

      {/* Main Grid: Triage Simulator & Active Emergency Queue */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Interactive Triage Test Simulator (6 Cols) */}
        <div className="lg:col-span-6 bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-5">
          <div>
            <h3 className="font-bold text-slate-900 text-sm">Interactive Clinical Triage Evaluator</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Simulate patient emergency intake to compute urgency score and immediate instructions.
            </p>
          </div>

          <form onSubmit={handleRunTriage} className="space-y-4 text-xs">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Patient Name *</label>
                <input
                  type="text"
                  required
                  value={patientName}
                  onChange={(e) => setPatientName(e.target.value)}
                  placeholder="e.g. Rahul Verma"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-teal-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">WhatsApp Phone *</label>
                <input
                  type="text"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 98..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-teal-500 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-2">Select Observed Symptoms:</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {symptomOptions.map((symp) => {
                  const isChecked = selectedSymptoms.includes(symp);
                  return (
                    <button
                      key={symp}
                      type="button"
                      onClick={() => handleToggleSymptom(symp)}
                      className={`p-2.5 rounded-xl border text-left font-medium transition flex items-center justify-between text-xs ${
                        isChecked
                          ? "border-rose-400 bg-rose-50 text-rose-950 font-semibold"
                          : "border-slate-200 text-slate-600 hover:bg-slate-50"
                      }`}
                    >
                      <span>{symp}</span>
                      {isChecked && <CheckCircle2 className="w-3.5 h-3.5 text-rose-600 flex-shrink-0" />}
                    </button>
                  );
                })}
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 px-4 bg-rose-600 hover:bg-rose-700 text-white rounded-xl font-bold transition shadow-sm flex items-center justify-center gap-1.5"
            >
              <AlertTriangle className="w-4 h-4" />
              <span>Evaluate Severity & Escalate Doctor</span>
            </button>
          </form>

          {/* Result Card if triaged */}
          {triagedCase && (
            <div className="mt-4 p-4 rounded-xl border border-rose-300 bg-rose-50/60 space-y-2.5 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-extrabold text-rose-900 text-sm">
                  Triage Result: Level {triagedCase.urgencyLevel}
                </span>
                <span className="px-2.5 py-0.5 rounded-full font-bold bg-rose-600 text-white font-mono">
                  Score: {triagedCase.urgencyScore} / 10
                </span>
              </div>
              <p className="text-rose-900 leading-relaxed font-medium">
                {triagedCase.recommendedAction}
              </p>
              <div className="pt-2 border-t border-rose-200 flex items-center justify-between text-rose-800">
                <span>Immediate Chair Allocation:</span>
                <span className="font-bold text-emerald-700">✓ On-Call Doctor Notified</span>
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Active Emergency Escalation Log (6 Cols) */}
        <div className="lg:col-span-6 bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-slate-900 text-sm">Active Emergency Inquiries</h3>
            <span className="text-xs text-slate-500">{emergencyCases.length} Cases logged</span>
          </div>

          <div className="space-y-3">
            {emergencyCases.map((c) => (
              <div
                key={c.id}
                className="p-4 rounded-xl border border-slate-200 bg-slate-50/40 space-y-2 text-xs"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <span className="font-bold text-slate-900 text-sm">{c.patientName}</span>
                    <div className="text-[10px] text-slate-500">{c.phone}</div>
                  </div>
                  <span
                    className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${
                      c.urgencyLevel === "Critical"
                        ? "bg-rose-600 text-white"
                        : c.urgencyLevel === "High"
                        ? "bg-rose-100 text-rose-800"
                        : "bg-amber-100 text-amber-800"
                    }`}
                  >
                    {c.urgencyLevel} ({c.urgencyScore}/10)
                  </span>
                </div>

                <div className="flex flex-wrap gap-1">
                  {c.symptoms.map((s, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 rounded-md bg-white border border-slate-200 text-slate-700 text-[10px]"
                    >
                      {s}
                    </span>
                  ))}
                </div>

                <p className="text-slate-600 text-[11px] leading-relaxed pt-1">
                  {c.recommendedAction}
                </p>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-400">
                  <span>Status: <strong className="text-slate-700">{c.status}</strong></span>
                  <span>{new Date(c.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
