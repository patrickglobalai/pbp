import type { HarmonicScore } from "./harmonic";
import type { Score } from "./index";

export interface AssessmentResult {
  id: string;
  userId: string;
  coachId?: string;
  partnerId?: string;
  scores: Score[];
  harmonicScores: HarmonicScore[];
  completedAt: Date;
  aiAnalysis?: string;
  // New retake fields
  version: number;
  originalResultId?: string;
  retakenAt?: Date;
}

export type ResultsContextType = {
  saveResults: (results: Omit<AssessmentResult, "id">) => Promise<boolean>;
  results: AssessmentResult[];
  isLoading: boolean;
  error: string | null;
  getResults: (userId: string) => Promise<AssessmentResult | null>;
};
