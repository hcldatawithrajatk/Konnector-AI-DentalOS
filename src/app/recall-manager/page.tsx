"use client";

import React, { useState } from "react";
import { useDentalOS } from "@/context/DentalContext";
import { Appointment } from "@/types";
import {
  Clock,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  CalendarCheck2,
  CalendarX2,
  RefreshCw,
  Send,
  MessageSquare,
  Users,
  Armchair,
  Check,
  ChevronRight,
} from "lucide-react";

export default function RecallManagerPage() {
  const { activeClinic, appointments, updateAppointmentStatus } = useDentalOS();

  const [activeTab, setActiveTab] = useState<"no_show_engine" | "recall_campaigns">("no_show_engine");
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(appointments[0] || null);
  const [actionSuccess, setActionSuccess] = useState<string>("");

  // Executive Retention Metrics
  const totalSlots = appointments.length || 1;
  const confirmedCount = appointments.filter((a) => a.status === "confirmed").length;
  const attendanceRate = ((confirmedCount / totalSlots) * 100).toFixed(1);
  const noShowRate = 4.2; // Platform industry standard benchmark
  const chairUtilization = 89.4; // %

  const recallCampaigns = [
    {
      id: "rec-1",
      title: "6-Month Preventive Hygiene & Ultrasonic Scaling",
      duePatients: 84,
      responseRate: "71.4%",
      channel: "WhatsApp Interactive Card",
      status: "Active Automated Loop",
      description: "Triggered 175 days after last prophylaxis cleaning with 1-click Saturday/Weekday booking slots.",
    },
    {
      id: "rec-2",
      title: "Dental Implant Annual Bone & Hygiene Stability Check",
      duePatients: 28,
      responseRate: "85.7%",
      channel: "WhatsApp & SMS",
      status: "Active Automated Loop",
      description: "Scheduled 11 months post-implant placement to check periapical radiograph stability and warranty compliance.",
    },
    {
      id: "rec-3",
      title: "Invisalign Aligner Checkpoint & Attachment Verification",
      duePatients: 36,
      responseRate: "92.0%",
      channel: "WhatsApp Card",
      status: "Active Automated Loop",
      description: "Prompts clear aligner patients every 4 weeks to verify tray fit before proceeding to next aligner batch.",
    },
    {
      id: "rec-4",
      title: "Pediatric 6-Month Fluoridation & Sealant Recall",
      duePatients: 19,
      responseRate: "68.2%",
      channel: "WhatsApp Parent Alert",
      status: "Active Automated Loop",
      description: "Sends parents gentle reminders for topical fluoride application and pit-fissure sealant checks.",
    },
  ];

  const handleSimulatePatientAction = (action: "confirmed" | "cancelled" | "reminded_2h") => {
    if (!selectedAppointment) return;
    updateAppointmentStatus(selectedAppointment.id, action);
    setSelectedAppointment({ ...selectedAppointment, status: action });
    setActionSuccess(`Patient successfully marked as: ${action.replace("_", " ").toUpperCase()}`);
    setTimeout(() => setActionSuccess(""), 3000);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-50 border border-teal-200 text-teal-800 text-xs font-semibold mb-1">
            <Sparkles className="w-3.5 h-3.5 text-teal-600" />
            <span>AI Recall & No-Show Prevention Engine</span>
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            AI Recall Manager & Chair Utilization
          </h2>
          <p className="text-xs text-slate-500">
            Automated multi-touch WhatsApp sequences reducing costly chair no-shows and driving 6-month hygiene recall retention.
          </p>
        </div>

        {/* Tab Controls */}
        <div className="flex items-center p-1 bg-white rounded-xl border border-slate-200 shadow-xs">
          <button
            onClick={() => setActiveTab("no_show_engine")}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
              activeTab === "no_show_engine" ? "bg-slate-900 text-white shadow-xs" : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>No-Show Prevention (48h/24h/2h)</span>
          </button>
          <button
            onClick={() => setActiveTab("recall_campaigns")}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
              activeTab === "recall_campaigns" ? "bg-slate-900 text-white shadow-xs" : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Hygiene Recall Loops</span>
          </button>
        </div>
      </div>

      {/* Top Utilization KPI Bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="bg-white p-4 rounded-xl border border-slate-200">
          <div className="text-slate-500 text-xs font-medium">Chair Attendance Rate</div>
          <div className="text-2xl font-extrabold text-emerald-600 mt-1">{attendanceRate}%</div>
          <div className="text-[10px] text-slate-500 mt-0.5">Industry avg: ~78%</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200">
          <div className="text-slate-500 text-xs font-medium">No-Show Rate</div>
          <div className="text-2xl font-extrabold text-teal-700 mt-1">{noShowRate}%</div>
          <div className="text-[10px] text-emerald-600 font-semibold mt-0.5">Reduced from 18% prior</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200">
          <div className="text-slate-500 text-xs font-medium">Chair Utilization</div>
          <div className="text-2xl font-extrabold text-slate-900 mt-1">{chairUtilization}%</div>
          <div className="text-[10px] text-slate-500 mt-0.5">Across all operatory chairs</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200">
          <div className="text-slate-500 text-xs font-medium">AI Recall Conversions</div>
          <div className="text-2xl font-extrabold text-purple-600 mt-1">167 / mo</div>
          <div className="text-[10px] text-purple-700 font-semibold mt-0.5">Automated re-bookings</div>
        </div>
      </div>

      {/* TAB 1: NO-SHOW PREVENTION ENGINE */}
      {activeTab === "no_show_engine" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Scheduled Appointments Queue (7 Cols) */}
          <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-slate-900 text-sm">Upcoming Chair Schedule</h3>
                <p className="text-xs text-slate-500">Live monitoring of 48h, 24h, and 2h automated reminder touches</p>
              </div>
              {actionSuccess && (
                <span className="text-xs text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg font-bold animate-in fade-in">
                  {actionSuccess}
                </span>
              )}
            </div>

            <div className="divide-y divide-slate-100">
              {appointments.map((apt) => {
                const isSelected = selectedAppointment?.id === apt.id;
                return (
                  <div
                    key={apt.id}
                    onClick={() => setSelectedAppointment(apt)}
                    className={`py-3.5 px-3 rounded-xl transition cursor-pointer flex items-center justify-between ${
                      isSelected ? "bg-teal-50/60 border border-teal-200" : "hover:bg-slate-50"
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900 text-xs">{apt.patientName}</span>
                        <span
                          className={`text-[9px] font-bold px-2 py-0.2 rounded-full uppercase ${
                            apt.status === "confirmed"
                              ? "bg-emerald-100 text-emerald-800"
                              : apt.status === "reminded_24h"
                              ? "bg-amber-100 text-amber-800"
                              : apt.status === "cancelled"
                              ? "bg-rose-100 text-rose-800"
                              : "bg-slate-100 text-slate-700"
                          }`}
                        >
                          {apt.status.replace("_", " ")}
                        </span>
                      </div>

                      <div className="text-xs text-slate-600 mt-0.5">{apt.treatmentName}</div>
                      <div className="text-[10px] text-slate-400 mt-0.5">
                        {apt.doctorName} • {new Date(apt.dateTime).toLocaleDateString()} at{" "}
                        {new Date(apt.dateTime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      </div>
                    </div>

                    <ChevronRight className="w-4 h-4 text-slate-400" />
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Column: 3-Touch Reminder Protocol Inspector (5 Cols) */}
          <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-5">
            <div>
              <h3 className="font-bold text-slate-900 text-sm">3-Touch Prevention Workflow</h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Every appointment undergoes an automated 3-tier sequence with 1-click confirmation buttons.
              </p>
            </div>

            {/* Sequence Steps */}
            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-xl border border-slate-200 bg-slate-50 space-y-1">
                <div className="flex items-center justify-between font-bold text-slate-900">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-teal-500" />
                    <span>Touch 1: 48-Hour Advance Notice</span>
                  </span>
                  <span className="text-[10px] text-teal-700 font-mono">T-48h</span>
                </div>
                <p className="text-[11px] text-slate-500">
                  WhatsApp interactive card with Google Calendar link and driving directions.
                </p>
              </div>

              <div className="p-3 rounded-xl border border-slate-200 bg-slate-50 space-y-1">
                <div className="flex items-center justify-between font-bold text-slate-900">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-amber-500" />
                    <span>Touch 2: 24-Hour Confirmation Prompt</span>
                  </span>
                  <span className="text-[10px] text-amber-700 font-mono">T-24h</span>
                </div>
                <p className="text-[11px] text-slate-500">
                  Includes 1-click WhatsApp buttons: [Confirm Appointment] or [Reschedule Slot].
                </p>
              </div>

              <div className="p-3 rounded-xl border border-slate-200 bg-slate-50 space-y-1">
                <div className="flex items-center justify-between font-bold text-slate-900">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                    <span>Touch 3: 2-Hour Chair Departure Check</span>
                  </span>
                  <span className="text-[10px] text-emerald-700 font-mono">T-2h</span>
                </div>
                <p className="text-[11px] text-slate-500">
                  Provides valet parking info and digital intake form QR for zero waiting-room delay.
                </p>
              </div>
            </div>

            {/* Patient Action Simulation Controls */}
            {selectedAppointment && (
              <div className="pt-3 border-t border-slate-100 space-y-2">
                <div className="text-xs font-bold text-slate-800">
                  Simulate Patient Action for {selectedAppointment.patientName}:
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <button
                    onClick={() => handleSimulatePatientAction("confirmed")}
                    className="p-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold transition flex items-center justify-center gap-1.5"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Patient Confirms</span>
                  </button>
                  <button
                    onClick={() => handleSimulatePatientAction("cancelled")}
                    className="p-2.5 rounded-xl border border-rose-200 bg-rose-50 hover:bg-rose-100 text-rose-800 font-bold transition flex items-center justify-center gap-1.5"
                  >
                    <CalendarX2 className="w-3.5 h-3.5 text-rose-600" />
                    <span>Patient Cancels</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 2: RECALL CAMPAIGNS */}
      {activeTab === "recall_campaigns" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {recallCampaigns.map((camp) => (
            <div
              key={camp.id}
              className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between space-y-4"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-teal-100 text-teal-800">
                    {camp.status}
                  </span>
                  <span className="text-xs font-mono font-bold text-emerald-600">
                    {camp.responseRate} Response
                  </span>
                </div>

                <h4 className="font-bold text-slate-900 text-sm">{camp.title}</h4>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">{camp.description}</p>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-slate-600 font-medium">
                  {camp.duePatients} Patients Due This Month
                </span>
                <span className="font-bold text-teal-700 flex items-center gap-1">
                  <Send className="w-3 h-3" />
                  <span>Channel: {camp.channel}</span>
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
