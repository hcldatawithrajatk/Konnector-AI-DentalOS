import { NextRequest, NextResponse } from "next/server";
import { initialDoctors } from "@/lib/mockData";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { patientName, phone, symptoms = [], clinicId = "clinic-in-01" } = body;

    if (!patientName || !phone) {
      return NextResponse.json({ error: "patientName and phone are required" }, { status: 400 });
    }

    // Urgency Calculation based on clinical severity matrix
    let score = 3;
    const severeSymptoms = ["Severe continuous pain (>8/10)", "Facial swelling extending to eye or neck", "Uncontrolled bleeding after extraction", "Avulsed (knocked out) permanent tooth", "Dental trauma from accident"];
    
    symptoms.forEach((s: string) => {
      if (severeSymptoms.some((sev) => s.toLowerCase().includes(sev.toLowerCase().slice(0, 15)))) {
        score += 3;
      } else {
        score += 1;
      }
    });

    const severityScore = Math.min(10, score);
    const assignedDoctor = initialDoctors.find((d) => d.clinicId === clinicId) || initialDoctors[0];

    const emergencyCase = {
      id: `emg-${Date.now()}`,
      clinicId,
      patientName,
      phone,
      symptoms,
      severityScore,
      assignedDoctorName: assignedDoctor.name,
      assignedDoctorId: assignedDoctor.id,
      status: severityScore >= 7 ? "Priority Emergency Escalation" : "Urgent Triaged",
      recommendedAction: severityScore >= 7 ? "Immediate Chair Allocation < 15 mins" : "Same-Day Emergency Consult Slot",
      escalatedAt: new Date().toISOString(),
    };

    return NextResponse.json(emergencyCase, { status: 200 });
  } catch (err: any) {
    return NextResponse.json({ error: "Emergency triage failed", details: err.message }, { status: 500 });
  }
}
