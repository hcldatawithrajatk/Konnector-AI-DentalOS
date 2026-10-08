"use client";

import React, { useState } from "react";
import { useDentalOS } from "@/context/DentalContext";
import { SmartQRCode, QRType } from "@/types";
import { QRCodeViewer } from "@/components/ui/QRCodeViewer";
import { formatCurrency } from "@/lib/utils";
import {
  QrCode,
  Sparkles,
  BarChart3,
  Sliders,
  ExternalLink,
  Eye,
  CheckCircle2,
  TrendingUp,
  CreditCard,
  MessageSquare,
  Star,
  Users,
  AlertTriangle,
  Stethoscope,
  FileText,
  Gift,
  Armchair,
  Palette,
} from "lucide-react";
import Link from "next/link";

export default function SmartQRHubPage() {
  const { activeClinic, smartQRs, updateQRCodeStyle } = useDentalOS();

  const [activeTab, setActiveTab] = useState<"catalog" | "studio" | "analytics">("catalog");
  const [selectedQR, setSelectedQR] = useState<SmartQRCode>(smartQRs[0]);

  // Design studio color / frame state
  const [fgColor, setFgColor] = useState<string>(selectedQR.customStyles?.fgColor || activeClinic.brandColor);
  const [frameStyle, setFrameStyle] = useState<"simple" | "badge" | "callout" | "poster">(
    selectedQR.customStyles?.frameStyle || "badge"
  );
  const [ctaText, setCtaText] = useState<string>(selectedQR.customStyles?.ctaText || "SCAN NOW");

  const handleSelectQR = (qr: SmartQRCode) => {
    setSelectedQR(qr);
    setFgColor(qr.customStyles?.fgColor || activeClinic.brandColor);
    setFrameStyle(qr.customStyles?.frameStyle || "badge");
    setCtaText(qr.customStyles?.ctaText || "SCAN NOW");
  };

  const handleSaveStyle = () => {
    updateQRCodeStyle(selectedQR.id, {
      fgColor,
      frameStyle,
      ctaText,
    });
  };

  // Compute total scans & revenue across all QRs
  const totalScans = smartQRs.reduce((acc, q) => acc + q.scansCount, 0);
  const totalConversions = smartQRs.reduce((acc, q) => acc + q.conversionsCount, 0);
  const totalQRRevenue = smartQRs.reduce((acc, q) => acc + q.revenueGenerated, 0);

  const getQRTypeIcon = (type: QRType) => {
    switch (type) {
      case "universal":
        return QrCode;
      case "whatsapp":
        return MessageSquare;
      case "review":
        return Star;
      case "payment":
        return CreditCard;
      case "appointment":
        return Users;
      case "intake":
        return FileText;
      case "referral":
        return Gift;
      case "treatment_plan":
        return TrendingUp;
      case "emergency":
        return AlertTriangle;
      case "doctor":
        return Stethoscope;
      case "chair":
        return Armchair;
      default:
        return QrCode;
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-50 border border-teal-200 text-teal-800 text-xs font-semibold mb-1">
            <Sparkles className="w-3.5 h-3.5 text-teal-600" />
            <span>Connect • Review • Collect Growth Engine</span>
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Smart QR Connect & Growth Hub
          </h2>
          <p className="text-xs text-slate-500">
            Deploy 11 specialized dental QR touchpoints across your reception, operatories, treatment estimates, and social media.
          </p>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center p-1 bg-white rounded-xl border border-slate-200 shadow-xs">
          <button
            onClick={() => setActiveTab("catalog")}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
              activeTab === "catalog" ? "bg-slate-900 text-white shadow-xs" : "text-slate-600 hover:text-slate-900"
            }`}
          >
            QR Catalog (11 Types)
          </button>
          <button
            onClick={() => setActiveTab("studio")}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
              activeTab === "studio" ? "bg-slate-900 text-white shadow-xs" : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Design Studio
          </button>
          <button
            onClick={() => setActiveTab("analytics")}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
              activeTab === "analytics" ? "bg-slate-900 text-white shadow-xs" : "text-slate-600 hover:text-slate-900"
            }`}
          >
            QR Analytics
          </button>
        </div>
      </div>

      {/* Top Performance Metric Bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="bg-white p-4 rounded-xl border border-slate-200">
          <div className="text-slate-500 text-xs font-medium">Total Smart QR Scans</div>
          <div className="text-xl font-extrabold text-slate-900 mt-1">{totalScans.toLocaleString()}</div>
          <div className="text-[10px] text-teal-600 font-semibold mt-0.5">Across all 11 active touchpoints</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200">
          <div className="text-slate-500 text-xs font-medium">Direct Conversions</div>
          <div className="text-xl font-extrabold text-emerald-600 mt-1">{totalConversions.toLocaleString()}</div>
          <div className="text-[10px] text-slate-500 mt-0.5">
            {((totalConversions / (totalScans || 1)) * 100).toFixed(1)}% Conversion rate
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200">
          <div className="text-slate-500 text-xs font-medium">Attributed QR Revenue</div>
          <div className="text-xl font-extrabold text-emerald-600 mt-1">
            {formatCurrency(totalQRRevenue, activeClinic.currency)}
          </div>
          <div className="text-[10px] text-slate-500 mt-0.5">Collected via touchless mobile</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200">
          <div className="text-slate-500 text-xs font-medium">Active QR Touchpoints</div>
          <div className="text-xl font-extrabold text-teal-600 mt-1">{smartQRs.length} / 11</div>
          <div className="text-[10px] text-emerald-600 font-semibold mt-0.5">100% Operational</div>
        </div>
      </div>

      {/* TAB 1: CATALOG */}
      {activeTab === "catalog" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Grid: 11 QR Touchpoints (8 Cols) */}
          <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-4">
            {smartQRs.map((qr) => {
              const Icon = getQRTypeIcon(qr.type);
              const isSelected = qr.id === selectedQR.id;
              return (
                <div
                  key={qr.id}
                  onClick={() => handleSelectQR(qr)}
                  className={`bg-white p-5 rounded-2xl border-2 transition cursor-pointer flex flex-col justify-between ${
                    isSelected ? "border-teal-600 shadow-md ring-2 ring-teal-50" : "border-slate-200 hover:border-slate-300"
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <div className="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center text-teal-700">
                        <Icon className="w-5 h-5" />
                      </div>
                      <span className="text-[10px] font-mono font-bold px-2 py-0.5 bg-slate-100 rounded-full text-slate-600 uppercase">
                        {qr.type.replace("_", " ")}
                      </span>
                    </div>

                    <h4 className="font-bold text-slate-900 text-sm">{qr.title}</h4>
                    <p className="text-xs text-slate-500 mt-1 line-clamp-2">{qr.subtitle}</p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                    <span className="text-slate-500 font-medium">
                      {qr.scansCount} Scans • {qr.conversionsCount} Convs
                    </span>
                    <span className="font-bold text-teal-700">
                      {qr.revenueGenerated > 0
                        ? formatCurrency(qr.revenueGenerated, activeClinic.currency)
                        : "Engagement QR"}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right Column: Live Selected QR Inspector & Scan Preview (4 Cols) */}
          <div className="lg:col-span-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col items-center text-center">
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
              Live QR Preview & Scanner Simulator
            </div>

            <QRCodeViewer
              value={selectedQR.targetUrl}
              size={220}
              fgColor={selectedQR.customStyles?.fgColor || activeClinic.brandColor}
              bgColor="#ffffff"
              title={selectedQR.title}
              subtitle={selectedQR.subtitle}
              ctaText={selectedQR.customStyles?.ctaText}
              frameStyle={selectedQR.customStyles?.frameStyle || "badge"}
              showActions={true}
            />

            <div className="w-full mt-6 pt-4 border-t border-slate-100 space-y-2 text-left">
              <div className="text-xs font-bold text-slate-800">Placement Guide:</div>
              <p className="text-xs text-slate-500">{selectedQR.locationTag || "Display prominently in clinic."}</p>

              <div className="pt-2">
                <Link
                  href={selectedQR.targetUrl}
                  target="_blank"
                  className="w-full py-2.5 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition shadow-sm"
                >
                  <Eye className="w-3.5 h-3.5 text-teal-400" />
                  <span>Simulate Patient Mobile Experience</span>
                  <ExternalLink className="w-3 h-3 text-slate-400" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: DESIGN STUDIO */}
      {activeTab === "studio" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 bg-white p-6 md:p-8 rounded-2xl border border-slate-200 shadow-sm">
          {/* Controls (6 Cols) */}
          <div className="lg:col-span-6 space-y-5">
            <div>
              <h3 className="text-base font-bold text-slate-900">QR Code Design Studio</h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Customize frame styles, brand palette, and calls to action for {selectedQR.title}.
              </p>
            </div>

            {/* Target QR selection */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Editing QR Code</label>
              <select
                value={selectedQR.id}
                onChange={(e) => {
                  const found = smartQRs.find((q) => q.id === e.target.value);
                  if (found) handleSelectQR(found);
                }}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-medium bg-white"
              >
                {smartQRs.map((q) => (
                  <option key={q.id} value={q.id}>
                    {q.title} ({q.type})
                  </option>
                ))}
              </select>
            </div>

            {/* Frame Styles */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-2">Frame Style</label>
              <div className="grid grid-cols-2 gap-2 text-xs">
                {[
                  { id: "badge", label: "Top Badge Frame" },
                  { id: "callout", label: "Callout Highlight" },
                  { id: "poster", label: "Premium Border Poster" },
                  { id: "simple", label: "Minimal Clean" },
                ].map((f) => (
                  <button
                    key={f.id}
                    type="button"
                    onClick={() => setFrameStyle(f.id as any)}
                    className={`p-2.5 rounded-xl border text-center font-semibold transition ${
                      frameStyle === f.id
                        ? "border-teal-600 bg-teal-50 text-teal-900 shadow-xs"
                        : "border-slate-200 hover:bg-slate-50 text-slate-700"
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Foreground Color */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-2">Brand Foreground Color</label>
              <div className="flex items-center gap-3">
                {[
                  activeClinic.brandColor,
                  "#0d9488",
                  "#4f46e5",
                  "#059669",
                  "#0284c7",
                  "#dc2626",
                  "#0f172a",
                ].map((color) => (
                  <button
                    key={color}
                    type="button"
                    onClick={() => setFgColor(color)}
                    className={`w-9 h-9 rounded-xl flex items-center justify-center text-white transition ${
                      fgColor === color ? "ring-4 ring-offset-2 ring-slate-400 scale-110" : ""
                    }`}
                    style={{ backgroundColor: color }}
                  >
                    {fgColor === color && <CheckCircle2 className="w-4 h-4" />}
                  </button>
                ))}
              </div>
            </div>

            {/* CTA Text */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Call-To-Action (CTA) Text</label>
              <input
                type="text"
                value={ctaText}
                onChange={(e) => setCtaText(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-bold uppercase tracking-wider"
                placeholder="e.g. SCAN TO BOOK ON WHATSAPP"
              />
            </div>

            <button
              onClick={handleSaveStyle}
              className="py-2.5 px-5 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs rounded-xl shadow-sm transition"
            >
              Save Custom Style
            </button>
          </div>

          {/* Right Live Canvas (6 Cols) */}
          <div className="lg:col-span-6 flex flex-col items-center justify-center p-6 bg-slate-50/70 rounded-2xl border border-slate-200">
            <QRCodeViewer
              value={selectedQR.targetUrl}
              size={240}
              fgColor={fgColor}
              bgColor="#ffffff"
              title={selectedQR.title}
              subtitle={selectedQR.subtitle}
              ctaText={ctaText}
              frameStyle={frameStyle}
              showActions={true}
            />
          </div>
        </div>
      )}

      {/* TAB 3: ANALYTICS */}
      {activeTab === "analytics" && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900">QR Touchpoint Conversion Breakdown</h3>
            <span className="text-xs text-slate-500">Real-time scan tracking</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50 text-slate-500 font-bold uppercase text-[10px] tracking-wider border-y border-slate-200">
                <tr>
                  <th className="py-3 px-4">Touchpoint Name</th>
                  <th className="py-3 px-4">Type</th>
                  <th className="py-3 px-4">Location</th>
                  <th className="py-3 px-4 text-right">Total Scans</th>
                  <th className="py-3 px-4 text-right">Conversions</th>
                  <th className="py-3 px-4 text-right">Conv. Rate</th>
                  <th className="py-3 px-4 text-right">Attributed Revenue</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {smartQRs.map((q) => {
                  const rate = q.scansCount > 0 ? ((q.conversionsCount / q.scansCount) * 100).toFixed(1) : "0.0";
                  return (
                    <tr key={q.id} className="hover:bg-slate-50/80 transition">
                      <td className="py-3 px-4 font-bold text-slate-900">{q.title}</td>
                      <td className="py-3 px-4 uppercase font-mono text-[10px] text-teal-700">{q.type}</td>
                      <td className="py-3 px-4 text-slate-500">{q.locationTag || "Global"}</td>
                      <td className="py-3 px-4 text-right font-mono font-bold text-slate-900">{q.scansCount}</td>
                      <td className="py-3 px-4 text-right font-mono font-bold text-emerald-600">{q.conversionsCount}</td>
                      <td className="py-3 px-4 text-right font-mono text-slate-600">{rate}%</td>
                      <td className="py-3 px-4 text-right font-mono font-bold text-slate-900">
                        {q.revenueGenerated > 0 ? formatCurrency(q.revenueGenerated, activeClinic.currency) : "—"}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
