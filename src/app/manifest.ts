import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'easycv',
    short_name: 'easycv',
    description:
      'A drag-and-drop resume and cover letter builder with twelve templates. No accounts. No backend. Yours forever.',
    start_url: '/builder',
    display: 'standalone',
    background_color: '#FBF8F1',
    theme_color: '#3D4A2A',
    icons: [
      { src: '/icon', sizes: '32x32', type: 'image/png' },
      { src: '/apple-icon', sizes: '180x180', type: 'image/png' },
    ],
  };
}
