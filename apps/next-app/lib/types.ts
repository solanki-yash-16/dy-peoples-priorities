export interface Submission {
  id: string;
  title: string;
  description: string;
  source: "public_meeting" | "letter" | "social_media" | "grievance_portal" | "direct_representation";
  region: string;
  category: "education" | "healthcare" | "infrastructure" | "employment" | "environment";
  sentiment: "positive" | "neutral" | "negative";
  submittedAt: string;
  language: string;
  upvotes: number;
}

export interface Theme {
  id: string;
  name: string;
  category: string;
  frequency: number;
  regions: string[];
  avgSentiment: number;
  trend: "up" | "down" | "stable";
}

export interface Hotspot {
  id: string;
  region: string;
  demandScore: number;
  topIssue: string;
  submissionCount: number;
  growthRate: number;
}

export interface Ranking {
  id: string;
  project: string;
  category: string;
  region: string;
  demandScore: number;
  alignmentScore: number;
  infrastructureGap: number;
  priorityScore: number;
  status: "proposed" | "approved" | "in_progress" | "completed";
  budgetEstimate: number;
  beneficiaries: number;
}

export interface Insight {
  id: string;
  type: "correlation" | "anomaly" | "prediction" | "recommendation";
  title: string;
  description: string;
  confidence: number;
  relatedProjects: string[];
}
