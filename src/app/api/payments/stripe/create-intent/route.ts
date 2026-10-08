import { NextRequest, NextResponse } from "next/server";
import { createStripePaymentIntent } from "@/lib/integrations/stripe";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { amountUSD, clinicId, patientName, patientEmail, treatmentName } = body;

    if (!amountUSD || amountUSD <= 0) {
      return NextResponse.json({ error: "Valid amountUSD is required" }, { status: 400 });
    }

    const intent = await createStripePaymentIntent({
      amountUSD: Number(amountUSD),
      clinicId: clinicId || "clinic-us-01",
      patientName: patientName || "US Patient",
      patientEmail,
      treatmentName: treatmentName || "Dental Procedure",
    });

    return NextResponse.json(intent, { status: 200 });
  } catch (err: any) {
    return NextResponse.json({ error: "Stripe intent creation failed", details: err.message }, { status: 500 });
  }
}
