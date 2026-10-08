export type Region = "IN" | "US";

export type ComplianceMode = "hipaa" | "india_gst";

export interface ClinicTenant {
  id: string;
  name: string;
  tagline: string;
  slug: string;
  logoUrl: string;
  brandColor: string;
  region: Region;
  address: string;
  city: string;
  state: string;
  website: string;
  locationsCount: number;
  timeZone: string;
  currency: "INR" | "USD";
  phone: string;
  whatsappNumber: string;
  connectedCalendar: "google" | "outlook" | null;
  complianceMode: ComplianceMode;
  gstNumber?: string;
  npiNumber?: string;
  rating: number;
  reviewCount: number;
  googlePlaceId?: string;
  onboardingCompleted: boolean;
  createdAt: string;
}

export interface Doctor {
  id: string;
  clinicId: string;
  name: string;
  title: string;
  specialization: string;
  availability: string[];
  appointmentDurationMinutes: number;
  avatarUrl: string;
  bio: string;
  active: boolean;
}

export interface Treatment {
  id: string;
  clinicId: string;
  name: string;
  category: "Preventive" | "Restorative" | "Cosmetic" | "Orthodontics" | "Surgical" | "Endodontics";
  priceINR: number;
  priceUSD: number;
  insuranceCovered: boolean;
  durationMinutes: number;
  description: string;
  acceptanceRate: number;
}

export type AIPersonaType =
  | "receptionist"
  | "treatment_coordinator"
  | "recall_manager"
  | "insurance_coordinator"
  | "billing_assistant"
  | "patient_care";

export interface AIEmployee {
  id: string;
  clinicId: string;
  persona: AIPersonaType;
  name: string;
  roleTitle: string;
  status: "active" | "training" | "paused";
  avatar: string;
  temperature: number;
  prompt: string;
  confidenceThreshold: number;
  workingHours: string;
  escalationRules: string;
  toneOfVoice: "Warm & Empathetic" | "Professional & Direct" | "Concise & Reassuring";
  conversationsHandled: number;
  resolutionRate: number;
  keyResponsibilities: string[];
}

export type CRMStage =
  | "new_lead"
  | "ai_qualified"
  | "consultation_scheduled"
  | "treatment_proposed"
  | "treatment_accepted"
  | "in_progress"
  | "completed"
  | "won"
  | "lost";

export interface PatientCRMRecord {
  id: string;
  clinicId: string;
  name: string;
  phone: string;
  email: string;
  dob: string;
  gender: "Male" | "Female" | "Other";
  status: CRMStage;
  leadScore: number;
  treatmentIntentScore: number;
  treatmentInterest: string;
  estimatedValue: number;
  preferredDoctorId: string;
  lastContactDate: string;
  nextRecallDate?: string;
  insuranceProvider?: string;
  insuranceMemberId?: string;
  verificationStatus?: "Verified" | "Pending" | "Unverified" | "Not Applicable";
  medicalAlerts: string[];
  digitalIntakeCompleted: boolean;
  digitalConsentSigned?: boolean;
  timeline: {
    id: string;
    timestamp: string;
    actor: "AI Receptionist" | "AI Coordinator" | "Dentist" | "Patient" | "System";
    action: string;
    details?: string;
  }[];
}

export interface Appointment {
  id: string;
  clinicId: string;
  patientId: string;
  patientName: string;
  phone: string;
  doctorId: string;
  doctorName: string;
  treatmentName: string;
  dateTime: string;
  durationMinutes: number;
  status: "confirmed" | "pending" | "reminded_48h" | "reminded_24h" | "reminded_2h" | "completed" | "cancelled" | "no_show";
  channel: "WhatsApp AI" | "Smart QR" | "Website" | "Front Desk";
  notes?: string;
}

export type QRType =
  | "universal"
  | "whatsapp"
  | "review"
  | "payment"
  | "appointment"
  | "intake"
  | "referral"
  | "treatment_plan"
  | "emergency"
  | "doctor"
  | "chair";

export interface SmartQRCode {
  id: string;
  clinicId: string;
  type: QRType;
  title: string;
  subtitle: string;
  targetUrl: string;
  scansCount: number;
  conversionsCount: number;
  revenueGenerated: number;
  customStyles: {
    fgColor: string;
    bgColor: string;
    frameStyle: "simple" | "badge" | "callout" | "poster";
    ctaText: string;
  };
  locationTag?: string;
}

export interface KnowledgeDocument {
  id: string;
  clinicId: string;
  title: string;
  fileType: "pdf" | "docx" | "url" | "brochure" | "faq" | "policy";
  fileSize: string;
  chunksCount: number;
  vectorStatus: "indexed" | "processing" | "error";
  tags: string[];
  lastUpdated: string;
  snippet: string;
}

export interface WorkflowNode {
  id: string;
  type: "trigger" | "condition" | "action" | "delay";
  title: string;
  description: string;
}

export interface WorkflowAutomation {
  id: string;
  clinicId: string;
  name: string;
  title?: string;
  description?: string;
  category: "Patient Journey" | "Recall" | "Billing" | "Review" | "No-Show";
  trigger: string;
  condition: string;
  action: string;
  isActive: boolean;
  runsCount: number;
  conversionRate: number;
  nodes?: WorkflowNode[];
}

export interface ReviewFeedback {
  id: string;
  clinicId: string;
  patientName: string;
  phone: string;
  score: number; // 1 - 10
  feedbackText: string;
  destination: "google_review" | "internal_ticket";
  status: "Review Published" | "Ticket In Review" | "Resolved";
  createdAt: string;
}

export interface PaymentTransaction {
  id: string;
  clinicId: string;
  patientName: string;
  treatmentName: string;
  amount: number;
  currency: "INR" | "USD";
  method: "UPI" | "Razorpay" | "PhonePe" | "Paytm" | "Stripe" | "Credit Card" | "ACH" | "CareCredit";
  status: "Completed" | "Pending" | "Failed";
  invoiceNumber: string;
  gstNumber?: string;
  createdAt: string;
}

export interface EmergencyTriageCase {
  id: string;
  clinicId: string;
  patientName: string;
  phone: string;
  symptoms: string[];
  urgencyScore: number; // 1-10
  urgencyLevel: "Critical" | "High" | "Moderate" | "Low";
  recommendedAction: string;
  emergencySlotOffered: boolean;
  status: "Triaged" | "Doctor Escalated" | "Booked" | "Resolved";
  createdAt: string;
}

export interface AuditLog {
  id: string;
  clinicId: string;
  userId: string;
  userName: string;
  role: string;
  action: string;
  module: string;
  ipAddress: string;
  device: string;
  timestamp: string;
  details: string;
}

export interface QuickWinStats {
  leadsGenerated: number;
  whatsappConversations: number;
  appointmentsBooked: number;
  googleReviewsCollected: number;
  paymentsCollected: number;
  revenueInfluenced: number;
  aiConversationsResolved: number;
  roiMultiplier: number;
  hoursSaved: number;
}
