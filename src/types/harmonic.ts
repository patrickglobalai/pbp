export type HarmonicLevel = {
  id: number;
  name: string;
  description: string;
  color: string;
};

export type HarmonicQuestion = {
  id: string;
  text: string;
  levelId: number;
  reversed: boolean;  // Added reversed property
};

export type HarmonicAnswer = {
  questionId: string;
  value: number;
};

export type HarmonicScore = {
  levelId: number;
  raw: number;
  normalized: number;
};