import LZString from 'lz-string';
import { ResumeData } from './types';

// We strip the photo before sharing — base64 photos blow past URL length limits and
// most recipients don't need them in a quick-look preview.
function stripBulky(data: ResumeData): ResumeData {
  if (!data.customization.photo) return data;
  return { ...data, customization: { ...data.customization, photo: undefined } };
}

export function encodeResumeToHash(data: ResumeData): string {
  const json = JSON.stringify(stripBulky(data));
  return LZString.compressToEncodedURIComponent(json);
}

export function decodeResumeFromHash(hash: string): ResumeData | null {
  try {
    const json = LZString.decompressFromEncodedURIComponent(hash);
    if (!json) return null;
    return JSON.parse(json) as ResumeData;
  } catch {
    return null;
  }
}

export function makeShareUrl(hash: string): string {
  if (typeof window === 'undefined') return `/share#${hash}`;
  return `${window.location.origin}/share#${hash}`;
}
