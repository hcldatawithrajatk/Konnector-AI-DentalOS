import { NextRequest, NextResponse } from "next/server";
import { createRazorpayOrder } from "@/lib/integrations/razorpay";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { amountINR, clinicId, patientName, patientPhone, treatmentName } = body;

    if (!amountINR || amountINR <= 0) {
      return NextResponse.json({ error: "Valid amountINR is required" }, { status: 400 });
    }

    const order = await createRazorpayOrder({
      amountINR: Number(amountINR),
      clinicId: clinicId || "clinic-in-01",
      patientName: patientName || "Patient",
      patientPhone: patientPhone || "+919876543210",
      treatmentName: treatmentName || "Dental Treatment",
    });

    return NextResponse.json(order, { status: 200 });
  } catch (err: any) {
    return NextResponse.json({ error: "Razorpay order creation failed", details: err.message }, { status: 500 });
  }
}
