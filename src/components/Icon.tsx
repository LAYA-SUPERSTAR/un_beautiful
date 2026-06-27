import React from 'react';

const iconPaths: Record<string, string> = {
  AlertTriangle: 'M21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3ZM12 9v4M12 17h.01',
  ShieldCheck: 'M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Zm0-8 2 2 4-4',
  Star: 'M12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2',
  Sparkles: 'M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z',
  Share2: 'M18 5a3 3 0 1 1 0 6 3 3 0 0 1 0-6Zm-12 7a3 3 0 1 1 0 6 3 3 0 0 1 0-6Zm12 7a3 3 0 1 1 0 6 3 3 0 0 1 0-6Zm-6-4 6.41 3.49-6.41 3.51M6 12l6.41-3.49L6 5',
  Droplets: 'M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Zm-4-10h.01Zm4 0h.01Zm4 0h.01',
  User: 'M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2M12 7a4 4 0 1 1-8 0 4 4 0 0 1 8 0Z',
  LayoutGrid: 'M3 3h7v7H3V3Zm11 0h7v7h-7V3Zm0 11h7v7h-7v-7Zm-11 0h7v7H3v-7Z',
  Palette: 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-4 10a2 2 0 1 1 4 0 2 2 0 0 1-4 0zm8 0a2 2 0 1 1 4 0 2 2 0 0 1-4 0zm-8 4a2 2 0 1 1 4 0 2 2 0 0 1-4 0zm4-8a2 2 0 1 1 4 0 2 2 0 0 1-4 0z',
  Zap: 'M13 2 3 14h9l-1 8 10-8h-9l1-8z',
  Download: 'M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3',
  X: 'M18 6L6 18M6 6l12 12',
  Check: 'M20 6L9 17l-5-5',
  Copy: 'M16 1H4a2 2 0 0 0-2 2v14h2V3h12V1zm3 4H8a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h11a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2zm0 16H8V7h11v14z',
};

interface IconProps {
  name: string;
  className?: string;
  style?: React.CSSProperties;
}

export function Icon({ name, className = '', style }: IconProps) {
  const d = iconPaths[name] || iconPaths.Star;
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      style={style}
    >
      <path d={d} />
    </svg>
  );
}
