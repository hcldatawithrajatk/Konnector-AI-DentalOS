"use client";

import React, { useState } from "react";
import { useParams } from "next/navigation";
import { useDentalOS } from "@/context/DentalContext";
import confetti from "canvas-confetti";
import {
  FileText,
  ShieldCheck,
  CheckCircle2,
  Lock,
  HeartPulse,
  User,
  Check,
} from "lucide-react";

export default function DigitalIntakePortalPage() {
  const params = useParams();
  const { activeClinic, addLead } = useDentalOS();

  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [dob, setDob] = useState("1992-05-14");
  const [gender, setGender] = useState<"Male" | "Female" | "Other">("Female");
  const [concern, setConcern] = useState("Teeth Whitening and Alignment");
  const [allergies, setAllergies] = useState("Penicillin");
  const [medications, setMedications] = useState("Multivitamins");
  const [consentSigned, setConsentSigned] = useState(false);
  const [signatureName, setSignatureName] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmitIntake = (e: React.FormEvent) => {
    e.preventDefault();
    if (!consentSigned || !signatureName) {
      alert("Please check digital consent and type your signature name.");
      return;
    }

    addLead({
      name: fullName,
      phone,
      email,
      dob,
      gender,
      status: "consultation_scheduled",
      leadScore: 90,
      treatmentIntentScore: 85,
      treatmentInterest: concern,
      estimatedValue: activeClinic.region === "US" ? 1200 : 18000,
      preferredDoctorId: "doc-1",
      lastContactDate: new Date().toISOString(),
      medicalAlerts: allergies ? [`Allergy: ${allergies}`] : [],
      digitalIntakeCompleted: true,
      digitalConsentSigned: true,
    });

    setSubmitted(true);
    confetti({
      particleCount: 120,
      spread: 70,
      origin: { y: 0.6 },
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between max-w-lg mx-auto shadow-2xl border-x border-slate-200">
      {/* Header */}
      <div
        className="p-6 text-white text-center"
        style={{ backgroundColor: activeClinic.brandColor }}
      >
        <img
          src={activeClinic.logoUrl}
          alt={activeClinic.name}
          className="w-14 h-14 rounded-2xl mx-auto object-cover border-2 border-white shadow-md mb-2 bg-white"
        />
        <h1 className="text-base font-bold">{activeClinic.name}</h1>
        <p className="text-xs opacity-90">Paperless Digital Patient Intake & Consent</p>
      </div>

      {/* Main Intake Form */}
      <div className="p-6 flex-1 space-y-6">
        {!submitted ? (
          <form onSubmit={handleSubmitIntake} className="space-y-4 text-xs">
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-3">
              <div className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                <User className="w-4 h-4 text-teal-600" />
                <span>Personal Information</span>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Full Legal Name *</label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Ananya Roy"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-teal-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">WhatsApp Phone *</label>
                  <input
                    type="text"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 / +1 ..."
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-teal-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@email.com"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-teal-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Date of Birth</label>
                  <input
                    type="date"
                    value={dob}
                    onChange={(e) => setDob(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-teal-500 focus:outline-none bg-white"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Gender</label>
                  <select
                    value={gender}
                    onChange={(e) => setGender(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-teal-500 focus:outline-none bg-white"
                  >
                    <option value="Female">Female</option>
                    <option value="Male">Male</option>
                    <option value="Other">Non-Binary / Other</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Medical History Section */}
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-3">
              <div className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                <HeartPulse className="w-4 h-4 text-rose-600" />
                <span>Dental Concern & Medical Alerts</span>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Primary Dental Concern</label>
                <input
                  type="text"
                  value={concern}
                  onChange={(e) => setConcern(e.target.value)}
                  placeholder="Toothache, alignment, cleaning, implants..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-teal-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Drug Allergies (if any)</label>
                  <input
                    type="text"
                    value={allergies}
                    onChange={(e) => setAllergies(e.target.value)}
                    placeholder="e.g. Penicillin, Latex"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-teal-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Current Medications</label>
                  <input
                    type="text"
                    value={medications}
                    onChange={(e) => setMedications(e.target.value)}
                    placeholder="e.g. Blood thinners, BP"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-teal-500 focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Digital Consent & Signature */}
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-3">
              <div className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-indigo-600" />
                <span>Treatment Consent & Data Privacy</span>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-[11px] text-slate-600 leading-relaxed max-h-24 overflow-y-auto">
                I hereby authorize {activeClinic.name} and their clinical dental team to perform clinical examination, diagnostic radiographs, and necessary preventive treatments. I acknowledge receiving the notice of privacy practices.
              </div>

              <label className="flex items-start gap-2 cursor-pointer pt-1">
                <input
                  type="checkbox"
                  required
                  checked={consentSigned}
                  onChange={(e) => setConsentSigned(e.target.checked)}
                  className="mt-0.5 accent-teal-600 rounded"
                />
                <span className="text-[11px] text-slate-700 font-medium">
                  I agree to the dental informed consent terms and authorize digital record storage.
                </span>
              </label>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Digital Signature (Type Full Legal Name) *</label>
                <input
                  type="text"
                  required
                  value={signatureName}
                  onChange={(e) => setSignatureName(e.target.value)}
                  placeholder="Type your name to digitally sign"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 font-mono italic font-bold focus:ring-2 focus:ring-teal-500 focus:outline-none"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 px-4 bg-teal-600 hover:bg-teal-700 text-white rounded-xl font-extrabold text-xs shadow-md transition"
            >
              Submit Digital Intake & Record in CRM
            </button>
          </form>
        ) : (
          <div className="p-6 rounded-3xl bg-white border border-emerald-200 shadow-md text-center space-y-4 animate-in fade-in">
            <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div>
              <h3 className="font-extrabold text-lg text-slate-900">Intake Completed!</h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Welcome to {activeClinic.name}, {fullName}! Your medical records and digital consent have been safely transmitted to the dental operatory.
              </p>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl text-xs text-slate-600 text-left space-y-1">
              <div>✓ Paperless intake verified</div>
              <div>✓ Chair reserved with Dr. Rajesh Sharma</div>
              <div>✓ Medical alerts flagged for clinical safety</div>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-slate-200 text-center text-[10px] text-slate-400">
        HIPAA & DPDP Act 2023 Compliant • Konnector AI DentalOS
      </div>
    </div>
  );
}
