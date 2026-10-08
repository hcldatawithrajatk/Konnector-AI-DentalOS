"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import {
  ClinicTenant,
  Doctor,
  Treatment,
  AIEmployee,
  PatientCRMRecord,
  Appointment,
  SmartQRCode,
  KnowledgeDocument,
  WorkflowAutomation,
  ReviewFeedback,
  PaymentTransaction,
  EmergencyTriageCase,
  AuditLog,
  QuickWinStats,
  CRMStage,
} from "@/types";
import {
  initialClinics,
  initialDoctors,
  initialTreatments,
  initialAIEmployees,
  initialCRMLeads,
  initialAppointments,
  initialSmartQRs,
  initialKnowledgeDocs,
  initialWorkflows,
  initialReviews,
  initialPayments,
  initialEmergencyCases,
  initialAuditLogs,
  initialQuickWinStats,
} from "@/lib/mockData";

interface DentalContextType {
  clinics: ClinicTenant[];
  activeClinic: ClinicTenant;
  setActiveClinicId: (id: string) => void;
  doctors: Doctor[];
  treatments: Treatment[];
  aiEmployees: AIEmployee[];
  crmLeads: PatientCRMRecord[];
  appointments: Appointment[];
  smartQRs: SmartQRCode[];
  knowledgeDocs: KnowledgeDocument[];
  workflows: WorkflowAutomation[];
  reviews: ReviewFeedback[];
  payments: PaymentTransaction[];
  emergencyCases: EmergencyTriageCase[];
  auditLogs: AuditLog[];
  stats: QuickWinStats;

  // Actions
  updateLeadStage: (leadId: string, stage: CRMStage) => void;
  updateAIEmployee: (employeeId: string, updates: Partial<AIEmployee>) => void;
  toggleWorkflow: (workflowId: string) => void;
  submitReview: (patientName: string, phone: string, score: number, feedback: string) => { destination: "google_review" | "internal_ticket"; review: ReviewFeedback };
  submitEmergencyCase: (data: { patientName: string; phone: string; symptoms: string[] }) => EmergencyTriageCase;
  recordPayment: (payment: Omit<PaymentTransaction, "id" | "createdAt" | "clinicId">) => void;
  createAppointment: (appointment: Omit<Appointment, "id" | "clinicId">) => Appointment;
  updateAppointmentStatus: (appointmentId: string, status: Appointment["status"]) => void;
  updateQRCodeStyle: (qrId: string, updates: Partial<SmartQRCode["customStyles"]>) => void;
  addKnowledgeDoc: (doc: Omit<KnowledgeDocument, "id" | "clinicId" | "lastUpdated">) => void;
  createOnboardedClinic: (data: any) => ClinicTenant;
  addLead: (lead: Omit<PatientCRMRecord, "id" | "clinicId" | "timeline">) => PatientCRMRecord;
}

const DentalContext = createContext<DentalContextType | undefined>(undefined);

