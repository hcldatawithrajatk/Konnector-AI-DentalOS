"use client";

import React, { useState } from "react";
import { useParams } from "next/navigation";
import { useDentalOS } from "@/context/DentalContext";
import confetti from "canvas-confetti";
import {
  Star,
  Sparkles,
  Heart,
  MessageSquare,
  CheckCircle2,
  ExternalLink,
  ShieldCheck,
  Send,
} from "lucide-react";

export default function ReviewFunnelPortalPage() {
  const params = useParams();
  const { activeClinic } = useDentalOS();

  const [rating, setRating] = useState<number | null>(null);
  const [patientName, setPatientName] = useState("");
  const [internalFeedback, setInternalFeedback] = useState("");
  const [submittedInternal, setSubmittedInternal] = useState(false);

  const handleSelectRating = (score: number) => {
    setRating(score);
    if (score >= 8) {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      });
    }
  };

  const handleSendInternalFeedback = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmittedInternal(true);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between max-w-md mx-auto shadow-2xl border-x border-slate-200">
      {/* Header */}
      <div
        className="p-6 text-white text-center"
        style={{ backgroundColor: activeClinic.brandColor }}
      >
        <img
          src={activeClinic.logoUrl}
          alt={activeClinic.name}
          className="w-16 h-16 rounded-2xl mx-auto object-cover border-2 border-white shadow-md mb-2 bg-white"
        />
        <h1 className="text-lg font-bold">{activeClinic.name}</h1>
        <p className="text-xs opacity-90">Patient Smile Experience Survey</p>
      </div>

      {/* Main Funnel Body */}
      <div className="p-6 flex-1 flex flex-col justify-center space-y-6">
        {/* Rating Question */}
        <div className="text-center space-y-2">
          <h2 className="text-lg font-extrabold text-slate-900 tracking-tight">
            How likely are you to recommend us to a friend or family member?
          </h2>
          <p className="text-xs text-slate-500">
            Select a score from 1 (Unlikely) to 10 (Extremely Likely)
          </p>
        </div>

        {/* 1-10 Rating Scale Buttons */}
        <div className="grid grid-cols-5 gap-2">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => {
            const isSelected = rating === num;
            return (
              <button
                key={num}
                type="button"
                onClick={() => handleSelectRating(num)}
                className={`py-3 rounded-xl font-mono text-sm font-bold border-2 transition ${
                  isSelected
                    ? "bg-slate-900 text-white border-slate-900 scale-105 shadow-md"
                    : num >= 8
                    ? "border-amber-300 bg-amber-50/50 text-amber-900 hover:bg-amber-100"
                    : "border-slate-200 bg-white text-slate-700 hover:bg-slate-100"
                }`}
              >
                {num}
              </button>
            );
          })}
        </div>

        {/* SCENARIO A: Positive Rating (8-10) -> Route to Google Reviews! */}
        {rating !== null && rating >= 8 && (
          <div className="p-5 rounded-2xl bg-amber-50/80 border-2 border-amber-300 space-y-4 animate-in fade-in">
            <div className="flex items-center gap-2 text-amber-800">
              <Star className="w-5 h-5 fill-amber-400 text-amber-400" />
              <h3 className="font-bold text-sm">Thank you so much! You made our day!</h3>
            </div>
            <p className="text-xs text-slate-700 leading-relaxed">
              We would be deeply grateful if you could take 15 seconds to share your review on Google. It helps other patients find caring dental care.
            </p>

            <a
              href={`https://search.google.com/local/writereview?placeid=ChIJN1t_tDeuEmsRUsoyG83frY4`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3 px-4 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-extrabold text-xs rounded-xl shadow-md transition flex items-center justify-center gap-2"
            >
              <Star className="w-4 h-4 fill-white" />
              <span>Post 5-Star Review on Google</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        )}

        {/* SCENARIO B: Constructive Rating (1-7) -> Route to Private Clinic Manager! */}
        {rating !== null && rating < 8 && (
          <div className="p-5 rounded-2xl bg-slate-100 border border-slate-300 space-y-3 animate-in fade-in">
            {!submittedInternal ? (
              <form onSubmit={handleSendInternalFeedback} className="space-y-3">
                <div className="font-bold text-slate-900 text-xs">
                  We are deeply committed to your comfort. How can we make this right?
                </div>
                <textarea
                  rows={3}
                  required
                  value={internalFeedback}
                  onChange={(e) => setInternalFeedback(e.target.value)}
                  placeholder="Tell our Practice Manager about your experience..."
                  className="w-full p-2.5 rounded-xl border border-slate-300 bg-white text-xs focus:ring-2 focus:ring-teal-500 focus:outline-none"
                />
                <button
                  type="submit"
                  className="w-full py-2.5 bg-slate-900 text-white rounded-xl font-bold text-xs shadow-sm"
                >
                  Submit Private Feedback to Practice Director
                </button>
              </form>
            ) : (
              <div className="text-center py-4 space-y-2 text-xs text-slate-700">
                <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
                <div className="font-bold text-sm text-slate-900">Thank you for your feedback</div>
                <p>Our Practice Manager has been notified directly and will contact you shortly.</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-slate-200 text-center text-[10px] text-slate-400">
        Verified Patient Feedback System • Konnector AI DentalOS
      </div>
    </div>
  );
}
