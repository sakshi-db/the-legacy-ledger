import type { Category } from '../types';
import { CATEGORIES } from '../data/seedMemories';

const CATEGORY_KEYWORDS: Record<Category, string[]> = {
  Childhood: ['school', 'child', 'kid', 'play', 'mother', 'father', 'home', 'grew', 'young', 'toy', 'sister', 'brother', 'mama', 'papa'],
  Traditions: ['tradition', 'sunday', 'holiday', 'candle', 'solstice', 'every year', 'family', 'gather', 'recipe', 'ritual', 'feast'],
  Wisdom: ['learned', 'lesson', 'listen', 'advice', 'understand', 'truth', 'father said', 'remember', 'wisdom', 'patience', 'silence'],
  Milestones: ['married', 'wedding', 'graduated', 'born', 'first', 'moved', 'job', 'apprentice', 'finished', 'began', 'started'],
  Family: ['grandmother', 'grandfather', 'aunt', 'uncle', 'cousin', 'daughter', 'son', 'granddaughter', 'family', 'generation', 'mother', 'father'],
  Adventure: ['drove', 'road', 'trip', 'ocean', 'mountain', 'travel', 'journey', 'crossed', 'adventure', 'escape', 'ran', 'fled'],
};

const TONES: { label: string; words: string[] }[] = [
  { label: 'Tender & Nostalgic', words: ['warm', 'remember', 'love', 'mother', 'home', 'smile', 'soft', 'tender', 'miss', 'long'] },
  { label: 'Reflective & Quiet', words: ['silence', 'listen', 'thought', 'understand', 'quiet', 'alone', 'reflect', 'finally', 'years'] },
  { label: 'Warm & Reverent', words: ['sacred', 'candle', 'tradition', 'light', 'gather', 'reverent', 'honor', 'generation'] },
  { label: 'Joyful & Lively', words: ['laugh', 'dance', 'race', 'shout', 'bright', 'joy', 'celebrate', 'feast', 'music'] },
  { label: 'Bittersweet', words: ['miss', 'gone', 'passed', 'tears', 'last', 'never', 'lost', 'goodbye', 'end'] },
  { label: 'Free & Exhilarated', words: ['drove', 'wind', 'freedom', 'ocean', 'edge', 'stars', 'open', 'wide', 'far'] },
  { label: 'Hopeful & Forward', words: ['hope', 'future', 'began', 'start', 'new', 'dream', 'next', 'tomorrow'] },
];

const YEAR_PATTERNS = [
  /\b(18[5-9]\d|19\d\d|20[0-3]\d)\b/g,
  /\b(eighteen\s+(?:eighty|ninety)[\w\s]{0,8})\b/i,
  /\b(nineteen[\s-]?(?:sixty|seventy|eighty|ninety)[\w\s]{0,8})\b/i,
  /\b(twenty[\s-]?(?:oh|twenty)[\w\s]{0,8})\b/i,
];

const ERA_MAP: { from: number; to: number; label: string }[] = [
  { from: 1900, to: 1919, label: 'Early 1900s' },
  { from: 1920, to: 1929, label: 'The 1920s' },
  { from: 1930, to: 1939, label: 'The 1930s' },
  { from: 1940, to: 1945, label: 'War Years 1940s' },
  { from: 1946, to: 1949, label: 'Post-War 1940s' },
  { from: 1950, to: 1959, label: 'The 1950s' },
  { from: 1960, to: 1969, label: 'The 1960s' },
  { from: 1970, to: 1979, label: 'The 1970s' },
  { from: 1980, to: 1989, label: 'The 1980s' },
  { from: 1990, to: 1999, label: 'The 1990s' },
  { from: 2000, to: 2009, label: 'Early 2000s' },
  { from: 2010, to: 2019, label: 'The 2010s' },
  { from: 2020, to: 2030, label: 'Early 2020s' },
];

function pickCategory(story: string): Category {
  const lower = story.toLowerCase();
  let best: Category = 'Family';
  let bestScore = 0;
  for (const cat of CATEGORIES) {
    const keywords: string[] = CATEGORY_KEYWORDS[cat];
    const score = keywords.reduce<number>(
      (acc, kw) => acc + (lower.includes(kw) ? 1 : 0),
      0,
    );
    if (score > bestScore) {
      bestScore = score;
      best = cat;
    }
  }
  return best;
}

function pickYear(story: string): { year: number; era: string } {
  for (const pattern of YEAR_PATTERNS) {
    const matches = [...story.matchAll(pattern)].map((m) => m[1]);
    if (matches.length) {
      const digits = matches[0].match(/\d{4}/);
      if (digits) {
        const year = parseInt(digits[0], 10);
        const era = ERA_MAP.find((e) => year >= e.from && year <= e.to)?.label ?? 'Mid-20th Century';
        return { year, era };
      }
    }
  }
  const now = new Date().getFullYear();
  return { year: now, era: 'Present Day' };
}

