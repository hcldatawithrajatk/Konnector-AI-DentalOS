import { NextRequest, NextResponse } from "next/server";
import { invokeGeminiChat } from "@/lib/integrations/gemini";
import { initialClinics, initialDoctors, initialTreatments, initialKnowledgeDocs } from "@/lib/mockData";
import { AIPersonaType } from "@/types";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      persona = "receptionist",
      userMessage,
      clinicId = "clinic-in-01",
      conversationHistory = [],
    } = body;

    if (!userMessage || typeof userMessage !== "string") {
      return NextResponse.json({ error: "userMessage is required" }, { status: 400 });
    }

    // Resolve tenant context
    const clinic = initialClinics.find((c) => c.id === clinicId) || initialClinics[0];
    const doctors = initialDoctors.filter((d) => d.clinicId === clinic.id);
    const treatments = initialTreatments.filter((t) => t.clinicId === clinic.id);
    const knowledgeDocs = initialKnowledgeDocs.filter((k) => k.clinicId === clinic.id);

    const response = await invokeGeminiChat({
      persona: persona as AIPersonaType,
      userMessage,
      clinic,
      doctors,
      treatments,
      knowledgeDocs,
      conversationHistory,
    });

    return NextResponse.json(response, { status: 200 });
  } catch (err: any) {
    console.error("AI Chat API error:", err);
    return NextResponse.json({ error: "Failed to generate AI response", details: err.message }, { status: 500 });
  }
}
