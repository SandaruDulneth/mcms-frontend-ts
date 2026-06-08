import { connectMongoose } from "@/lib/mongoose";
import CrisisReport from "@/models/CrisisReport";
import type { CrisisReportRecord } from "@/types/crisis-report";

type ReportDocument = {
  _id: { toString(): string };
  originalMessage: string;
  detectedLanguage?: string;
  reportedLanguage?: string;
  translatedMessage?: string;
  location?: string;
  sourceType?: string;
  contactInfo?: string;
  category?: string;
  urgencyLevel?: string;
  assignedAuthority?: string;
  notes?: string;
  affectedCommunity?: string[];
  status?: string;
  createdAt?: Date;
  updatedAt?: Date;
};

function serializeReport(report: ReportDocument): CrisisReportRecord {
  return {
    id: report._id.toString(),
    originalMessage: report.originalMessage,
    detectedLanguage: report.detectedLanguage,
    reportedLanguage: report.reportedLanguage,
    translatedMessage: report.translatedMessage,
    location: report.location,
    sourceType: report.sourceType,
    contactInfo: report.contactInfo,
    category: report.category,
    urgencyLevel: report.urgencyLevel,
    assignedAuthority: report.assignedAuthority,
    notes: report.notes,
    affectedCommunity: report.affectedCommunity ?? [],
    status: report.status ?? "Active",
    createdAt: report.createdAt?.toISOString() ?? "",
    updatedAt: report.updatedAt?.toISOString() ?? "",
  };
}

export async function getCrisisReports(): Promise<CrisisReportRecord[]> {
  await connectMongoose();

  const reports = await CrisisReport.find()
    .sort({ createdAt: -1 })
    .select("-__v")
    .lean<ReportDocument[]>();

  return reports.map(serializeReport);
}

export async function loadCrisisReports() {
  try {
    return {
      reports: await getCrisisReports(),
      error: null,
    };
  } catch {
    return {
      reports: [] as CrisisReportRecord[],
      error: "Unable to load crisis reports from the database.",
    };
  }
}
