import type { Memory } from '../types';
import { MemoryCard } from './MemoryCard';

interface TimelineProps {
  memories: Memory[];
  onOpen: (memory: Memory) => void;
}

export function Timeline({ memories, onOpen }: TimelineProps) {
  if (memories.length === 0) {
    return (
      <div className="mx-auto max-w-md py-20 text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-cream-200">
          <span className="text-2xl text-cream-500">✦</span>
        </div>
        <h3 className="mb-2 text-lg font-semibold text-cream-800">No memories found</h3>
        <p className="journal-serif italic text-cream-600">
          Try a different search or category — or record a new memory to begin the archive.
        </p>
      </div>
    );
  }

  const sorted = [...memories].sort((a, b) => b.year - a.year);

  return (
    <div className="relative mx-auto max-w-6xl">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {sorted.map((memory, i) => (
          <div key={memory.id} className="animate-fadeUp" style={{ animationDelay: `${i * 60}ms` }}>
            <MemoryCard memory={memory} onOpen={onOpen} />
          </div>
        ))}
      </div>
    </div>
  );
}
