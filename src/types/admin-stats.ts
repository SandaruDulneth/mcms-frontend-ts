export type AdminStats = {
  totalReports: number;
  byUrgency: { High: number; Medium: number; Low: number; Critical: number };
  byStatus: {
    Pending: number;
    Active: number;
    "In Progress": number;
    Resolved: number;
  };
  byCrisisType: Record<string, number>;
  totalResponders: number;
  reportsLast7Days: Array<{ date: string; count: number }>;
};
