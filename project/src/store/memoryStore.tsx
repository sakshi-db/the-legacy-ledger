import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import type { Memory } from '../types';
import { SEED_MEMORIES } from '../data/seedMemories';

const STORAGE_KEY = 'legacy-ledger:memories:v1';

interface MemoryStore {
  memories: Memory[];
  addMemory: (m: Memory) => void;
  deleteMemory: (id: string) => void;
  resetToSeed: () => void;
}

const MemoryContext = createContext<MemoryStore | null>(null);

function loadMemories(): Memory[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as Memory[];
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch {
    /* ignore */
  }
  return SEED_MEMORIES;
}

export function MemoryProvider({ children }: { children: ReactNode }) {
  const [memories, setMemories] = useState<Memory[]>(() => loadMemories());

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(memories));
    } catch {
      /* ignore */
    }
  }, [memories]);

  const store = useMemo<MemoryStore>(
    () => ({
      memories,
      addMemory: (m) => setMemories((prev) => [m, ...prev]),
      deleteMemory: (id) => setMemories((prev) => prev.filter((m) => m.id !== id)),
      resetToSeed: () => setMemories(SEED_MEMORIES),
    }),
    [memories],
  );

  return <MemoryContext.Provider value={store}>{children}</MemoryContext.Provider>;
}

export function useMemories(): MemoryStore {
  const ctx = useContext(MemoryContext);
  if (!ctx) throw new Error('useMemories must be used within MemoryProvider');
  return ctx;
}
