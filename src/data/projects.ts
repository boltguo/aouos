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
      'Step through algorithms and AI concepts one state at a time. The code, visualization, inputs, and execution log move together, so you can see why each step happens.',
    tech: ['Algorithms', 'AI & CS'],
    link: 'https://vizlearn.app/',
    category: 'product',
    featured: true,
    proof:
      '64 free interactive lessons covering foundations, algorithms, AI, and computer science.',
  },
  {
    id: '02',
    title: 'CodePin',
    description:
      "Keep Wi-Fi, contact, and check-in QR codes on your iPhone's Lock Screen or Dynamic Island, ready when you need them.",
    tech: ['iOS', 'Live Activities'],
    link: 'https://codepin.aouos.com/',
    category: 'product',
    featured: true,
    proof:
      'Every code is generated on your iPhone with Core Image. Nothing is uploaded or tracked.',
  },
  {
    id: '03',
    title: 'AOUO (Archived)',
    description:
      'An archived pre-alpha experiment in local-first agent apps. Each isolated .aouo pack bundled its own skills, memory, storage, schedules, permissions, and interface.',
    tech: ['Agent Runtime', 'Local-first'],
    link: 'https://aouo.ai/',
    category: 'tool',
    footerOnly: true,
  },
  {
    id: '04',
    title: 'AOUI',
    description:
      'A compact UI reference for the CSS-variable themes, buttons, cards, forms, tables, and feedback patterns used across AOUOS projects.',
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
    title: 'React 19 Learning',
    description:
      'Thirty project-based lessons. Build a Todo app and a Next.js 15 storefront, add tests and deployment, then look inside React Fiber.',
    tech: ['React 19', 'Next.js 15'],
    link: 'https://react.aouos.com',
    category: 'learning',
  },
  {
    id: '08',
    title: 'Vue 3 Learning',
    description:
      'Learn Vue 3 by building projects, from a Todo app to a full-stack shop. Later lessons cover Pinia, routing, framework internals, and 15 comparisons with React.',
    tech: ['Vue 3', 'Composition API'],
    link: 'https://vue.aouos.com',
    category: 'learning',
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
