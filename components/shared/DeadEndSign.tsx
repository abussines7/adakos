// components/shared/DeadEndSign.tsx
// Rambu "jalan buntu": persegi biru, batang putih dengan palang merah.

export default function DeadEndSign({ className = 'w-16 h-16' }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" className={className} role="img" aria-label="Rambu jalan buntu">
      <rect x="2" y="2" width="60" height="60" rx="6" fill="var(--water)" stroke="var(--ink)" strokeWidth="3" />
      <rect x="7" y="7" width="50" height="50" rx="3" fill="none" stroke="#fff" strokeWidth="2" />
      <rect x="27" y="24" width="10" height="28" fill="#fff" />
      <rect x="16" y="14" width="32" height="10" fill="var(--alert)" stroke="#fff" strokeWidth="2" />
    </svg>
  );
}
