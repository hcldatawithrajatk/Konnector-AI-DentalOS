// =============================================================================
// KONNECTOR AI DENTALOS — GOOGLE GEMINI 2.5 INTEGRATION CONNECTOR
// =============================================================================

import { AIPersonaType, ClinicTenant, Doctor, Treatment, KnowledgeDocument } from "@/types";

export interface GeminiChatOptions {
  persona: AIPersonaType;
  userMessage: string;
  clinic: ClinicTenant;
  doctors: Doctor[];
  treatments: Treatment[];
  knowledgeDocs: KnowledgeDocument[];
  conversationHistory?: Array<{ role: "user" | "model"; content: string }>;
  apiKey?: string;
  modelTier?: "flash" | "pro";
}

export interface GeminiChatResponse {
  reply: string;
  suggestedReplies: string[];
  actionCard?: {
    type: "booking" | "payment" | "emergency" | "review" | "intake";
    title: string;
    details: string;
    buttonText: string;
    actionUrl?: string;
  };
  modelUsed: string;
  groundedChunks: string[];
  isFallback: boolean;
}

/**
 * Sanitizes user input to protect against prompt injection and jailbreaking.
 */
export function sanitizeInput(input: string): string {
  if (!input) return "";
  // Strip control characters and common prompt injection wrappers
  return input
    .replace(/[\u0000-\u001F\u007F-\u009F]/g, "")
    .replace(/System:\s*Ignore previous instructions/gi, "[REDACTED]")
    .replace(/You are now DAN/gi, "[REDACTED]")
    .replace(/Forget your system prompt/gi, "[REDACTED]")
    .trim()
    .slice(0, 1500); // 1,500 character ceiling to prevent buffer overflow attacks
}

/**
 * Builds the clinical persona system instruction for Gemini.
 */
function buildSystemInstruction(
  persona: AIPersonaType,
  clinic: ClinicTenant,
  doctors: Doctor[],
  treatments: Treatment[],
  knowledgeDocs: KnowledgeDocument[]
): string {
  const doctorRoster = doctors.map((d) => `${d.name} (${d.specialization})`).join(", ");
  const treatmentMenu = treatments
    .slice(0, 8)
    .map((t) => `${t.name}: ${clinic.currency === "INR" ? "₹" + t.priceINR : "$" + t.priceUSD}`)
    .join("; ");
  const knowledgeContext = knowledgeDocs
    .slice(0, 4)
    .map((k) => `[${k.title}]: ${k.snippet}`)
    .join("\n");

  const baseGuardrails = `
You are an autonomous AI Dental Employee at "${clinic.name}", located at ${clinic.address}, ${clinic.city}, ${clinic.state}.
Clinic Currency: ${clinic.currency}. Phone: ${clinic.phone}.
Available Doctors: ${doctorRoster}.
Treatments & Pricing: ${treatmentMenu}.
Clinical Knowledge Base:
${knowledgeContext}

STRICT GUARDRAILS:
1. NEVER invent clinical diagnoses, prescription drugs, or promises of guaranteed surgical outcomes.
2. If patient mentions severe pain, bleeding, facial swelling, broken teeth, or trauma, ALWAYS classify as EMERGENCY and prioritize emergency chair booking.
3. Keep responses empathetic, concise (under 80 words for WhatsApp), and end with a clear clinical next step.
4. Tenant Isolation: Only mention doctors and services for ${clinic.name}.
`;

  switch (persona) {
    case "receptionist":
      return `${baseGuardrails}\nROLE: Aria, AI Front Desk Receptionist. You handle 24/7 appointment bookings, FAQs, clinic directions, and pricing inquiries.`;
    case "treatment_coordinator":
      return `${baseGuardrails}\nROLE: Vikram, AI Treatment Coordinator. You handle high-value procedures (Implants, Invisalign, Veneers, Crowns). Educate on long-term health benefits, transparent fee schedules, and flexible payment plans.`;
    case "recall_manager":
      return `${baseGuardrails}\nROLE: Maya, AI Patient Recall Manager. You reach out for 6-month preventive hygiene cleanings and post-treatment checkups.`;
    case "insurance_coordinator":
      return `${baseGuardrails}\nROLE: Marcus, AI Insurance Coordinator. You verify US dental PPOs (Delta, MetLife, Cigna) and India GST corporate reimbursement policies.`;
    case "billing_assistant":
      return `${baseGuardrails}\nROLE: Pooja, AI Billing & Collections Assistant. You assist patients in reviewing digital estimates, paying via UPI/Stripe, and setting up split payment plans.`;
    case "patient_care":
      return `${baseGuardrails}\nROLE: Elena, AI Post-Op Patient Care Coordinator. You check on patient recovery 24-48 hours after clinical procedures.`;
    default:
      return baseGuardrails;
  }
}

