"use client";

import React, { useState } from "react";
import { useParams } from "next/navigation";
import { useDentalOS } from "@/context/DentalContext";
import {
  AlertTriangle,
  PhoneCall,
  ShieldAlert,
  CheckCircle2,
  Clock,
  HeartPulse,
} from "lucide-react";

export default function EmergencyPortalPage() {
  const params = useParams();
  const { activeClinic, submitEmergencyCase } = useDentalOS();

  const [patientName, setPatientName] = useState("");
  const [phone, setPhone] = useState("");
  const [selectedSymptom, setSelectedSymptom] = useState("Severe Throbbing Toothache");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!patientName || !phone) return;

    submitEmergencyCase({
      patientName,
      phone,
      symptoms: [selectedSymptom],
    });

    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between max-w-md mx-auto shadow-2xl border-x border-slate-200">
      {/* Header */}
      <div className="p-6 bg-rose-600 text-white text-center">
        <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center mx-auto mb-2">
          <AlertTriangle className="w-6 h-6 text-white" />
        </div>
        <h1 className="text-lg font-bold">{activeClinic.name}</h1>
        <p className="text-xs opacity-90">24/7 Dental Emergency Care</p>
      </div>

      {/* Main Body */}
      <div className="p-6 flex-1 space-y-6">
        {/* Direct Call Banner */}
        <a
          href={`tel:${activeClinic.phone}`}
          className="flex items-center justify-center gap-2 p-3.5 rounded-2xl bg-slate-900 text-white font-extrabold text-xs shadow-md transition hover:bg-slate-800"
        >
          <PhoneCall className="w-4 h-4 text-emerald-400" />
          <span>Call Emergency Hotline: {activeClinic.phone}</span>
        </a>

        {!submitted ? (
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div className="text-center space-y-1">
              <h2 className="font-extrabold text-slate-900 text-sm">
                Get Immediate Triage & Reserve Emergency Chair
              </h2>
              <p className="text-[11px] text-slate-500">
                Our on-call dentist will be alerted instantly on WhatsApp.
              </p>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Your Name *</label>
              <input
                type="text"
                required
                value={patientName}
                onChange={(e) => setPatientName(e.target.value)}
                placeholder="e.g. Vikram Joshi"
                className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-rose-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Your Mobile Phone *</label>
              <input
                type="text"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+91 / +1 ..."
                className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-rose-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">What is your primary symptom?</label>
              <select
                value={selectedSymptom}
                onChange={(e) => setSelectedSymptom(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-rose-500 focus:outline-none bg-white"
              >
                <option value="Severe Throbbing Toothache">Severe Throbbing Toothache</option>
                <option value="Facial Swelling / Cheek Abscess">Facial Swelling / Cheek Abscess</option>
                <option value="Knocked-Out / Broken Tooth (Trauma)">Knocked-Out / Broken Tooth (Trauma)</option>
                <option value="Continuous Bleeding from Gum/Socket">Continuous Bleeding from Gum/Socket</option>
                <option value="Lost Crown or Broken Filling">Lost Crown or Broken Filling</option>
              </select>
            </div>

            {/* Quick First-Aid Advice */}
            <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-[11px] text-amber-900 space-y-1">
              <div className="font-bold flex items-center gap-1">
                <HeartPulse className="w-3.5 h-3.5 text-amber-700" />
                <span>Immediate First-Aid Protocol:</span>
              </div>
              <p>
                {selectedSymptom.includes("Knocked-Out")
                  ? "Do not scrub the tooth root. Place the tooth in a glass of cold milk or saliva and come immediately. Time is critical within 60 minutes."
                  : selectedSymptom.includes("Swelling")
                  ? "Apply a cold compress to your cheek outside. Do NOT apply hot pads. Rinse mouth with warm salt water."
                  : "Rinse gently with warm salt water. Avoid extreme temperatures. Our team will contact you in under 5 minutes."}
              </p>
            </div>

            <button
              type="submit"
              className="w-full py-3 px-4 bg-rose-600 hover:bg-rose-700 text-white rounded-xl font-extrabold text-xs shadow-md transition"
            >
              Dispatch Emergency Alert to Doctor
            </button>
          </form>
        ) : (
          <div className="p-6 rounded-3xl bg-white border border-rose-200 shadow-md text-center space-y-4 animate-in fade-in">
            <div className="w-14 h-14 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div>
              <h3 className="font-extrabold text-lg text-slate-900">Emergency Alert Dispatched!</h3>
              <p className="text-xs text-slate-500 mt-0.5">
                On-call dentist at {activeClinic.name} has received your symptom report and will call {phone} immediately.
              </p>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl text-xs text-slate-600 text-left space-y-1">
              <div>📍 Clinic Address: {activeClinic.address}</div>
              <div>⚡ Priority Chair: Reserved on standby</div>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-slate-200 text-center text-[10px] text-slate-400">
        Emergency Triage Protocol • Konnector AI DentalOS
      </div>
    </div>
  );
}
