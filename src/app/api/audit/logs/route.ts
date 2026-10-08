import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { clinicId, userId, userName, role, action, module, details } = body;

    const ip = req.headers.get("x-forwarded-for") || "127.0.0.1";
    const userAgent = req.headers.get("user-agent") || "unknown";

    const auditEntry = {
      id: `log-${Date.now()}`,
      clinicId: clinicId || "clinic-in-01",
      userId: userId || "user-current",
      userName: userName || "Staff User",
      role: role || "Practice Staff",
      action: action || "Record Viewed",
      module: module || "General",
      ipAddress: ip.split(",")[0].trim(),
      device: userAgent.slice(0, 100),
      details: details || "Standard clinical action executed",
      timestamp: new Date().toISOString(),
    };

    return NextResponse.json({ status: "recorded", log: auditEntry }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: "Audit logging failed", details: err.message }, { status: 500 });
  }
}
