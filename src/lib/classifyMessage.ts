import type { DisasterCategory, UrgencyLevel } from "@/data/mockDisasters";

export type ClassificationResult = {
  detectedLanguage: string;
  translatedMessage: string;
  category: DisasterCategory;
  urgency: UrgencyLevel;
  suggestedAuthority: string;
};

const categoryRules: Array<{
  category: DisasterCategory;
  authority: string;
  keywords: string[];
}> = [
  {
    category: "Flood",
    authority: "Disaster Management Centre",
    keywords: ["flood", "water", "river"],
  },
  {
    category: "Fire",
    authority: "Fire Department",
    keywords: ["fire", "smoke"],
  },
  {
    category: "Earthquake",
    authority: "Disaster Management Centre",
    keywords: ["earthquake", "shaking"],
  },
  {
    category: "Infrastructure Damage",
    authority: "Local Council",
    keywords: ["bridge", "road", "collapse", "collapsed"],
  },
  {
    category: "Medical Emergency",
    authority: "Hospitals / Ambulance",
    keywords: ["ambulance", "injured", "medical"],
  },
];

export function classifyMessage(
  message: string,
  language: string,
): ClassificationResult {
  const normalized = message.toLowerCase();
  const rule = categoryRules.find(({ keywords }) =>
    keywords.some((keyword) => normalized.includes(keyword)),
  );
  const urgentTerms = ["trapped", "help", "urgent", "rescue", "critical"];
  const highTerms = ["injured", "spreading", "collapse", "flood"];
  const urgency = urgentTerms.some((term) => normalized.includes(term))
    ? "Critical"
    : highTerms.some((term) => normalized.includes(term))
      ? "High"
      : "Medium";

  return {
    detectedLanguage: language,
    translatedMessage:
      language === "English"
        ? message
        : `[Prototype translation to English] ${message}`,
    category: rule?.category ?? "Other",
    urgency,
    suggestedAuthority: rule?.authority ?? "Police",
  };
}