function pickTone(story: string): string {
  const lower = story.toLowerCase();
  let best = TONES[0].label;
  let bestScore = 0;
  for (const tone of TONES) {
    const score = tone.words.reduce((acc, w) => acc + (lower.includes(w) ? 1 : 0), 0);
    if (score > bestScore) {
      bestScore = score;
      best = tone.label;
    }
  }
  return best;
}

const STOP_WORDS = new Set([
  'the', 'and', 'but', 'for', 'with', 'that', 'this', 'was', 'were', 'had', 'have',
  'from', 'into', 'they', 'their', 'there', 'then', 'when', 'what', 'who', 'whom',
  'his', 'her', 'she', 'him', 'our', 'would', 'could', 'should', 'not', 'one', 'all',
  'about', 'after', 'before', 'between', 'them', 'been', 'are', 'is', 'it', 'to', 'of',
  'in', 'on', 'a', 'an', 'as', 'at', 'by', 'we', 'i', 'me', 'my', 'so', 'if', 'or',
]);

function extractTags(story: string): string[] {
  const words = story
    .toLowerCase()
    .replace(/[^a-z\s']/g, ' ')
    .split(/\s+/)
    .filter((w) => w.length > 3 && !STOP_WORDS.has(w));
  const freq = new Map<string, number>();
  for (const w of words) freq.set(w, (freq.get(w) ?? 0) + 1);
  return [...freq.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6)
    .map(([w]) => w);
}

function extractHighlights(story: string): string[] {
  const sentences = story
    .split(/(?<=[.!?])\s+/)
    .map((s) => s.trim())
    .filter((s) => s.length > 18 && s.length < 160);
  const scored = sentences.map((s) => {
    const lower = s.toLowerCase();
    let score = 0;
    for (const words of Object.values(CATEGORY_KEYWORDS)) {
      for (const w of words) if (lower.includes(w)) score += 1;
    }
    if (/\d{4}/.test(s)) score += 1;
    if (s.length < 110) score += 1;
    return { s, score };
  });
  return scored
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)
    .map((x) => x.s.replace(/\.$/, ''));
}

export interface AutoMetadata {
  category: Category;
  year: number;
  era: string;
  tone: string;
  highlights: string[];
  tags: string[];
}

export function autoTag(story: string): AutoMetadata {
  const { year, era } = pickYear(story);
  return {
    category: pickCategory(story),
    year,
    era,
    tone: pickTone(story),
    highlights: extractHighlights(story),
    tags: extractTags(story),
  };
}

export function askMemory(question: string, memory: {
  story: string;
  title: string;
  author: string;
  relation: string;
  highlights: string[];
  tags: string[];
  year: number;
  era: string;
  tone: string;
  location?: string;
}): string {
  const q = question.toLowerCase().trim();
  if (!q) return 'Ask me anything about this memory and I will search its pages for you.';

  const qWords = q.split(/\s+/).filter((w) => w.length > 2);

  const sentences = memory.story.split(/(?<=[.!?])\s+/);

  const scored = sentences.map((s) => {
    const lower = s.toLowerCase();
    let score = 0;
    for (const w of qWords) if (lower.includes(w)) score += 2;
    for (const tag of memory.tags) if (q.includes(tag)) score += 1;
    if (lower.includes(memory.author.toLowerCase().split(' ')[0])) score += 1;
    return { s, score };
  });

  const best = scored.sort((a, b) => b.score - a.score)[0];

  const whoMatch = /\b(who|grandmother|grandfather|mother|father|aunt|uncle|granddaughter|daughter|son|brother|sister)\b/.test(q);
  const whenMatch = /\b(when|year|date|how old|time)\b/.test(q);
  const whereMatch = /\b(where|place|location|city|town)\b/.test(q);
  const whatMatch = /\b(what|tell me about|describe)\b/.test(q);
  const feelingMatch = /\b(feel|felt|feeling|emotion|sad|happy|love)\b/.test(q);

  const intros: string[] = [];

  if (whoMatch) {
    intros.push(`${memory.author} appears in this memory as ${memory.relation.toLowerCase()}.`);
  }
  if (whenMatch) {
    intros.push(`This memory is set around ${memory.year} — ${memory.era}.`);
  }
  if (whereMatch && memory.location) {
    intros.push(`It takes place in ${memory.location}.`);
  }
  if (feelingMatch) {
    intros.push(`The tone of this memory is ${memory.tone.toLowerCase()}.`);
  }

  if (whatMatch && best && best.score > 0) {
    intros.push(`From the story: "${best.s.trim()}"`);
  } else if (best && best.score > 0) {
    intros.push(`Here is the passage most relevant to your question: "${best.s.trim()}"`);
  } else if (memory.highlights.length) {
    intros.push(`While no single passage matched your words, a key highlight reads: "${memory.highlights[0]}."`);
  } else {
    intros.push('I could not find a passage that directly addresses that, but the story may hold it between the lines. Try another question.');
  }

  return intros.join(' ');
}
