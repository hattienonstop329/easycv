export function Star({ className = '', color = '#3D4A2A' }: { className?: string; color?: string }) {
  return (
    <svg viewBox="0 0 40 40" className={className} fill="none" stroke={color} strokeWidth={2} strokeLinecap="round">
      <path d="M20 4 L23 17 L36 20 L23 23 L20 36 L17 23 L4 20 L17 17 Z" />
    </svg>
  );
}

export function Arrow({ className = '', color = '#3D4A2A' }: { className?: string; color?: string }) {
  return (
    <svg viewBox="0 0 120 80" className={className} fill="none" stroke={color} strokeWidth={2.5} strokeLinecap="round">
      <path d="M5,40 C25,10 60,10 95,40 C100,42 100,42 110,42" />
      <path d="M100,30 L110,42 L98,52" />
    </svg>
  );
}

export function Squiggle({ className = '', color = '#C77D7D' }: { className?: string; color?: string }) {
  return (
    <svg viewBox="0 0 200 20" className={className} fill="none" stroke={color} strokeWidth={2.5} strokeLinecap="round">
      <path d="M2,10 Q15,2 30,10 T60,10 T90,10 T120,10 T150,10 T180,10 T198,10" />
    </svg>
  );
}

export function Underline({ className = '', color = '#7A8B5C' }: { className?: string; color?: string }) {
  return (
    <svg viewBox="0 0 200 12" className={className} fill="none" stroke={color} strokeWidth={3} strokeLinecap="round">
      <path d="M5,8 C40,2 80,2 120,5 C150,7 180,4 195,3" />
    </svg>
  );
}

export function Heart({ className = '', color = '#C77D7D' }: { className?: string; color?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill={color} stroke={color} strokeWidth={1}>
      <path d="M12 21s-7-4.35-7-10a4 4 0 0 1 7-2.65A4 4 0 0 1 19 11c0 5.65-7 10-7 10z" />
    </svg>
  );
}

export function CoffeeCup({ className = '', color = '#4A3F35' }: { className?: string; color?: string }) {
  return (
    <svg viewBox="0 0 50 50" className={className} fill="none" stroke={color} strokeWidth={2} strokeLinecap="round">
      <path d="M10 18 L10 36 C10 40 14 42 18 42 L30 42 C34 42 38 40 38 36 L38 18 Z" />
      <path d="M38 22 L42 22 C45 22 46 24 46 27 C46 30 45 32 42 32 L38 32" />
      <path d="M16 8 C18 10 16 13 18 15" />
      <path d="M22 6 C24 8 22 11 24 13" />
      <path d="M28 8 C30 10 28 13 30 15" />
    </svg>
  );
}

export function PaperPlane({ className = '', color = '#5D6E42' }: { className?: string; color?: string }) {
  return (
    <svg viewBox="0 0 60 60" className={className} fill="none" stroke={color} strokeWidth={2} strokeLinejoin="round">
      <path d="M5 30 L55 8 L42 52 L30 35 L48 14 L18 32 Z" />
    </svg>
  );
}

export function Flower({ className = '', color = '#C77D7D' }: { className?: string; color?: string }) {
  return (
    <svg viewBox="0 0 40 40" className={className} fill="none" stroke={color} strokeWidth={2} strokeLinecap="round">
      <circle cx="20" cy="20" r="3" fill={color} />
      <path d="M20 5 C24 10 24 14 20 17 C16 14 16 10 20 5 Z" fill={color} fillOpacity="0.6" />
      <path d="M35 20 C30 24 26 24 23 20 C26 16 30 16 35 20 Z" fill={color} fillOpacity="0.6" />
      <path d="M20 35 C16 30 16 26 20 23 C24 26 24 30 20 35 Z" fill={color} fillOpacity="0.6" />
      <path d="M5 20 C10 16 14 16 17 20 C14 24 10 24 5 20 Z" fill={color} fillOpacity="0.6" />
    </svg>
  );
}

export function Leaf({ className = '', color = '#7A8B5C' }: { className?: string; color?: string }) {
  return (
    <svg viewBox="0 0 40 40" className={className} fill="none" stroke={color} strokeWidth={2} strokeLinecap="round">
      <path d="M5 35 C10 5 30 5 35 20 C30 35 15 35 5 35 Z" fill={color} fillOpacity="0.3" />
      <path d="M5 35 C15 25 25 18 35 12" />
    </svg>
  );
}

export function Spiral({ className = '', color = '#3D4A2A' }: { className?: string; color?: string }) {
  return (
    <svg viewBox="0 0 60 60" className={className} fill="none" stroke={color} strokeWidth={2} strokeLinecap="round">
      <path d="M30 10 C40 10 50 18 50 30 C50 40 42 48 32 48 C24 48 18 42 18 34 C18 28 22 24 28 24 C32 24 35 27 35 31 C35 33 33 35 31 35" />
    </svg>
  );
}

// --- feature icons -- hand-drawn style, same line weight as doodles above.

