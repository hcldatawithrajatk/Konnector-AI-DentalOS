"use client";

import React, { useState } from "react";
import { useDentalOS } from "@/context/DentalContext";
import { PatientCRMRecord, CRMStage } from "@/types";
import { formatCurrency, formatDate } from "@/lib/utils";
import {
  Users,
  Search,
  Filter,
  Plus,
  ArrowRight,
  TrendingUp,
  Clock,
  Sparkles,
  Phone,
  Mail,
  ShieldAlert,
  CheckCircle2,
  FileCheck,
  Calendar,
  X,
} from "lucide-react";

export default function DentalCRMPage() {
  const { activeClinic, crmLeads, updateLeadStage, addLead } = useDentalOS();

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLead, setSelectedLead] = useState<PatientCRMRecord | null>(crmLeads[0] || null);
  const [showNewLeadModal, setShowNewLeadModal] = useState(false);

  // New lead form state
  const [newLeadName, setNewLeadName] = useState("");
  const [newLeadPhone, setNewLeadPhone] = useState("");
  const [newLeadEmail, setNewLeadEmail] = useState("");
  const [newLeadInterest, setNewLeadInterest] = useState("Dental Implants");
  const [newLeadValue, setNewLeadValue] = useState(activeClinic.region === "US" ? 1800 : 38000);

  const stages: { key: CRMStage; label: string; color: string }[] = [
    { key: "new_lead", label: "New Lead", color: "border-slate-300 bg-slate-50" },
    { key: "ai_qualified", label: "AI Qualified", color: "border-teal-300 bg-teal-50/50" },
    { key: "consultation_scheduled", label: "Consultation Scheduled", color: "border-blue-300 bg-blue-50/50" },
    { key: "treatment_proposed", label: "Treatment Proposed", color: "border-purple-300 bg-purple-50/50" },
    { key: "treatment_accepted", label: "Treatment Accepted", color: "border-emerald-300 bg-emerald-50/50" },
    { key: "in_progress", label: "In Progress", color: "border-indigo-300 bg-indigo-50/50" },
    { key: "completed", label: "Completed", color: "border-slate-300 bg-slate-50" },
  ];

  const filteredLeads = crmLeads.filter(
    (l) =>
      l.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.phone.includes(searchTerm) ||
      l.treatmentInterest.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreateLead = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLeadName) return;

    const lead = addLead({
      name: newLeadName,
      phone: newLeadPhone,
      email: newLeadEmail,
      dob: "1990-01-01",
      gender: "Female",
      status: "new_lead",
      leadScore: 75,
      treatmentIntentScore: 80,
      treatmentInterest: newLeadInterest,
      estimatedValue: Number(newLeadValue),
      preferredDoctorId: "doc-1",
      lastContactDate: new Date().toISOString(),
      medicalAlerts: [],
      digitalIntakeCompleted: false,
    });

    setSelectedLead(lead);
    setShowNewLeadModal(false);
    setNewLeadName("");
    setNewLeadPhone("");
    setNewLeadEmail("");
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-50 border border-teal-200 text-teal-800 text-xs font-semibold mb-1">
            <Users className="w-3.5 h-3.5 text-teal-600" />
            <span>High-Intent Dental Growth Pipeline</span>
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Dental CRM & Patient Pipeline
          </h2>
          <p className="text-xs text-slate-500">
            Track patients from their initial WhatsApp scan through AI qualification, treatment proposal, and procedure completion.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search patients or treatments..."
              className="pl-9 pr-3 py-2 rounded-xl border border-slate-200 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>

          <button
            onClick={() => setShowNewLeadModal(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition shadow-sm"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>+ Add Patient Lead</span>
          </button>
        </div>
      </div>

      {/* Main Kanban Board (Horizontal Scrolling Pipeline) */}
      <div className="flex gap-4 overflow-x-auto pb-4 pt-1">
        {stages.map((stage) => {
          const leadsInStage = filteredLeads.filter((l) => l.status === stage.key);
          const stageValue = leadsInStage.reduce((acc, l) => acc + l.estimatedValue, 0);

          return (
            <div
              key={stage.key}
              className="w-72 flex-shrink-0 bg-white rounded-2xl border border-slate-200 shadow-xs flex flex-col max-h-[700px]"
            >
              {/* Stage Header */}
              <div className="p-3.5 border-b border-slate-100 flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900 text-xs">{stage.label}</span>
                    <span className="text-[10px] font-mono font-bold px-1.5 py-0.2 bg-slate-100 text-slate-700 rounded-full">
                      {leadsInStage.length}
                    </span>
                  </div>
                  <div className="text-[10px] text-slate-500 mt-0.5">
                    {formatCurrency(stageValue, activeClinic.currency)}
                  </div>
                </div>
              </div>

              {/* Lead Cards List */}
              <div className="p-2.5 flex-1 overflow-y-auto space-y-2.5">
                {leadsInStage.map((lead) => {
                  const isSelected = selectedLead?.id === lead.id;
                  return (
                    <div
                      key={lead.id}
                      onClick={() => setSelectedLead(lead)}
                      className={`p-3 rounded-xl border transition cursor-pointer text-left ${
                        isSelected
                          ? "border-teal-600 bg-teal-50/50 shadow-sm ring-1 ring-teal-200"
                          : "border-slate-200 bg-white hover:border-slate-300 hover:shadow-xs"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <span className="font-bold text-slate-900 text-xs">{lead.name}</span>
                        <span className="text-[10px] font-mono font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded">
                          {formatCurrency(lead.estimatedValue, activeClinic.currency)}
                        </span>
                      </div>

                      <p className="text-[11px] text-slate-600 mt-1 line-clamp-1">
                        {lead.treatmentInterest}
                      </p>

                      <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between text-[10px]">
                        <span className="text-teal-700 font-semibold">
                          Intent: {lead.treatmentIntentScore}%
                        </span>
                        <span className="text-slate-400">
                          {lead.digitalIntakeCompleted ? "✓ Intake Done" : "⏳ Pending Intake"}
                        </span>
                      </div>
                    </div>
                  );
                })}

                {leadsInStage.length === 0 && (
                  <div className="p-4 text-center text-slate-400 text-xs italic">
                    No leads in this stage
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Selected Lead Detailed Record Drawer */}
      {selectedLead && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-100">
            <div>
              <div className="flex items-center gap-2.5">
                <h3 className="text-lg font-bold text-slate-900">{selectedLead.name}</h3>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-teal-100 text-teal-800 capitalize">
                  {selectedLead.status.replace("_", " ")}
                </span>
                {selectedLead.insuranceProvider && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
                    {selectedLead.insuranceProvider} ({selectedLead.verificationStatus})
                  </span>
                )}
              </div>
              <div className="flex items-center gap-4 text-xs text-slate-500 mt-1">
                <span className="flex items-center gap-1">
                  <Phone className="w-3.5 h-3.5" /> {selectedLead.phone}
                </span>
                <span className="flex items-center gap-1">
                  <Mail className="w-3.5 h-3.5" /> {selectedLead.email}
                </span>
                <span>DOB: {selectedLead.dob}</span>
              </div>
            </div>

            {/* Stage Quick Advance Selector */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-600">Move Stage:</span>
              <select
                value={selectedLead.status}
                onChange={(e) => {
                  updateLeadStage(selectedLead.id, e.target.value as CRMStage);
                  setSelectedLead({ ...selectedLead, status: e.target.value as CRMStage });
                }}
                className="px-3 py-1.5 rounded-xl border border-slate-300 text-xs font-semibold bg-white"
              >
                {stages.map((s) => (
                  <option key={s.key} value={s.key}>
                    {s.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Treatment & Intent Scores (1 Col) */}
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="text-xs font-bold text-slate-800">Primary Treatment Goal</div>
                <div className="text-sm font-bold text-slate-900">{selectedLead.treatmentInterest}</div>
                <div className="text-xs text-slate-500">
                  Estimated Value:{" "}
                  <strong className="text-emerald-700">
                    {formatCurrency(selectedLead.estimatedValue, activeClinic.currency)}
                  </strong>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
                <div>
                  <div className="flex justify-between text-xs text-slate-700 mb-1">
                    <span>AI Lead Qualification Score</span>
                    <span className="font-bold font-mono text-teal-700">{selectedLead.leadScore}/100</span>
                  </div>
                  <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-teal-500 rounded-full"
                      style={{ width: `${selectedLead.leadScore}%` }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs text-slate-700 mb-1">
                    <span>Treatment Acceptance Intent Score</span>
                    <span className="font-bold font-mono text-emerald-700">
                      {selectedLead.treatmentIntentScore}/100
                    </span>
                  </div>
                  <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-emerald-500 rounded-full"
                      style={{ width: `${selectedLead.treatmentIntentScore}%` }}
                    />
                  </div>
                </div>
              </div>

              {selectedLead.medicalAlerts.length > 0 && (
                <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-800 space-y-1">
                  <div className="font-bold flex items-center gap-1">
                    <ShieldAlert className="w-3.5 h-3.5 text-rose-600" />
                    <span>Medical & Allergy Alerts:</span>
                  </div>
                  <div className="list-disc pl-4">
                    {selectedLead.medicalAlerts.map((m, idx) => (
                      <div key={idx}>• {m}</div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Interaction History & Timeline (2 Cols) */}
            <div className="lg:col-span-2 space-y-3">
              <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider">
                Full Interaction Timeline & Audit Trail
              </h4>

              <div className="divide-y divide-slate-100 border border-slate-100 rounded-xl p-3 bg-slate-50/40">
                {selectedLead.timeline.map((event) => (
                  <div key={event.id} className="py-2.5 flex items-start gap-3">
                    <div
                      className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0 mt-0.5 ${
                        event.actor === "AI Receptionist"
                          ? "bg-teal-600"
                          : event.actor === "AI Coordinator"
                          ? "bg-purple-600"
                          : event.actor === "Dentist"
                          ? "bg-blue-600"
                          : "bg-slate-700"
                      }`}
                    >
                      {event.actor.charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-slate-900">{event.actor}</span>
                        <span className="text-[10px] text-slate-400">
                          {new Date(event.timestamp).toLocaleString()}
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 mt-0.5">{event.action}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* New Patient Lead Modal */}
      {showNewLeadModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-sm">Add New Patient Lead</h3>
              <button onClick={() => setShowNewLeadModal(false)}>
                <X className="w-4 h-4 text-slate-400 hover:text-slate-700" />
              </button>
            </div>

            <form onSubmit={handleCreateLead} className="space-y-3.5 mt-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Patient Full Name *</label>
                <input
                  type="text"
                  required
                  value={newLeadName}
                  onChange={(e) => setNewLeadName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-teal-500 focus:outline-none"
                  placeholder="e.g. Priya Sharma"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Phone Number (WhatsApp) *</label>
                <input
                  type="text"
                  required
                  value={newLeadPhone}
                  onChange={(e) => setNewLeadPhone(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-teal-500 focus:outline-none"
                  placeholder="+91 98200..."
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Email</label>
                <input
                  type="email"
                  value={newLeadEmail}
                  onChange={(e) => setNewLeadEmail(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-teal-500 focus:outline-none"
                  placeholder="priya@example.com"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Interested Treatment</label>
                <select
                  value={newLeadInterest}
                  onChange={(e) => setNewLeadInterest(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white"
                >
                  <option value="Dental Implants">Single Tooth Dental Implant</option>
                  <option value="Invisalign Clear Aligners">Invisalign Clear Aligners</option>
                  <option value="Porcelain Veneers">Porcelain Veneers</option>
                  <option value="Root Canal (RCT)">Root Canal & Crown</option>
                  <option value="Dental Cleaning & Scaling">Dental Cleaning & Scaling</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Estimated Value ({activeClinic.currency})
                </label>
                <input
                  type="number"
                  value={newLeadValue}
                  onChange={(e) => setNewLeadValue(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-teal-500 focus:outline-none"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowNewLeadModal(false)}
                  className="px-3.5 py-2 border border-slate-200 rounded-xl text-slate-700 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-xl font-bold transition shadow-sm"
                >
                  Create & Launch AI Nurture
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
