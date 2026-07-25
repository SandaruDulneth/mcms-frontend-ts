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

// One geocoded location — matches the Node backend's IGeoLocation interface
export type GeoLocation = {
  name       : string;
  lat        : number;
  lng        : number;
  displayName: string;
  source     : string;  // "spacy_ner" | "gazetteer"
};

export type UserReportRecord = {
  _id                  : string;
  message              : string;
  location?            : string;
  sourceType           : ReportSourceType;
  crisisType?          : string;
  crisisConfidence?    : number;
  messageType?         : string;
  messageTypeConfidence?: number;
  urgencyLevel?        : ReportUrgencyLevel;
  urgencyConfidence?   : number;
  extractedLocations?  : string[];
  extractedLocationsGeo?: GeoLocation[];   // ← new: lat/lng for map
  affectedCommunities  : string[];
  summary?             : string;
  latencyMs?           : number;
  status               : ReportStatus;
  createdAt            : string;
  updatedAt            : string;
};

export type UserReportCreateInput = {
  message    : string;
  location?  : string;
  sourceType?: ReportSourceType;
};

export type ApiResponse<T> = {
  success: boolean;
  data   : T;
};