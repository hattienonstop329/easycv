const STEPS = [
  { n: '01', title: 'open the desk', body: 'No signup, no email — just hit "start writing" and a sample resume is waiting for you.' },
  { n: '02', title: 'fill, drag, doodle', body: 'Edit any field on the left. Drag sections to reorder. Toggle visibility with a tap.' },
  { n: '03', title: 'switch templates', body: 'Five looks, one click each. Your data follows along — no copy-paste, no re-typing.' },
  { n: '04', title: 'export & ship', body: 'Print to PDF straight from your browser. Pixel-perfect, A4 or Letter.' },
] as const;

export function HowItWorks() {
  return (
    <section id="how" className="px-6 md:px-12 py-24">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <span className="font-[family-name:var(--font-hand)] text-2xl text-strawberry-deep rotate-1 inline-block">
            four small steps ✿
          </span>
          <h2 className="font-[family-name:var(--font-serif)] text-5xl md:text-6xl text-olive-ink mt-3 font-light">
            here&apos;s how it goes.
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {STEPS.map((s) => (
            <div key={s.n} className="relative bg-paper border-2 border-cocoa/15 rounded-2xl p-6 hover:bg-cream transition">
              <div className="font-[family-name:var(--font-serif)] text-5xl text-strawberry-deep/40">{s.n}</div>
              <h3 className="font-[family-name:var(--font-hand)] text-3xl text-olive-ink mt-2">{s.title}</h3>
              <p className="text-cocoa-soft mt-2 text-sm leading-relaxed">{s.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