export function SplitView({ className = '', color = '#3D4A2A' }: { className?: string; color?: string }) {
  return (
    <svg viewBox="0 0 60 48" className={className} fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <rect x="4" y="6" width="24" height="36" rx="2" />
      <rect x="32" y="6" width="24" height="36" rx="2" />
      <path d="M8 14 L24 14 M8 20 L20 20 M8 26 L22 26 M8 32 L18 32" />
      <path d="M36 14 L52 14 M36 20 L48 20 M36 26 L50 26" />
    </svg>
  );
}

export function DragHandle({ className = '', color = '#3D4A2A' }: { className?: string; color?: string }) {
  return (
    <svg viewBox="0 0 48 48" className={className} fill="none" stroke={color} strokeWidth={2} strokeLinecap="round">
      <circle cx="14" cy="12" r="2.5" fill={color} />
      <circle cx="14" cy="24" r="2.5" fill={color} />
      <circle cx="14" cy="36" r="2.5" fill={color} />
      <circle cx="30" cy="12" r="2.5" fill={color} />
      <circle cx="30" cy="24" r="2.5" fill={color} />
      <circle cx="30" cy="36" r="2.5" fill={color} />
      <path d="M40 14 L46 20 L40 26" />
      <path d="M40 32 L46 26" />
    </svg>
  );
}

export function Sparkles({ className = '', color = '#C77D7D' }: { className?: string; color?: string }) {
  return (
    <svg viewBox="0 0 48 48" className={className} fill="none" stroke={color} strokeWidth={2} strokeLinecap="round">
      <path d="M24 4 L26 14 L36 16 L26 18 L24 28 L22 18 L12 16 L22 14 Z" fill={color} fillOpacity="0.25" />
      <path d="M10 30 L11 36 L17 37 L11 38 L10 44 L9 38 L3 37 L9 36 Z" fill={color} fillOpacity="0.25" />
      <path d="M40 28 L41 34 L46 35 L41 36 L40 42 L39 36 L34 35 L39 34 Z" fill={color} fillOpacity="0.25" />
    </svg>
  );
}

export function Target({ className = '', color = '#5D6E42' }: { className?: string; color?: string }) {
  return (
    <svg viewBox="0 0 48 48" className={className} fill="none" stroke={color} strokeWidth={2} strokeLinecap="round">
      <circle cx="24" cy="24" r="18" />
      <circle cx="24" cy="24" r="11" />
      <circle cx="24" cy="24" r="4" fill={color} />
      <path d="M24 2 L24 8" />
      <path d="M24 40 L24 46" />
      <path d="M2 24 L8 24" />
      <path d="M40 24 L46 24" />
    </svg>
  );
}

export function Palette({ className = '', color = '#3D4A2A' }: { className?: string; color?: string }) {
  return (
    <svg viewBox="0 0 48 48" className={className} fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M24 4 C12 4 4 13 4 24 C4 33 11 40 19 40 C22 40 22 36 24 35 C26 34 30 36 34 36 C40 36 44 31 44 25 C44 13 35 4 24 4 Z" />
      <circle cx="14" cy="20" r="2" fill="#C77D7D" stroke="none" />
      <circle cx="22" cy="13" r="2" fill="#7A8B5C" stroke="none" />
      <circle cx="32" cy="17" r="2" fill="#3D4A2A" stroke="none" />
      <circle cx="34" cy="27" r="2" fill="#C19A4B" stroke="none" />
    </svg>
  );
}

export function TypeAa({ className = '', color = '#3D4A2A' }: { className?: string; color?: string }) {
  return (
    <svg viewBox="0 0 48 48" className={className} fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 38 L16 12 L26 38" />
      <path d="M10 28 L22 28" />
      <path d="M32 22 C32 18 34 16 38 16 C42 16 44 18 44 22 L44 38" />
      <path d="M44 30 C40 30 36 31 36 34 C36 37 38 38 41 38 C43 38 44 37 44 35" />
    </svg>
  );
}

export function Undo({ className = '', color = '#3D4A2A' }: { className?: string; color?: string }) {
  return (
    <svg viewBox="0 0 48 48" className={className} fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M8 20 C14 10 26 8 34 14 C42 20 42 32 34 38 C28 42 20 42 14 36" />
      <path d="M4 14 L8 22 L16 18" />
    </svg>
  );
}

export function Lock({ className = '', color = '#3D4A2A' }: { className?: string; color?: string }) {
  return (
    <svg viewBox="0 0 48 48" className={className} fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <rect x="8" y="22" width="32" height="22" rx="3" />
      <path d="M14 22 L14 16 C14 10 18 6 24 6 C30 6 34 10 34 16 L34 22" />
      <circle cx="24" cy="32" r="3" fill={color} />
      <path d="M24 35 L24 39" />
    </svg>
  );
}

export function DocPdf({ className = '', color = '#3D4A2A' }: { className?: string; color?: string }) {
  return (
    <svg viewBox="0 0 48 48" className={className} fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M10 4 L30 4 L40 14 L40 44 L10 44 Z" />
      <path d="M30 4 L30 14 L40 14" />
      <text x="14" y="36" fontSize="9" fontFamily="monospace" stroke="none" fill={color} fontWeight="700">PDF</text>
    </svg>
  );
}

