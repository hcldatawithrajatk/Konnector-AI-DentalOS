"use client";

import React, { useState } from "react";
import { useDentalOS } from "@/context/DentalContext";
import {
  TrendingUp,
  Users,
  MessageSquare,
  CalendarCheck2,
  Star,
  CreditCard,
  Sparkles,
  ArrowUpRight,
  ShieldCheck,
  Zap,
  CheckCircle2,
  Clock,
  QrCode,
  DollarSign,
  ChevronRight,
  ExternalLink,
  Bot,
} from "lucide-react";
import Link from "next/link";
import { formatCurrency } from "@/lib/utils";

export default function DashboardPage() {
  const { activeClinic, stats, crmLeads, appointments, aiEmployees, smartQRs } = useDentalOS();

  // Interactive ROI Calculator states
  const [monthlyPatients, setMonthlyPatients] = useState<number>(180);
  const [avgTicket, setAvgTicket] = useState<number>(activeClinic.region === "US" ? 350 : 4500);
  const [showLaunchpad, setShowLaunchpad] = useState<boolean>(true);

  // ROI calculations
  const extraAppointments = Math.round(monthlyPatients * 0.18); // 18% boost
  const noShowRecovered = Math.round(monthlyPatients * 0.12); // 12% reduction in no-shows
  const totalRecoveredVisits = extraAppointments + noShowRecovered;
  const addedRevenue = totalRecoveredVisits * avgTicket;
  const softwareCost = activeClinic.region === "US" ? 99 : 4999;
  const estimatedROI = Math.round(addedRevenue / softwareCost);

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Post-Onboarding Quick Start Launchpad */}
      {showLaunchpad && (
        <div className="relative overflow-hidden rounded-2xl bg-white border border-teal-200/90 p-5 md:p-6 shadow-xs animate-in fade-in">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center font-bold">
                <Sparkles className="w-5 h-5 text-teal-600" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-extrabold text-slate-900 text-sm">
                    Clinic Successfully Operationalized
                  </h3>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span>4 Starter Growth Workflows Armed</span>
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  Setup finished under 10 minutes. Follow these 4 high-ROI actions to unlock immediate chairs and patient reviews.
                </p>
              </div>
            </div>
            <button
              onClick={() => setShowLaunchpad(false)}
              className="text-xs text-slate-400 hover:text-slate-600 font-semibold self-end md:self-auto"
            >
              ✕ Dismiss Launchpad
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mt-4 text-xs">
            <Link
              href="/starter-kit"
              className="p-3.5 rounded-xl border border-slate-200 hover:border-teal-400 bg-slate-50/50 hover:bg-teal-50/30 transition group flex flex-col justify-between space-y-2"
            >
              <div>
                <div className="flex items-center justify-between font-bold text-slate-900 mb-1">
                  <span className="flex items-center gap-1.5">
                    <QrCode className="w-4 h-4 text-teal-600" />
                    <span>1. Print Poster Kit</span>
                  </span>
                  <span className="text-[10px] font-mono text-teal-700 bg-teal-100 px-1.5 py-0.5 rounded">
                    A4 / Tent
                  </span>
                </div>
                <p className="text-[11px] text-slate-500">
                  Print your Universal & Review posters for the reception desk and operatory chairs.
                </p>
              </div>
              <span className="text-[11px] font-bold text-teal-700 group-hover:translate-x-1 transition-transform inline-flex items-center gap-1">
                Open Poster Studio &rarr;
              </span>
            </Link>

            <Link
              href="/ai-workforce?persona=receptionist"
              className="p-3.5 rounded-xl border border-slate-200 hover:border-teal-400 bg-slate-50/50 hover:bg-teal-50/30 transition group flex flex-col justify-between space-y-2"
            >
              <div>
                <div className="flex items-center justify-between font-bold text-slate-900 mb-1">
                  <span className="flex items-center gap-1.5">
                    <MessageSquare className="w-4 h-4 text-emerald-600" />
                    <span>2. Test AI Receptionist</span>
                  </span>
                  <span className="text-[10px] font-mono text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded">
                    WhatsApp
                  </span>
                </div>
                <p className="text-[11px] text-slate-500">
                  Chat with Aria on the simulated phone to test FAQs, timings, and slot booking.
                </p>
              </div>
              <span className="text-[11px] font-bold text-emerald-700 group-hover:translate-x-1 transition-transform inline-flex items-center gap-1">
                Launch Phone Simulator &rarr;
              </span>
            </Link>

            <Link
              href="/portal/clinic-in-01/review"
              target="_blank"
              className="p-3.5 rounded-xl border border-slate-200 hover:border-teal-400 bg-slate-50/50 hover:bg-teal-50/30 transition group flex flex-col justify-between space-y-2"
            >
              <div>
                <div className="flex items-center justify-between font-bold text-slate-900 mb-1">
                  <span className="flex items-center gap-1.5">
                    <Star className="w-4 h-4 text-amber-500 fill-amber-400" />
                    <span>3. Test Review Funnel</span>
                  </span>
                  <span className="text-[10px] font-mono text-amber-700 bg-amber-100 px-1.5 py-0.5 rounded">
                    2-Tier
                  </span>
                </div>
                <p className="text-[11px] text-slate-500">
                  Experience how ratings 8-10 open Google Maps, while 1-7 route to private clinic resolution.
                </p>
              </div>
              <span className="text-[11px] font-bold text-amber-700 group-hover:translate-x-1 transition-transform inline-flex items-center gap-1">
                Preview Patient Funnel &rarr;
              </span>
            </Link>

            <Link
              href="/portal/clinic-in-01/pay"
              target="_blank"
              className="p-3.5 rounded-xl border border-slate-200 hover:border-teal-400 bg-slate-50/50 hover:bg-teal-50/30 transition group flex flex-col justify-between space-y-2"
            >
              <div>
                <div className="flex items-center justify-between font-bold text-slate-900 mb-1">
                  <span className="flex items-center gap-1.5">
                    <CreditCard className="w-4 h-4 text-indigo-600" />
                    <span>4. Test Touchless Pay</span>
                  </span>
                  <span className="text-[10px] font-mono text-indigo-700 bg-indigo-100 px-1.5 py-0.5 rounded">
                    UPI / Stripe
                  </span>
                </div>
                <p className="text-[11px] text-slate-500">
                  Simulate QR payment checkout, GST invoice generation, and WhatsApp receipt delivery.
                </p>
              </div>
              <span className="text-[11px] font-bold text-indigo-700 group-hover:translate-x-1 transition-transform inline-flex items-center gap-1">
                Preview Mobile Checkout &rarr;
              </span>
            </Link>
          </div>
        </div>
      )}
      {/* Top Banner: 30-Day ROI Highlight */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 via-teal-950 to-slate-900 text-white p-6 md:p-8 shadow-xl border border-teal-800/30">
        <div className="absolute right-0 top-0 -mt-8 -mr-8 w-72 h-72 bg-teal-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/20 text-teal-300 text-xs font-semibold mb-3 border border-teal-500/30">
              <Sparkles className="w-3.5 h-3.5" />
              <span>30-Day Quick Win Guarantee • Measurable ROI</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight">
              {activeClinic.name} Growth Engine
            </h2>
            <p className="text-slate-300 text-sm mt-1 max-w-2xl leading-relaxed">
              Your autonomous AI Dental Workforce has resolved{" "}
              <span className="font-bold text-teal-300">
                {stats.aiConversationsResolved} patient inquiries
              </span>{" "}
              and delivered{" "}
              <span className="font-bold text-emerald-400">
                {formatCurrency(stats.revenueInfluenced, activeClinic.currency)}
              </span>{" "}
              in influenced practice revenue this month.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/starter-kit"
              className="px-4 py-2.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs shadow-lg shadow-teal-500/20 transition flex items-center gap-2"
            >
              <QrCode className="w-4 h-4" />
              <span>Print Growth Starter Kit</span>
            </Link>
            <Link
              href="/ai-workforce"
              className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs border border-white/10 transition flex items-center gap-2"
            >
              <MessageSquare className="w-4 h-4 text-teal-300" />
              <span>Open WhatsApp Simulator</span>
            </Link>
          </div>
        </div>

        {/* 30-Day Metrics Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3 mt-6 pt-6 border-t border-white/10">
          <div className="p-3 rounded-xl bg-white/5 border border-white/5">
            <div className="text-slate-400 text-[11px] font-medium">Leads Captured</div>
            <div className="text-xl font-extrabold text-white mt-0.5">{stats.leadsGenerated}</div>
            <div className="text-[10px] text-emerald-400 flex items-center gap-0.5 mt-0.5">
              <TrendingUp className="w-3 h-3" /> +32% this month
            </div>
          </div>

          <div className="p-3 rounded-xl bg-white/5 border border-white/5">
            <div className="text-slate-400 text-[11px] font-medium">WhatsApp Convos</div>
            <div className="text-xl font-extrabold text-white mt-0.5">{stats.whatsappConversations}</div>
            <div className="text-[10px] text-teal-300">24/7 AI Receptionist</div>
          </div>

          <div className="p-3 rounded-xl bg-white/5 border border-white/5">
            <div className="text-slate-400 text-[11px] font-medium">Appointments Booked</div>
            <div className="text-xl font-extrabold text-white mt-0.5">{stats.appointmentsBooked}</div>
            <div className="text-[10px] text-emerald-400 flex items-center gap-0.5 mt-0.5">
              <TrendingUp className="w-3 h-3" /> +24% vs manual
            </div>
          </div>

          <div className="p-3 rounded-xl bg-white/5 border border-white/5">
            <div className="text-slate-400 text-[11px] font-medium">Google Reviews</div>
            <div className="text-xl font-extrabold text-amber-300 mt-0.5 flex items-center gap-1">
              <Star className="w-4 h-4 fill-amber-300" />
              <span>+{stats.googleReviewsCollected}</span>
            </div>
            <div className="text-[10px] text-slate-300">Avg Rating 4.9★</div>
          </div>

          <div className="p-3 rounded-xl bg-white/5 border border-white/5">
            <div className="text-slate-400 text-[11px] font-medium">Payments Collected</div>
            <div className="text-lg font-extrabold text-emerald-400 mt-0.5 truncate">
              {formatCurrency(stats.paymentsCollected, activeClinic.currency)}
            </div>
            <div className="text-[10px] text-slate-300">
              {activeClinic.region === "US" ? "Stripe / ACH" : "UPI / Razorpay"}
            </div>
          </div>

          <div className="p-3 rounded-xl bg-white/5 border border-white/5">
            <div className="text-slate-400 text-[11px] font-medium">Front Desk Hours Saved</div>
            <div className="text-xl font-extrabold text-teal-300 mt-0.5">{stats.hoursSaved} hrs</div>
            <div className="text-[10px] text-slate-300">≈ 2.5 staff members</div>
          </div>

          <div className="p-3 rounded-xl bg-white/5 border border-white/5">
            <div className="text-slate-400 text-[11px] font-medium">AI ROI Multiplier</div>
            <div className="text-xl font-extrabold text-emerald-400 mt-0.5">{stats.roiMultiplier}x</div>
            <div className="text-[10px] text-emerald-300 font-semibold">Net Growth ROI</div>
          </div>
        </div>
      </div>

      {/* CONNECT. REVIEW. COLLECT. Platform Philosophy */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <div>
            <h3 className="text-base font-bold text-slate-900 tracking-tight">
              Connect. Review. Collect. (First Week Playbook)
            </h3>
            <p className="text-xs text-slate-500">
              The core three growth loops designed to deliver instant revenue and reputation in days 1 to 7.
            </p>
          </div>
          <Link
            href="/starter-kit"
            className="text-xs font-semibold text-teal-700 hover:text-teal-800 flex items-center gap-1"
          >
            <span>View All Posters</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Loop 1: Connect */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:shadow-md transition">
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-xl bg-teal-50 flex items-center justify-center text-teal-600 font-bold">
                1
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 bg-teal-100 text-teal-800 rounded-full">
                ACTIVE • 24x7
              </span>
            </div>
            <h4 className="font-bold text-slate-900 text-sm">1. Connect via WhatsApp QR</h4>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              Place the WhatsApp QR at reception and online. Patients scan and chat instantly with{" "}
              <strong className="text-slate-700">Aria (AI Receptionist)</strong> to book slots without waiting on hold.
            </p>
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
              <span className="text-xs text-slate-500">Avg Response Time</span>
              <span className="text-xs font-bold text-teal-600">3 Seconds</span>
            </div>
          </div>

          {/* Loop 2: Review */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:shadow-md transition">
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600 font-bold">
                2
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 bg-amber-100 text-amber-800 rounded-full">
                AI FUNNEL FILTER
              </span>
            </div>
            <h4 className="font-bold text-slate-900 text-sm">2. Generate Reviews via Review QR</h4>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              2 hours post-treatment, patients get a 1-10 rating prompt. Ratings 8-10 route straight to Google Reviews. Ratings ≤7 trigger a private clinic resolution ticket.
            </p>
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
              <span className="text-xs text-slate-500">Google Review Rate</span>
              <span className="text-xs font-bold text-amber-600">72.8% Conversion</span>
            </div>
          </div>

          {/* Loop 3: Collect */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:shadow-md transition">
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600 font-bold">
                3
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded-full">
                TOUCHLESS BILLING
              </span>
            </div>
            <h4 className="font-bold text-slate-900 text-sm">3. Collect Payments via Payment QR</h4>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              Patients scan at the counter or click WhatsApp links to pay advances, co-pays, or treatment deposits instantly via {activeClinic.currency === "INR" ? "UPI/Razorpay" : "Stripe/ACH"}.
            </p>
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
              <span className="text-xs text-slate-500">Collection Velocity</span>
              <span className="text-xs font-bold text-emerald-600">&lt; 60 Seconds</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Two Columns: AI Employees Live Status & Quick CRM Pipeline */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Pre-Built AI Dental Employees (2 Cols) */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900 tracking-tight flex items-center gap-2">
                <Bot className="w-4 h-4 text-teal-600" />
                <span>Active AI Dental Workforce</span>
              </h3>
              <p className="text-xs text-slate-500">
                Not a simple chatbot. 6 dedicated AI staff operating continuously across WhatsApp, SMS & Web.
              </p>
            </div>
            <Link
              href="/ai-workforce"
              className="text-xs font-semibold text-teal-700 hover:text-teal-800 flex items-center gap-1"
            >
              <span>Employee Studio</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {aiEmployees.map((emp) => (
              <div
                key={emp.id}
                className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs hover:border-teal-300 transition flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-2.5">
                      <img
                        src={emp.avatar}
                        alt={emp.name}
                        className="w-10 h-10 rounded-full object-cover border border-slate-200"
                      />
                      <div>
                        <div className="flex items-center gap-1.5">
                          <h4 className="font-bold text-slate-900 text-xs">{emp.name}</h4>
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                        </div>
                        <p className="text-[10px] text-teal-700 font-semibold">{emp.roleTitle}</p>
                      </div>
                    </div>
                    <span className="text-[10px] font-mono font-bold text-slate-600 bg-slate-100 px-1.5 py-0.5 rounded">
                      {emp.resolutionRate}% Res.
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 mt-2.5 line-clamp-2 leading-relaxed">
                    {emp.prompt}
                  </p>
                </div>

                <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-500">
                  <span>{emp.conversationsHandled.toLocaleString()} Patients Served</span>
                  <Link
                    href={`/ai-workforce?persona=${emp.persona}`}
                    className="text-teal-700 font-bold hover:underline flex items-center gap-0.5"
                  >
                    <span>Simulate</span>
                    <ArrowUpRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            ))}
          </div>

          {/* Recent Appointments & Reminders Preview */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <CalendarCheck2 className="w-4 h-4 text-teal-600" />
                <h4 className="font-bold text-slate-900 text-sm">Upcoming Chair Appointments & No-Show Reminders</h4>
              </div>
              <Link href="/recall-manager" className="text-xs font-semibold text-teal-700 hover:underline">
                View All Slots
              </Link>
            </div>

            <div className="divide-y divide-slate-100">
              {appointments.slice(0, 4).map((apt) => (
                <div key={apt.id} className="py-2.5 flex items-center justify-between text-xs">
                  <div>
                    <span className="font-bold text-slate-900">{apt.patientName}</span>
                    <span className="text-slate-400 mx-1.5">•</span>
                    <span className="text-slate-600">{apt.treatmentName}</span>
                    <div className="text-[10px] text-slate-500 mt-0.5">
                      Doctor: {apt.doctorName} • Via: <span className="font-medium text-teal-700">{apt.channel}</span>
                    </div>
                  </div>

                  <div className="text-right">
                    <span
                      className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        apt.status === "confirmed"
                          ? "bg-emerald-100 text-emerald-800"
                          : apt.status === "reminded_24h"
                          ? "bg-amber-100 text-amber-800"
                          : "bg-slate-100 text-slate-700"
                      }`}
                    >
                      {apt.status.replace("_", " ").toUpperCase()}
                    </span>
                    <div className="text-[10px] text-slate-500 mt-0.5">
                      {new Date(apt.dateTime).toLocaleDateString([], { month: "short", day: "numeric" })} at{" "}
                      {new Date(apt.dateTime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Interactive Practice ROI Calculator & Growth Hub Summary */}
        <div className="space-y-4">
          {/* Interactive ROI Calculator Widget */}
          <div className="bg-gradient-to-br from-teal-900 to-slate-900 text-white p-5 rounded-2xl shadow-lg border border-teal-800/40">
            <div className="flex items-center gap-2 mb-2">
              <Zap className="w-4 h-4 text-teal-400" />
              <h4 className="font-bold text-sm tracking-tight">Practice Growth ROI Calculator</h4>
            </div>
            <p className="text-[11px] text-slate-300 leading-snug">
              Adjust your monthly patient volume to estimate incremental revenue generated by Konnector AI DentalOS.
            </p>

            <div className="mt-4 space-y-3">
              <div>
                <div className="flex justify-between text-xs text-slate-300 mb-1">
                  <span>Monthly Patient Visits</span>
                  <span className="font-bold text-white font-mono">{monthlyPatients}</span>
                </div>
                <input
                  type="range"
                  min="50"
                  max="800"
                  step="10"
                  value={monthlyPatients}
                  onChange={(e) => setMonthlyPatients(Number(e.target.value))}
                  className="w-full accent-teal-400 h-1.5 bg-white/20 rounded-lg cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs text-slate-300 mb-1">
                  <span>Avg Ticket Value ({activeClinic.currency})</span>
                  <span className="font-bold text-white font-mono">
                    {formatCurrency(avgTicket, activeClinic.currency)}
                  </span>
                </div>
                <input
                  type="range"
                  min={activeClinic.region === "US" ? 100 : 1500}
                  max={activeClinic.region === "US" ? 1500 : 25000}
                  step={activeClinic.region === "US" ? 25 : 500}
                  value={avgTicket}
                  onChange={(e) => setAvgTicket(Number(e.target.value))}
                  className="w-full accent-teal-400 h-1.5 bg-white/20 rounded-lg cursor-pointer"
                />
              </div>
            </div>

            <div className="mt-5 p-3.5 rounded-xl bg-white/10 border border-white/10 space-y-2">
              <div className="flex justify-between text-xs text-slate-300">
                <span>Extra Recovered Bookings:</span>
                <span className="font-bold text-white">+{totalRecoveredVisits} / mo</span>
              </div>
              <div className="flex justify-between text-xs text-slate-300">
                <span>Added Monthly Revenue:</span>
                <span className="font-bold text-emerald-400">
                  +{formatCurrency(addedRevenue, activeClinic.currency)}
                </span>
              </div>
              <div className="pt-2 border-t border-white/10 flex justify-between text-xs">
                <span className="text-teal-300 font-semibold">Projected Annual ROI:</span>
                <span className="font-extrabold text-teal-300 text-sm">{estimatedROI}x Return</span>
              </div>
            </div>
          </div>

          {/* Dental CRM High-Value Pipeline Snapshot */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-bold text-slate-900 text-xs">High-Value Treatment Leads</h4>
              <Link href="/crm" className="text-[11px] font-semibold text-teal-700 hover:underline">
                View CRM
              </Link>
            </div>

            <div className="space-y-2.5">
              {crmLeads.slice(0, 4).map((lead) => (
                <div
                  key={lead.id}
                  className="p-2.5 rounded-lg border border-slate-100 hover:bg-slate-50 transition"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-900">{lead.name}</span>
                    <span className="text-[10px] font-mono font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded">
                      {formatCurrency(lead.estimatedValue, activeClinic.currency)}
                    </span>
                  </div>
                  <div className="text-[10px] text-slate-500 mt-0.5 truncate">
                    {lead.treatmentInterest}
                  </div>
                  <div className="flex items-center justify-between mt-1 text-[9px] text-slate-400">
                    <span>Intent Score: {lead.treatmentIntentScore}/100</span>
                    <span className="capitalize text-teal-700 font-semibold">
                      {lead.status.replace("_", " ")}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
