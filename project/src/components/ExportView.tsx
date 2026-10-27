import { useEffect } from 'react';
import { Printer, X, BookOpenText } from 'lucide-react';
import type { Memory } from '../types';

interface ExportViewProps {
  memories: Memory[];
  onClose: () => void;
}

export function ExportView({ memories, onClose }: ExportViewProps) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handler);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', handler);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  const sorted = [...memories].sort((a, b) => a.year - b.year);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-cream-100">
      {/* Toolbar */}
      <div className="sticky top-0 z-10 flex items-center justify-between border-b border-cream-300/60 bg-cream-50/95 px-5 py-3 backdrop-blur-md no-print sm:px-8">
        <div className="flex items-center gap-2">
          <BookOpenText className="h-5 w-5 text-cream-800" strokeWidth={1.6} />
          <span className="text-sm font-medium text-cream-900">Export Archive · Print Preview</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handlePrint}
            className="flex items-center gap-2 rounded-full bg-cream-900 px-4 py-2 text-sm font-medium text-cream-100 shadow-page transition-transform hover:scale-105 active:scale-95"
          >
            <Printer className="h-4 w-4" strokeWidth={1.6} />
            Print / Save as PDF
          </button>
          <button
            onClick={onClose}
            className="rounded-full p-2 text-cream-700 transition-colors hover:bg-cream-200"
            aria-label="Close export"
          >
            <X className="h-5 w-5" strokeWidth={1.8} />
          </button>
        </div>
      </div>

      {/* Printable book */}
      <div className="mx-auto max-w-3xl px-8 py-12 sm:px-16 sm:py-20">
        {/* Title page */}
        <div className="mb-16 border-b border-cream-300 pb-12 text-center">
          <p className="journal-serif mb-2 text-sm uppercase tracking-[0.3em] text-cream-600">
            The Family Archive
          </p>
          <h1 className="mb-4 text-4xl font-semibold text-cream-900 sm:text-5xl">
            The Legacy Ledger
          </h1>
          <p className="journal-serif text-lg italic text-cream-700">
            A preserved collection of {sorted.length} {sorted.length === 1 ? 'memory' : 'memories'}{' '}
            and life stories, gathered across the generations.
          </p>
          <p className="mt-6 journal-serif text-sm text-cream-500">
            Compiled {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>

        {/* Chapters */}
        <div className="space-y-12">
          {sorted.map((memory, i) => (
            <article key={memory.id} className="break-inside-avoid">
              <div className="mb-4 flex items-baseline gap-3">
                <span className="journal-serif text-3xl font-semibold text-amber-800/70">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <div className="h-px flex-1 bg-cream-300" />
                <span className="journal-serif text-sm italic text-cream-600">{memory.era}</span>
              </div>

              <h2 className="mb-1 text-2xl font-semibold leading-tight text-cream-900">
                {memory.title}
              </h2>
              <p className="journal-serif mb-5 text-base italic text-cream-700">
                {memory.author} · {memory.relation}
                {memory.location ? ` · ${memory.location}` : ''}
                {memory.year ? ` · ${memory.year}` : ''}
              </p>

              <div className="journal-serif space-y-3 text-[16px] leading-[1.85] text-cream-900">
                {memory.story.split(/\n+/).filter(Boolean).map((p, j) => (
                  <p key={j}>{p}</p>
                ))}
              </div>

              {memory.highlights.length > 0 && (
                <div className="mt-5 border-l-2 border-amber-400/60 pl-4">
                  <p className="mb-1.5 journal-serif text-xs font-semibold uppercase tracking-wider text-amber-800">
                    Highlights
                  </p>
                  <ul className="space-y-1">
                    {memory.highlights.map((h, j) => (
                      <li key={j} className="journal-serif text-[15px] italic text-cream-700">
                        — {h}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {memory.tags.length > 0 && (
                <p className="mt-4 journal-serif text-xs italic text-cream-500">
                  Tags: {memory.tags.map((t) => `#${t}`).join('  ')}
                </p>
              )}
            </article>
          ))}
        </div>

        {/* Colophon */}
        <div className="mt-16 border-t border-cream-300 pt-8 text-center">
          <p className="journal-serif text-sm italic text-cream-600">
            “The light was how she always managed to be in the room.”
          </p>
          <p className="mt-4 journal-serif text-xs text-cream-500">
            — End of Archive —
          </p>
        </div>
      </div>
    </div>
  );
}
