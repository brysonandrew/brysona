export type ScrapedSite = {
  url: string;
  title: string;
  metaDescription: string;
  content: string;
  emails: string[];
};

export type EmailBits = {
  name: string;
  subject: string;
  cta: string;
  offer: string;
  insights: string[];
  opportunities: string[];
  microFix: string;
  leadScore: number;
  leadReason: string;
  followUps: string[];
  demoIdea: string;
};

export type BuiltEmail = {
  subject: string;
  body: string;
};

export type GenerateEmailRequestBody = {
  url: string;
  fallbackName?: string;
};


