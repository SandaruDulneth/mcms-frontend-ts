export type DisasterCategory =
  | "Flood"
  | "Fire"
  | "Earthquake"
  | "Infrastructure Damage"
  | "Medical Emergency"
  | "Other";

export type UrgencyLevel = "Low" | "Medium" | "High" | "Critical";
export type ReportStatus = "Active" | "Monitoring" | "Resolved";

export type DisasterReport = {
  id: string;
  message: string;
  category: DisasterCategory;
  location: string;
  urgency: UrgencyLevel;
  status: ReportStatus;
  timestamp: string;
  language: "English" | "Sinhala" | "Tamil";
  source: "Citizen SMS" | "Mobile App" | "Hotline" | "Agency Portal";
  authority: string;
  coordinates: {
    top: string;
    left: string;
  };
};

export const mockDisasters: DisasterReport[] = [
  {
    id: "MCMS-1001",
    message:
      "River water is rising near the north bridge and families need help.",
    category: "Flood",
    location: "Kelaniya North",
    urgency: "Critical",
    status: "Active",
    timestamp: "17 May 2026, 17:20",
    language: "English",
    source: "Citizen SMS",
    authority: "Disaster Management Centre",
    coordinates: { top: "38%", left: "24%" },
  },
  {
    id: "MCMS-1002",
    message:
      "Smoke reported from market storage block, fire spreading to shops.",
    category: "Fire",
    location: "Pettah Market",
    urgency: "High",
    status: "Active",
    timestamp: "17 May 2026, 16:48",
    language: "Tamil",
    source: "Hotline",
    authority: "Fire Department",
    coordinates: { top: "54%", left: "52%" },
  },
  {
    id: "MCMS-1003",
    message: "Road shoulder collapsed after heavy rain, buses cannot pass.",
    category: "Infrastructure Damage",
    location: "Badulla Pass",
    urgency: "Medium",
    status: "Monitoring",
    timestamp: "17 May 2026, 15:35",
    language: "Sinhala",
    source: "Mobile App",
    authority: "Local Council",
    coordinates: { top: "66%", left: "70%" },
  },
  {
    id: "MCMS-1004",
    message: "Injured residents need ambulance support after building damage.",
    category: "Medical Emergency",
    location: "Galle Fort",
    urgency: "High",
    status: "Active",
    timestamp: "17 May 2026, 14:10",
    language: "English",
    source: "Agency Portal",
    authority: "Hospitals / Ambulance",
    coordinates: { top: "76%", left: "36%" },
  },
  {
    id: "MCMS-1005",
    message:
      "Minor earth shaking felt, no injuries reported by local officers.",
    category: "Earthquake",
    location: "Kandy Central",
    urgency: "Low",
    status: "Resolved",
    timestamp: "17 May 2026, 11:52",
    language: "Sinhala",
    source: "Hotline",
    authority: "Disaster Management Centre",
    coordinates: { top: "29%", left: "59%" },
  },
  {
    id: "MCMS-1006",
    message:
      "People are trapped inside a flooded house and request urgent rescue.",
    category: "Flood",
    location: "Ratnapura South",
    urgency: "Critical",
    status: "Active",
    timestamp: "17 May 2026, 10:25",
    language: "Tamil",
    source: "Citizen SMS",
    authority: "Disaster Management Centre",
    coordinates: { top: "62%", left: "31%" },
  },
];
