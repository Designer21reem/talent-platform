export function CrownLogo({ size = 32, className = '' }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 100 84"
      width={size}
      height={size}
      fill="currentColor"
      className={className}
      aria-label="THE VALUE logo"
    >
      {/* Crown body — three peaks */}
      <path d="M8,58 L8,44 L24,10 L34,44 L50,4 L66,44 L76,10 L92,44 L92,58 Z" />
      {/* Base bar */}
      <rect x="8" y="62" width="84" height="14" rx="2" />
      {/* Center circle gem */}
      <circle cx="50" cy="51" r="5" fillOpacity="0.28" />
    </svg>
  );
}
