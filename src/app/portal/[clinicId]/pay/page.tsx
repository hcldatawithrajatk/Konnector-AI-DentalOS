"use client";

import React, { useState } from "react";
import { useParams } from "next/navigation";
import { useDentalOS } from "@/context/DentalContext";
import { formatCurrency } from "@/lib/utils";
import confetti from "canvas-confetti";
import {
  CreditCard,
  ShieldCheck,
  CheckCircle2,
  Lock,
  Smartphone,
  Receipt,
  Download,
  Check,
} from "lucide-react";

export default function MobilePaymentPortalPage() {
  const params = useParams();
  const { activeClinic, recordPayment } = useDentalOS();

  const isUS = activeClinic.region === "US";
  const [patientName, setPatientName] = useState("Rohan Desai");
  const [treatment, setTreatment] = useState("Dental Cleaning & Scaling");
  const [amount, setAmount] = useState<number>(isUS ? 180 : 2500);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const handlePayNow = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setPaymentSuccess(true);
      recordPayment({
        patientName,
        treatmentName: treatment,
        amount,
        currency: activeClinic.currency,
        method: isUS ? "Stripe" : "UPI",
        status: "Completed",
        invoiceNumber: `INV-${Date.now().toString().slice(-6)}`,
        gstNumber: activeClinic.gstNumber,
      });

      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 },
      });
    }, 1200);
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
          className="w-14 h-14 rounded-2xl mx-auto object-cover border-2 border-white shadow-md mb-2 bg-white"
        />
        <h1 className="text-base font-bold">{activeClinic.name}</h1>
        <p className="text-xs opacity-90">Touchless Patient Checkout</p>
      </div>

      {/* Main Body */}
      <div className="p-6 flex-1 flex flex-col justify-center space-y-6">
        {!paymentSuccess ? (
          <div className="space-y-5">
            {/* Amount Due Card */}
            <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm text-center space-y-1">
              <span className="text-xs text-slate-500 font-medium">Total Amount Due</span>
              <div className="text-3xl font-extrabold text-slate-900 font-mono">
                {formatCurrency(amount, activeClinic.currency)}
              </div>
              <div className="text-xs text-teal-700 font-semibold pt-1">{treatment}</div>
            </div>

            {/* Payment Rails Selection */}
            <div className="space-y-3">
              <div className="text-xs font-bold text-slate-800">Choose Payment Method:</div>

              {isUS ? (
                <div className="space-y-2 text-xs">
                  <div className="p-3 rounded-xl border-2 border-teal-600 bg-teal-50/50 flex items-center justify-between font-semibold text-slate-900 cursor-pointer">
                    <span className="flex items-center gap-2">
                      <CreditCard className="w-4 h-4 text-teal-600" />
                      <span>Apple Pay / Google Pay / Card</span>
                    </span>
                    <Check className="w-4 h-4 text-teal-600" />
                  </div>
                  <div className="p-3 rounded-xl border border-slate-200 bg-white flex items-center justify-between font-medium text-slate-700 cursor-pointer">
                    <span>ACH Direct Bank Transfer</span>
                  </div>
                </div>
              ) : (
                <div className="space-y-2 text-xs">
                  <div className="p-3 rounded-xl border-2 border-teal-600 bg-teal-50/50 flex items-center justify-between font-semibold text-slate-900 cursor-pointer">
                    <span className="flex items-center gap-2">
                      <Smartphone className="w-4 h-4 text-teal-600" />
                      <span>Instant UPI (GPay, PhonePe, Paytm)</span>
                    </span>
                    <Check className="w-4 h-4 text-teal-600" />
                  </div>
                  <div className="p-3 rounded-xl border border-slate-200 bg-white flex items-center justify-between font-medium text-slate-700 cursor-pointer">
                    <span>Credit / Debit Card or 0% EMI</span>
                  </div>
                </div>
              )}
            </div>

            {/* Pay Button */}
            <button
              onClick={handlePayNow}
              disabled={isProcessing}
              className="w-full py-3.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-extrabold text-sm shadow-md transition flex items-center justify-center gap-2"
            >
              <Lock className="w-4 h-4" />
              <span>
                {isProcessing
                  ? "Processing Secure Transaction..."
                  : `Pay ${formatCurrency(amount, activeClinic.currency)}`}
              </span>
            </button>

            <div className="flex items-center justify-center gap-1.5 text-[10px] text-slate-500">
              <ShieldCheck className="w-3.5 h-3.5 text-teal-600" />
              <span>256-Bit Bank-Grade Encryption • Zero Card Data Stored</span>
            </div>
          </div>
        ) : (
          <div className="p-6 rounded-3xl bg-white border border-emerald-200 shadow-md text-center space-y-4 animate-in fade-in">
            <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div>
              <h3 className="font-extrabold text-lg text-slate-900">Payment Successful!</h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Paid {formatCurrency(amount, activeClinic.currency)} to {activeClinic.name}
              </p>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs text-left space-y-1">
              <div className="flex justify-between text-slate-500">
                <span>Receipt Number:</span>
                <span className="font-mono text-slate-900 font-bold">REC-2025-0819</span>
              </div>
              <div className="flex justify-between text-slate-500">
                <span>Treatment:</span>
                <span className="text-slate-900 font-medium">{treatment}</span>
              </div>
              <div className="flex justify-between text-slate-500">
                <span>WhatsApp Confirmation:</span>
                <span className="text-emerald-700 font-semibold">Sent to your number</span>
              </div>
            </div>

            <button
              onClick={() => window.print()}
              className="w-full py-2.5 px-3 rounded-xl border border-slate-200 text-slate-800 font-bold text-xs flex items-center justify-center gap-1.5"
            >
              <Receipt className="w-3.5 h-3.5" />
              <span>Download Digital Tax Receipt</span>
            </button>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-slate-200 text-center text-[10px] text-slate-400">
        Konnector AI DentalOS Secure Payment Gateway
      </div>
    </div>
  );
}
