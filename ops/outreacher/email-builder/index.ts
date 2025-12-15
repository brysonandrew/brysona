import type { EmailBits, BuiltEmail } from '../types';

// offer ? `${offer}\n` : ''}${
//   demoIdea
//     ? `If it helps, I'm happy to put together a small demo along these lines: ${demoIdea}\n`
//     : ''

export const INTRO = "I’m a frontend web developer from New Zealand, now based in Poland, with 9+ years of experience building React, Next.js, and Vue interfaces in TypeScript, combining hands-on experience with AI tools like ChatGPT and Cursor to accelerate development."

export const buildEmail = (bits: EmailBits): BuiltEmail => {
  const {
    name,
    subject,
    cta,
    // offer, demoIdea
  } = bits;

  const safeName = name || 'there';

  const subjectLine =
    subject ||
    `Frontend web developer support available for ${safeName}`;

  const body = `Hi ${safeName},

${INTRO}

${cta}

References available. I can send a couple of recent projects, or we can jump on a quick call if that's easier.

Kind regards,
Andrew Bryson
brysona.dev | github.com/brysonandrew | linkedin.com/in/brysona

14-second intro → https://brysona.dev/video
`;

  return { subject: subjectLine, body };
};
