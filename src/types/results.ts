import type { Score } from './index';
import type { HarmonicScore } from './harmonic';

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