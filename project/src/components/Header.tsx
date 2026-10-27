import { BookOpenText, Plus, Printer } from 'lucide-react';

interface HeaderProps {
  onAdd: () => void;
  onExport: () => void;
  memoryCount: number;
}

export function Header({ onAdd, onExport, memoryCount }: HeaderProps) {
  return (
    <header className="sticky top-0 z-30 border-b border-cream-300/60 bg-cream-100/90 backdrop-blur-md no-print">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-4 sm:px-8">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-cream-900 text-cream-100 shadow-page">
            <BookOpenText className="h-5 w-5" strokeWidth={1.6} />
          </div>
          <div className="leading-tight">
            <h1 className="text-xl font-semibold tracking-tight text-cream-900 sm:text-2xl">
              The Legacy Ledger
            </h1>
            <p className="journal-serif text-sm italic text-cream-700">
              {memoryCount} {memoryCount === 1 ? 'memory' : 'memories'} preserved
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={onExport}
            className="hidden items-center gap-2 rounded-full border border-cream-400/70 px-4 py-2 text-sm font-medium text-cream-800 transition-colors hover:bg-cream-200/70 sm:flex"
          >
            <Printer className="h-4 w-4" strokeWidth={1.6} />
            Export Archive
          </button>
          <button
            onClick={onAdd}
            className="flex items-center gap-2 rounded-full bg-cream-900 px-4 py-2 text-sm font-medium text-cream-100 shadow-page transition-transform hover:scale-[1.02] active:scale-95"
          >
            <Plus className="h-4 w-4" strokeWidth={2} />
            <span className="hidden sm:inline">Record Memory</span>
            <span className="sm:hidden">New</span>
          </button>
        </div>
      </div>
    </header>
  );
}
