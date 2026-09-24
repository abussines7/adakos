// components/explore/AiSearchForm.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Sparkles } from 'lucide-react';
import { MAX_QUERY_LENGTH } from '@/src/lib/ai-search';

export default function AiSearchForm({ initialQuery }: { initialQuery: string }) {
  const router = useRouter();
  const [query, setQuery] = useState(initialQuery);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = query.trim();
    router.push(trimmed ? `/explore?ai_query=${encodeURIComponent(trimmed)}` : '/explore');
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 max-w-md w-full">
      <input
        type="text"
        value={query}
        maxLength={MAX_QUERY_LENGTH}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Cari dengan AI (misal: kos putri jalan bung)"
        aria-label="Pencarian AI"
        className="flex-grow px-4 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 outline-none text-sm bg-white"
      />
      <button
        type="submit"
        className="bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white px-4 py-2.5 rounded-xl font-semibold text-sm transition-all flex items-center gap-1.5 cursor-pointer shrink-0 shadow-sm"
      >
        <Sparkles size={14} className="animate-pulse" />
        <span>AI Search</span>
      </button>
    </form>
  );
}
