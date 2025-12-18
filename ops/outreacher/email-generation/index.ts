import OpenAI from 'openai';
import type { ScrapedSite, EmailBits } from '../types';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const generateEmailBits = async (
  siteInfo: ScrapedSite,
  fallbackName: string,
): Promise<EmailBits> => {
  const { title, metaDescription, content, emails, url } =
    siteInfo;

  const systemPrompt = `
You help a senior frontend developer (Andrew Bryson) generate high-value cold outreach to web studios and digital agencies.

IMPORTANT CONTEXT:
Andrew’s base email template (outside this JSON) ALREADY includes:
- who he is (frontend dev)
- where he is based
- his years of experience
- his core stack (React/Next/Vue/TypeScript)
- his links, references line, and intro video link

Therefore, the content you return MUST NOT repeat or mention any of that.
Your job is ONLY to generate the tailored, non-redundant bits.

You will receive:
- basic site metadata
- extracted text content
- any contact emails found
- the site's URL

Return a JSON object with:

- "name": string
  Most likely first name of the owner/decision-maker or first word of contact email ONLY if can be identified as a male or female first name.
  If unknown, use a team-style name such as "the [Studio Name] team" or the provided fallback.

- "subject": string
  Always use "Frontend web developer support available for [Studio Name]"

- "cta": string
  One tight paragraph (2–3 sentences, max ~70 words) that:
  - references something specific from their website (services, niches, clientele, style, stack hints, WP/headless, etc.)
  - states ONE concrete way Andrew can help (overflow UI work, polish, performance, animations, hybrid WP blocks, etc.)
  - Do NOT include closings/signatures.
  - Do NOT make promises to the recipient.
  - Do NOT be too presumptuous with the recipient.
  - DO make it compelling, not too agency-brochure-ish.

- "offer": string
  A low-friction, productised offer (one sentence). No tech stack repetition.

- "insights": string[]
  1–3 concrete observations about their positioning/site.

- "opportunities": string[]
  1–3 concrete ways Andrew could help.

- "microFix": string
  One small UI/performance improvement suggestion.

- "leadScore": number
  0–100

- "leadReason": string
  1–2 sentences explaining the score.

- "followUps": string[]
  3 follow-ups (each 1–2 short sentences):
  - never say "just following up"
  - add small value (insight/microFix/offer)
  - stay low-pressure

- "demoIdea": string
  A tiny demo idea phrased as a noun/idea only (NOT a paragraph, NOT prefaced).
  Example format: "Alternative hero motion treatment for your services page"
  Keep it short.

HARD RULES (must follow):
- DO NOT mention: years of experience, location, portfolio, references, “projects”, “jump on a quick call”, or any video.
- DO NOT mention Andrew’s tech stack unless the site content explicitly indicates a specific stack AND it’s essential.
- Never output these (or close variants):
  - "Happy to share a couple of relevant projects or jump on a quick call..."
  - "If it helps, I'm happy to put together a small demo..."
- Avoid repeating the same idea across cta/offer/opportunities. Each field should add new information.
- Tone: professional, confident, friendly. No hype, no emojis, no exclamation marks.
- Respond ONLY as valid JSON with this exact shape:
  {
    "name": string,
    "subject": string,
    "cta": string,
    "offer": string,
    "insights": string[],
    "opportunities": string[],
    "microFix": string,
    "leadScore": number,
    "leadReason": string,
    "followUps": string[],
    "demoIdea": string
  }.
`.trim();

  const sanitize = (s: string): string => {
    const bannedPhrases: RegExp[] = [
      /happy to share a couple of relevant projects? or jump on a quick call.*?\./gi,
      /if it helps, i['’]?m happy to put together a small demo.*?\./gi,
      /jump on a quick call/gi,
      /\breferences available\b/gi,
      /\b9\+\s*years?\b/gi,
      /\bbased in\b.*?(canada|vancouver|north vancouver)/gi,
    ];

    let out = s.trim();
    for (const rx of bannedPhrases)
      out = out.replace(rx, '').trim();

    // clean up double spaces / dangling punctuation
    out = out.replace(/\s{2,}/g, ' ');
    out = out.replace(/\s+\./g, '.');
    out = out.replace(/^\s*[,\-–—]\s*/g, '');
    return out.trim();
  };

  const sanitizeBits = (bits: EmailBits): EmailBits => ({
    ...bits,
    subject: sanitize(bits.subject),
    cta: sanitize(bits.cta),
    offer: sanitize(bits.offer),
    microFix: sanitize(bits.microFix),
    leadReason: sanitize(bits.leadReason),
    demoIdea: sanitize(bits.demoIdea),
    insights: bits.insights.map(sanitize).filter(Boolean),
    opportunities: bits.opportunities
      .map(sanitize)
      .filter(Boolean),
    followUps: bits.followUps.map(sanitize).filter(Boolean),
  });

  const userPrompt = `
Website info:
URL: ${url}
Title: ${title || 'N/A'}
Meta description: ${metaDescription || 'N/A'}

Possible contact emails found:
${emails.length ? emails.join(', ') : 'None found'}

Extracted content:
"""
${content || 'N/A'}
"""

Fallback name to use if you really can't infer a specific person:
"${fallbackName}"
`.trim();

  const completion = await openai.chat.completions.create({
    model: 'gpt-4.1-mini',
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt },
    ],
    temperature: 0.7,
  });

  const raw =
    completion.choices[0].message.content?.trim() ?? '';

  let parsed: EmailBits;
  try {
    parsed = JSON.parse(raw) as EmailBits;
  } catch (err) {
    console.error('Failed to parse JSON from model:', raw);
    throw new Error('Model returned invalid JSON');
  }

  parsed = sanitizeBits(parsed);

  return parsed;
};
