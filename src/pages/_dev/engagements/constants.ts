// engagements.ts
import type { TEngagement } from './types';

export const ENGAGEMENTS_2025: TEngagement[] = [
  {
    id: 'insurgence-2025',
    year: '2025',
    client: 'Insurgence',
    location: 'Melbourne',
    role: 'Senior Frontend & AI Systems Consulting',
    summary:
      'Embedded across AI-focused product teams delivering production UI and internal tooling under tight timelines.',
    focus: [
      'React / Next.js component architecture for rapid iteration',
      'TypeScript safety + maintainability in shared codebases',
      'AI-assisted UI workflows and internal tooling guidance',
      'Delivery support across multiple parallel builds',
    ],
    impact: [
      'Faster feature delivery with fewer regressions',
      'Reduced friction between design and engineering',
      'Improved long-term maintainability of production systems',
    ],
    tags: ['React', 'Next.js', 'TypeScript', 'AI tooling'],
    nda: true,
  },
  {
    id: 'stikky-2025',
    year: '2025',
    client: 'Stikky',
    location: 'Brisbane',
    role: 'Agency Engineering Partner',
    summary:
      'Ongoing technical partner supporting high-velocity agency delivery across modern frontends and platform integrations.',
    focus: [
      'Frontend architecture + performance optimisation',
      'React and Headless WordPress delivery support',
      'CI/CD and DX improvements for rapid iteration',
      'AI-assisted QA and content workflow enhancements',
    ],
    impact: [
      'Improved performance and reliability across client builds',
      'Reduced turnaround time on complex implementations',
      'Increased engineering confidence under tight deadlines',
    ],
    tags: ['React', 'Headless WP', 'Performance', 'CI/CD'],
    nda: true,
  },
];
