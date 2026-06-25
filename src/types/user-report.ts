export const reportSourceTypes = ["User Report", "News API"] as const;

export const reportUrgencyLevels = [
  "Low",
  "Medium",
  "High",
  "Critical",
] as const;

export const reportStatuses = [
  "Pending",
  "Active",
  "In Progress",
  "Resolved",
] as const;

export type ReportSourceType = (typeof reportSourceTypes)[number];
export type ReportUrgencyLevel = (typeof reportUrgencyLevels)[number];
export type ReportStatus = (typeof reportStatuses)[number];

export type UserReportRecord = {
  _id: string;
  message: string;
  location?: string;
  sourceType: ReportSourceType;
  crisisType?: string;
  crisisConfidence?: number;
  messageType?: string;
  messageTypeConfidence?: number;
  urgencyLevel?: ReportUrgencyLevel;
  urgencyConfidence?: number;
  extractedLocations?: string[];
  affectedCommunities: string[];
  summary?: string;
  latencyMs?: number;
  status: ReportStatus;
  createdAt: string;
  updatedAt: string;
};

export type UserReportCreateInput = {
  message: string;
  location?: string;
  sourceType?: ReportSourceType;
};

export type ApiResponse<T> = {
  success: boolean;
  data: T;
};

