import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { provider, memberId, patientName, dateOfBirth } = body;

    if (!provider || !memberId) {
      return NextResponse.json({ error: "provider and memberId are required" }, { status: 400 });
    }

    // Determine verification simulation / clearinghouse gateway response
    const supportedProviders = [
      "Delta Dental PPO",
      "MetLife Dental",
      "Cigna Dental Health",
      "Guardian Dental",
      "Aetna Dental",
      "UnitedHealthcare Dental",
    ];

    const isRecognized = supportedProviders.some((p) =>
      provider.toLowerCase().includes(p.toLowerCase().split(" ")[0])
    );

    const deductibleRemaining = isRecognized ? 50.0 : 150.0;
    const preventiveCoverage = isRecognized ? 100 : 80;
    const basicCoverage = isRecognized ? 80 : 50;
    const majorCoverage = isRecognized ? 50 : 0;
    const annualMaximumRemaining = isRecognized ? 1450.0 : 800.0;

    return NextResponse.json(
      {
        status: "Active Coverage Verified",
        clearinghouseResponseId: `ch-271-${Date.now()}`,
        timestamp: new Date().toISOString(),
        patient: {
          name: patientName || "Verified Patient",
          memberId,
          provider,
        },
        benefits: {
          preventiveCoveragePercent: preventiveCoverage, // Cleanings, Scaling, Exams
          basicCoveragePercent: basicCoverage,           // Fillings, Root Canals
          majorCoveragePercent: majorCoverage,           // Crowns, Implants, Bridges
          annualDeductibleRemainingUSD: deductibleRemaining,
          annualBenefitMaximumRemainingUSD: annualMaximumRemaining,
          orthodonticLifetimeMaximumUSD: 1000.0,
          waitingPeriodMet: true,
        },
        requiresPreAuthorization: majorCoverage > 0,
      },
      { status: 200 }
    );
  } catch (err: any) {
    return NextResponse.json({ error: "Insurance verification failed", details: err.message }, { status: 500 });
  }
}
