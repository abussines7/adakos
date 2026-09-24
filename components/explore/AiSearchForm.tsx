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
    <form onSubmit={handleSubmit} className="flex w-full max-w-lg gap-2">
      <input
        type="text"
        value={query}
        maxLength={MAX_QUERY_LENGTH}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="kos putri jalan Bung, bebas banjir"
        aria-label="Pencarian AI"
        className="field flex-1"
      />
      <button type="submit" className="btn btn-signal shrink-0">
        <Sparkles size={15} aria-hidden="true" />
        Tanya AI
      </button>
    </form>
  );
}
