'use client';

// PDF bytes stay in the browser. The pdf.worker.min.mjs (>1MB) is loaded
// once from a CDN so we don't bundle it.
export async function extractTextFromPdf(file: File): Promise<{
  text: string;
  lines: string[];
  pages: number;
}> {
  const pdfjs = await import('pdfjs-dist');
  if (!pdfjs.GlobalWorkerOptions.workerSrc) {
    pdfjs.GlobalWorkerOptions.workerSrc = `https://cdn.jsdelivr.net/npm/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;
  }
  const buf = await file.arrayBuffer();
  const doc = await pdfjs.getDocument({ data: buf }).promise;
  const lines: string[] = [];

  for (let p = 1; p <= doc.numPages; p++) {
    const page = await doc.getPage(p);
    const content = await page.getTextContent();
    const viewport = page.getViewport({ scale: 1 });
    const pageWidth = viewport.width;

    type Item = { x: number; y: number; width: number; str: string };
    const items: Item[] = [];
    for (const it of content.items as Array<{
      str: string;
      transform: number[];
      width?: number;
    }>) {
      const str = it.str;
      if (!str) continue;
      items.push({
        x: it.transform[4],
        y: Math.round(it.transform[5]),
        width: it.width ?? 0,
        str,
      });
    }

    const columnBoundary = detectColumnBoundary(items, pageWidth);

    if (columnBoundary === null) {
      lines.push(...rowsToLines(items));
    } else {
      const left = items.filter((it) => it.x + it.width / 2 < columnBoundary);
      const right = items.filter((it) => it.x + it.width / 2 >= columnBoundary);
      lines.push(...rowsToLines(left));
      lines.push('');
      lines.push(...rowsToLines(right));
    }
    lines.push('');
  }

  return { text: lines.join('\n'), lines, pages: doc.numPages };
}

function rowsToLines(items: { x: number; y: number; str: string }[]): string[] {
  const byRow = new Map<number, { x: number; str: string }[]>();
  for (const it of items) {
    const arr = byRow.get(it.y) ?? [];
    arr.push({ x: it.x, str: it.str });
    byRow.set(it.y, arr);
  }
  const out: string[] = [];
  const sortedYs = Array.from(byRow.keys()).sort((a, b) => b - a);
  for (const y of sortedYs) {
    const row = byRow.get(y)!;
    row.sort((a, b) => a.x - b.x);
    const line = row.map((r) => r.str).join('').replace(/\s+/g, ' ').trim();
    if (line) out.push(line);
  }
  return out;
}

// Returns the X to split items into left/right columns, or null when the page
// looks single-column. Picks the probe with the fewest straddling items and
// non-trivial content on both sides.
function detectColumnBoundary(
  items: { x: number; y: number; width: number }[],
  pageWidth: number,
): number | null {
  if (items.length < 20 || pageWidth < 100) return null;
  const probes: number[] = [];
  for (let pct = 0.3; pct <= 0.7; pct += 0.02) {
    probes.push(pageWidth * pct);
  }
  let best: { x: number; straddles: number; leftCount: number; rightCount: number } | null = null;
  for (const x of probes) {
    let straddles = 0;
    let leftCount = 0;
    let rightCount = 0;
    for (const it of items) {
      const start = it.x;
      const end = it.x + Math.max(it.width, 1);
      if (end < x) leftCount++;
      else if (start > x) rightCount++;
      else straddles++;
    }
    // Need a real split: both sides non-trivial.
    if (leftCount < items.length * 0.15 || rightCount < items.length * 0.15) continue;
    if (!best || straddles < best.straddles) {
      best = { x, straddles, leftCount, rightCount };
    }
  }
  // Demand a clean gap: very few items straddling the chosen line.
  if (!best || best.straddles > items.length * 0.05) return null;
  return best.x;
}
