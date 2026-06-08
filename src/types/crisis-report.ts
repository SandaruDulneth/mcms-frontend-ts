export type CrisisReportRecord = {
  id: string;
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
  affectedCommunity: string[];
  status: string;
  createdAt: string;
  updatedAt: string;
};
