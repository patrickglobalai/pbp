export type Category = 'being' | 'doing' | 'having';

export type Characteristic = {
  id: string;
  name: string;
  category: Category;
  description: string;
};

export type Question = {
  id: string;
  text: string;
  characteristicId: string;
  reversed: boolean;  // Added reversed property
};

export type QuestionGroup = {
  characteristic: Characteristic;
  questions: Question[];
};

export type Answer = {
  questionId: string;
  value: number;
};

export type Score = {
  characteristicId: string;
  raw: number;
  normalized: number;
};