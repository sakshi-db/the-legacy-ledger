import { useMemo, useState } from 'react';
import { MemoryProvider, useMemories } from './store/memoryStore';
import { Header } from './components/Header';
import { Filters } from './components/Filters';
import { Timeline } from './components/Timeline';
import { AddMemoryModal } from './components/AddMemoryModal';
import { MemoryDetail } from './components/MemoryDetail';
import { ExportView } from './components/ExportView';
import type { Category, Memory } from './types';

function Ledger() {
  const { memories } = useMemories();
  const [query, setQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<Category | 'All'>('All');
  const [addOpen, setAddOpen] = useState(false);
  const [activeMemory, setActiveMemory] = useState<Memory | null>(null);
  const [exportOpen, setExportOpen] = useState(false);

  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim();
    return memories.filter((m) => {
      if (activeCategory !== 'All' && m.category !== activeCategory) return false;
      if (!q) return true;
      return (
        m.title.toLowerCase().includes(q) ||
        m.story.toLowerCase().includes(q) ||
        m.author.toLowerCase().includes(q) ||
        m.tags.some((t) => t.toLowerCase().includes(q)) ||
        m.location?.toLowerCase().includes(q) ||
        m.category.toLowerCase().includes(q)
      );
    });
  }, [memories, query, activeCategory]);

  return (
    <div className="min-h-screen paper-grain bg-cream-100 text-cream-900">
      <Header
        onAdd={() => setAddOpen(true)}
        onExport={() => setExportOpen(true)}
        memoryCount={memories.length}
      />

      <main className="mx-auto max-w-6xl px-5 py-8 sm:px-8">
        {/* Hero intro */}
        <section className="mb-10 text-center no-print">
          <p className="journal-serif mb-2 text-sm uppercase tracking-[0.25em] text-cream-600">
            Preserve the voices that shaped you
          </p>
          <h2 className="mb-3 text-3xl font-semibold text-cream-900 sm:text-4xl">
            Every family is an archive of stories.
          </h2>
          <p className="journal-serif mx-auto max-w-xl text-lg italic leading-relaxed text-cream-700">
            Record the memories that matter — in words or in voice — and the ledger keeps them
            safe, beautifully tagged, and ready to be revisited or passed on.
          </p>
        </section>

        <Filters
          query={query}
          setQuery={setQuery}
          activeCategory={activeCategory}
          setActiveCategory={setActiveCategory}
          resultCount={filtered.length}
        />

        <Timeline memories={filtered} onOpen={setActiveMemory} />
      </main>

      <footer className="mt-12 border-t border-cream-300/50 py-8 text-center no-print">
        <p className="journal-serif text-sm italic text-cream-600">
          The Legacy Ledger — kept privately on this device.
        </p>
      </footer>

      <AddMemoryModal open={addOpen} onClose={() => setAddOpen(false)} />
      <MemoryDetail memory={activeMemory} onClose={() => setActiveMemory(null)} />
      {exportOpen && <ExportView memories={memories} onClose={() => setExportOpen(false)} />}
    </div>
  );
}

export default function App() {
  return (
    <MemoryProvider>
      <Ledger />
    </MemoryProvider>
  );
}
