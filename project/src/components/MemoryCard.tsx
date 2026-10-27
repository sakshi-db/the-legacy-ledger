import { Calendar, MapPin, Mic, Quote } from 'lucide-react';
import type { Memory } from '../types';

interface MemoryCardProps {
  memory: Memory;
  onOpen: (memory: Memory) => void;
}

const CATEGORY_TINT: Record<Memory['category'], string> = {
  Childhood: 'bg-amber-100 text-amber-900 border-amber-300/70',
  Traditions: 'bg-rose-50 text-rose-900 border-rose-200/70',
  Wisdom: 'bg-emerald-50 text-emerald-900 border-emerald-200/70',
  Milestones: 'bg-sky-50 text-sky-900 border-sky-200/70',
  Family: 'bg-cream-200 text-cream-900 border-cream-400/70',
  Adventure: 'bg-indigo-50 text-indigo-900 border-indigo-200/70',
};

export function MemoryCard({ memory, onOpen }: MemoryCardProps) {
  return (
    <article
      onClick={() => onOpen(memory)}
      className="group cursor-pointer overflow-hidden rounded-2xl border border-cream-300/60 bg-cream-50 shadow-page transition-all duration-300 hover:-translate-y-1 hover:shadow-archive"
    >
      {memory.photoUrl && (
        <div className="relative h-44 overflow-hidden">
          <img
            src={memory.photoUrl}
            alt={memory.title}
            loading="lazy"
            className="h-full w-full object-cover grayscale-[0.15] sepia-[0.12] transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-cream-900/40 via-transparent to-transparent" />
          <span
            className={`absolute left-3 top-3 rounded-full border px-2.5 py-1 text-[11px] font-medium backdrop-blur-sm ${CATEGORY_TINT[memory.category]}`}
          >
            {memory.category}
          </span>
        </div>
      )}
      <div className="p-5">
        <div className="mb-2 flex items-center gap-3 text-xs text-cream-600">
          <span className="flex items-center gap-1">
            <Calendar className="h-3 w-3" strokeWidth={1.8} />
            {memory.year}
          </span>
          {memory.location && (
            <span className="flex items-center gap-1 truncate">
              <MapPin className="h-3 w-3" strokeWidth={1.8} />
              {memory.location}
            </span>
          )}
          {memory.audioNote && (
            <span className="flex items-center gap-1 text-cream-700">
              <Mic className="h-3 w-3" strokeWidth={1.8} />
              {Math.round(memory.audioNote.duration)}s
            </span>
          )}
        </div>
        <h3 className="mb-1.5 text-lg font-semibold leading-snug text-cream-900 transition-colors group-hover:text-amber-900">
          {memory.title}
        </h3>
        <p className="journal-serif mb-3 text-[15px] italic leading-relaxed text-cream-700">
          <Quote className="mr-1 inline h-3.5 w-3.5 -translate-y-0.5 text-cream-400" strokeWidth={1.6} />
          {memory.story.slice(0, 140)}…
        </p>
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-cream-700">
            {memory.author} · <span className="text-cream-500">{memory.relation}</span>
          </span>
          <span className="text-[11px] italic text-cream-500">{memory.tone}</span>
        </div>
        {memory.tags.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {memory.tags.slice(0, 4).map((tag) => (
              <span
                key={tag}
                className="rounded-full bg-cream-200/70 px-2 py-0.5 text-[10px] text-cream-700"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </article>
  );
}
