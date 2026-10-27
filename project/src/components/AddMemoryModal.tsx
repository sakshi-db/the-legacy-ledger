import { useEffect, useRef, useState } from 'react';
import { Calendar, MapPin, Mic, Square, Sparkles, Upload, X, Check } from 'lucide-react';
import type { Category, Memory } from '../types';
import { CATEGORIES } from '../data/seedMemories';
import { autoTag } from '../utils/aiMetadata';
import { useMemories } from '../store/memoryStore';
import { useVoiceRecorder } from '../hooks/useVoiceRecorder';

interface AddMemoryModalProps {
  open: boolean;
  onClose: () => void;
}

const CATEGORY_TINT: Record<Category, string> = {
  Childhood: 'bg-amber-100 text-amber-900 border-amber-300/70',
  Traditions: 'bg-rose-50 text-rose-900 border-rose-200/70',
  Wisdom: 'bg-emerald-50 text-emerald-900 border-emerald-200/70',
  Milestones: 'bg-sky-50 text-sky-900 border-sky-200/70',
  Family: 'bg-cream-200 text-cream-900 border-cream-400/70',
  Adventure: 'bg-indigo-50 text-indigo-900 border-indigo-200/70',
};

export function AddMemoryModal({ open, onClose }: AddMemoryModalProps) {
  const { addMemory } = useMemories();
  const { isRecording, duration, levels, start, stop } = useVoiceRecorder();

  const [title, setTitle] = useState('');
  const [story, setStory] = useState('');
  const [author, setAuthor] = useState('');
  const [relation, setRelation] = useState('');
  const [date, setDate] = useState('');
  const [location, setLocation] = useState('');
  const [audioDuration, setAudioDuration] = useState<number | null>(null);
  const [photoUrl, setPhotoUrl] = useState<string | undefined>(undefined);
  const [metadata, setMetadata] = useState<ReturnType<typeof autoTag> | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!open) {
      setTitle('');
      setStory('');
      setAuthor('');
      setRelation('');
      setDate('');
      setLocation('');
      setAudioDuration(null);
      setPhotoUrl(undefined);
      setMetadata(null);
    }
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handler);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', handler);
      document.body.style.overflow = '';
    };
  }, [open, onClose]);

  if (!open) return null;

  const runAnalysis = () => {
    if (story.trim().length < 20) return;
    setIsAnalyzing(true);
    setTimeout(() => {
      setMetadata(autoTag(story));
      setIsAnalyzing(false);
    }, 900);
  };

  const handleStop = () => {
    stop();
    setAudioDuration(duration);
  };

  const handlePhoto = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setPhotoUrl(reader.result as string);
    reader.readAsDataURL(file);
  };

  const canSubmit = title.trim() && story.trim().length >= 20 && author.trim();

  const handleSubmit = () => {
    if (!canSubmit || !metadata) return;
    const memory: Memory = {
      id: `mem-${Date.now()}`,
      title: title.trim(),
      story: story.trim(),
      author: author.trim(),
      relation: relation.trim() || 'Family',
      category: metadata.category,
      year: metadata.year,
      era: metadata.era,
      date: date || undefined,
      location: location.trim() || undefined,
      tone: metadata.tone,
      highlights: metadata.highlights,
      tags: metadata.tags,
      photoUrl,
      audioNote: audioDuration
        ? { duration: audioDuration, transcript: 'Audio recording preserved with this memory.' }
        : undefined,
      createdAt: Date.now(),
    };
    addMemory(memory);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-cream-950/50 p-4 backdrop-blur-sm no-print sm:p-8">
      <div
        className="absolute inset-0"
        onClick={onClose}
      />
      <div className="relative my-auto w-full max-w-2xl animate-fadeUp rounded-3xl border border-cream-300 bg-cream-50 shadow-archive">
        <div className="sticky top-0 z-10 flex items-center justify-between rounded-t-3xl border-b border-cream-300/70 bg-cream-50/95 px-6 py-4 backdrop-blur-md">
          <h2 className="text-xl font-semibold text-cream-900">Record a Memory</h2>
          <button
            onClick={onClose}
            className="rounded-full p-2 text-cream-600 transition-colors hover:bg-cream-200"
            aria-label="Close"
          >
            <X className="h-5 w-5" strokeWidth={1.8} />
          </button>
        </div>

        <div className="space-y-6 px-6 py-6">
          {/* Voice recorder */}
          <div className="rounded-2xl border border-cream-300/70 bg-cream-100/60 p-5">
            <div className="mb-3 flex items-center gap-2">
              <Mic className="h-4 w-4 text-cream-700" strokeWidth={1.6} />
              <span className="text-sm font-medium text-cream-800">Voice Note</span>
              {audioDuration !== null && !isRecording && (
                <span className="ml-auto flex items-center gap-1 text-xs text-emerald-700">
                  <Check className="h-3 w-3" /> {audioDuration}s recorded
                </span>
              )}
            </div>

            {/* Wave visualization */}
            <div className="flex h-16 items-center justify-center gap-[3px] rounded-xl bg-cream-50/80">
              {levels.map((lvl, i) => (
                <div
                  key={i}
                  className="w-[4px] rounded-full bg-cream-500/70 transition-all duration-75"
                  style={{
                    height: `${Math.max(8, lvl * 56)}px`,
                    opacity: isRecording ? 0.9 : 0.3,
                    animation: isRecording ? undefined : 'softPulse 2s ease-in-out infinite',
                    animationDelay: `${i * 80}ms`,
                  }}
                />
              ))}
            </div>

            <div className="mt-3 flex items-center justify-between">
              <span className="journal-serif text-sm italic text-cream-600">
                {isRecording ? `Recording… ${duration}s` : 'Capture the voice behind the story'}
              </span>
              {isRecording ? (
                <button
                  onClick={handleStop}
                  className="flex items-center gap-2 rounded-full bg-rose-600 px-4 py-2 text-sm font-medium text-white shadow-page transition-transform hover:scale-105 active:scale-95"
                >
                  <Square className="h-3.5 w-3.5 fill-current" />
                  Stop
                </button>
              ) : (
                <button
                  onClick={start}
                  className="flex items-center gap-2 rounded-full bg-cream-900 px-4 py-2 text-sm font-medium text-cream-100 shadow-page transition-transform hover:scale-105 active:scale-95"
                >
                  <Mic className="h-3.5 w-3.5" />
                  Record
                </button>
              )}
            </div>
          </div>

          {/* Title */}
          <div>
            <label className="mb-1.5 block text-sm font-medium text-cream-800">Title</label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="A name for this memory…"
              className="w-full rounded-xl border border-cream-300 bg-cream-100/50 px-4 py-2.5 text-sm text-cream-900 placeholder:text-cream-500 focus:border-cream-500 focus:outline-none focus:ring-2 focus:ring-cream-400/30"
            />
          </div>

          {/* Story */}
          <div>
            <label className="mb-1.5 block text-sm font-medium text-cream-800">The Story</label>
            <textarea
              value={story}
              onChange={(e) => setStory(e.target.value)}
              onBlur={runAnalysis}
              rows={6}
              placeholder="Tell the story in your own words. Include names, places, and the feelings that come back to you…"
              className="w-full rounded-xl border border-cream-300 bg-cream-100/50 px-4 py-3 text-[15px] leading-relaxed text-cream-900 placeholder:text-cream-500 focus:border-cream-500 focus:outline-none focus:ring-2 focus:ring-cream-400/30 journal-serif"
            />
            <p className="mt-1.5 text-xs italic text-cream-500">
              When you finish writing, the ledger will suggest an era, category, tone, and highlights.
            </p>
          </div>

          {/* Author + Relation */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-cream-800">Told by</label>
              <input
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                placeholder="e.g. Margaret Holloway"
                className="w-full rounded-xl border border-cream-300 bg-cream-100/50 px-4 py-2.5 text-sm text-cream-900 placeholder:text-cream-500 focus:border-cream-500 focus:outline-none focus:ring-2 focus:ring-cream-400/30"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-cream-800">Relation</label>
              <input
                value={relation}
                onChange={(e) => setRelation(e.target.value)}
                placeholder="e.g. Grandmother"
                className="w-full rounded-xl border border-cream-300 bg-cream-100/50 px-4 py-2.5 text-sm text-cream-900 placeholder:text-cream-500 focus:border-cream-500 focus:outline-none focus:ring-2 focus:ring-cream-400/30"
              />
            </div>
          </div>

          {/* Date + Location */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1.5 flex items-center gap-1.5 text-sm font-medium text-cream-800">
                <Calendar className="h-3.5 w-3.5" strokeWidth={1.8} /> Date
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full rounded-xl border border-cream-300 bg-cream-100/50 px-4 py-2.5 text-sm text-cream-900 focus:border-cream-500 focus:outline-none focus:ring-2 focus:ring-cream-400/30"
              />
            </div>
            <div>
              <label className="mb-1.5 flex items-center gap-1.5 text-sm font-medium text-cream-800">
                <MapPin className="h-3.5 w-3.5" strokeWidth={1.8} /> Location
              </label>
              <input
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g. Portland, Oregon"
                className="w-full rounded-xl border border-cream-300 bg-cream-100/50 px-4 py-2.5 text-sm text-cream-900 placeholder:text-cream-500 focus:border-cream-500 focus:outline-none focus:ring-2 focus:ring-cream-400/30"
              />
            </div>
          </div>

          {/* Photo */}
          <div>
            <label className="mb-1.5 block text-sm font-medium text-cream-800">Photo</label>
            <div className="flex items-center gap-4">
              <button
                onClick={() => fileRef.current?.click()}
                className="flex items-center gap-2 rounded-xl border border-dashed border-cream-400 px-4 py-2.5 text-sm text-cream-700 transition-colors hover:bg-cream-200/50"
              >
                <Upload className="h-4 w-4" strokeWidth={1.6} />
                Attach a photo
              </button>
              <input ref={fileRef} type="file" accept="image/*" onChange={handlePhoto} className="hidden" />
              {photoUrl && (
                <img src={photoUrl} alt="preview" className="h-16 w-16 rounded-lg object-cover shadow-page" />
              )}
            </div>
          </div>

          {/* AI Metadata */}
          {isAnalyzing && (
            <div className="flex items-center gap-3 rounded-xl border border-cream-300 bg-cream-100/60 px-4 py-3">
              <Sparkles className="h-4 w-4 animate-softPulse text-amber-600" />
              <span className="text-sm italic text-cream-700">Reading the story and gathering its threads…</span>
            </div>
          )}

          {metadata && !isAnalyzing && (
            <div className="animate-fadeUp rounded-2xl border border-amber-300/50 bg-amber-50/60 p-5">
              <div className="mb-3 flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-amber-700" />
                <span className="text-sm font-semibold text-amber-900">Suggested by the Ledger</span>
              </div>
              <div className="mb-3 flex flex-wrap gap-2">
                <span className={`rounded-full border px-2.5 py-1 text-[11px] font-medium ${CATEGORY_TINT[metadata.category]}`}>
                  {metadata.category}
                </span>
                <span className="rounded-full border border-cream-300 bg-cream-100 px-2.5 py-1 text-[11px] text-cream-800">
                  {metadata.era} · {metadata.year}
                </span>
                <span className="rounded-full border border-cream-300 bg-cream-100 px-2.5 py-1 text-[11px] italic text-cream-700">
                  {metadata.tone}
                </span>
              </div>
              {metadata.highlights.length > 0 && (
                <ul className="mb-2 space-y-1">
                  {metadata.highlights.map((h, i) => (
                    <li key={i} className="flex gap-2 text-sm text-cream-800">
                      <span className="text-amber-600">•</span>
                      <span className="journal-serif italic">{h}</span>
                    </li>
                  ))}
                </ul>
              )}
              <div className="flex flex-wrap gap-1.5">
                {metadata.tags.map((tag) => (
                  <span key={tag} className="rounded-full bg-cream-200/70 px-2 py-0.5 text-[10px] text-cream-700">
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 flex items-center justify-end gap-3 rounded-b-3xl border-t border-cream-300/70 bg-cream-50/95 px-6 py-4 backdrop-blur-md">
          <button
            onClick={onClose}
            className="rounded-full px-5 py-2 text-sm font-medium text-cream-700 transition-colors hover:bg-cream-200"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={!canSubmit || !metadata}
            className="rounded-full bg-cream-900 px-5 py-2 text-sm font-medium text-cream-100 shadow-page transition-all hover:scale-[1.02] active:scale-95 disabled:cursor-not-allowed disabled:opacity-40"
          >
            {metadata ? 'Save to the Ledger' : 'Analyze first to save'}
          </button>
        </div>
      </div>
    </div>
  );
}
