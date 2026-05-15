'use client';

export function Segmented<T extends string>({
  value,
  onChange,
  options,
}: {
  value: T;
  onChange: (next: T) => void;
  options: ReadonlyArray<{ value: T; label: string }>;
}) {
  return (
    <div className="inline-flex bg-paper border border-cocoa/15 rounded-full p-0.5 gap-0.5">
      {options.map((o) => (
        <button
          key={o.value}
          type="button"
          onClick={() => onChange(o.value)}
          className={`px-3 py-1 rounded-full text-xs transition ${
            value === o.value
              ? 'bg-olive-ink text-paper'
              : 'text-cocoa-soft hover:text-olive-ink'
          }`}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}
