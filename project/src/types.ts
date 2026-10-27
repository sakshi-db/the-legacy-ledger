export type Category =
  | 'Childhood'
  | 'Traditions'
  | 'Wisdom'
  | 'Milestones'
  | 'Family'
  | 'Adventure';

export interface Memory {
  id: string;
  title: string;
  story: string;
  author: string;
  relation: string;
  category: Category;
  year: number;
  era: string;
  date?: string;
  location?: string;
  tone: string;
  highlights: string[];
  tags: string[];
  photoUrl?: string;
  audioNote?: {
    duration: number;
    transcript: string;
  };
  createdAt: number;
}

export interface Question {
  question: string;
  answer: string;
  createdAt: number;
}
