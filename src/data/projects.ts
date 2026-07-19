export type Project = {
  id: string;
  title: string;
  description: string;
  tech: readonly string[];
  link: string;
  category: 'product' | 'tool' | 'learning';
  /** Featured projects get the big card treatment on the homepage */
  featured?: boolean;
  /** Only linked from the footer, not shown in the projects section */
  footerOnly?: boolean;
  /** One concrete proof point, shown on featured cards */
  proof?: string;
};

export const projects: readonly Project[] = [
  {
    id: '01',
    title: 'VizLearn',
    description:
      'Change an input and step through what happens next. The code, visualization, and execution log stay in sync, so the result never feels like a magic trick.',
    tech: ['Algorithms', 'AI & CS'],
    link: 'https://vizlearn.app/',
    category: 'product',
    featured: true,
    proof:
      'Free to use in the browser, with lessons on algorithms, AI, and computer science.',
  },
  {
    id: '02',
    title: 'KanaPlanet',
    description:
      'KanaPlanet builds a daily plan from your lessons and review queue, so you always know what to study next.',
    tech: ['Japanese Learning', 'Spaced Repetition'],
    link: 'https://kanaplanet.aouos.com/',
    category: 'product',
    featured: true,
    proof:
      'Lessons run from kana through N1, with listening, reading, and AI conversation practice along the way.',
  },
  {
    id: '04',
    title: 'AOUI (WIP)',
    description:
      'A work-in-progress UI reference for the CSS-variable themes, buttons, cards, forms, tables, and feedback patterns used across AOUOS projects.',
    tech: ['Design Tokens', 'Components'],
    link: 'https://aoui.aouos.com/',
    category: 'tool',
    footerOnly: true,
  },
  {
    id: '05',
    title: 'AOUOS LOGO',
    description:
      'Download the AOUOS logo as SVG or PNG, with transparent and white-background versions in several sizes.',
    tech: ['SVG', 'Brand Assets'],
    link: 'https://logo.aouos.com/',
    category: 'tool',
    footerOnly: true,
  },
  {
    id: '06',
    title: 'Watermark Remover',
    description:
      'Remove Nano Banana watermarks in your browser by reversing alpha blending. Your image stays on your device, and no AI tries to guess the missing pixels.',
    tech: ['Local Processing', 'Alpha Blending'],
    link: 'https://wmremover.aouos.com/',
    category: 'tool',
  },
  {
    id: '07',
    title: 'CodePin',
    description:
      'Make a QR code or barcode, or scan one with the camera or from a photo. Keep it in history, pin it to the Lock Screen or Dynamic Island, and export it as HD or SVG. Pro sync uses your private iCloud database.',
    tech: ['QR & Barcodes', 'Local-first', 'SVG & iCloud'],
    link: 'https://codepin.aouos.com/',
    category: 'product',
  },
  {
    id: '03',
    title: 'AOUO (Pre-alpha)',
    description:
      'A pre-alpha take on local-first agent apps. Each .aouo pack keeps its skills and data inside a separate app boundary, with its own schedule, permissions, and UI.',
    tech: ['Agent Runtime', 'Local-first'],
    link: 'https://aouo.ai/',
    category: 'tool',
  },
  {
    id: '08',
    title: 'React 19 Learning',
    description:
      'Thirty project-based lessons. Build a Todo app and a Next.js 15 storefront, add tests and deployment, then look inside React Fiber.',
    tech: ['React 19', 'Next.js 15'],
    link: 'https://react.aouos.com',
    category: 'learning',
    footerOnly: true,
  },
  {
    id: '09',
    title: 'Vue 3 Learning',
    description:
      'Learn Vue 3 by building projects, from a Todo app to a full-stack shop. Later lessons cover Pinia, routing, framework internals, and 15 comparisons with React.',
    tech: ['Vue 3', 'Composition API'],
    link: 'https://vue.aouos.com',
    category: 'learning',
    footerOnly: true,
  },
] as const;

export const projectCategories = [
  { key: 'product', title: 'Products' },
  { key: 'tool', title: 'Tools & experiments' },
  { key: 'learning', title: 'Learning notes' },
] as const;

/** Social accounts — same handle everywhere. */
export const socials = [
  { name: 'GitHub', icon: 'github', href: 'https://github.com/boltguo' },
  { name: 'X', icon: 'x', href: 'https://x.com/boltguo' },
  {
    name: 'LinkedIn',
    icon: 'linkedin',
    href: 'https://www.linkedin.com/in/boltguo/',
  },
  {
    name: 'Telegram',
    icon: 'telegram',
    href: 'https://t.me/boltguo',
  },
  { name: 'YouTube', icon: 'youtube', href: 'https://youtube.com/@boltguo' },
  {
    name: 'Instagram',
    icon: 'instagram',
    href: 'https://instagram.com/boltguo',
  },
  {
    name: 'Bilibili',
    icon: 'bilibili',
    href: 'https://space.bilibili.com/48999569',
  },
] as const;