export function DentalProvider({ children }: { children: React.ReactNode }) {
  const [clinics, setClinics] = useState<ClinicTenant[]>(initialClinics);
  const [activeClinicId, setActiveClinicId] = useState<string>("clinic-in-01");
  const [doctors, setDoctors] = useState<Doctor[]>(initialDoctors);
  const [treatments, setTreatments] = useState<Treatment[]>(initialTreatments);
  const [aiEmployees, setAIEmployees] = useState<AIEmployee[]>(initialAIEmployees);
  const [crmLeads, setCRMLeads] = useState<PatientCRMRecord[]>(initialCRMLeads);
  const [appointments, setAppointments] = useState<Appointment[]>(initialAppointments);
  const [smartQRs, setSmartQRs] = useState<SmartQRCode[]>(initialSmartQRs);
  const [knowledgeDocs, setKnowledgeDocs] = useState<KnowledgeDocument[]>(initialKnowledgeDocs);
  const [workflows, setWorkflows] = useState<WorkflowAutomation[]>(initialWorkflows);
  const [reviews, setReviews] = useState<ReviewFeedback[]>(initialReviews);
  const [payments, setPayments] = useState<PaymentTransaction[]>(initialPayments);
  const [emergencyCases, setEmergencyCases] = useState<EmergencyTriageCase[]>(initialEmergencyCases);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(initialAuditLogs);
  const [stats, setStats] = useState<QuickWinStats>(initialQuickWinStats);

  // Active clinic object
  const activeClinic = clinics.find((c) => c.id === activeClinicId) || clinics[0];

  // Filter items by active clinic
  const activeDoctors = doctors.filter((d) => d.clinicId === activeClinic.id);
  const activeTreatments = treatments.filter((t) => t.clinicId === activeClinic.id);
  const activeAIEmployees = aiEmployees.filter((e) => e.clinicId === activeClinic.id);
  const activeLeads = crmLeads.filter((l) => l.clinicId === activeClinic.id);
  const activeAppointments = appointments.filter((a) => a.clinicId === activeClinic.id);
  const activeQRs = smartQRs.filter((q) => q.clinicId === activeClinic.id);
  const activeKnowledge = knowledgeDocs.filter((k) => k.clinicId === activeClinic.id);
  const activeWorkflows = workflows.filter((w) => w.clinicId === activeClinic.id);
  const activeReviews = reviews.filter((r) => r.clinicId === activeClinic.id);
  const activePayments = payments.filter((p) => p.clinicId === activeClinic.id);
  const activeEmergencies = emergencyCases.filter((e) => e.clinicId === activeClinic.id);
  const activeLogs = auditLogs.filter((l) => l.clinicId === activeClinic.id);

  const addAuditLog = (action: string, module: string, details: string) => {
    const newLog: AuditLog = {
      id: `log-${Date.now()}`,
      clinicId: activeClinic.id,
      userId: "user-current",
      userName: "Dr. Admin / Manager",
      role: "Practice Manager",
      action,
      module,
      ipAddress: "127.0.0.1",
      device: "Admin Dashboard",
      timestamp: new Date().toISOString(),
      details,
    };
    setAuditLogs((prev) => [newLog, ...prev]);
  };

  const updateLeadStage = (leadId: string, stage: CRMStage) => {
    setCRMLeads((prev) =>
      prev.map((lead) => {
        if (lead.id === leadId) {
          const updated = {
            ...lead,
            status: stage,
            timeline: [
              {
                id: `t-${Date.now()}`,
                timestamp: new Date().toISOString(),
                actor: "System" as const,
                action: `Moved stage to ${stage.replace("_", " ").toUpperCase()}`,
              },
              ...lead.timeline,
            ],
          };
          return updated;
        }
        return lead;
      })
    );
    addAuditLog("Lead Stage Update", "Dental CRM", `Lead ${leadId} moved to ${stage}`);
  };

  const addLead = (lead: Omit<PatientCRMRecord, "id" | "clinicId" | "timeline">): PatientCRMRecord => {
    const newLead: PatientCRMRecord = {
      ...lead,
      id: `lead-${Date.now()}`,
      clinicId: activeClinic.id,
      timeline: [
        {
          id: `t-${Date.now()}`,
          timestamp: new Date().toISOString(),
          actor: "AI Receptionist",
          action: "Patient registered through Digital Intake QR",
        },
      ],
    };
    setCRMLeads((prev) => [newLead, ...prev]);
    setStats((prev) => ({ ...prev, leadsGenerated: prev.leadsGenerated + 1 }));
    addAuditLog("New Patient Lead Created", "Dental CRM", `Registered ${newLead.name}`);
    return newLead;
  };

  const updateAIEmployee = (employeeId: string, updates: Partial<AIEmployee>) => {
    setAIEmployees((prev) =>
      prev.map((emp) => (emp.id === employeeId ? { ...emp, ...updates } : emp))
    );
    addAuditLog("AI Employee Config Updated", "AI Workforce", `Updated settings for employee ${employeeId}`);
  };

  const toggleWorkflow = (workflowId: string) => {
    setWorkflows((prev) =>
      prev.map((wf) => (wf.id === workflowId ? { ...wf, isActive: !wf.isActive } : wf))
    );
    addAuditLog("Workflow Automation Toggled", "Workflows", `Toggled status for workflow ${workflowId}`);
  };

  const submitReview = (
    patientName: string,
    phone: string,
    score: number,
    feedback: string
  ) => {
    const destination: "google_review" | "internal_ticket" =
      score >= 8 ? "google_review" : "internal_ticket";
    const status: "Review Published" | "Ticket In Review" =
      destination === "google_review" ? "Review Published" : "Ticket In Review";

    const newReview: ReviewFeedback = {
      id: `rev-${Date.now()}`,
      clinicId: activeClinic.id,
      patientName,
      phone,
      score,
      feedbackText: feedback,
      destination,
      status,
      createdAt: new Date().toISOString(),
    };

    setReviews((prev) => [newReview, ...prev]);
    if (destination === "google_review") {
      setStats((prev) => ({
        ...prev,
        googleReviewsCollected: prev.googleReviewsCollected + 1,
      }));
    }
    addAuditLog(
      "Review Funnel Ingested",
      "AI Review Funnel",
      `Score ${score}/10 routed to ${destination}`
    );
    return { destination, review: newReview };
  };

  const submitEmergencyCase = (data: {
    patientName: string;
    phone: string;
    symptoms: string[];
  }): EmergencyTriageCase => {
    // Clinical urgency heuristic
    let score = 5;
    const sStr = data.symptoms.join(" ").toLowerCase();
    if (sStr.includes("trauma") || sStr.includes("bleeding") || sStr.includes("swelling") || sStr.includes("severe")) {
      score = 9;
    } else if (sStr.includes("broken") || sStr.includes("lost filling")) {
      score = 7;
    }

    const urgencyLevel: "Critical" | "High" | "Moderate" | "Low" =
      score >= 9 ? "Critical" : score >= 7 ? "High" : score >= 5 ? "Moderate" : "Low";

    const recommendedAction =
      urgencyLevel === "Critical"
        ? "Acute infection/trauma. Immediate emergency chair allocation with on-call doctor."
        : urgencyLevel === "High"
        ? "Priority same-day emergency slot offered within 3 hours."
        : "Standard next-available consultation.";

    const newCase: EmergencyTriageCase = {
      id: `em-${Date.now()}`,
      clinicId: activeClinic.id,
      patientName: data.patientName,
      phone: data.phone,
      symptoms: data.symptoms,
      urgencyScore: score,
      urgencyLevel,
      recommendedAction,
      emergencySlotOffered: true,
      status: "Doctor Escalated",
      createdAt: new Date().toISOString(),
    };

    setEmergencyCases((prev) => [newCase, ...prev]);
    addAuditLog("Dental Emergency Triaged", "Emergency Triage", `Urgency ${score}/10 (${urgencyLevel}) for ${data.patientName}`);
    return newCase;
  };

  const recordPayment = (
    payment: Omit<PaymentTransaction, "id" | "createdAt" | "clinicId">
  ) => {
    const newPayment: PaymentTransaction = {
      ...payment,
      id: `pay-${Date.now()}`,
      clinicId: activeClinic.id,
      createdAt: new Date().toISOString(),
    };
    setPayments((prev) => [newPayment, ...prev]);
    setStats((prev) => ({
      ...prev,
      paymentsCollected: prev.paymentsCollected + payment.amount,
      revenueInfluenced: prev.revenueInfluenced + payment.amount,
    }));
    addAuditLog("Payment Recorded", "Billing Engine", `Collected ${payment.amount} ${payment.currency} via ${payment.method}`);
  };

  const createAppointment = (
    appointment: Omit<Appointment, "id" | "clinicId">
  ): Appointment => {
    const newApt: Appointment = {
      ...appointment,
      id: `apt-${Date.now()}`,
      clinicId: activeClinic.id,
    };
    setAppointments((prev) => [newApt, ...prev]);
    setStats((prev) => ({
      ...prev,
      appointmentsBooked: prev.appointmentsBooked + 1,
    }));
    addAuditLog("Appointment Scheduled", "Appointments", `Booked for ${appointment.patientName} with ${appointment.doctorName}`);
    return newApt;
  };

  const updateAppointmentStatus = (
    appointmentId: string,
    status: Appointment["status"]
  ) => {
    setAppointments((prev) =>
      prev.map((a) => (a.id === appointmentId ? { ...a, status } : a))
    );
    addAuditLog("Appointment Status Updated", "Appointments", `Appointment ${appointmentId} updated to ${status}`);
  };

  const updateQRCodeStyle = (
    qrId: string,
    updates: Partial<SmartQRCode["customStyles"]>
  ) => {
    setSmartQRs((prev) =>
      prev.map((q) =>
        q.id === qrId
          ? { ...q, customStyles: { ...q.customStyles, ...updates } }
          : q
      )
    );
    addAuditLog("QR Code Customized", "Smart QR Hub", `Updated styles for QR ${qrId}`);
  };

  const addKnowledgeDoc = (
    doc: Omit<KnowledgeDocument, "id" | "clinicId" | "lastUpdated">
  ) => {
    const newDoc: KnowledgeDocument = {
      ...doc,
      id: `doc-k-${Date.now()}`,
      clinicId: activeClinic.id,
      lastUpdated: new Date().toISOString().split("T")[0],
    };
    setKnowledgeDocs((prev) => [newDoc, ...prev]);
    addAuditLog("Knowledge Document Uploaded", "RAG Knowledge Base", `Indexed ${doc.title} (${doc.chunksCount} chunks)`);
  };

  const createOnboardedClinic = (data: any): ClinicTenant => {
    const newClinicId = `clinic-custom-${Date.now()}`;
    const newSlug = data.name.toLowerCase().replace(/[^a-z0-9]+/g, "-");

    const newClinic: ClinicTenant = {
      id: newClinicId,
      name: data.name || "Modern Dental Care",
      tagline: data.tagline || "Advanced AI-Powered Dental Excellence",
      slug: newSlug,
      logoUrl: data.logoUrl || "https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=150&auto=format&fit=crop&q=80",
      brandColor: data.brandColor || "#0d9488",
      region: data.region || "IN",
      address: data.address || "123 Healthcare Boulevard",
      city: data.city || (data.region === "US" ? "New York" : "Mumbai"),
      state: data.state || (data.region === "US" ? "NY" : "MH"),
      website: data.website || "https://dentalcare.example.com",
      locationsCount: Number(data.locationsCount) || 1,
      timeZone: data.timeZone || (data.region === "US" ? "America/New_York" : "Asia/Kolkata"),
      currency: data.region === "US" ? "USD" : "INR",
      phone: data.phone || "+1 555 123 4567",
      whatsappNumber: data.whatsappNumber || "+1 555 123 4567",
      connectedCalendar: data.connectedCalendar || "google",
      complianceMode: data.region === "US" ? "hipaa" : "india_gst",
      gstNumber: data.gstNumber,
      npiNumber: data.npiNumber,
      rating: 5.0,
      reviewCount: 1,
      onboardingCompleted: true,
      createdAt: new Date().toISOString(),
    };

    // Add clinic
    setClinics((prev) => [newClinic, ...prev]);

    // Create doctors for this clinic
    const customDocs: Doctor[] = (data.doctors && data.doctors.length > 0)
      ? data.doctors.map((d: any, idx: number) => ({
          id: `doc-${newClinicId}-${idx}`,
          clinicId: newClinicId,
          name: d.name,
          title: d.title || "Lead Dentist",
          specialization: d.specialization || "General Dentistry",
          availability: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
          appointmentDurationMinutes: Number(d.duration) || 30,
          avatarUrl: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=120&auto=format&fit=crop&q=80",
          bio: "Dedicated dental professional delivering personalized, gentle care.",
          active: true,
        }))
      : [
          {
            id: `doc-${newClinicId}-0`,
            clinicId: newClinicId,
            name: "Dr. Clinic Lead",
            title: "Principal Dentist",
            specialization: "Comprehensive & Aesthetic Dentistry",
            availability: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
            appointmentDurationMinutes: 30,
            avatarUrl: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=120&auto=format&fit=crop&q=80",
            bio: "Experienced clinician leveraging modern digital workflows.",
            active: true,
          },
        ];
    setDoctors((prev) => [...customDocs, ...prev]);

    // Create treatments
    const customTreatments: Treatment[] = (data.treatments && data.treatments.length > 0)
      ? data.treatments.map((t: any, idx: number) => ({
          id: `treat-${newClinicId}-${idx}`,
          clinicId: newClinicId,
          name: t.name,
          category: t.category || "Preventive",
          priceINR: Number(t.priceINR) || 2500,
          priceUSD: Number(t.priceUSD) || 150,
          insuranceCovered: true,
          durationMinutes: 45,
          description: t.description || "State of the art clinical treatment.",
          acceptanceRate: 85,
        }))
      : initialTreatments.map((t, idx) => ({
          ...t,
          id: `treat-${newClinicId}-${idx}`,
          clinicId: newClinicId,
        }));
    setTreatments((prev) => [...customTreatments, ...prev]);

    // Create 6 AI Employees for new clinic
    const newAIEmps: AIEmployee[] = initialAIEmployees.map((emp, idx) => ({
      ...emp,
      id: `emp-${newClinicId}-${idx}`,
      clinicId: newClinicId,
      prompt: emp.prompt.replace("Apex Dental Studio", newClinic.name),
    }));
    setAIEmployees((prev) => [...newAIEmps, ...prev]);

    // Create default 4 Starter QRs instantly
    const newQRs: SmartQRCode[] = [
      {
        id: `qr-${newClinicId}-1`,
        clinicId: newClinicId,
        type: "universal",
        title: "Universal Smart Clinic QR",
        subtitle: "One QR for Everything: Booking, WhatsApp, Payments & Reviews",
        targetUrl: `/portal/${newClinicId}/hub`,
        scansCount: 0,
        conversionsCount: 0,
        revenueGenerated: 0,
        customStyles: {
          fgColor: newClinic.brandColor,
          bgColor: "#ffffff",
          frameStyle: "poster",
          ctaText: `SCAN FOR ${newClinic.name.toUpperCase()} HUB`,
        },
      },
      {
        id: `qr-${newClinicId}-2`,
        clinicId: newClinicId,
        type: "whatsapp",
        title: "WhatsApp Connect QR",
        subtitle: "Scan to start 24x7 AI Dental Receptionist on WhatsApp",
        targetUrl: `https://wa.me/${newClinic.whatsappNumber.replace(/[^0-9]/g, "")}?text=Hi%20${encodeURIComponent(newClinic.name)},%20I%20would%20like%20to%20book%20an%20appointment`,
        scansCount: 0,
        conversionsCount: 0,
        revenueGenerated: 0,
        customStyles: {
          fgColor: "#059669",
          bgColor: "#ffffff",
          frameStyle: "callout",
          ctaText: "CHAT WITH AI RECEPTIONIST ON WHATSAPP",
        },
      },
      {
        id: `qr-${newClinicId}-3`,
        clinicId: newClinicId,
        type: "review",
        title: "AI Google Review QR",
        subtitle: "Automated NPS review filter: 8-10 to Google, 1-7 to Private Clinic Care",
        targetUrl: `/portal/${newClinicId}/review`,
        scansCount: 0,
        conversionsCount: 0,
        revenueGenerated: 0,
        customStyles: {
          fgColor: newClinic.brandColor,
          bgColor: "#ffffff",
          frameStyle: "badge",
          ctaText: "RATE YOUR 5-STAR VISIT",
        },
      },
      {
        id: `qr-${newClinicId}-4`,
        clinicId: newClinicId,
        type: "payment",
        title: "Touchless Instant Payment QR",
        subtitle: "India UPI / Razorpay / US Stripe touchless payment stand",
        targetUrl: `/portal/${newClinicId}/pay`,
        scansCount: 0,
        conversionsCount: 0,
        revenueGenerated: 0,
        customStyles: {
          fgColor: "#0f172a",
          bgColor: "#ffffff",
          frameStyle: "callout",
          ctaText: newClinic.region === "US" ? "SCAN TO PAY VIA STRIPE / CARD" : "SCAN TO PAY VIA UPI / QR",
        },
      },
    ];
    setSmartQRs((prev) => [...newQRs, ...prev]);

    // Create default workflows
    const newWorkflows: WorkflowAutomation[] = initialWorkflows.map((w, idx) => ({
      ...w,
      id: `wf-${newClinicId}-${idx}`,
      clinicId: newClinicId,
      runsCount: 0,
    }));
    setWorkflows((prev) => [...newWorkflows, ...prev]);

    // Switch to new clinic immediately
    setActiveClinicId(newClinicId);
    addAuditLog("Clinic Onboarded & Launched", "Onboarding Wizard", `Successfully launched ${newClinic.name}`);

    return newClinic;
  };

  return (
    <DentalContext.Provider
      value={{
        clinics,
        activeClinic,
        setActiveClinicId,
        doctors: activeDoctors,
        treatments: activeTreatments,
        aiEmployees: activeAIEmployees,
        crmLeads: activeLeads,
        appointments: activeAppointments,
        smartQRs: activeQRs,
        knowledgeDocs: activeKnowledge,
        workflows: activeWorkflows,
        reviews: activeReviews,
        payments: activePayments,
        emergencyCases: activeEmergencies,
        auditLogs: activeLogs,
        stats,
        updateLeadStage,
        updateAIEmployee,
        toggleWorkflow,
        submitReview,
        submitEmergencyCase,
        recordPayment,
        createAppointment,
        updateAppointmentStatus,
        updateQRCodeStyle,
        addKnowledgeDoc,
        createOnboardedClinic,
        addLead,
      }}
    >
      {children}
    </DentalContext.Provider>
  );
}

export function useDentalOS() {
  const context = useContext(DentalContext);
  if (!context) {
    throw new Error("useDentalOS must be used within a DentalProvider");
  }
  return context;
}
