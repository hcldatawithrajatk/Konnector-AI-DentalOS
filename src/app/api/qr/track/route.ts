import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { qrId, clinicId, targetRoute, referrer } = body;

    const userAgent = req.headers.get("user-agent") || "unknown";
    const ip = req.headers.get("x-forwarded-for") || "127.0.0.1";

    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent);
    const deviceType = isMobile ? "Mobile" : "Desktop";

    const scanRecord = {
      id: `scan-${Date.now()}`,
      qrId: qrId || "qr-universal",
      clinicId: clinicId || "clinic-in-01",
      deviceType,
      ipAddress: ip.split(",")[0].trim(),
      userAgent: userAgent.slice(0, 150),
      referrer: referrer || "direct_scan",
      scannedAt: new Date().toISOString(),
      redirectUrl: targetRoute || "/portal/clinic-in-01/hub",
    };

    return NextResponse.json(
      {
        status: "tracked",
        scan: scanRecord,
      },
      { status: 200 }
    );
  } catch (err: any) {
    return NextResponse.json({ error: "Tracking failed", details: err.message }, { status: 500 });
  }
}
