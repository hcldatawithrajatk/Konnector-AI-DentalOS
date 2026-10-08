import { ClinicTenant, Doctor, Treatment, KnowledgeDocument, AIPersonaType } from "@/types";

export interface AIChatMessage {
  id: string;
  sender: "user" | "ai" | "system" | "human_agent";
  text: string;
  timestamp: string;
  suggestedReplies?: string[];
  actionCard?: {
    type: "booking" | "payment" | "emergency" | "review" | "intake";
    title: string;
    details: string;
    buttonText: string;
    actionUrl?: string;
  };
}

export function generateAIResponse(
  persona: AIPersonaType,
  userMessage: string,
  clinic: ClinicTenant,
  doctors: Doctor[],
  treatments: Treatment[],
  knowledgeDocs: KnowledgeDocument[]
): AIChatMessage {
  const lowerMsg = userMessage.toLowerCase();
  const timestamp = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  // 1. EMERGENCY CHECK
  if (
    lowerMsg.includes("emergency") ||
    lowerMsg.includes("bleeding") ||
    lowerMsg.includes("severe pain") ||
    lowerMsg.includes("swelling") ||
    lowerMsg.includes("broken tooth") ||
    lowerMsg.includes("accident")
  ) {
    return {
      id: `ai-${Date.now()}`,
      sender: "ai",
      text: `🚨 Urgent Attention: I detect you may be experiencing a dental emergency. Our on-call clinical team at ${clinic.name} is alerted.\n\nPlease keep head elevated and avoid hot/cold foods. Would you like our emergency slot reserved immediately?`,
      timestamp,
      suggestedReplies: ["Reserve Emergency Slot Now", "Speak to On-Call Doctor", "Call Clinic Directly"],
      actionCard: {
        type: "emergency",
        title: "Immediate Dental Emergency Care",
        details: `Priority On-Call Doctor: ${doctors[0]?.name || "Dr. On Call"}. Estimated wait: < 15 mins.`,
        buttonText: "Confirm Emergency Chair Allocation",
      },
    };
  }

  // 2. PERSONA-SPECIFIC LOGIC
  switch (persona) {
    case "receptionist": {
      if (lowerMsg.includes("book") || lowerMsg.includes("appointment") || lowerMsg.includes("consultation") || lowerMsg.includes("slot")) {
        const docNames = doctors.map((d) => d.name).join(" or ");
        return {
          id: `ai-${Date.now()}`,
          sender: "ai",
          text: `I'd be glad to schedule your visit at ${clinic.name}! We have openings this week with ${docNames}.\n\nWhich doctor or time of day (morning/afternoon) suits your schedule best?`,
          timestamp,
          suggestedReplies: [
            `Book with ${doctors[0]?.name || "Dentist"} (Morning)`,
            `Book with ${doctors[1]?.name || "Specialist"} (Afternoon)`,
            "Check weekend slots",
          ],
          actionCard: {
            type: "booking",
            title: "Quick Appointment Booking",
            details: `Duration: 30-45 mins • Location: ${clinic.address}`,
            buttonText: "Pick Preferred Slot",
          },
        };
      }

      if (lowerMsg.includes("cost") || lowerMsg.includes("price") || lowerMsg.includes("fee") || lowerMsg.includes("charges")) {
        const sampleTreatments = treatments.slice(0, 3);
        const feeList = sampleTreatments
          .map(
            (t) =>
              `• ${t.name}: ${clinic.currency === "INR" ? "₹" + t.priceINR.toLocaleString("en-IN") : "$" + t.priceUSD}`
          )
          .join("\n");

        return {
          id: `ai-${Date.now()}`,
          sender: "ai",
          text: `Here is our transparent price guide at ${clinic.name}:\n\n${feeList}\n\nWe also offer 0% interest flexible payment plans! Would you like a consultation for a personalized treatment plan?`,
          timestamp,
          suggestedReplies: ["Book Consultation", "Do you accept insurance?", "Explore 0% EMI"],
        };
      }

      if (lowerMsg.includes("location") || lowerMsg.includes("address") || lowerMsg.includes("where") || lowerMsg.includes("direction")) {
        return {
          id: `ai-${Date.now()}`,
          sender: "ai",
          text: `📍 We are located at:\n${clinic.address}, ${clinic.city}, ${clinic.state}.\n\n🕒 Timings: Mon-Sat 9:00 AM - 8:00 PM, Sunday by appointment. Valet parking is available.`,
          timestamp,
          suggestedReplies: ["Send Google Maps Pin", "Book an appointment", "Call Clinic"],
        };
      }

      if (lowerMsg.includes("doctor") || lowerMsg.includes("dentist") || lowerMsg.includes("specialist")) {
        const docDetails = doctors.map((d) => `• ${d.name} (${d.specialization})`).join("\n");
        return {
          id: `ai-${Date.now()}`,
          sender: "ai",
          text: `Our clinical team is led by top dental specialists:\n\n${docDetails}\n\nWho would you like to consult with?`,
          timestamp,
          suggestedReplies: doctors.map((d) => `Book with ${d.name}`),
        };
      }

      return {
        id: `ai-${Date.now()}`,
        sender: "ai",
        text: `Hello! I'm Aria, your 24/7 AI Receptionist at ${clinic.name}. How can I assist you with your dental health today?`,
        timestamp,
        suggestedReplies: [
          "Book an Appointment",
          "Check Treatment Pricing",
          "Inquire about Dental Implants / Invisalign",
          "Insurance & Payment Options",
        ],
      };
    }

    case "treatment_coordinator": {
      if (lowerMsg.includes("implant") || lowerMsg.includes("missing tooth")) {
        return {
          id: `ai-${Date.now()}`,
          sender: "ai",
          text: `Dental Implants are the gold standard for restoring missing teeth with lifelong durability and natural chewing function. At ${clinic.name}, we use 3D CBCT guided computer planning for virtually painless placement.\n\nWe provide a lifetime manufacturer warranty and convenient 0% interest EMI from ${
            clinic.currency === "INR" ? "₹3,200/month" : "$149/month"
          }.\n\nWould you like to review our before-and-after smile transformations?`,
          timestamp,
          suggestedReplies: ["Show Before & After Cases", "Calculate My Monthly EMI", "Book 3D CBCT Scan"],
          actionCard: {
            type: "booking",
            title: "Comprehensive Implant Assessment",
            details: "Includes 3D digital bone scan & personalized surgical plan",
            buttonText: "Schedule Implant Consultation",
          },
        };
      }

      if (lowerMsg.includes("invisalign") || lowerMsg.includes("braces") || lowerMsg.includes("aligner")) {
        return {
          id: `ai-${Date.now()}`,
          sender: "ai",
          text: `Clear Aligners straighten your teeth discreetly without metal wires or food restrictions. Using our digital iTero 3D scanner, Dr. Ananya Sen can show you your exact new smile simulation in under 10 minutes!\n\nWould you like to book a complimentary 3D smile scan?`,
          timestamp,
          suggestedReplies: ["Book 3D Smile Scan", "Compare Metal Braces vs Aligners", "Check Financing Options"],
        };
      }

      return {
        id: `ai-${Date.now()}`,
        sender: "ai",
        text: `Hi, I'm Vikram, your Treatment Coordinator. I specialize in high-value aesthetic and restorative procedures like Implants, Invisalign, Veneers, and Full Mouth Rehab. What smile goal are you exploring?`,
        timestamp,
        suggestedReplies: ["Dental Implants", "Invisalign Clear Aligners", "Porcelain Veneers", "Smile Makeover"],
      };
    }

    case "recall_manager": {
      return {
        id: `ai-${Date.now()}`,
        sender: "ai",
        text: `Hello! This is Tara from ${clinic.name}. It's time for your 6-month preventive hygiene cleaning and checkup. Maintaining biannual cleanings prevents periodontal bone loss and keeps your smile radiant.\n\nCan I confirm a 30-minute slot for you this Saturday?`,
        timestamp,
        suggestedReplies: ["Confirm Saturday 11 AM", "Reschedule to Next Week", "I've already had my cleaning"],
        actionCard: {
          type: "booking",
          title: "Preventive Hygiene Recall",
          details: "Ultrasonic Scaling & Stain Polish (30 mins)",
          buttonText: "1-Click Confirm Hygiene Slot",
        },
      };
    }

    case "insurance_coordinator": {
      if (clinic.region === "US") {
        return {
          id: `ai-${Date.now()}`,
          sender: "ai",
          text: `Hello, I'm Marcus, AI Insurance Coordinator. We accept major US dental PPO plans including Delta Dental, MetLife, Cigna, Guardian, Aetna, and UnitedHealthcare.\n\nCould you please share your insurance provider and Member ID? I'll instantly verify your benefits, deductible, and estimated co-pay.`,
          timestamp,
          suggestedReplies: ["Delta Dental PPO", "MetLife Dental", "Cigna Dental", "Self-Pay / No Insurance"],
          actionCard: {
            type: "intake",
            title: "US Insurance Real-Time Verification",
            details: "Upload card photo or enter Member ID & Group #",
            buttonText: "Verify Insurance Benefits",
          },
        };
      } else {
        return {
          id: `ai-${Date.now()}`,
          sender: "ai",
          text: `Hello, I'm Marcus. In India, dental treatments can be claimed under select corporate outpatient benefits or comprehensive healthcare policies. We provide formal GST itemized bills and medical certificates for easy reimbursement.\n\nWould you like an itemized estimate for your corporate claim?`,
          timestamp,
          suggestedReplies: ["Request Itemized Estimate", "Check Corporate Empanelment", "0% Interest Card EMI"],
        };
      }
    }

    case "billing_assistant": {
      return {
        id: `ai-${Date.now()}`,
        sender: "ai",
        text: `Hello! I'm Zara, your Billing Assistant at ${clinic.name}. You have an active treatment estimate ready for review. You can settle securely via touchless payment in seconds.\n\nWe accept ${
          clinic.currency === "INR" ? "UPI, PhonePe, Google Pay, NetBanking, and Credit Card EMI" : "Stripe, Apple Pay, HSA/FSA cards, and CareCredit"
        }.`,
        timestamp,
        suggestedReplies: ["View Invoice", "Pay Securely Online", "Request Split EMI Plan"],
        actionCard: {
          type: "payment",
          title: "Instant Digital Invoice Payment",
          details: `Clinic: ${clinic.name} • Currency: ${clinic.currency}`,
          buttonText: "Open Secure Payment Portal",
        },
      };
    }

    case "patient_care": {
      return {
        id: `ai-${Date.now()}`,
        sender: "ai",
        text: `Hi! This is Chloe, checking in on your recovery after your visit with Dr. Rajesh Sharma at ${clinic.name}.\n\nHow is your comfort level today? Have you taken your prescribed medications, and is there any bleeding or swelling?`,
        timestamp,
        suggestedReplies: ["Feeling great, no pain!", "Mild discomfort, manageable", "Swelling has increased", "Need to speak with doctor"],
      };
    }

    default:
      return {
        id: `ai-${Date.now()}`,
        sender: "ai",
        text: `How can I help you at ${clinic.name}?`,
        timestamp,
      };
  }
}

export function searchKnowledgeBaseRAG(query: string, docs: KnowledgeDocument[]) {
  const qTerms = query.toLowerCase().split(" ").filter((w) => w.length > 2);
  const results = docs.map((doc) => {
    let score = 0.45;
    const content = (doc.title + " " + doc.snippet + " " + doc.tags.join(" ")).toLowerCase();
    for (const term of qTerms) {
      if (content.includes(term)) {
        score += 0.16;
      }
    }
    score = Math.min(0.97, Math.max(0.35, score + Math.random() * 0.05));
    return {
      doc,
      similarityScore: parseFloat(score.toFixed(3)),
      retrievedChunk: doc.snippet,
    };
  });

  return results.sort((a, b) => b.similarityScore - a.similarityScore);
}
