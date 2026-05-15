import { Nav } from '@/components/landing/Nav';
import { Hero } from '@/components/landing/Hero';
import { Marquee } from '@/components/landing/Marquee';
import { Features } from '@/components/landing/Features';
import { TemplateGallery } from '@/components/landing/TemplateGallery';
import { HowItWorks } from '@/components/landing/HowItWorks';
import { Testimonials } from '@/components/landing/Testimonials';
import { CTA } from '@/components/landing/CTA';
import { Footer } from '@/components/landing/Footer';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000';

const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'easycv',
  applicationCategory: 'BusinessApplication',
  operatingSystem: 'Any (browser)',
  description:
    'A drag-and-drop resume and cover letter builder with twelve templates, full customization, and zero signup. Runs entirely in your browser — no accounts, no cloud.',
  url: SITE_URL,
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
  featureList: [
    '12 resume templates (7 professional, 5 creative)',
    '5 matching cover letter templates',
    'Full color, font, density customization',
    'Drag-and-drop section reorder',
    'PDF, PNG, plain-text, JSON Resume export',
    'JD keyword matcher',
    'Polish writing assist (verbs, clichés, length)',
    'Multiple resume versions',
    'Undo / redo with keyboard shortcuts',
    'Local storage — no account required',
    'Share via URL (read-only)',
  ],
};

export default function Home() {
  return (
    <main className="paper-bg min-h-screen text-cocoa overflow-hidden">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <Nav />
      <Hero />
      <Marquee />
      <Features />
      <TemplateGallery />
      <HowItWorks />
      <Testimonials />
      <CTA />
      <Footer />
    </main>
  );
}
