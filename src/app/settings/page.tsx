"use client";

import React, { useState } from "react";
import { useDentalOS } from "@/context/DentalContext";
import {
  Settings,
  Shield,
  Building2,
  Users,
  Lock,
  Globe,
  Upload,
  Sparkles,
  Check,
  CheckCircle2,
  Clock,
  FileCheck,
} from "lucide-react";

export default function SettingsPage() {
  const { activeClinic, auditLogs } = useDentalOS();

  const [activeTab, setActiveTab] = useState<"branding" | "locations" | "compliance" | "rbac" | "audit">("branding");

  // Form states
  const [clinicName, setClinicName] = useState(activeClinic.name);
  const [tagline, setTagline] = useState(activeClinic.tagline);
  const [phone, setPhone] = useState(activeClinic.phone);
  const [whatsappNumber, setWhatsappNumber] = useState(activeClinic.whatsappNumber);
  const [brandColor, setBrandColor] = useState(activeClinic.brandColor);
  const [customDomain, setCustomDomain] = useState(`care.${activeClinic.slug}.com`);
  const [googlePlaceId, setGooglePlaceId] = useState("ChIJN1t_tDeuEmsRUsoyG83frY4");
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 text-slate-800 text-xs font-semibold mb-1">
            <Settings className="w-3.5 h-3.5 text-slate-600" />
            <span>Multi-Tenant Practice Administration</span>
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Practice Settings & White-Label
          </h2>
          <p className="text-xs text-slate-500">
            Configure white-label branding, doctor permissions, HIPAA / India GST compliance, and audit logs.
          </p>
        </div>

        {savedSuccess && (
          <span className="px-3 py-1 bg-emerald-100 text-emerald-800 text-xs font-bold rounded-lg flex items-center gap-1.5 animate-in fade-in">
            <Check className="w-3.5 h-3.5" />
            <span>Settings Saved!</span>
          </span>
        )}
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 p-1 bg-white rounded-xl border border-slate-200 shadow-xs overflow-x-auto">
        {[
          { key: "branding", label: "Branding & Domain" },
          { key: "compliance", label: "Healthcare Compliance" },
          { key: "rbac", label: "Staff & RBAC" },
          { key: "audit", label: "Security Audit Logs" },
        ].map((t) => (
          <button
            key={t.key}
            onClick={() => setActiveTab(t.key as any)}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition flex-shrink-0 ${
              activeTab === t.key ? "bg-slate-900 text-white shadow-xs" : "text-slate-600 hover:text-slate-900"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* TAB 1: BRANDING & DOMAIN */}
      {activeTab === "branding" && (
        <form onSubmit={handleSave} className="bg-white rounded-2xl border border-slate-200 p-6 md:p-8 shadow-sm space-y-6">
          <div>
            <h3 className="text-base font-bold text-slate-900">White-Label Clinic Identity</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Customize how your dental brand looks across patient portals, WhatsApp messages, and printed posters.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Clinic Legal Name</label>
              <input
                type="text"
                value={clinicName}
                onChange={(e) => setClinicName(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-teal-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Tagline</label>
              <input
                type="text"
                value={tagline}
                onChange={(e) => setTagline(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-teal-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Custom Patient Portal Domain</label>
              <input
                type="text"
                value={customDomain}
                onChange={(e) => setCustomDomain(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-teal-500 focus:outline-none font-mono"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Google Place ID (5-Star Reviews)</label>
              <input
                type="text"
                value={googlePlaceId}
                onChange={(e) => setGooglePlaceId(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-teal-500 focus:outline-none font-mono"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">WhatsApp Cloud API Number</label>
              <input
                type="text"
                value={whatsappNumber}
                onChange={(e) => setWhatsappNumber(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-teal-500 focus:outline-none font-mono"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Clinic Voice Phone</label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-teal-500 focus:outline-none font-mono"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
            <span className="text-xs text-slate-400">DNS CNAME target: cname.konnectordental.app</span>
            <button
              type="submit"
              className="py-2.5 px-6 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shadow-sm transition"
            >
              Save Brand Changes
            </button>
          </div>
        </form>
      )}

      {/* TAB 2: COMPLIANCE */}
      {activeTab === "compliance" && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 md:p-8 shadow-sm space-y-6">
          <div>
            <h3 className="text-base font-bold text-slate-900">Healthcare Compliance Regulations</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Region-specific data protection, consent enforcement, and tax filing settings.
            </p>
          </div>

          {activeClinic.region === "US" ? (
            <div className="p-5 rounded-2xl bg-indigo-50/50 border border-indigo-200 space-y-3 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-bold text-indigo-950 text-sm flex items-center gap-1.5">
                  <Shield className="w-4 h-4 text-indigo-600" />
                  <span>HIPAA Compliance Mode Active (45 CFR § 164)</span>
                </span>
                <span className="px-2.5 py-0.5 bg-emerald-100 text-emerald-800 rounded-full font-bold">
                  Signed BAA On File
                </span>
              </div>
              <p className="text-indigo-900 leading-relaxed">
                All Protected Health Information (PHI) is encrypted with AES-256 at rest in Google Cloud SQL and TLS 1.3 in transit. Strict role-based least privilege access enforced.
              </p>
            </div>
          ) : (
            <div className="p-5 rounded-2xl bg-teal-50/50 border border-teal-200 space-y-3 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-bold text-teal-950 text-sm flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-teal-600" />
                  <span>India GST & WhatsApp Healthcare Consent Framework</span>
                </span>
                <span className="px-2.5 py-0.5 bg-emerald-100 text-emerald-800 rounded-full font-bold">
                  GST Verified
                </span>
              </div>
              <p className="text-teal-900 leading-relaxed">
                Registered GSTIN: <strong className="font-mono">{activeClinic.gstNumber}</strong>. Automated digital consent recorded before patient intake form submission adhering to the Digital Personal Data Protection Act (DPDPA 2023).
              </p>
            </div>
          )}
        </div>
      )}

      {/* TAB 3: RBAC */}
      {activeTab === "rbac" && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900">Clinic Staff Roles & Permissions</h3>
            <span className="text-xs text-slate-500">4 Active Staff Accounts</span>
          </div>

          <div className="divide-y divide-slate-100 text-xs">
            {[
              { name: "Dr. Lead Doctor", role: "Owner / Clinical Director", access: "Full Clinical & Financial Admin", badge: "bg-purple-100 text-purple-800" },
              { name: "Dr. Associate Specialist", role: "Associate Dentist", access: "Patient Records & Chair Schedule", badge: "bg-blue-100 text-blue-800" },
              { name: "Pooja Kulkarni", role: "Front Desk Receptionist", access: "WhatsApp Inbox & Appointment Booking", badge: "bg-teal-100 text-teal-800" },
              { name: "Aria (AI)", role: "Autonomous AI Receptionist", access: "24/7 WhatsApp & Calendar Webhook", badge: "bg-emerald-100 text-emerald-800" },
            ].map((staff, idx) => (
              <div key={idx} className="py-3 flex items-center justify-between">
                <div>
                  <span className="font-bold text-slate-900">{staff.name}</span>
                  <div className="text-[11px] text-slate-500 mt-0.5">{staff.access}</div>
                </div>
                <span className={`px-2.5 py-0.5 rounded-full font-bold text-[10px] ${staff.badge}`}>
                  {staff.role}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: AUDIT LOGS */}
      {activeTab === "audit" && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900">Security & Clinical Audit Trail</h3>
            <span className="text-xs text-slate-500">Immutable GCP Cloud Logging replica</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50 text-slate-500 font-bold uppercase text-[10px] tracking-wider border-y border-slate-200">
                <tr>
                  <th className="py-3 px-4">Actor</th>
                  <th className="py-3 px-4">Action</th>
                  <th className="py-3 px-4">Resource</th>
                  <th className="py-3 px-4">IP Address</th>
                  <th className="py-3 px-4">Timestamp</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {auditLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50/80 transition">
                    <td className="py-3 px-4 font-bold text-slate-900">{log.userName}</td>
                    <td className="py-3 px-4 text-slate-700">{log.action}</td>
                    <td className="py-3 px-4 font-mono text-[11px] text-teal-700">{log.module}</td>
                    <td className="py-3 px-4 font-mono text-slate-500">{log.ipAddress}</td>
                    <td className="py-3 px-4 text-slate-400">{new Date(log.timestamp).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
