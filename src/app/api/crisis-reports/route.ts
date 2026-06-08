import { NextResponse } from "next/server";
import { connectMongoose } from "@/lib/mongoose";
import CrisisReport from "@/models/CrisisReport";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type CrisisReportPayload = {
  originalMessage?: unknown;
  detectedLanguage?: unknown;
  reportedLanguage?: unknown;
  translatedMessage?: unknown;
  location?: unknown;
  sourceType?: unknown;
  source?: unknown;
  contactInfo?: unknown;
  contact?: unknown;
  category?: unknown;
  urgencyLevel?: unknown;
  assignedAuthority?: unknown;
  authority?: unknown;
  notes?: unknown;
  affectedCommunity?: unknown;
  status?: unknown;
};

function readString(value: unknown) {
  return typeof value === "string" ? value.trim() : undefined;
}

function readStringArray(value: unknown) {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .filter((item): item is string => typeof item === "string")
    .map((item) => item.trim())
    .filter(Boolean);
}

export async function GET() {
  try {
    await connectMongoose();

    const reports = await CrisisReport.find()
      .sort({ createdAt: -1 })
      .select("-__v")
      .lean();

    return NextResponse.json({
      ok: true,
      reports,
    });
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Failed to fetch crisis reports.";

    return NextResponse.json({ ok: false, message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as CrisisReportPayload;
    const originalMessage = readString(body.originalMessage);

    if (!originalMessage) {
      return NextResponse.json(
        {
          ok: false,
          message: "originalMessage is required.",
        },
        { status: 400 },
      );
    }

    await connectMongoose();

    const report = await CrisisReport.create({
      originalMessage,
      detectedLanguage: readString(body.detectedLanguage),
      reportedLanguage: readString(body.reportedLanguage),
      translatedMessage: readString(body.translatedMessage),
      location: readString(body.location),
      sourceType: readString(body.sourceType) || readString(body.source),
      contactInfo: readString(body.contactInfo) || readString(body.contact),
      category: readString(body.category),
      urgencyLevel: readString(body.urgencyLevel),
      assignedAuthority:
        readString(body.assignedAuthority) || readString(body.authority),
      notes: readString(body.notes),
      affectedCommunity: readStringArray(body.affectedCommunity),
      status: readString(body.status) || "Active",
    });

    return NextResponse.json(
      {
        ok: true,
        report: report.toObject({ versionKey: false }),
      },
      { status: 201 },
    );
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Failed to create crisis report.";

    return NextResponse.json({ ok: false, message }, { status: 500 });
  }
}
