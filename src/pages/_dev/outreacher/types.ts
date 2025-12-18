// types.ts

export type TGenerateEmailResponse = {
  url: string;
  normalizedUrl: string;
  name: string;
  subject: string;
  cta: string;
  body: string;
  offer: string;
  insights: string;
  opportunities: string;
  microFix: string;
  leadScore: number | string;
  leadReason: string;
  followUps: string;
  demoIdea: string;
  contactEmails: string[];
  debug: {
    siteTitle: string;
    metaDescription: string | null;
  };
};

export type TToastType = 'success' | 'error' | 'info';

export type TToastState = {
  message: string;
  type: TToastType;
  via?: string;
} | null;

export type TShowToastFn = (
  message: string,
  type?: TToastType,
  via?: string,
) => void;