/**
 * Main Gemini inference dispatcher.
 * Calls Google Gemini 2.5 Flash / Pro REST API if key is available,
 * otherwise falls back cleanly to deterministic clinical heuristics.
 */
export async function invokeGeminiChat(options: GeminiChatOptions): Promise<GeminiChatResponse> {
  const {
    persona,
    userMessage,
    clinic,
    doctors,
    treatments,
    knowledgeDocs,
    apiKey = process.env.GEMINI_API_KEY,
    modelTier = persona === "treatment_coordinator" ? "pro" : "flash",
  } = options;

  const cleanMessage = sanitizeInput(userMessage);
  const modelName = modelTier === "pro" ? "gemini-2.5-pro" : "gemini-2.5-flash";
  const systemInstruction = buildSystemInstruction(persona, clinic, doctors, treatments, knowledgeDocs);

  // If Gemini API Key is configured, make real live network call
  if (apiKey && apiKey !== "AIzaSy_YOUR_GEMINI_KEY" && apiKey.startsWith("AIzaSy")) {
    try {
      const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${apiKey}`;
      const payload = {
        contents: [
          {
            role: "user",
            parts: [{ text: `${systemInstruction}\n\nPatient Message: ${cleanMessage}` }],
          },
        ],
        generationConfig: {
          temperature: 0.3,
          maxOutputTokens: 300,
          topP: 0.8,
        },
      };

      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        const data = await res.json();
        const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
        if (text) {
          return {
            reply: text.trim(),
            suggestedReplies: ["Book an Appointment", "Check Doctor Availability", "View Pricing Guide"],
            modelUsed: modelName,
            groundedChunks: knowledgeDocs.slice(0, 2).map((k) => k.title),
            isFallback: false,
          };
        }
      }
    } catch (err) {
      console.warn("Live Gemini API call failed, falling back to deterministic engine:", err);
    }
  }

  // Graceful fallback to deterministic clinical intelligence
  return fallbackClinicalEngine(persona, cleanMessage, clinic, doctors, treatments, knowledgeDocs);
}

function fallbackClinicalEngine(
  persona: AIPersonaType,
  message: string,
  clinic: ClinicTenant,
  doctors: Doctor[],
  treatments: Treatment[],
  knowledgeDocs: KnowledgeDocument[]
): GeminiChatResponse {
  const lower = message.toLowerCase();

  // Emergency Detection
  if (lower.includes("pain") || lower.includes("bleeding") || lower.includes("swelling") || lower.includes("broken") || lower.includes("emergency")) {
    return {
      reply: `🚨 Priority Dental Care: I notice you are experiencing clinical discomfort. At ${clinic.name}, our priority is getting you out of pain fast. Our emergency slot with ${doctors[0]?.name || "our on-call specialist"} is ready for you today.`,
      suggestedReplies: ["Reserve Immediate Emergency Slot", "Speak with Doctor Directly", "Get Clinic Directions"],
      actionCard: {
        type: "emergency",
        title: "Immediate Emergency Appointment",
        details: `Clinic: ${clinic.address} • Phone: ${clinic.phone}`,
        buttonText: "Confirm Emergency Chair Allocation",
      },
      modelUsed: "gemini-2.5-flash (Deterministic Fallback)",
      groundedChunks: ["Dental Emergency Triage Protocols"],
      isFallback: true,
    };
  }

  // Booking Detection
  if (lower.includes("book") || lower.includes("appointment") || lower.includes("consult") || lower.includes("slot")) {
    return {
      reply: `I would be happy to schedule your consultation at ${clinic.name}! Dr. ${doctors[0]?.name || "Dentist"} has morning and afternoon slots available this week.\n\nWhich day or time works best for you?`,
      suggestedReplies: [`Book with ${doctors[0]?.name || "Doctor"} (Morning)`, "Check Weekend Availability", "View Treatment Fees"],
      actionCard: {
        type: "booking",
        title: "Select Preferred Appointment Time",
        details: `Duration: 30 mins • Location: ${clinic.address}`,
        buttonText: "Choose Available Time Slot",
      },
      modelUsed: "gemini-2.5-flash (Deterministic Fallback)",
      groundedChunks: ["Appointment Scheduling Rules"],
      isFallback: true,
    };
  }

  // Default response
  return {
    reply: `Hello! This is Aria from ${clinic.name}. How can I assist with your dental health today? We offer comprehensive cleanings, cosmetic dentistry, implants, and 24/7 emergency care.`,
    suggestedReplies: ["Book an Appointment", "Explore Treatment Prices", "Ask a Dental Question"],
    modelUsed: "gemini-2.5-flash (Deterministic Fallback)",
    groundedChunks: knowledgeDocs.slice(0, 1).map((k) => k.title),
    isFallback: true,
  };
}
