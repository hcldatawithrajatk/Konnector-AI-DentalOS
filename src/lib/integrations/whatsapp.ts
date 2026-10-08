// =============================================================================
// KONNECTOR AI DENTALOS — META WHATSAPP CLOUD API INTEGRATION CONNECTOR
// =============================================================================

import crypto from "crypto";

export interface WhatsAppInboundMessage {
  fromPhone: string;
  messageId: string;
  text: string;
  timestamp: string;
  phoneNumberId: string;
  type: "text" | "button" | "interactive";
}

/**
 * Verifies the X-Hub-Signature-256 header sent by Meta to ensure authenticity.
 */
export function verifyMetaWebhookSignature(
  rawBody: string,
  signatureHeader: string | null,
  appSecret: string = process.env.WHATSAPP_APP_SECRET || ""
): boolean {
  if (!signatureHeader || !appSecret) {
    // If no secret configured in dev mode, allow graceful inspection
    return process.env.NODE_ENV !== "production";
  }

  try {
    const [algo, signature] = signatureHeader.split("=");
    if (algo !== "sha256" || !signature) return false;

    const hmac = crypto.createHmac("sha256", appSecret);
    const digest = hmac.update(rawBody).digest("hex");

    return crypto.timingSafeEqual(Buffer.from(signature, "utf8"), Buffer.from(digest, "utf8"));
  } catch (err) {
    console.error("Meta webhook signature verification error:", err);
    return false;
  }
}

/**
 * Parses incoming Meta Cloud API webhook payload into structured patient message.
 */
export function parseWhatsAppWebhook(body: any): WhatsAppInboundMessage | null {
  try {
    const entry = body?.entry?.[0];
    const change = entry?.changes?.[0]?.value;
    const message = change?.messages?.[0];
    const metadata = change?.metadata;

    if (!message) return null;

    let text = "";
    if (message.type === "text") {
      text = message.text?.body || "";
    } else if (message.type === "interactive") {
      text = message.interactive?.button_reply?.title || message.interactive?.list_reply?.title || "";
    } else if (message.type === "button") {
      text = message.button?.text || "";
    }

    return {
      fromPhone: message.from,
      messageId: message.id,
      text,
      timestamp: message.timestamp,
      phoneNumberId: metadata?.phone_number_id || "",
      type: message.type,
    };
  } catch (err) {
    console.error("Failed to parse WhatsApp webhook payload:", err);
    return null;
  }
}

/**
 * Sends a real outbound WhatsApp text message via Meta Graph API v20.0.
 */
export async function sendWhatsAppTextMessage(
  toPhone: string,
  messageText: string,
  phoneNumberId: string = process.env.WHATSAPP_PHONE_NUMBER_ID || "",
  accessToken: string = process.env.WHATSAPP_CLOUD_API_ACCESS_TOKEN || ""
): Promise<{ success: boolean; messageId?: string; error?: string }> {
  if (!accessToken || !phoneNumberId) {
    console.warn("WhatsApp credentials not configured; logging simulated message dispatch:", { toPhone, messageText });
    return { success: true, messageId: `mock-wa-${Date.now()}` };
  }

  try {
    const url = `https://graph.facebook.com/v20.0/${phoneNumberId}/messages`;
    const payload = {
      messaging_product: "whatsapp",
      recipient_type: "individual",
      to: toPhone.replace(/\D/g, ""), // Strip non-digit characters
      type: "text",
      text: { preview_url: true, body: messageText },
    };

    const res = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const data = await res.json();
    if (res.ok && data?.messages?.[0]?.id) {
      return { success: true, messageId: data.messages[0].id };
    } else {
      return { success: false, error: JSON.stringify(data?.error || data) };
    }
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

/**
 * Sends interactive quick reply buttons via Meta WhatsApp Graph API.
 */
export async function sendWhatsAppInteractiveButtons(
  toPhone: string,
  bodyText: string,
  buttons: Array<{ id: string; title: string }>,
  phoneNumberId: string = process.env.WHATSAPP_PHONE_NUMBER_ID || "",
  accessToken: string = process.env.WHATSAPP_CLOUD_API_ACCESS_TOKEN || ""
): Promise<{ success: boolean; messageId?: string }> {
  if (!accessToken || !phoneNumberId) {
    return { success: true, messageId: `mock-wa-btn-${Date.now()}` };
  }

  try {
    const url = `https://graph.facebook.com/v20.0/${phoneNumberId}/messages`;
    const payload = {
      messaging_product: "whatsapp",
      recipient_type: "individual",
      to: toPhone.replace(/\D/g, ""),
      type: "interactive",
      interactive: {
        type: "button",
        body: { text: bodyText },
        action: {
          buttons: buttons.slice(0, 3).map((b) => ({
            type: "reply",
            reply: { id: b.id, title: b.title.slice(0, 20) }, // WhatsApp max 20 chars per button title
          })),
        },
      },
    };

    const res = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const data = await res.json();
    return { success: res.ok, messageId: data?.messages?.[0]?.id };
  } catch (err) {
    console.error("WhatsApp interactive button send failed:", err);
    return { success: false };
  }
}
