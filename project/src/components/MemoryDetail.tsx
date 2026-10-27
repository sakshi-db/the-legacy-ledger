import { useEffect, useRef, useState } from 'react';
import {
  Calendar,
  MapPin,
  Mic,
  Trash2,
  X,
  Send,
  MessageCircleQuestion,
  Sparkles,
  BookOpen,
  Tag,
} from 'lucide-react';
import type { Memory, Question } from '../types';
import { useMemories } from '../store/memoryStore';
import { askMemory } from '../utils/aiMetadata';

interface MemoryDetailProps {
  memory: Memory | null;
  onClose: () => void;
}

export function MemoryDetail({ memory, onClose }: MemoryDetailProps) {
  const { deleteMemory } = useMemories();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [draft, setDraft] = useState('');
  const [thinking, setThinking] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setQuestions([]);
    setDraft('');
  }, [memory?.id]);

  useEffect(() => {
    if (!memory) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handler);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', handler);
      document.body.style.overflow = '';
    };
  }, [memory, onClose]);

  if (!memory) return null;

  const handleAsk = () => {
    if (!draft.trim()) return;
    const question = draft.trim();
    setDraft('');
    setThinking(true);
    setTimeout(() => {
      const answer = askMemory(question, memory);
      setQuestions((prev) => [...prev, { question, answer, createdAt: Date.now() }]);
      setThinking(false);
      setTimeout(() => {
        scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
      }, 50);
    }, 800);
  };

  const handleDelete = () => {
    deleteMemory(memory.id);
    onClose();
  };

  const paragraphs = memory.story.split(/\n+/).filter(Boolean);

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-cream-950/60 p-4 backdrop-blur-sm no-print sm:p-8">
      <div className="absolute inset-0" onClick={onClose} />
      <div className="relative my-auto w-full max-w-3xl animate-fadeUp overflow-hidden rounded-3xl bg-cream-50 shadow-archive">
        {/* Close + delete */}
        <div className="absolute right-4 top-4 z-20 flex gap-2">
          <button
            onClick={handleDelete}
            className="rounded-full bg-cream-50/80 p-2 text-cream-600 backdrop-blur-sm transition-colors hover:bg-rose-50 hover:text-rose-700"
            aria-label="Delete memory"
          >
            <Trash2 className="h-4 w-4" strokeWidth={1.6} />
          </button>
          <button
            onClick={onClose}
            className="rounded-full bg-cream-50/80 p-2 text-cream-700 backdrop-blur-sm transition-colors hover:bg-cream-200"
            aria-label="Close"
          >
            <X className="h-5 w-5" strokeWidth={1.8} />
          </button>
        </div>

        <div ref={scrollRef} className="max-h-[88vh] overflow-y-auto scrollbar-soft">
          {/* Photo header */}
          {memory.photoUrl && (
            <div className="relative h-56 sm:h-72">
              <img
                src={memory.photoUrl}
                alt={memory.title}
                className="h-full w-full object-cover grayscale-[0.1] sepia-[0.15]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-cream-50 via-cream-50/20 to-transparent" />
            </div>
          )}

          {/* Book page body */}
          <div className="book-page relative px-6 py-8 sm:px-12 sm:py-10">
            <div className="pointer-events-none absolute left-0 top-0 h-full w-1.5 bg-gradient-to-b from-cream-400/40 via-cream-400/20 to-transparent" />

            <div className="mb-4 flex flex-wrap items-center gap-2 text-xs text-cream-600">
              <span className="flex items-center gap-1 rounded-full bg-cream-200/70 px-2.5 py-1 font-medium text-cream-800">
                <BookOpen className="h-3 w-3" strokeWidth={1.8} />
                {memory.category}
              </span>
              <span className="flex items-center gap-1">
                <Calendar className="h-3 w-3" strokeWidth={1.8} />
                {memory.year} · {memory.era}
              </span>
              {memory.location && (
                <span className="flex items-center gap-1">
                  <MapPin className="h-3 w-3" strokeWidth={1.8} />
                  {memory.location}
                </span>
              )}
              {memory.audioNote && (
                <span className="flex items-center gap-1 text-cream-700">
                  <Mic className="h-3 w-3" strokeWidth={1.8} />
                  {Math.round(memory.audioNote.duration)}s voice note
                </span>
              )}
            </div>

            <h2 className="mb-2 text-3xl font-semibold leading-tight text-cream-900 sm:text-4xl">
              {memory.title}
            </h2>
            <p className="journal-serif mb-8 text-lg italic text-cream-700">
              {memory.author} · {memory.relation}
              <span className="mx-2 text-cream-300">|</span>
              <span className="text-cream-600">{memory.tone}</span>
            </p>

            <div className="journal-serif space-y-4 text-[17px] leading-[1.85] text-cream-900 sm:text-[18px]">
              {paragraphs.map((p, i) => (
                <p key={i} className={i === 0 ? 'first-letter:float-left first-letter:mr-2 first-letter:font-serif first-letter:text-5xl first-letter:font-semibold first-letter:leading-[0.8] first-letter:text-amber-800' : ''}>
                  {p}
                </p>
              ))}
            </div>

            {/* Highlights */}
            {memory.highlights.length > 0 && (
              <div className="mt-8 rounded-2xl border border-cream-300/60 bg-cream-100/50 p-5">
                <div className="mb-3 flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-amber-700" />
                  <span className="text-sm font-semibold text-cream-900">Highlights</span>
                </div>
                <ul className="space-y-2">
                  {memory.highlights.map((h, i) => (
                    <li key={i} className="flex gap-2.5 journal-serif text-[15px] italic text-cream-800">
                      <span className="mt-1 text-amber-600">✦</span>
                      <span>{h}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Tags */}
            {memory.tags.length > 0 && (
              <div className="mt-6 flex flex-wrap items-center gap-1.5">
                <Tag className="h-3.5 w-3.5 text-cream-500" strokeWidth={1.6} />
                {memory.tags.map((tag) => (
                  <span key={tag} className="rounded-full bg-cream-200/70 px-2.5 py-0.5 text-[11px] text-cream-700">
                    #{tag}
                  </span>
                ))}
              </div>
            )}

            {/* Ask the Memory */}
            <div className="mt-10 rounded-2xl border border-amber-300/50 bg-amber-50/40 p-5">
              <div className="mb-4 flex items-center gap-2">
                <MessageCircleQuestion className="h-4 w-4 text-amber-800" strokeWidth={1.6} />
                <h3 className="text-sm font-semibold text-amber-900">Ask the Memory</h3>
                <span className="text-[11px] italic text-amber-700/70">
                  Ask anything — the ledger will search the story for you
                </span>
              </div>

              <div className="mb-4 space-y-3">
                {questions.length === 0 && !thinking && (
                  <p className="journal-serif text-sm italic text-cream-600">
                    Try: "What did {memory.author.split(' ')[0]} say about home?" or "Where did this take place?"
                  </p>
                )}
                {questions.map((q, i) => (
                  <div key={i} className="space-y-2 animate-fadeUp">
                    <div className="flex justify-end">
                      <div className="max-w-[80%] rounded-2xl rounded-br-sm bg-cream-900 px-4 py-2.5 text-sm text-cream-100">
                        {q.question}
                      </div>
                    </div>
                    <div className="flex justify-start">
                      <div className="max-w-[85%] rounded-2xl rounded-bl-sm border border-amber-300/50 bg-cream-50 px-4 py-2.5 text-sm leading-relaxed text-cream-800 journal-serif">
                        {q.answer}
                      </div>
                    </div>
                  </div>
                ))}
                {thinking && (
                  <div className="flex items-center gap-2 text-sm italic text-cream-600">
                    <span className="flex gap-1">
                      <span className="h-2 w-2 animate-softPulse rounded-full bg-amber-600" style={{ animationDelay: '0ms' }} />
                      <span className="h-2 w-2 animate-softPulse rounded-full bg-amber-600" style={{ animationDelay: '200ms' }} />
                      <span className="h-2 w-2 animate-softPulse rounded-full bg-amber-600" style={{ animationDelay: '400ms' }} />
                    </span>
                    Searching the pages…
                  </div>
                )}
              </div>

              <div className="flex gap-2">
                <input
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleAsk()}
                  placeholder="Ask a question about this memory…"
                  className="flex-1 rounded-full border border-cream-300 bg-cream-50 px-4 py-2.5 text-sm text-cream-900 placeholder:text-cream-500 focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-400/30"
                />
                <button
                  onClick={handleAsk}
                  disabled={!draft.trim() || thinking}
                  className="flex items-center gap-1.5 rounded-full bg-amber-800 px-4 py-2.5 text-sm font-medium text-cream-50 transition-transform hover:scale-105 active:scale-95 disabled:opacity-40"
                >
                  <Send className="h-3.5 w-3.5" strokeWidth={1.8} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