export function ImageIcon({ className = '', color = '#3D4A2A' }: { className?: string; color?: string }) {
  return (
    <svg viewBox="0 0 48 48" className={className} fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <rect x="4" y="8" width="40" height="32" rx="3" />
      <circle cx="16" cy="20" r="3" fill={color} />
      <path d="M4 32 L16 22 L26 30 L34 24 L44 32" />
    </svg>
  );
}

export function CodeJson({ className = '', color = '#3D4A2A' }: { className?: string; color?: string }) {
  return (
    <svg viewBox="0 0 48 48" className={className} fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 8 C10 10 8 14 8 18 L8 22 C8 24 6 24 4 24 C6 24 8 24 8 26 L8 30 C8 34 10 38 16 40" />
      <path d="M32 8 C38 10 40 14 40 18 L40 22 C40 24 42 24 44 24 C42 24 40 24 40 26 L40 30 C40 34 38 38 32 40" />
      <circle cx="20" cy="24" r="1.5" fill={color} stroke="none" />
      <circle cx="24" cy="24" r="1.5" fill={color} stroke="none" />
      <circle cx="28" cy="24" r="1.5" fill={color} stroke="none" />
    </svg>
  );
}

export function ShareLink({ className = '', color = '#3D4A2A' }: { className?: string; color?: string }) {
  return (
    <svg viewBox="0 0 48 48" className={className} fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 28 C14 28 10 24 10 20 C10 16 14 12 18 12 L24 12" />
      <path d="M30 20 C34 20 38 24 38 28 C38 32 34 36 30 36 L24 36" />
      <path d="M16 24 L32 24" />
    </svg>
  );
}

export function Keyboard({ className = '', color = '#3D4A2A' }: { className?: string; color?: string }) {
  return (
    <svg viewBox="0 0 56 40" className={className} fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <rect x="4" y="6" width="48" height="28" rx="3" />
      <path d="M10 14 L12 14 M16 14 L18 14 M22 14 L24 14 M28 14 L30 14 M34 14 L36 14 M40 14 L42 14 M46 14 L48 14" />
      <path d="M10 22 L12 22 M16 22 L18 22 M22 22 L24 22 M28 22 L30 22 M34 22 L36 22 M40 22 L42 22 M46 22 L48 22" />
      <path d="M14 28 L42 28" strokeWidth={2.5} />
    </svg>
  );
}

export function Letter({ className = '', color = '#3D4A2A' }: { className?: string; color?: string }) {
  return (
    <svg viewBox="0 0 48 36" className={className} fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <rect x="4" y="4" width="40" height="28" rx="2" />
      <path d="M4 8 L24 22 L44 8" />
      <path d="M4 32 L18 18" />
      <path d="M44 32 L30 18" />
    </svg>
  );
}

export function Layers({ className = '', color = '#3D4A2A' }: { className?: string; color?: string }) {
  return (
    <svg viewBox="0 0 48 48" className={className} fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M24 6 L44 16 L24 26 L4 16 Z" />
      <path d="M4 24 L24 34 L44 24" />
      <path d="M4 32 L24 42 L44 32" />
    </svg>
  );
}

export function Broom({ className = '', color = '#3D4A2A' }: { className?: string; color?: string }) {
  return (
    <svg viewBox="0 0 48 48" className={className} fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M30 6 L42 18" />
      <path d="M28 8 L18 18 L30 30 L40 20 Z" />
      <path d="M18 18 L4 38" />
      <path d="M22 22 L10 42" />
      <path d="M26 26 L16 44" />
    </svg>
  );
}

export function Ruler({ className = '', color = '#3D4A2A' }: { className?: string; color?: string }) {
  return (
    <svg viewBox="0 0 48 48" className={className} fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <rect x="6" y="14" width="36" height="20" rx="2" transform="rotate(-15 24 24)" />
      <path d="M10 18 L11 22 M14 17 L15 21 M18 16 L19 20 M22 15 L23 19 M26 14 L28 20 M30 13 L31 17 M34 12 L35 16 M38 11 L39 15" />
    </svg>
  );
}

export function Upload({ className = '', color = '#3D4A2A' }: { className?: string; color?: string }) {
  return (
    <svg viewBox="0 0 48 48" className={className} fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M24 6 L24 30" />
      <path d="M14 16 L24 6 L34 16" />
      <path d="M8 36 L8 42 L40 42 L40 36" />
    </svg>
  );
}

export function PhotoFrame({ className = '', color = '#3D4A2A' }: { className?: string; color?: string }) {
  return (
    <svg viewBox="0 0 48 48" className={className} fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <rect x="6" y="6" width="36" height="36" rx="3" />
      <circle cx="18" cy="20" r="4" />
      <path d="M6 36 L18 26 L28 32 L42 22" />
    </svg>
  );
}
