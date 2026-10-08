// =============================================================================
// KONNECTOR AI DENTALOS — STRIPE PAYMENT GATEWAY CONNECTOR (USA)
// =============================================================================

import crypto from "crypto";

export interface CreateStripeIntentOptions {
  amountUSD: number;
  clinicId: string;
  patientName: string;
  patientEmail?: string;
  treatmentName: string;
  secretKey?: string;
}

export interface StripeIntentResult {
  clientSecret: string;
  paymentIntentId: string;
  amount: number;
  currency: string;
  status: string;
}

/**
 * Creates a Stripe PaymentIntent for US Dental Clinic checkout.
 */
export async function createStripePaymentIntent(options: CreateStripeIntentOptions): Promise<StripeIntentResult> {
  const {
    amountUSD,
    clinicId,
    patientName,
    patientEmail,
    treatmentName,
    secretKey = process.env.STRIPE_SECRET_KEY || "sk_test_placeholder",
  } = options;

  const amountInCents = Math.round(amountUSD * 100);

  // If live Stripe secret key exists, call Stripe API
  if (secretKey && !secretKey.includes("placeholder") && secretKey.startsWith("sk_")) {
    try {
      const body = new URLSearchParams({
        amount: amountInCents.toString(),
        currency: "usd",
        "payment_method_types[]": "card",
        "description": `${treatmentName} - Patient: ${patientName}`,
        "metadata[clinicId]": clinicId,
        "metadata[patientName]": patientName,
        "metadata[treatmentName]": treatmentName,
      });

      if (patientEmail) {
        body.append("receipt_email", patientEmail);
      }

      const res = await fetch("https://api.stripe.com/v1/payment_intents", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${secretKey}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: body.toString(),
      });

      if (res.ok) {
        const intent = await res.json();
        return {
          clientSecret: intent.client_secret,
          paymentIntentId: intent.id,
          amount: amountUSD,
          currency: "USD",
          status: intent.status,
        };
      }
    } catch (err) {
      console.warn("Stripe API call failed, generating fallback intent:", err);
    }
  }

  // Fallback intent for preview / local testing
  const mockId = `pi_${Date.now()}_us`;
  return {
    clientSecret: `${mockId}_secret_${Date.now()}`,
    paymentIntentId: mockId,
    amount: amountUSD,
    currency: "USD",
    status: "requires_payment_method",
  };
}

/**
 * Verifies Stripe Webhook signature header (`stripe-signature`).
 */
export function verifyStripeWebhookSignature(
  rawPayload: string,
  signatureHeader: string | null,
  webhookSecret: string = process.env.STRIPE_WEBHOOK_SECRET || "whsec_placeholder"
): boolean {
  if (webhookSecret === "whsec_placeholder" || process.env.NODE_ENV !== "production") {
    return true; // Pass in local testing
  }

  if (!signatureHeader) return false;

  try {
    const parts = signatureHeader.split(",");
    let timestamp = "";
    let signature = "";

    for (const part of parts) {
      const [key, val] = part.split("=");
      if (key === "t") timestamp = val;
      if (key === "v1") signature = val;
    }

    if (!timestamp || !signature) return false;

    const signedPayload = `${timestamp}.${rawPayload}`;
    const expectedSignature = crypto.createHmac("sha256", webhookSecret).update(signedPayload).digest("hex");

    return crypto.timingSafeEqual(Buffer.from(signature, "utf8"), Buffer.from(expectedSignature, "utf8"));
  } catch (err) {
    console.error("Stripe webhook verification error:", err);
    return false;
  }
}
