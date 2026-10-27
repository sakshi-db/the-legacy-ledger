import { Search, X } from 'lucide-react';
import { CATEGORIES } from '../data/seedMemories';
import type { Category } from '../types';

interface FiltersProps {
  query: string;
  setQuery: (q: string) => void;
  activeCategory: Category | 'All';
  setActiveCategory: (c: Category | 'All') => void;
  resultCount: number;
}

const CATEGORY_ICONS: Record<Category | 'All', string> = {
  All: '✦',
  Childhood: '☊',
  Traditions: '❋',
  Wisdom: '❂',
  Milestones: '◈',
  Family: '✿',
  Adventure: '↟',
};

export function Filters({
  query,
  setQuery,
  activeCategory,
  setActiveCategory,
  resultCount,
}: FiltersProps) {
  const cats: (Category | 'All')[] = ['All', ...CATEGORIES];

  return (
    <div className="sticky top-[73px] z-20 -mx-5 mb-8 border-b border-cream-300/50 bg-cream-50/95 px-5 py-4 backdrop-blur-md sm:-mx-8 sm:px-8 no-print">
      <div className="mx-auto max-w-6xl">
        <div className="relative mb-4">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-cream-600" strokeWidth={1.6} />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search memories by keyword, name, or tag…"
            className="w-full rounded-full border border-cream-300 bg-cream-100/70 py-3 pl-11 pr-10 text-sm text-cream-900 placeholder:text-cream-500 focus:border-cream-500 focus:outline-none focus:ring-2 focus:ring-cream-400/40"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1 text-cream-600 hover:bg-cream-200"
              aria-label="Clear search"
            >
              <X className="h-4 w-4" strokeWidth={1.8} />
            </button>
          )}
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {cats.map((cat) => {
            const active = activeCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-medium transition-all ${
                  active
                    ? 'bg-cream-900 text-cream-100 shadow-page'
                    : 'border border-cream-300/80 text-cream-700 hover:border-cream-500 hover:bg-cream-200/50'
                }`}
              >
                <span className="text-[10px] opacity-70">{CATEGORY_ICONS[cat]}</span>
                {cat}
              </button>
            );
          })}
          <span className="ml-auto text-xs italic text-cream-600 journal-serif">
            {resultCount} {resultCount === 1 ? 'entry' : 'entries'} found
          </span>
        </div>
      </div>
    </div>
  );
}
