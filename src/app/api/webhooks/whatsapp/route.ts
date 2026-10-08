import { NextRequest, NextResponse } from "next/server";
import {
  verifyMetaWebhookSignature,
  parseWhatsAppWebhook,
  sendWhatsAppTextMessage,
} from "@/lib/integrations/whatsapp";
import { invokeGeminiChat } from "@/lib/integrations/gemini";
import { initialClinics, initialDoctors, initialTreatments, initialKnowledgeDocs } from "@/lib/mockData";

/**
 * GET: Meta Webhook Verification Handshake
 */
export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const mode = searchParams.get("hub.mode");
  const token = searchParams.get("hub.verify_token");
  const challenge = searchParams.get("hub.challenge");

  const expectedToken = process.env.WHATSAPP_WEBHOOK_VERIFY_TOKEN || "dentalos_webhook_secret";

  if (mode === "subscribe" && token === expectedToken) {
    return new Response(challenge || "", { status: 200 });
  }

  return NextResponse.json({ error: "Verification token mismatch" }, { status: 403 });
}

/**
 * POST: Real-Time Inbound WhatsApp Patient Message Dispatcher
 */
export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.text();
    const signature = req.headers.get("x-hub-signature-256");

    // 1. Verify Meta Signature
    const isAuthentic = verifyMetaWebhookSignature(rawBody, signature);
    if (!isAuthentic && process.env.NODE_ENV === "production") {
      return NextResponse.json({ error: "Invalid webhook signature" }, { status: 401 });
    }

    const payload = JSON.parse(rawBody);
    const inbound = parseWhatsAppWebhook(payload);

    if (!inbound || !inbound.text) {
      // Acknowledgment for status updates (sent, delivered, read)
      return NextResponse.json({ status: "acknowledged" }, { status: 200 });
    }

    // 2. Resolve Clinic Tenant (match by registered WhatsApp Phone Number ID or default)
    const targetClinic =
      initialClinics.find((c) => c.whatsappNumber.replace(/\D/g, "") === inbound.phoneNumberId) ||
      initialClinics[0];

    // 3. Dispatch to Gemini Autonomous Employee
    const aiResponse = await invokeGeminiChat({
      persona: "receptionist",
      userMessage: inbound.text,
      clinic: targetClinic,
      doctors: initialDoctors.filter((d) => d.clinicId === targetClinic.id),
      treatments: initialTreatments.filter((t) => t.clinicId === targetClinic.id),
      knowledgeDocs: initialKnowledgeDocs.filter((k) => k.clinicId === targetClinic.id),
    });

    // 4. Send Real Outbound WhatsApp Reply
    await sendWhatsAppTextMessage(
      inbound.fromPhone,
      aiResponse.reply,
      inbound.phoneNumberId,
      process.env.WHATSAPP_CLOUD_API_ACCESS_TOKEN
    );

    return NextResponse.json(
      {
        status: "processed",
        patientPhone: inbound.fromPhone,
        replyDispatched: aiResponse.reply,
        modelUsed: aiResponse.modelUsed,
      },
      { status: 200 }
    );
  } catch (err: any) {
    console.error("WhatsApp Webhook processing error:", err);
    return NextResponse.json({ error: "Internal processing error", details: err.message }, { status: 500 });
  }
}
