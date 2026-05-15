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
