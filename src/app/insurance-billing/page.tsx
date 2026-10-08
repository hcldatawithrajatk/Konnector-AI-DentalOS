"use client";

import React, { useState } from "react";
import { useDentalOS } from "@/context/DentalContext";
import { formatCurrency, formatDate } from "@/lib/utils";
import {
  CreditCard,
  ShieldCheck,
  CheckCircle2,
  FileText,
  DollarSign,
  Plus,
  Send,
  Building2,
  Sparkles,
  QrCode,
  AlertCircle,
  Receipt,
  X,
} from "lucide-react";

export default function InsuranceBillingPage() {
  const { activeClinic, payments, recordPayment, crmLeads } = useDentalOS();

  const isUS = activeClinic.region === "US";
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  // New payment form states
  const [payPatientName, setPayPatientName] = useState("");
  const [payTreatmentName, setPayTreatmentName] = useState("Dental Cleaning & Ultrasonic Scaling");
  const [payAmount, setPayAmount] = useState<number>(isUS ? 150 : 2500);
  const [payMethod, setPayMethod] = useState<any>(isUS ? "Stripe" : "UPI");

  // US Insurance Mock Verification Queue
  const [insuranceQueue, setInsuranceQueue] = useState([
    {
      id: "ins-1",
      patientName: "Sarah Jenkins",
      provider: "Delta Dental Premier",
      memberId: "DD-99281726",
      groupNumber: "GRP-40112",
      status: "Verified",
      annualMax: "$1,500",
      deductibleMet: "$50 / $50 Met",
      preventiveCoverage: "100%",
      restorativeCoverage: "80%",
      orthoCoverage: "50%",
      verifiedBy: "Marcus (AI Insurance Coordinator)",
    },
    {
      id: "ins-2",
      patientName: "David Miller",
      provider: "MetLife Dental PPO",
      memberId: "MET-881920",
      groupNumber: "GRP-20914",
      status: "Verified",
      annualMax: "$2,000",
      deductibleMet: "$0 / $50 Unmet",
      preventiveCoverage: "100%",
      restorativeCoverage: "80%",
      orthoCoverage: "0%",
      verifiedBy: "Marcus (AI Insurance Coordinator)",
    },
    {
      id: "ins-3",
      patientName: "Jessica Lee",
      provider: "Cigna Dental DPPO",
      memberId: "CIG-331092",
      groupNumber: "GRP-77211",
      status: "Pending Document Upload",
      annualMax: "Pending",
      deductibleMet: "Pending",
      preventiveCoverage: "Pending",
      restorativeCoverage: "Pending",
      orthoCoverage: "Pending",
      verifiedBy: "Marcus (AI Insurance Coordinator)",
    },
  ]);

  const handleCreatePayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!payPatientName) return;

    recordPayment({
      patientName: payPatientName,
      treatmentName: payTreatmentName,
      amount: Number(payAmount),
      currency: activeClinic.currency,
      method: payMethod,
      status: "Completed",
      invoiceNumber: `INV-${Date.now().toString().slice(-6)}`,
      gstNumber: activeClinic.gstNumber,
    });

    setShowPaymentModal(false);
    setPayPatientName("");
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-800 text-xs font-semibold mb-1">
            <CreditCard className="w-3.5 h-3.5 text-indigo-600" />
            <span>
              {isUS ? "US Insurance Verification & Stripe Rails" : "India GST Invoicing & Instant UPI Engine"}
            </span>
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            {isUS ? "US Insurance & Payments Module" : "India Payments & GST Invoicing"}
          </h2>
          <p className="text-xs text-slate-500">
            {isUS
              ? "Real-time eligibility verification for Delta Dental, MetLife, Cigna, Guardian + Stripe touchless checkout."
              : "GST compliant B2C/B2B tax invoices, instant UPI QR links, and Razorpay automated settlement."}
          </p>
        </div>

        <button
          onClick={() => setShowPaymentModal(true)}
          className="flex items-center gap-1.5 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition shadow-sm"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>+ Dispatch Instant Payment Link</span>
        </button>
      </div>

      {/* US INSURANCE SECTION (Visible for US practices) */}
      {isUS && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-indigo-600" />
              <div>
                <h3 className="font-bold text-slate-900 text-sm">
                  US Insurance Real-Time Verification (AI Coordinator Marcus)
                </h3>
                <p className="text-xs text-slate-500">
                  Automated electronic EDI 270/271 eligibility inquiries for major US dental payers.
                </p>
              </div>
            </div>
            <span className="text-xs font-bold px-2.5 py-1 bg-indigo-50 text-indigo-700 rounded-full">
              HIPAA Compliant Mode
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {insuranceQueue.map((item) => (
              <div
                key={item.id}
                className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2 text-xs"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900">{item.patientName}</span>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      item.status === "Verified" ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-800"
                    }`}
                  >
                    {item.status}
                  </span>
                </div>

                <div className="text-slate-600 font-medium">
                  {item.provider} • ID: <span className="font-mono">{item.memberId}</span>
                </div>

                <div className="pt-2 border-t border-slate-200 grid grid-cols-3 gap-1 text-[11px]">
                  <div>
                    <span className="text-slate-400 block text-[9px] uppercase">Annual Max</span>
                    <span className="font-bold text-slate-800">{item.annualMax}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[9px] uppercase">Preventive</span>
                    <span className="font-bold text-emerald-600">{item.preventiveCoverage}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[9px] uppercase">Restorative</span>
                    <span className="font-bold text-slate-800">{item.restorativeCoverage}</span>
                  </div>
                </div>

                <div className="text-[10px] text-slate-400 pt-1">
                  Verified by: <span className="font-semibold text-slate-600">{item.verifiedBy}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* INDIA GST & INVOICING BANNER (Visible for India practices) */}
      {!isUS && (
        <div className="bg-gradient-to-r from-teal-50 to-emerald-50 rounded-2xl border border-teal-200 p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-600 text-white flex items-center justify-center font-bold">
              <Receipt className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-sm">
                India GST & Dynamic UPI QR Compliance Active
              </h3>
              <p className="text-xs text-slate-600 mt-0.5">
                GSTIN: <span className="font-mono font-bold">{activeClinic.gstNumber}</span> • SAC Code 999312
                (Dental Healthcare Services). Zero tax liability on dental medical treatment.
              </p>
            </div>
          </div>
          <span className="px-3 py-1 bg-white border border-teal-300 text-teal-800 text-xs font-bold rounded-lg self-start sm:self-auto shadow-xs">
            100% Tax Compliant
          </span>
        </div>
      )}

      {/* Recent Payments & Collections Table */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-slate-900">Recent Payment Transactions & Invoices</h3>
          <span className="text-xs text-slate-500">Auto-reconciled via Webhook</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 text-slate-500 font-bold uppercase text-[10px] tracking-wider border-y border-slate-200">
              <tr>
                <th className="py-3 px-4">Invoice #</th>
                <th className="py-3 px-4">Patient Name</th>
                <th className="py-3 px-4">Treatment</th>
                <th className="py-3 px-4">Payment Method</th>
                <th className="py-3 px-4 text-right">Amount</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {payments.map((p) => (
                <tr key={p.id} className="hover:bg-slate-50/80 transition">
                  <td className="py-3 px-4 font-mono font-bold text-teal-700">{p.invoiceNumber}</td>
                  <td className="py-3 px-4 font-bold text-slate-900">{p.patientName}</td>
                  <td className="py-3 px-4 text-slate-600">{p.treatmentName}</td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 font-semibold text-[10px]">
                      {p.method}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right font-mono font-bold text-emerald-600">
                    {formatCurrency(p.amount, p.currency)}
                  </td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                      {p.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-slate-400">{formatDate(p.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Payment Link Modal */}
      {showPaymentModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-sm">Create & Dispatch Payment Link</h3>
              <button onClick={() => setShowPaymentModal(false)}>
                <X className="w-4 h-4 text-slate-400 hover:text-slate-700" />
              </button>
            </div>

            <form onSubmit={handleCreatePayment} className="space-y-3.5 mt-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Patient Full Name *</label>
                <input
                  type="text"
                  required
                  value={payPatientName}
                  onChange={(e) => setPayPatientName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-teal-500 focus:outline-none"
                  placeholder="e.g. Ramesh Patel"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Treatment Description</label>
                <input
                  type="text"
                  value={payTreatmentName}
                  onChange={(e) => setPayTreatmentName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-teal-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Amount Due ({activeClinic.currency}) *
                </label>
                <input
                  type="number"
                  required
                  value={payAmount}
                  onChange={(e) => setPayAmount(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-teal-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Payment Rail</label>
                <select
                  value={payMethod}
                  onChange={(e) => setPayMethod(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white"
                >
                  {isUS ? (
                    <>
                      <option value="Stripe">Stripe Card Payment</option>
                      <option value="ACH">ACH Bank Debit</option>
                      <option value="CareCredit">CareCredit Financing</option>
                    </>
                  ) : (
                    <>
                      <option value="UPI">Instant UPI QR Link</option>
                      <option value="Razorpay">Razorpay Gateway</option>
                      <option value="PhonePe">PhonePe / Paytm</option>
                    </>
                  )}
                </select>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowPaymentModal(false)}
                  className="px-3.5 py-2 border border-slate-200 rounded-xl text-slate-700 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold transition shadow-sm"
                >
                  Record & Send WhatsApp Receipt
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
