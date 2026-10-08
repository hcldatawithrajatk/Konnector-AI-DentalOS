import { NextResponse } from "next/server";

export async function GET() {
  const memoryUsage = process.memoryUsage();

  return NextResponse.json(
    {
      status: "healthy",
      service: "Konnector AI DentalOS",
      timestamp: new Date().toISOString(),
      uptimeSeconds: Math.floor(process.uptime()),
      environment: process.env.NODE_ENV || "development",
      checks: {
        databaseConfigured: Boolean(process.env.DATABASE_URL),
        geminiConfigured: Boolean(process.env.GEMINI_API_KEY && !process.env.GEMINI_API_KEY.includes("placeholder")),
        whatsappConfigured: Boolean(process.env.WHATSAPP_CLOUD_API_ACCESS_TOKEN),
        stripeConfigured: Boolean(process.env.STRIPE_SECRET_KEY && !process.env.STRIPE_SECRET_KEY.includes("placeholder")),
        razorpayConfigured: Boolean(process.env.RAZORPAY_KEY_SECRET && !process.env.RAZORPAY_KEY_SECRET.includes("placeholder")),
      },
      memory: {
        rssMB: Math.round(memoryUsage.rss / 1024 / 1024),
        heapUsedMB: Math.round(memoryUsage.heapUsed / 1024 / 1024),
      },
    },
    { status: 200 }
  );
}
