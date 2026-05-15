import html2canvas from 'html2canvas';

export async function exportPreviewToPng(filename: string, scale = 2): Promise<void> {
  const node = document.getElementById('resume-preview');
  if (!node) throw new Error('Could not find the resume preview to export.');

  // Temporarily reset any transform on parent so html2canvas measures correctly.
  const parent = node.parentElement;
  const prevTransform = parent?.style.transform ?? '';
  if (parent) parent.style.transform = 'none';

  try {
    const canvas = await html2canvas(node, {
      scale,
      backgroundColor: '#ffffff',
      useCORS: true,
      logging: false,
    });
    const blob: Blob | null = await new Promise((resolve) => canvas.toBlob((b) => resolve(b), 'image/png'));
    if (!blob) throw new Error('PNG generation failed.');
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  } finally {
    if (parent) parent.style.transform = prevTransform;
  }
}
