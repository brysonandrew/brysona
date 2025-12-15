import type { Request, Response } from 'express';
import { scrapeSite } from '../scraper';
import { generateEmailBits } from '../email-generation';
import { buildEmail } from '../email-builder';
import type { GenerateEmailRequestBody, ScrapedSite } from '../types';

export const handleGenerateEmail = async (
  req: Request<unknown, unknown, GenerateEmailRequestBody>,
  res: Response,
): Promise<Response> => {
  try {
    const { url, fallbackName = 'your team' } = req.body || {};

    if (!url) {
      return res
        .status(400)
        .json({ error: 'Missing "url" in body' });
    }

    let siteInfo: ScrapedSite;
    try {
      siteInfo = await scrapeSite(url);
    } catch (scrapeErr: any) {
      console.error('Scrape error:', scrapeErr);
      return res.status(502).json({
        error: 'Failed to fetch or parse the website',
        details: scrapeErr?.message,
        code: scrapeErr?.code,
        type: scrapeErr?.type,
      });
    }

    const aiBits = await generateEmailBits(siteInfo, fallbackName);
    const fullEmail = buildEmail(aiBits);

    return res.json({
      url,
      normalizedUrl: siteInfo.url,
      name: aiBits.name,
      subject: fullEmail.subject,
      cta: aiBits.cta,
      body: fullEmail.body,
      offer: aiBits.offer,
      insights: aiBits.insights,
      opportunities: aiBits.opportunities,
      microFix: aiBits.microFix,
      leadScore: aiBits.leadScore,
      leadReason: aiBits.leadReason,
      followUps: aiBits.followUps,
      demoIdea: aiBits.demoIdea,
      contactEmails: siteInfo.emails,
      debug: {
        siteTitle: siteInfo.title,
        metaDescription: siteInfo.metaDescription,
      },
    });
  } catch (err: any) {
    console.error('Error in /generate-email:', err);
    return res.status(500).json({
      error: err?.message ?? 'Internal server error',
      code: err?.code,
      type: err?.type,
    });
  }
};


