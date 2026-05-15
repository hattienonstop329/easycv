'use client';

import { ChangeEvent, useRef } from 'react';
import { useResume } from '@/lib/store';
import { COLOR_THEMES, FONTS, DENSITY_SCALES } from '@/lib/design-tokens';
import { Density, FontKey, PageFormat, PaperTexture } from '@/lib/types';
import { ColorChip } from '../controls/ColorChip';
import { Segmented } from '../controls/Segmented';

export function DesignPanel() {
  const c = useResume((s) => s.data.customization);
  const apply = useResume((s) => s.applyThemePreset);
  const update = useResume((s) => s.updateCustomization);
  const setPhoto = useResume((s) => s.setPhoto);
  const fileRef = useRef<HTMLInputElement>(null);

  const onPhoto = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setPhoto(typeof reader.result === 'string' ? reader.result : undefined);
    reader.readAsDataURL(file);
  };

  return (
    <div className="space-y-6">
      <Block title="color theme" hint="tap a swatch — every color updates instantly">
        <div className="grid grid-cols-3 gap-2">
          {COLOR_THEMES.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => apply(t.id)}
              className="bg-paper border border-cocoa/15 rounded-xl p-2 hover:border-cocoa/40 transition text-left"
            >
              <div className="flex gap-1 h-7 rounded overflow-hidden">
                <span className="flex-1" style={{ background: t.background }} />
                <span className="flex-1" style={{ background: t.accent }} />
                <span className="flex-1" style={{ background: t.sidebar }} />
              </div>
              <div className="text-xs mt-1.5 text-olive-ink">{t.name}</div>
            </button>
          ))}
        </div>
      </Block>

      <Block title="custom colors" hint="fine-tune any color the active template uses">
        <div className="grid grid-cols-2 gap-3">
          <ColorChip label="accent" value={c.accent} onChange={(v) => update({ accent: v })} />
          <ColorChip label="heading" value={c.heading} onChange={(v) => update({ heading: v })} />
          <ColorChip label="body text" value={c.text} onChange={(v) => update({ text: v })} />
          <ColorChip label="muted" value={c.muted} onChange={(v) => update({ muted: v })} />
          <ColorChip label="background" value={c.background} onChange={(v) => update({ background: v })} />
          <ColorChip label="sidebar" value={c.sidebar} onChange={(v) => update({ sidebar: v })} />
          <ColorChip label="sidebar text" value={c.sidebarText} onChange={(v) => update({ sidebarText: v })} />
        </div>
      </Block>

      <Block title="typography">
        <div className="space-y-3">
          <FontSelect
            label="headings"
            value={c.fontHead}
            onChange={(v) => update({ fontHead: v })}
          />
          <FontSelect
            label="body"
            value={c.fontBody}
            onChange={(v) => update({ fontBody: v })}
          />
        </div>
      </Block>

      <Block title="density">
        <Segmented
          value={c.density}
          onChange={(v) => update({ density: v as Density })}
          options={Object.values(DENSITY_SCALES).map((d) => ({ value: d.key, label: d.name }))}
        />
      </Block>

      <Block title="page format">
        <Segmented
          value={c.format}
          onChange={(v) => update({ format: v as PageFormat })}
          options={[
            { value: 'A4', label: 'A4 (210×297mm)' },
            { value: 'Letter', label: 'Letter (8.5×11in)' },
          ]}
        />
      </Block>

      <Block title="paper texture" hint="adds a subtle background pattern. plays nicest with creative templates.">
        <div className="grid grid-cols-3 gap-2">
          {(['plain', 'cream', 'lined', 'grid', 'dotted', 'coffee'] as PaperTexture[]).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => update({ paperTexture: t })}
              className={`bg-paper border rounded-xl overflow-hidden transition text-left ${
                c.paperTexture === t
                  ? 'border-olive-ink ring-2 ring-olive-ink/20'
                  : 'border-cocoa/15 hover:border-cocoa/40'
              }`}
            >
              <div className={`h-12 bg-white paper-tex-${t}`} />
              <div className="px-2 py-1 text-xs text-olive-ink capitalize">{t}</div>
            </button>
          ))}
        </div>
      </Block>

      <Block title="photo (optional)" hint="some templates show a circular photo in the sidebar">
        <div className="flex items-center gap-3">
          {c.photo ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={c.photo}
              alt="profile"
              className="w-14 h-14 rounded-full object-cover border border-cocoa/15"
            />
          ) : (
            <div className="w-14 h-14 rounded-full border-2 border-dashed border-cocoa/30 flex items-center justify-center text-cocoa-soft text-xs">
              none
            </div>
          )}
          <div className="flex flex-col gap-1">
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              className="text-xs px-3 py-1.5 rounded-full bg-paper border border-cocoa/15 hover:bg-cream2 text-olive-ink"
            >
              upload
            </button>
            {c.photo && (
              <button
                type="button"
                onClick={() => setPhoto(undefined)}
                className="text-xs text-cocoa-soft hover:text-strawberry-deep"
              >
                remove
              </button>
            )}
          </div>
          <input ref={fileRef} type="file" accept="image/*" onChange={onPhoto} className="hidden" />
        </div>
        <label className="flex items-center gap-2 mt-3 text-sm text-cocoa-soft cursor-pointer">
          <input
            type="checkbox"
            checked={c.showPhoto}
            onChange={(e) => update({ showPhoto: e.target.checked })}
            className="accent-matcha-deep"
          />
          show photo on resume
        </label>
      </Block>
    </div>
  );
}

function Block({ title, hint, children }: { title: string; hint?: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="font-[family-name:var(--font-hand)] text-xl text-olive-ink leading-none">{title}</div>
      {hint && <div className="text-xs text-cocoa-soft mt-1 mb-3">{hint}</div>}
      {!hint && <div className="mb-3" />}
      {children}
    </div>
  );
}

function FontSelect({
  label,
  value,
  onChange,
}: {
  label: string;
  value: FontKey;
  onChange: (v: FontKey) => void;
}) {
  return (
    <div>
      <div className="text-[11px] uppercase tracking-widest text-cocoa-soft mb-1.5">{label}</div>
      <div className="grid grid-cols-3 gap-1.5">
        {FONTS.map((f) => (
          <button
            key={f.key}
            type="button"
            onClick={() => onChange(f.key)}
            style={{ fontFamily: f.cssVar }}
            className={`text-xs px-2 py-2 rounded-lg border transition text-left ${
              value === f.key
                ? 'border-olive-ink bg-cream2 text-olive-ink'
                : 'border-cocoa/15 text-cocoa-soft hover:bg-cream2'
            }`}
          >
            <div className="text-base leading-none">{f.name}</div>
            <div className="text-[9px] text-cocoa-soft mt-0.5 uppercase tracking-wider" style={{ fontFamily: 'inherit' }}>
              {f.family}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
