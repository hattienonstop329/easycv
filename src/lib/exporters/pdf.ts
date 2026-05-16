import { toPng } from 'html-to-image';
import { jsPDF } from 'jspdf';

type PageFormat = 'A4' | 'Letter';

interface PageDims {
  widthMm: number;
  heightMm: number;
  jsPdfFormat: 'a4' | 'letter';
}

const PAGE_DIMS: Record<PageFormat, PageDims> = {
  A4: { widthMm: 210, heightMm: 297, jsPdfFormat: 'a4' },
  Letter: { widthMm: 215.9, heightMm: 279.4, jsPdfFormat: 'letter' },
};

/**
 * Render the current resume preview into a downloadable PDF that matches
 * the on-screen preview pixel-for-pixel.
 *
 * Uses `html-to-image` (SVG foreignObject under the hood) which preserves
 * text layout, fonts, and CSS color-mix() much better than canvas-based
 * rasterizers. Renders at 3x device pixel ratio for crisp PDF text.
 */
export async function exportPreviewToPdf(
  filename: string,
  format: PageFormat = 'A4',
): Promise<void> {
  const node = document.getElementById('resume-preview') as HTMLElement | null;
  if (!node) throw new Error('Could not find the resume preview to export.');

  // Reset any preview transform/scale so the renderer captures actual pixels.
  // (PreviewPaper applies `transform: scale(0.7..)` for the responsive on-screen fit.)
  const scaler = node.parentElement;
  const prevTransform = scaler?.style.transform ?? '';
  if (scaler) scaler.style.transform = 'none';

  // Wait for all web fonts to actually be available before snapshot,
  // otherwise html-to-image may capture the system fallback. Race against a
  // short timeout so a stuck font load (CDN down, CORS blocked) can't hang
  // the export indefinitely — we'll fall back to system fonts in that case.
  if ('fonts' in document) {
    try {
      await Promise.race([
        (document as Document & { fonts: { ready: Promise<unknown> } }).fonts.ready,
        new Promise((resolve) => setTimeout(resolve, 4000)),
      ]);
    } catch {
      /* non-fatal */
    }
  }

  // One animation frame so any layout changes from removing the transform settle.
  await new Promise((r) => requestAnimationFrame(() => r(null)));

  try {
    const rect = node.getBoundingClientRect();
    const cssWidth = rect.width;
    const cssHeight = rect.height;

    const dataUrl = await toPng(node, {
      cacheBust: true,
      pixelRatio: 3,
      backgroundColor: '#ffffff',
      width: cssWidth,
      height: cssHeight,
      style: {
        transform: 'none',
        margin: '0',
      },
    });

    // Decode to get true pixel dimensions for PDF math.
    const img = await loadImage(dataUrl);

    const dims = PAGE_DIMS[format];
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: dims.jsPdfFormat,
      compress: true,
    });

    const imgWidth = dims.widthMm;
    const imgHeight = (img.naturalHeight * imgWidth) / img.naturalWidth;

    let heightLeft = imgHeight;
    let position = 0;

    pdf.addImage(dataUrl, 'PNG', 0, position, imgWidth, imgHeight, undefined, 'FAST');
    heightLeft -= dims.heightMm;

    while (heightLeft > 0.5) {
      position = position - dims.heightMm;
      pdf.addPage();
      pdf.addImage(dataUrl, 'PNG', 0, position, imgWidth, imgHeight, undefined, 'FAST');
      heightLeft -= dims.heightMm;
    }

    pdf.save(filename);
  } finally {
    if (scaler) scaler.style.transform = prevTransform;
  }
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}
