"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useDentalOS } from "@/context/DentalContext";
import confetti from "canvas-confetti";
import {
  Sparkles,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Building2,
  Globe,
  Upload,
  MessageSquare,
  Calendar,
  Stethoscope,
  DollarSign,
  FileText,
  Rocket,
  ShieldCheck,
  Check,
  QrCode,
  Layers,
} from "lucide-react";

export default function OnboardingPage() {
  const router = useRouter();
  const { createOnboardedClinic } = useDentalOS();

  const [currentStep, setCurrentStep] = useState<number>(1);
  const [isLaunching, setIsLaunching] = useState<boolean>(false);

  // Form State across the 10 steps
  const [formData, setFormData] = useState({
    // Step 1: Region
    region: "IN" as "IN" | "US",

    // Step 2: Clinic Details
    name: "SmileCraft Advanced Dental Care",
    tagline: "Precision Digital Dentistry & Implants",
    address: "B-104, Metro Plaza, Indiranagar",
    city: "Bengaluru",
    state: "Karnataka",
    website: "https://smilecraftdental.com",
    locationsCount: 1,
    timeZone: "Asia/Kolkata",
    phone: "+91 98450 12345",

    // Step 3: Logo & Brand
    logoUrl: "https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=150&auto=format&fit=crop&q=80",
    brandColor: "#0d9488",

    // Step 4: WhatsApp
    whatsappNumber: "+91 98450 12345",
    whatsappConnected: true,

    // Step 5: Calendar
    connectedCalendar: "google" as "google" | "outlook",
    calendarSyncVerified: true,

    // Step 6: Doctors
    doctors: [
      {
        name: "Dr. Vikram Sethi, MDS",
        specialization: "Prosthodontics & Oral Implantology",
        availability: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
        duration: 45,
      },
      {
        name: "Dr. Neha Rao, MDS",
        specialization: "Orthodontics & Clear Aligners",
        availability: ["Tue", "Thu", "Sat"],
        duration: 30,
      },
    ],

    // Step 7: Treatments
    selectedTreatments: [
      "Cleaning & Scaling",
      "Root Canal (Single Sitting)",
      "Dental Implants (Titanium)",
      "Invisalign Clear Aligners",
      "Ceramic Crowns",
      "Porcelain Veneers",
      "Teeth Whitening",
    ],

    // Step 8: Pricing
    pricingMode: "Standard Transparent",
    currency: "INR",
    acceptsInsurance: true,

    // Step 9: Knowledge Base
    uploadedFiles: [
      "SmileCraft_Fee_Schedule_2025.pdf",
      "Implant_Patient_Warranty_Guide.pdf",
      "Post_Extraction_Care_Instructions.docx",
      "https://smilecraftdental.com/faq",
    ],

    // Step 10: Launch Checklist
  });

  const steps = [
    { num: 1, label: "Business Region", icon: Globe },
    { num: 2, label: "Clinic Details", icon: Building2 },
    { num: 3, label: "Logo & Colors", icon: Upload },
    { num: 4, label: "Connect WhatsApp", icon: MessageSquare },
    { num: 5, label: "Connect Calendar", icon: Calendar },
    { num: 6, label: "Doctors", icon: Stethoscope },
    { num: 7, label: "Treatments", icon: Layers },
    { num: 8, label: "Pricing", icon: DollarSign },
    { num: 9, label: "Knowledge Base", icon: FileText },
    { num: 10, label: "Launch Clinic", icon: Rocket },
  ];

  const handleNext = () => {
    if (currentStep < 10) {
      setCurrentStep((prev) => prev + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleLaunch = () => {
    setIsLaunching(true);

    // Launch celebratory confetti
    confetti({
      particleCount: 150,
      spread: 80,
      origin: { y: 0.6 },
    });

    // Create the clinic tenant into persistent store
    setTimeout(() => {
      createOnboardedClinic({
        ...formData,
        currency: formData.region === "US" ? "USD" : "INR",
      });

      // Redirect directly to the Starter Kit page to see generated posters
      router.push("/starter-kit");
    }, 1200);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-16">
      {/* Wizard Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-50 border border-teal-200 text-teal-800 text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5 text-teal-600" />
          <span>10-Minute Rapid Onboarding Wizard</span>
        </div>
        <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">
          Launch Your AI Dental Practice
        </h2>
        <p className="text-xs md:text-sm text-slate-500 max-w-xl mx-auto">
          Complete these 10 steps once. We will instantly spin up your 6 AI employees, WhatsApp workflow, and ready-to-print smart QR starter kit.
        </p>
      </div>

      {/* Progress Stepper Bar */}
      <div className="bg-white p-3 md:p-4 rounded-2xl border border-slate-200 shadow-xs overflow-x-auto">
        <div className="flex items-center justify-between min-w-[680px]">
          {steps.map((s, idx) => {
            const isCompleted = currentStep > s.num;
            const isCurrent = currentStep === s.num;
            const Icon = s.icon;
            return (
              <React.Fragment key={s.num}>
                <button
                  onClick={() => setCurrentStep(s.num)}
                  className="flex flex-col items-center group focus:outline-none"
                >
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition ${
                      isCompleted
                        ? "bg-teal-600 text-white"
                        : isCurrent
                        ? "bg-slate-900 text-white ring-4 ring-teal-100"
                        : "bg-slate-100 text-slate-400 group-hover:bg-slate-200"
                    }`}
                  >
                    {isCompleted ? <Check className="w-4 h-4" /> : s.num}
                  </div>
                  <span
                    className={`text-[10px] font-medium mt-1 truncate max-w-[65px] ${
                      isCurrent
                        ? "text-slate-900 font-bold"
                        : isCompleted
                        ? "text-teal-700"
                        : "text-slate-400"
                    }`}
                  >
                    {s.label}
                  </span>
                </button>
                {idx < steps.length - 1 && (
                  <div
                    className={`flex-1 h-0.5 mx-1 transition ${
                      currentStep > s.num ? "bg-teal-500" : "bg-slate-200"
                    }`}
                  />
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {/* Main Step Content Card */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 md:p-8 shadow-sm">
        {/* STEP 1: BUSINESS REGION */}
        {currentStep === 1 && (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-bold text-slate-900">Step 1: Select Business Region</h3>
              <p className="text-xs text-slate-500 mt-1">
                This automatically configures local currency, healthcare compliance regulations, and payment rails.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div
                onClick={() =>
                  setFormData({
                    ...formData,
                    region: "IN",
                    currency: "INR",
                    timeZone: "Asia/Kolkata",
                    city: "Bengaluru",
                    state: "Karnataka",
                  })
                }
                className={`p-5 rounded-2xl border-2 cursor-pointer transition ${
                  formData.region === "IN"
                    ? "border-teal-600 bg-teal-50/40 shadow-sm"
                    : "border-slate-200 hover:border-slate-300"
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-3xl">🇮🇳</span>
                  {formData.region === "IN" && (
                    <CheckCircle2 className="w-5 h-5 text-teal-600" />
                  )}
                </div>
                <h4 className="font-bold text-slate-900 text-sm">India Practice</h4>
                <p className="text-xs text-slate-500 mt-1">
                  Optimized for Indian dental clinics and chains.
                </p>
                <div className="mt-4 pt-3 border-t border-slate-200/60 space-y-1.5 text-xs text-slate-600">
                  <div className="flex items-center gap-1.5">
                    <Check className="w-3.5 h-3.5 text-teal-600" />
                    <span>Currency: INR (₹)</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Check className="w-3.5 h-3.5 text-teal-600" />
                    <span>Payments: UPI, PhonePe, Paytm & Razorpay</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Check className="w-3.5 h-3.5 text-teal-600" />
                    <span>Tax: GST Compliant B2C / B2B Invoicing</span>
                  </div>
                </div>
              </div>

              <div
                onClick={() =>
                  setFormData({
                    ...formData,
                    region: "US",
                    currency: "USD",
                    timeZone: "America/New_York",
                    city: "Boston",
                    state: "MA",
                  })
                }
                className={`p-5 rounded-2xl border-2 cursor-pointer transition ${
                  formData.region === "US"
                    ? "border-teal-600 bg-teal-50/40 shadow-sm"
                    : "border-slate-200 hover:border-slate-300"
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-3xl">🇺🇸</span>
                  {formData.region === "US" && (
                    <CheckCircle2 className="w-5 h-5 text-teal-600" />
                  )}
                </div>
                <h4 className="font-bold text-slate-900 text-sm">United States Practice</h4>
                <p className="text-xs text-slate-500 mt-1">
                  Optimized for US dental clinics, DSOs, and group practices.
                </p>
                <div className="mt-4 pt-3 border-t border-slate-200/60 space-y-1.5 text-xs text-slate-600">
                  <div className="flex items-center gap-1.5">
                    <Check className="w-3.5 h-3.5 text-teal-600" />
                    <span>Currency: USD ($)</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Check className="w-3.5 h-3.5 text-teal-600" />
                    <span>Payments: Stripe, ACH, Apple Pay & CareCredit</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Check className="w-3.5 h-3.5 text-teal-600" />
                    <span>Security: HIPAA Mode + US Insurance PPO Verification</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* STEP 2: CLINIC DETAILS */}
        {currentStep === 2 && (
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-bold text-slate-900">Step 2: Clinic Details</h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Tell us about your dental practice location and online presence.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-slate-700 mb-1">Clinic Name *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-teal-500 focus:outline-none"
                  placeholder="e.g. Apex Dental Studio"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Tagline</label>
                <input
                  type="text"
                  value={formData.tagline}
                  onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-teal-500 focus:outline-none"
                  placeholder="e.g. Advanced Aesthetics & Implantology"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Website URL</label>
                <input
                  type="text"
                  value={formData.website}
                  onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-teal-500 focus:outline-none"
                  placeholder="https://yourclinic.com"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-slate-700 mb-1">Physical Address</label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-teal-500 focus:outline-none"
                  placeholder="Suite 101, Main Healthcare Blvd"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">City</label>
                <input
                  type="text"
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-teal-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Number of Locations</label>
                <select
                  value={formData.locationsCount}
                  onChange={(e) => setFormData({ ...formData, locationsCount: Number(e.target.value) })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-teal-500 focus:outline-none bg-white"
                >
                  <option value={1}>1 Single Clinic</option>
                  <option value={2}>2 - 4 Locations (Regional)</option>
                  <option value={5}>5+ Locations (Dental Chain / DSO)</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* STEP 3: LOGO & BRAND */}
        {currentStep === 3 && (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-bold text-slate-900">Step 3: Upload Logo & Brand Colors</h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Your brand colors and logo are embedded into all smart QR posters, patient portals, and WhatsApp cards.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-6 p-5 rounded-2xl bg-slate-50 border border-slate-200">
              <img
                src={formData.logoUrl}
                alt="Clinic Logo Preview"
                className="w-24 h-24 rounded-2xl object-cover border-2 border-white shadow-md"
              />
              <div className="space-y-2 text-center sm:text-left">
                <div className="font-bold text-slate-900 text-sm">Clinic Brand Mark</div>
                <p className="text-xs text-slate-500">Supports PNG, SVG, JPG. High resolution recommended.</p>
                <input
                  type="text"
                  value={formData.logoUrl}
                  onChange={(e) => setFormData({ ...formData, logoUrl: e.target.value })}
                  className="w-full max-w-md px-3 py-1.5 rounded-lg border border-slate-300 text-xs font-mono"
                  placeholder="Paste image URL or use default"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-2">Primary Brand Color</label>
              <div className="flex items-center gap-3">
                {[
                  { name: "Dental Teal", hex: "#0d9488" },
                  { name: "Medical Indigo", hex: "#4f46e5" },
                  { name: "Surgical Emerald", hex: "#059669" },
                  { name: "Cyan Health", hex: "#0284c7" },
                  { name: "Royal Purple", hex: "#7c3aed" },
                  { name: "Executive Slate", hex: "#0f172a" },
                ].map((c) => (
                  <button
                    key={c.hex}
                    type="button"
                    onClick={() => setFormData({ ...formData, brandColor: c.hex })}
                    className={`w-10 h-10 rounded-xl flex items-center justify-center text-white transition ${
                      formData.brandColor === c.hex ? "ring-4 ring-offset-2 ring-slate-400 scale-110" : ""
                    }`}
                    style={{ backgroundColor: c.hex }}
                    title={c.name}
                  >
                    {formData.brandColor === c.hex && <Check className="w-4 h-4" />}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* STEP 4: CONNECT WHATSAPP */}
        {currentStep === 4 && (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-bold text-slate-900">Step 4: Connect WhatsApp Cloud API</h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Enable 24/7 AI Receptionist (Aria) to answer calls, triage toothaches, and book calendar slots.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-emerald-50/40 border border-emerald-200 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold">
                    <MessageSquare className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm">Meta WhatsApp Cloud API</h4>
                    <p className="text-xs text-slate-500">Official Meta verified business gateway</p>
                  </div>
                </div>
                <span className="px-2.5 py-1 bg-emerald-100 text-emerald-800 text-xs font-bold rounded-full flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Ready to Pair</span>
                </span>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Clinic WhatsApp Business Number
                </label>
                <input
                  type="text"
                  value={formData.whatsappNumber}
                  onChange={(e) => setFormData({ ...formData, whatsappNumber: e.target.value })}
                  className="w-full max-w-sm px-3 py-2 rounded-xl border border-slate-300 text-xs font-mono"
                  placeholder="+91 98450 12345 or +1 617 555 0198"
                />
              </div>

              <div className="pt-3 border-t border-emerald-200/70 text-xs text-emerald-800 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Zero hardware required. Uses serverless Google Cloud Run webhook listeners.</span>
              </div>
            </div>
          </div>
        )}

        {/* STEP 5: CONNECT CALENDAR */}
        {currentStep === 5 && (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-bold text-slate-900">Step 5: Connect Doctor Calendars</h3>
              <p className="text-xs text-slate-500 mt-0.5">
                AI employees only offer slots that are genuinely open. Prevents double-booking automatically.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div
                onClick={() => setFormData({ ...formData, connectedCalendar: "google" })}
                className={`p-5 rounded-2xl border-2 cursor-pointer transition ${
                  formData.connectedCalendar === "google"
                    ? "border-teal-600 bg-teal-50/40"
                    : "border-slate-200 hover:border-slate-300"
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="font-bold text-slate-900 text-sm">Google Calendar</span>
                  {formData.connectedCalendar === "google" && (
                    <CheckCircle2 className="w-5 h-5 text-teal-600" />
                  )}
                </div>
                <p className="text-xs text-slate-500">
                  Instant two-way sync with Google Workspace / Gmail doctors' schedules.
                </p>
                <div className="mt-3 text-[11px] text-teal-700 font-semibold">
                  ✓ Instant real-time webhook sync enabled
                </div>
              </div>

              <div
                onClick={() => setFormData({ ...formData, connectedCalendar: "outlook" })}
                className={`p-5 rounded-2xl border-2 cursor-pointer transition ${
                  formData.connectedCalendar === "outlook"
                    ? "border-teal-600 bg-teal-50/40"
                    : "border-slate-200 hover:border-slate-300"
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="font-bold text-slate-900 text-sm">Microsoft Outlook / 365</span>
                  {formData.connectedCalendar === "outlook" && (
                    <CheckCircle2 className="w-5 h-5 text-teal-600" />
                  )}
                </div>
                <p className="text-xs text-slate-500">
                  Enterprise sync with Microsoft Graph API and Exchange servers.
                </p>
                <div className="mt-3 text-[11px] text-teal-700 font-semibold">
                  ✓ Enterprise Graph API integration
                </div>
              </div>
            </div>
          </div>
        )}

        {/* STEP 6: CONFIGURE DOCTORS */}
        {currentStep === 6 && (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-bold text-slate-900">Step 6: Configure Clinic Doctors</h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Specify clinical specialists so Aria and Vikram can match patient concerns accurately.
              </p>
            </div>

            <div className="space-y-3">
              {formData.doctors.map((doc, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 flex flex-col md:flex-row md:items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-teal-600 text-white flex items-center justify-center font-bold text-xs">
                      {doc.name.charAt(3) || "Dr"}
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 text-xs">{doc.name}</h4>
                      <p className="text-[11px] text-teal-700 font-semibold">{doc.specialization}</p>
                    </div>
                  </div>
                  <div className="text-[11px] text-slate-500">
                    Slot: <span className="font-bold text-slate-700">{doc.duration} mins</span> • Available:{" "}
                    {doc.availability.join(", ")}
                  </div>
                </div>
              ))}
            </div>

            <div className="p-3 bg-teal-50 rounded-xl text-xs text-teal-800">
              💡 You can add more associate doctors, hygienists, and chair schedules later in Practice Settings.
            </div>
          </div>
        )}

        {/* STEP 7: CONFIGURE TREATMENTS */}
        {currentStep === 7 && (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-bold text-slate-900">Step 7: Configure Treatments Offered</h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Select the dental procedures your clinic performs. Pre-configured clinical FAQs will be activated.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
              {[
                "Cleaning & Scaling",
                "Root Canal (Single Sitting)",
                "Dental Implants (Titanium)",
                "Invisalign Clear Aligners",
                "Metal & Ceramic Braces",
                "Porcelain Veneers",
                "Ceramic Crowns",
                "Teeth Whitening",
                "Wisdom Tooth Extraction",
                "Complete / Partial Dentures",
                "Full Mouth Rehabilitation",
                "Emergency Toothache Triage",
              ].map((treat) => {
                const isSelected = formData.selectedTreatments.includes(treat);
                return (
                  <button
                    key={treat}
                    type="button"
                    onClick={() => {
                      if (isSelected) {
                        setFormData({
                          ...formData,
                          selectedTreatments: formData.selectedTreatments.filter((t) => t !== treat),
                        });
                      } else {
                        setFormData({
                          ...formData,
                          selectedTreatments: [...formData.selectedTreatments, treat],
                        });
                      }
                    }}
                    className={`p-3 rounded-xl border text-left text-xs font-semibold flex items-center justify-between transition ${
                      isSelected
                        ? "border-teal-600 bg-teal-50 text-teal-900 shadow-xs"
                        : "border-slate-200 text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    <span>{treat}</span>
                    {isSelected && <Check className="w-4 h-4 text-teal-600 flex-shrink-0" />}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* STEP 8: CONFIGURE PRICING */}
        {currentStep === 8 && (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-bold text-slate-900">Step 8: Configure Pricing & Payment Modes</h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Pricing is used by AI employees to answer patient questions and generate instant payment QR links.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <span className="font-bold text-slate-900 text-sm">Currency Standard</span>
                  <p className="text-xs text-slate-500">Auto-configured based on selected region</p>
                </div>
                <span className="px-3 py-1 bg-slate-900 text-white font-mono text-xs font-bold rounded-lg">
                  {formData.region === "US" ? "USD ($)" : "INR (₹)"}
                </span>
              </div>

              <div className="pt-3 border-t border-slate-200 space-y-2">
                <div className="text-xs font-bold text-slate-800">Accepted Payment Channels</div>
                <div className="flex flex-wrap gap-2 text-xs">
                  {formData.region === "US" ? (
                    <>
                      <span className="px-2.5 py-1 bg-white border border-slate-200 rounded-lg">Stripe Cards</span>
                      <span className="px-2.5 py-1 bg-white border border-slate-200 rounded-lg">ACH Transfer</span>
                      <span className="px-2.5 py-1 bg-white border border-slate-200 rounded-lg">Apple / Google Pay</span>
                      <span className="px-2.5 py-1 bg-white border border-slate-200 rounded-lg">CareCredit Financing</span>
                    </>
                  ) : (
                    <>
                      <span className="px-2.5 py-1 bg-white border border-slate-200 rounded-lg">Instant UPI QR</span>
                      <span className="px-2.5 py-1 bg-white border border-slate-200 rounded-lg">Razorpay Gateway</span>
                      <span className="px-2.5 py-1 bg-white border border-slate-200 rounded-lg">PhonePe / Paytm</span>
                      <span className="px-2.5 py-1 bg-white border border-slate-200 rounded-lg">0% Credit Card EMI</span>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* STEP 9: KNOWLEDGE BASE UPLOAD */}
        {currentStep === 9 && (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-bold text-slate-900">Step 9: Knowledge Base Upload (RAG)</h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Upload PDFs, brochures, or website URLs. Vertex AI Vector Search embeds them for instant AI grounding.
              </p>
            </div>

            <div className="border-2 border-dashed border-teal-300 rounded-2xl p-6 text-center bg-teal-50/20">
              <Upload className="w-8 h-8 text-teal-600 mx-auto mb-2" />
              <div className="font-bold text-slate-800 text-sm">Drop Dental Fee Guides or FAQs Here</div>
              <p className="text-xs text-slate-500 mt-0.5">Supports PDF, DOCX, TXT, Website URLs up to 50MB</p>
            </div>

            <div className="space-y-2">
              <div className="text-xs font-bold text-slate-700">Pre-Loaded Practice Knowledge:</div>
              {formData.uploadedFiles.map((file, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-2.5 rounded-xl border border-slate-200 bg-white text-xs"
                >
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-teal-600" />
                    <span className="font-medium text-slate-800">{file}</span>
                  </div>
                  <span className="text-[10px] text-emerald-700 bg-emerald-50 font-bold px-2 py-0.5 rounded-full">
                    Chunked & Indexed
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* STEP 10: LAUNCH CLINIC */}
        {currentStep === 10 && (
          <div className="space-y-6 text-center">
            <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-teal-600 to-emerald-400 text-white flex items-center justify-center mx-auto shadow-lg shadow-teal-500/20">
              <Rocket className="w-8 h-8" />
            </div>

            <div>
              <h3 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                Your Clinic is Ready to Launch!
              </h3>
              <p className="text-xs md:text-sm text-slate-500 max-w-md mx-auto mt-1">
                Click Launch to activate your 6 AI employees and generate your print-ready Dental Growth Starter Kit instantly.
              </p>
            </div>

            {/* Default Activated Growth Features Callout */}
            <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 text-left max-w-xl mx-auto space-y-3">
              <div className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-teal-600" />
                <span>Instant Auto-Generated Growth Features:</span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs text-slate-700 font-medium">
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-teal-500" />
                  <span>WhatsApp Connect QR</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-teal-500" />
                  <span>Google Review QR</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-teal-500" />
                  <span>Payment QR Stand</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-teal-500" />
                  <span>Universal Smart Clinic QR</span>
                </div>
              </div>
            </div>

            <button
              onClick={handleLaunch}
              disabled={isLaunching}
              className="w-full max-w-md mx-auto py-3.5 px-6 rounded-xl bg-gradient-to-r from-teal-600 via-teal-500 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 text-white font-extrabold text-sm shadow-xl shadow-teal-600/20 transition flex items-center justify-center gap-2 cursor-pointer"
            >
              <Sparkles className="w-4 h-4" />
              <span>{isLaunching ? "Activating AI Workforce..." : "Launch Clinic & Generate Starter Kit"}</span>
            </button>
          </div>
        )}

        {/* Wizard Footer Navigation */}
        <div className="mt-8 pt-6 border-t border-slate-100 flex items-center justify-between">
          {currentStep > 1 ? (
            <button
              onClick={handleBack}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-slate-200 text-slate-700 text-xs font-semibold hover:bg-slate-50 transition"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back</span>
            </button>
          ) : (
            <div />
          )}

          {currentStep < 10 && (
            <button
              onClick={handleNext}
              className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition shadow-sm"
            >
              <span>Continue to Step {currentStep + 1}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
