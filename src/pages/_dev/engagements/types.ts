// types.ts
export type TEngagement = {
  id: string;
  year: string;
  client: string;
  location?: string;
  role: string;
  summary: string;
  focus: string[];
  impact: string[];
  tags?: string[];
  nda?: boolean;
};