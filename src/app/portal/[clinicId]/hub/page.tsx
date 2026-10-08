"use client";

import React from "react";
import { useParams } from "next/navigation";
import { useDentalOS } from "@/context/DentalContext";
import Link from "next/link";
import {
  Calendar,
  MessageSquare,
  Star,
  CreditCard,
  Phone,
  MapPin,
  AlertTriangle,
  FileText,
  Gift,
  Clock,
  Sparkles,
  ChevronRight,
  ShieldCheck,
} from "lucide-react";

export default function UniversalPortalHubPage() {
  const params = useParams();
  const { activeClinic, doctors } = useDentalOS();

  const clinicId = params?.clinicId as string;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between max-w-md mx-auto shadow-2xl border-x border-slate-200">
      {/* Clinic Header Banner */}
      <div
        className="p-6 text-white text-center relative overflow-hidden"
        style={{ backgroundColor: activeClinic.brandColor }}
      >
        <div className="w-20 h-20 rounded-2xl mx-auto overflow-hidden border-2 border-white shadow-lg mb-3 bg-white">
          <img
            src={activeClinic.logoUrl}
            alt={activeClinic.name}
            className="w-full h-full object-cover"
          />
        </div>

        <h1 className="text-xl font-extrabold tracking-tight">{activeClinic.name}</h1>
        <p className="text-xs opacity-90 mt-0.5">{activeClinic.tagline}</p>

        <div className="mt-3 flex items-center justify-center gap-2 text-xs font-medium">
          <span className="flex items-center gap-1 bg-black/20 px-2.5 py-1 rounded-full">
            <MapPin className="w-3 h-3" />
            <span>{activeClinic.city}, {activeClinic.state}</span>
          </span>
          <span className="flex items-center gap-1 bg-black/20 px-2.5 py-1 rounded-full">
            <Clock className="w-3 h-3" />
            <span>Open Today</span>
          </span>
        </div>
      </div>

      {/* Main Touchpoints Menu */}
      <div className="p-4 space-y-2.5 flex-1">
        {/* Touchpoint 1: WhatsApp Chat */}
        <Link
          href={`/ai-workforce?persona=receptionist`}
          className="flex items-center justify-between p-4 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white shadow-md transition"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
              <MessageSquare className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="font-bold text-sm">Chat on WhatsApp (24/7)</div>
              <div className="text-[11px] text-emerald-100">Ask questions & book with Aria</div>
            </div>
          </div>
          <ChevronRight className="w-5 h-5 text-emerald-200" />
        </Link>

        {/* Touchpoint 2: Book Appointment */}
        <Link
          href={`/ai-workforce?persona=receptionist`}
          className="flex items-center justify-between p-4 rounded-2xl bg-white border border-slate-200 hover:border-teal-400 shadow-xs transition"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-50 flex items-center justify-center text-teal-600">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <div className="font-bold text-slate-900 text-sm">Book Chair Appointment</div>
              <div className="text-[11px] text-slate-500">Pick doctor & convenient time slot</div>
            </div>
          </div>
          <ChevronRight className="w-5 h-5 text-slate-400" />
        </Link>

        {/* Touchpoint 3: Touchless Payment */}
        <Link
          href={`/portal/${clinicId}/pay`}
          className="flex items-center justify-between p-4 rounded-2xl bg-white border border-slate-200 hover:border-teal-400 shadow-xs transition"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600">
              <CreditCard className="w-5 h-5" />
            </div>
            <div>
              <div className="font-bold text-slate-900 text-sm">Touchless Mobile Payment</div>
              <div className="text-[11px] text-slate-500">
                {activeClinic.region === "US" ? "Stripe / Apple Pay" : "Instant UPI / Razorpay"}
              </div>
            </div>
          </div>
          <ChevronRight className="w-5 h-5 text-slate-400" />
        </Link>

        {/* Touchpoint 4: Digital Intake */}
        <Link
          href={`/portal/${clinicId}/intake`}
          className="flex items-center justify-between p-4 rounded-2xl bg-white border border-slate-200 hover:border-teal-400 shadow-xs transition"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <div className="font-bold text-slate-900 text-sm">Paperless Digital Intake</div>
              <div className="text-[11px] text-slate-500">Fast medical history & digital consent</div>
            </div>
          </div>
          <ChevronRight className="w-5 h-5 text-slate-400" />
        </Link>

        {/* Touchpoint 5: Review */}
        <Link
          href={`/portal/${clinicId}/review`}
          className="flex items-center justify-between p-4 rounded-2xl bg-white border border-slate-200 hover:border-teal-400 shadow-xs transition"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center text-amber-500">
              <Star className="w-5 h-5 fill-amber-400" />
            </div>
            <div>
              <div className="font-bold text-slate-900 text-sm">Leave a Google Review</div>
              <div className="text-[11px] text-slate-500">Rate today&apos;s visit in 15 seconds</div>
            </div>
          </div>
          <ChevronRight className="w-5 h-5 text-slate-400" />
        </Link>

        {/* Touchpoint 6: Emergency Triage */}
        <Link
          href={`/portal/${clinicId}/emergency`}
          className="flex items-center justify-between p-4 rounded-2xl bg-rose-50 border border-rose-200 hover:bg-rose-100 transition"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-rose-600 text-white flex items-center justify-center">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <div className="font-bold text-rose-950 text-sm">Dental Emergency Triage</div>
              <div className="text-[11px] text-rose-700">Immediate pain & swelling routing</div>
            </div>
          </div>
          <ChevronRight className="w-5 h-5 text-rose-400" />
        </Link>
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-slate-200 text-center text-[10px] text-slate-400 space-y-1">
        <div>{activeClinic.phone} • {activeClinic.address}</div>
        <div>Powered by Konnector AI DentalOS</div>
      </div>
    </div>
  );
}
