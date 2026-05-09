export function Logo({ className = "h-8 w-8" }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden="true">
      <defs>
        <linearGradient id="ss-g" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#14F195" />
          <stop offset="55%" stopColor="#00C2FF" />
          <stop offset="100%" stopColor="#9945FF" />
        </linearGradient>
      </defs>
      <rect x="2" y="2" width="28" height="28" rx="8" fill="url(#ss-g)" />
      <path
        d="M10 13c0-1.7 1.5-3 3.5-3H21M22 19c0 1.7-1.5 3-3.5 3H11M10 16h12"
        stroke="#0a0a0a"
        strokeWidth="2.2"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  );
}
