import { TAboutCopy } from "@pages/about/types";

export const ABOUT_COPY = {
  intro: {
    title: `Hi, I'm Andrew — a Front-End
            Developer based in North Vancouver, Vancouver, Canada, focused on clean, modern, reliable
            interfaces.`,
    paragraphs: [
      `I’ve spent the last 9+ years building fast, accessible, and user-friendly web applications using React, Vue, TypeScript, and Next.js/Nuxt.`,
      `I specialise in turning ideas and complex requirements into clean, production-ready interfaces — built with clarity, communication, and attention to detail.`,
    ],
  },

  whatIDo: {
    title: `What I do`,
    blocks: [
      `I design and build front-end experiences that feel fast, intuitive, and polished.`,
      {
        type: 'bullets',
        title: 'My work spans:',
        items: [
          'React / Next.js applications',
          'Vue / Nuxt applications',
          'API-driven and headless CMS setups',
          'High-performance, SEO-optimised websites',
          'UI/UX for interactive and media-rich apps',
          'Advanced animations (Framer Motion, GSAP, scroll-based, micro-interactions)',
          'AI-powered interfaces for creative, productivity, and automation tools',
        ],
      },
      `I focus on performance, maintainability, and long-term scalability — writing clean code that your team can build on.`,
    ],
  },

  howIWork: {
    title: `How I work`,
    blocks: [
      `My approach is simple: communicate clearly, deliver reliably, and respect your time.`,
      {
        type: 'bullets',
        items: [
          'I provide realistic estimates',
          'I share progress early and often',
          'I solve problems collaboratively',
          'I keep codebases tidy, consistent, and documented',
          'I take ownership of the work from start to finish',
        ],
      },
      `I treat every project like a partnership, not a handoff.`,
    ],
  },

  whoIWorkWith: {
    title: `Who I work with`,
    blocks: [
      {
        type: 'bullets',
        title: `I’ve collaborated with:`,
        items: [
          'digital agencies',
          'SaaS companies',
          'creative studios',
          'e-commerce teams',
          'startups and founders',
        ],
      },
      `…across Canada, Australia, Europe, and North America — often bridging multiple time zones.`,
      `Whether you need a single front-end feature, a complete web application, or ongoing support, I can integrate smoothly with your team and deliver work you can trust.`,
    ],
  },

  aboutMe: {
    title: `A bit more about me`,
    blocks: [
      `I'm based in North Vancouver, Vancouver, Canada, working primarily with clients in North America, Europe, and Australia.`,
      `Outside of development, I spend my time creating AI-driven projects, audio tools, and music — often combining technology and creativity in unique ways.`,
    ],
  },

  letsWork: {
    title: `Let’s work together`,
    blocks: [
      `If you need a senior front-end developer who values clarity, quality, and reliability, I’d be happy to help.`,
      `You can reach me anytime through my contact form — or connect via email if you prefer.`,
    ],
  },
} as const satisfies TAboutCopy;
