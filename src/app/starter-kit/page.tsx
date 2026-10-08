"use client";

import React, { useState } from "react";
import { useDentalOS } from "@/context/DentalContext";
import { QRCodeViewer } from "@/components/ui/QRCodeViewer";
import {
  Printer,
  Download,
  Share2,
  CheckCircle2,
  Sparkles,
  QrCode,
  Layers,
  FileText,
  Smartphone,
  Eye,
  Check,
} from "lucide-react";

export default function StarterKitPage() {
  const { activeClinic, smartQRs } = useDentalOS();

  const [activeFormat, setActiveFormat] = useState<"print_a4" | "table_tent" | "social_square">(
    "print_a4"
  );
  const [selectedPoster, setSelectedPoster] = useState<string>("universal");

  // Core 4 Starter Kit QRs
  const starterKitItems = [
    {
      id: "universal",
      type: "universal",
      title: "Universal Smart Clinic QR Poster",
      badge: "ALL-IN-ONE HUB",
      badgeColor: "bg-teal-100 text-teal-800",
      description: "One QR for appointments, directions, WhatsApp, doctors, and patient resources.",
      placement: "Clinic Entrance, Waiting Lounge & Glass Door",
      qr: smartQRs.find((q) => q.type === "universal"),
      headline: `WELCOME TO ${activeClinic.name.toUpperCase()}`,
      subheadline: "Scan with your smartphone camera for instant services",
      bullets: [
        "📅 Book & Reschedule Appointments",
        "💬 Chat with AI Receptionist on WhatsApp",
        "💳 Touchless Mobile Payments",
        "⭐ Leave a 5-Star Google Review",
      ],
      footerNote: "No app download required • Instant high-speed access",
    },
    {
      id: "whatsapp",
      type: "whatsapp",
      title: "WhatsApp Connect QR Poster",
      badge: "CONNECT",
      badgeColor: "bg-emerald-100 text-emerald-800",
      description: "Instant direct WhatsApp connection to 24x7 AI Dental Receptionist (Aria).",
      placement: "Reception Front Desk & Outdoor Signboard",
      qr: smartQRs.find((q) => q.type === "whatsapp"),
      headline: "CHAT WITH US ON WHATSAPP",
      subheadline: "Skip the waiting line. 24/7 instant appointment bookings & dental FAQs.",
      bullets: [
        "⚡ 3-Second Instant AI Response",
        "🦷 Inquire About Implants, Braces & Veneers",
        "📍 Get Location Map & Timings",
        "🚑 Immediate Emergency Dental Assistance",
      ],
      footerNote: `WhatsApp Official: ${activeClinic.whatsappNumber}`,
    },
    {
      id: "review",
      type: "review",
      title: "AI Google Review QR Poster",
      badge: "REVIEW",
      badgeColor: "bg-amber-100 text-amber-800",
      description: "Intelligent 2-tier review funnel: 8-10 goes to Google, 1-7 routes to private clinic care.",
      placement: "Checkout Desk & Treatment Operatories",
      qr: smartQRs.find((q) => q.type === "review"),
      headline: "HOW WAS YOUR VISIT TODAY?",
      subheadline: "Scan to rate your smile experience and help us shine",
      bullets: [
        "🌟 Rate your doctor & clinical care",
        "🎁 Earn loyalty smile rewards for your next visit",
        "💬 Share direct feedback with our practice manager",
      ],
      footerNote: "Takes less than 15 seconds • Verified Patient Reviews",
    },
    {
      id: "payment",
      type: "payment",
      title: "Touchless Payment Stand Poster",
      badge: "COLLECT",
      badgeColor: "bg-indigo-100 text-indigo-800",
      description: activeClinic.region === "US" ? "Stripe & ACH instant payment stand" : "UPI QR, Google Pay, PhonePe & Razorpay stand",
      placement: "Billing Counter & Chairside Tables",
      qr: smartQRs.find((q) => q.type === "payment"),
      headline: "TOUCHLESS INSTANT PAYMENT",
      subheadline: "Scan to pay with your preferred mobile payment app securely",
      bullets: [
        activeClinic.region === "US"
          ? "💳 Apple Pay, Google Pay & Credit Cards"
          : "📱 UPI, PhonePe, Google Pay & Paytm",
        "🔒 256-Bit Bank Grade SSL Encryption",
        "🧾 Instant Digital WhatsApp GST Receipt",
        "0% Interest EMI Plans Available",
      ],
      footerNote: "GST Compliant Invoicing • Verified Merchant Terminal",
    },
  ];

  const currentItem = starterKitItems.find((i) => i.id === selectedPoster) || starterKitItems[0];

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-800 text-xs font-semibold mb-1">
            <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
            <span>Auto-Generated Practice Assets</span>
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Dental Growth Starter Kit
          </h2>
          <p className="text-xs text-slate-500">
            Print-ready physical collateral and posters automatically tailored with {activeClinic.name}&apos;s brand colors, logo, and smart QR codes.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold shadow-sm transition"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Current Poster</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Selector & Live Poster Canvas */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: 4 Posters List (4 Cols) */}
        <div className="lg:col-span-4 space-y-3">
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider px-1">
            Select Poster Template
          </div>

          {starterKitItems.map((item) => {
            const isSelected = item.id === selectedPoster;
            return (
              <div
                key={item.id}
                onClick={() => setSelectedPoster(item.id)}
                className={`p-4 rounded-2xl border-2 cursor-pointer transition text-left ${
                  isSelected
                    ? "border-teal-600 bg-teal-50/40 shadow-sm"
                    : "border-slate-200 bg-white hover:border-slate-300"
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${item.badgeColor}`}>
                    {item.badge}
                  </span>
                  {isSelected && <Check className="w-4 h-4 text-teal-600" />}
                </div>
                <h4 className="font-bold text-slate-900 text-xs">{item.title}</h4>
                <p className="text-[11px] text-slate-500 mt-1 line-clamp-2">{item.description}</p>
                <div className="mt-3 pt-2 border-t border-slate-100 text-[10px] text-slate-400 font-medium">
                  Recommended: <span className="text-slate-600 font-semibold">{item.placement}</span>
                </div>
              </div>
            );
          })}

          {/* Export Format Selector */}
          <div className="p-4 rounded-2xl bg-white border border-slate-200 space-y-2 mt-4">
            <div className="text-xs font-bold text-slate-800">Print & Social Dimensions</div>
            <div className="grid grid-cols-3 gap-1.5 text-xs">
              <button
                onClick={() => setActiveFormat("print_a4")}
                className={`p-2 rounded-lg border text-center font-semibold text-[11px] ${
                  activeFormat === "print_a4" ? "border-teal-600 bg-teal-50 text-teal-800" : "border-slate-200"
                }`}
              >
                A4 Poster (Print)
              </button>
              <button
                onClick={() => setActiveFormat("table_tent")}
                className={`p-2 rounded-lg border text-center font-semibold text-[11px] ${
                  activeFormat === "table_tent" ? "border-teal-600 bg-teal-50 text-teal-800" : "border-slate-200"
                }`}
              >
                Table Tent Stand
              </button>
              <button
                onClick={() => setActiveFormat("social_square")}
                className={`p-2 rounded-lg border text-center font-semibold text-[11px] ${
                  activeFormat === "social_square" ? "border-teal-600 bg-teal-50 text-teal-800" : "border-slate-200"
                }`}
              >
                Instagram 1:1
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Live High-Res Poster Preview (8 Cols) */}
        <div className="lg:col-span-8 flex justify-center">
          <div
            id="printable-poster"
            className={`w-full max-w-xl bg-white rounded-3xl border-4 shadow-2xl p-8 flex flex-col justify-between transition-all duration-300 relative overflow-hidden ${
              activeFormat === "social_square" ? "aspect-square" : "min-h-[720px]"
            }`}
            style={{ borderColor: activeClinic.brandColor }}
          >
            {/* Top Clinic Branding Header */}
            <div>
              <div className="flex items-center justify-between pb-6 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <img
                    src={activeClinic.logoUrl}
                    alt={activeClinic.name}
                    className="w-12 h-12 rounded-xl object-cover border border-slate-200"
                  />
                  <div>
                    <h3 className="font-extrabold text-slate-900 text-base tracking-tight">
                      {activeClinic.name}
                    </h3>
                    <p className="text-xs text-slate-500 font-medium">{activeClinic.tagline}</p>
                  </div>
                </div>

                <div className="text-right text-[11px] text-slate-400">
                  <div>{activeClinic.city}, {activeClinic.state}</div>
                  <div className="font-semibold text-slate-700">{activeClinic.phone}</div>
                </div>
              </div>

              {/* Main Headline */}
              <div className="text-center my-6 space-y-1.5">
                <span
                  className="inline-block px-3 py-1 rounded-full text-xs font-extrabold tracking-wider uppercase text-white shadow-xs"
                  style={{ backgroundColor: activeClinic.brandColor }}
                >
                  {currentItem.headline}
                </span>
                <p className="text-xs text-slate-600 max-w-md mx-auto pt-1 font-medium">
                  {currentItem.subheadline}
                </p>
              </div>
            </div>

            {/* Central Smart QR Code Display */}
            <div className="my-auto flex flex-col items-center justify-center py-4">
              <div className="p-4 bg-white rounded-3xl border-2 border-slate-200 shadow-lg">
                <QRCodeViewer
                  value={currentItem.qr?.targetUrl || `/portal/${activeClinic.id}/hub`}
                  size={240}
                  fgColor={activeClinic.brandColor}
                  bgColor="#ffffff"
                  title=""
                  subtitle=""
                  frameStyle="simple"
                  showActions={false}
                />
              </div>

              {/* Scan with camera callout */}
              <div className="mt-4 flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-100 text-slate-800 text-xs font-bold">
                <Smartphone className="w-3.5 h-3.5 text-teal-600" />
                <span>Point your Phone Camera to Scan</span>
              </div>
            </div>

            {/* Key Service Bullets & Footer */}
            <div className="pt-6 border-t border-slate-100 space-y-4">
              <div className="grid grid-cols-2 gap-2 text-xs text-slate-700 font-medium">
                {currentItem.bullets.map((b, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-teal-500 flex-shrink-0" />
                    <span className="truncate">{b}</span>
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-between text-[10px] text-slate-400 pt-3 border-t border-slate-100">
                <span>{currentItem.footerNote}</span>
                <span className="font-mono">Powered by Konnector AI DentalOS</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
