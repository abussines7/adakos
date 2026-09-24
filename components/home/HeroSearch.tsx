// components/home/HeroSearch.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search, Sparkles } from 'lucide-react';
import type { AreaOption } from '@/src/lib/areas';
import { MAX_QUERY_LENGTH } from '@/src/lib/ai-search';

type Mode = 'area' | 'ai';

export default function HeroSearch({ areas }: { areas: AreaOption[] }) {
  const router = useRouter();
  const [mode, setMode] = useState<Mode>('area');
  const [selectedArea, setSelectedArea] = useState('semua');
  const [aiQuery, setAiQuery] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (mode === 'area') {
      router.push(selectedArea === 'semua' ? '/explore' : `/explore?area=${encodeURIComponent(selectedArea)}`);
      return;
    }
    const query = aiQuery.trim();
    if (query) {
      router.push(`/explore?ai_query=${encodeURIComponent(query)}`);
    }
  };

  const modeButton = (value: Mode, label: React.ReactNode) => (
    <button
      type="button"
      aria-pressed={mode === value}
      onClick={() => setMode(value)}
      className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold transition-colors cursor-pointer ${
        mode === value ? 'bg-ink text-paper' : 'bg-white text-ink hover:bg-paper-deep'
      }`}
    >
      {label}
    </button>
  );

  return (
    <div>
      <div className="mb-3 inline-flex divide-x-2 divide-ink overflow-hidden rounded-sm border-2 border-ink">
        {modeButton('area', 'Pilih area')}
        {modeButton(
          'ai',
          <>
            <Sparkles size={13} aria-hidden="true" />
            Tanya AI
          </>
        )}
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-2 sm:flex-row">
        {mode === 'area' ? (
          <select
            aria-label="Area kos"
            value={selectedArea}
            onChange={(e) => setSelectedArea(e.target.value)}
            className="field cursor-pointer sm:flex-1"
          >
            <option value="semua">Semua area sekitar Unhas</option>
            {areas.map((a) => (
              <option key={a.id} value={a.slug}>
                {a.nama}
              </option>
            ))}
          </select>
        ) : (
          <input
            type="text"
            aria-label="Pertanyaan untuk pencarian AI"
            value={aiQuery}
            maxLength={MAX_QUERY_LENGTH}
            onChange={(e) => setAiQuery(e.target.value)}
            placeholder="kos putri dekat Sahabat di bawah 1 juta, bebas banjir"
            className="field sm:flex-1"
          />
        )}
        <button type="submit" className="btn btn-signal whitespace-nowrap">
          <Search size={16} aria-hidden="true" />
          {mode === 'area' ? 'Cari kos' : 'Tanya AI'}
        </button>
      </form>
    </div>
  );
}
