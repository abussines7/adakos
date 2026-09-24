// components/explore/FilterSidebar.tsx
'use client';

import { useState } from 'react';
import { Check, ChevronDown } from 'lucide-react';
import LevelMeter from '@/components/shared/LevelMeter';
import { useExploreNavigation } from '@/hooks/useExploreNavigation';
import type { AreaOption } from '@/src/lib/areas';

const TIPE_OPTIONS = [
  { value: 'semua', label: 'Semua' },
  { value: 'putra', label: 'Putra' },
  { value: 'putri', label: 'Putri' },
  { value: 'campur', label: 'Campur' },
];

interface FilterSidebarProps {
  areas: AreaOption[];
  currentArea: string;
  currentTipe: string;
  onlyBebasBanjir: boolean;
  onlyJalanMulus: boolean;
}

function SectionLabel({ children, htmlFor }: { children: React.ReactNode; htmlFor?: string }) {
  const className = 'mb-2 block font-mono text-xs text-muted-ink';
  return htmlFor ? (
    <label htmlFor={htmlFor} className={className}>
      {children}
    </label>
  ) : (
    <span className={className}>{children}</span>
  );
}

function QuickToggle({ active, label, onToggle }: { active: boolean; label: string; onToggle: () => void }) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onToggle}
      className={`flex w-full items-center gap-3 rounded-sm border-2 px-3 py-2 text-left text-sm font-semibold transition-colors cursor-pointer ${
        active ? 'border-ink bg-sign-tint' : 'border-ink/20 bg-white hover:border-ink/50'
      }`}
    >
      <span
        aria-hidden="true"
        className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-[3px] border-2 ${
          active ? 'border-sign bg-sign text-white' : 'border-ink/40'
        }`}
      >
        {active && <Check size={11} strokeWidth={3.5} />}
      </span>
      <span className="flex-1">{label}</span>
      <LevelMeter level={1} />
    </button>
  );
}

export default function FilterSidebar({
  areas,
  currentArea,
  currentTipe,
  onlyBebasBanjir,
  onlyJalanMulus,
}: FilterSidebarProps) {
  const { setFilter, resetFilters } = useExploreNavigation();
  // Di layar kecil filter dilipat agar daftar kos langsung terlihat.
  const [openOnMobile, setOpenOnMobile] = useState(false);
  const activeCount =
    Number(currentArea !== 'semua') + Number(currentTipe !== 'semua') + Number(onlyBebasBanjir) + Number(onlyJalanMulus);

  return (
    <div className="panel overflow-hidden md:sticky md:top-24">
      <div className="flex items-center justify-between gap-3 bg-ink px-5 py-3 text-paper">
        <h2 className="font-bold">
          Saring kos
          {activeCount > 0 && <span className="ml-2 font-mono text-xs font-normal text-signal">{activeCount} aktif</span>}
        </h2>
        <div className="flex items-center gap-4">
          <button onClick={resetFilters} className="text-sm text-signal underline-offset-4 hover:underline cursor-pointer">
            Atur ulang
          </button>
          <button
            type="button"
            onClick={() => setOpenOnMobile((open) => !open)}
            aria-expanded={openOnMobile}
            aria-controls="filter-body"
            aria-label={openOnMobile ? 'Tutup filter' : 'Buka filter'}
            className="md:hidden cursor-pointer"
          >
            <ChevronDown size={20} aria-hidden="true" className={`transition-transform ${openOnMobile ? 'rotate-180' : ''}`} />
          </button>
        </div>
      </div>

      <div id="filter-body" className={`space-y-6 border-t-2 border-ink p-5 ${openOnMobile ? '' : 'hidden md:block'}`}>
        <div>
          <SectionLabel htmlFor="filter-area">Area</SectionLabel>
          <select
            id="filter-area"
            value={currentArea}
            onChange={(e) => setFilter('area', e.target.value)}
            className="field cursor-pointer"
          >
            <option value="semua">Semua area</option>
            {areas.map((a) => (
              <option key={a.id} value={a.slug}>
                {a.nama} ({a.jumlahKos})
              </option>
            ))}
          </select>
        </div>

        <div>
          <SectionLabel>Tipe kos</SectionLabel>
          <div className="grid grid-cols-2 overflow-hidden rounded-sm border-2 border-ink">
            {TIPE_OPTIONS.map(({ value, label }, idx) => {
              const isActive = currentTipe === value;
              return (
                <button
                  key={value}
                  type="button"
                  aria-pressed={isActive}
                  onClick={() => setFilter('tipe', value)}
                  className={`px-3 py-2 text-sm font-semibold transition-colors cursor-pointer ${
                    idx % 2 === 0 ? 'border-r-2 border-ink' : ''
                  } ${idx < 2 ? 'border-b-2 border-ink' : ''} ${
                    isActive ? 'bg-ink text-paper' : 'bg-white text-ink hover:bg-paper-deep'
                  }`}
                >
                  {label}
                </button>
              );
            })}
          </div>
        </div>

        <div>
          <SectionLabel>Akses</SectionLabel>
          <div className="space-y-2">
            <QuickToggle
              active={onlyBebasBanjir}
              label="Bebas banjir"
              onToggle={() => setFilter('status_banjir', onlyBebasBanjir ? '' : 'aman')}
            />
            <QuickToggle
              active={onlyJalanMulus}
              label="Jalan mulus"
              onToggle={() => setFilter('kondisi_jalan', onlyJalanMulus ? '' : 'mulus')}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
