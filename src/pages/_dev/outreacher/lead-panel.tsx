import type { FC } from 'react';
import { memo, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useOutreacher } from './context';

export type TLeadPanelData = {
  url: string;
  normalizedUrl: string;
  name: string;
  subject: string;
  cta: string;
  body: string;
  offer: string;
  insights: string | string[];
  opportunities: string | string[];
  microFix: string;
  leadScore: number | string;
  leadReason: string;
  followUps: string | string[];
  demoIdea: string;
  contactEmails: string[];
  debug: {
    siteTitle: string;
    metaDescription: string | null;
  };
};

export type TLeadPanelProps = {
  data: TLeadPanelData;
};

export const LeadPanel: FC<TLeadPanelProps> = memo(
  ({ data }) => {
    const { copy } = useOutreacher();
    const {
      name,
      normalizedUrl,
      subject,
      cta,
      offer,
      demoIdea,
      microFix,
      leadScore,
      leadReason,
      debug,
      url,
    } = data;

    const insights = useMemo(
      () =>
        Array.isArray(data.insights)
          ? data.insights
          : data.insights
            ? [data.insights]
            : [],
      [data.insights],
    );

    const opportunities = useMemo(
      () =>
        Array.isArray(data.opportunities)
          ? data.opportunities
          : data.opportunities
            ? [data.opportunities]
            : [],
      [data.opportunities],
    );

    const followUps = useMemo(
      () =>
        Array.isArray(data.followUps)
          ? data.followUps
          : data.followUps
            ? [data.followUps]
            : [],
      [data.followUps],
    );

    const emailContacts = useMemo(
      () =>
        data.contactEmails.filter((value) =>
          value.includes('@'),
        ),
      [data.contactEmails],
    );

    const numericScore =
      typeof leadScore === 'number'
        ? leadScore
        : Number.isNaN(Number(leadScore))
          ? null
          : Number(leadScore);

    const scoreLabel =
      numericScore == null
        ? '—'
        : `${numericScore}`.padStart(2, '0');

    return (
      <motion.section
        className="w-full rounded-2xl border border-white-02 bg-dark-07 backdrop-blur-2xl shadow-[0_18px_60px_rgba(0,0,0,0.7)] p-4 md:p-6 flex flex-col gap-4"
        initial={{ opacity: 0, y: 16, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.22, ease: 'easeOut' }}
      >
        {/* Top header row */}
        <header className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div className="flex flex-col gap-2 min-w-0">
            {/* Chip */}
            <div className="inline-flex items-center gap-2 rounded-full bg-black-2 border border-white-02 px-3 py-1">
              <span className="h-1.5 w-1.5 rounded-full bg-plus shadow-[0_0_0_4px_rgba(74,222,128,0.35)]" />
              <span className="text-[11px] uppercase tracking-[0.16em] text-white-06">
                Lead overview
              </span>
            </div>

            {/* Name + URL */}
            <div className="flex flex-col gap-1">
              <h2 className="text-xl md:text-2xl font-semibold tracking-tight text-white-09">
                {name || 'Unknown target'}
              </h2>
              <div className="flex flex-wrap items-center gap-2 text-xs">
                {normalizedUrl && (
                  <a
                    href={normalizedUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="font-mono text-white-07 hover:text-white-09 underline underline-offset-4 decoration-primary-05"
                  >
                    {normalizedUrl}
                  </a>
                )}
                {url && url !== normalizedUrl && (
                  <span className="whitespace-nowrap rounded-full bg-black-2 border border-white-02 px-2 py-0.5 text-[10px] font-mono text-white-06">
                    Raw URL: {url}
                  </span>
                )}
              </div>
            </div>

            {/* Debug meta */}
            {debug?.siteTitle && (
              <p className="text-xs text-white-06 line-clamp-1">
                <span className="text-white-05 uppercase tracking-[0.14em] text-[10px] mr-1.5">
                  Site title / page title:
                </span>
                {debug.siteTitle}
              </p>
            )}

            {debug?.metaDescription && (
              <p className="text-xs text-white-06 line-clamp-2">
                <span className="text-white-05 uppercase tracking-[0.14em] text-[10px] mr-1.5">
                  Meta / meta description:
                </span>
                {debug.metaDescription}
              </p>
            )}
          </div>

          {/* Lead score bubble */}
          <div className="flex items-center justify-end md:justify-center">
            <div className="relative flex items-stretch gap-3 rounded-2xl bg-black-2 border border-white-02 px-4 py-3">
              <div>
                <span className="text-[11px] uppercase tracking-[0.16em] text-white-06">
                  Score
                </span>
                <div className="flex flex-col items-end">
                  <div className="flex items-end gap-0">
                    <span className="text-3xl font-semibold text-plus">
                      {scoreLabel}
                    </span>
                    <span className="text-xs text-white-06 whitespace-nowrap">
                      / 100
                    </span>
                  </div>
                </div>
              </div>

              <div className="grow w-px bg-white-02" />
              <div className="flex flex-col items-start gap-1">
                <span className="inline-flex items-center gap-1 rounded-full bg-plus-01 border border-plus-04 px-2 py-0.5 text-[10px] text-plus-08">
                  <span className="h-1.5 w-1.5 rounded-full bg-plus" />
                  Qualified
                </span>
                {emailContacts.length > 0 && (
                  <span className="text-[10px] text-white-06">
                    {emailContacts.length} email
                    {emailContacts.length > 1
                      ? 's'
                      : ''}{' '}
                    found
                  </span>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Subject + main CTA */}
        <section className="grid gap-4 md:grid-cols-[minmax(0,2fr)_minmax(0,2.2fr)]">
          <div className="flex flex-col gap-3">
            {/* Subject */}
            <div className="rounded-xl bg-black-2 border border-white-02 p-4 flex flex-col gap-1.5">
              <div className="flex items-center justify-between gap-2">
                <span className="text-[11px] uppercase tracking-[0.16em] text-white-06">
                  Subject / email subject
                </span>
                <span className="text-[10px] text-white-06">
                  First impression
                </span>
              </div>
              <p className="text-sm font-semibold text-white-09">
                {subject}
              </p>
            </div>

            {/* Core offer */}
            <div className="rounded-xl bg-black-2 border border-white-02 p-4 flex flex-col gap-1.5">
              <span className="text-[11px] uppercase tracking-[0.16em] text-white-06">
                Core offer
              </span>
              <p className="text-sm text-white-08 whitespace-pre-wrap">
                {offer}
              </p>
            </div>
          </div>

          {/* CTA */}
          <div className="rounded-xl bg-black-2 border border-white-02 p-4 flex flex-col gap-1.5">
            <div className="flex items-center justify-between gap-2">
              <span className="text-[11px] uppercase tracking-[0.16em] text-white-06">
                CTA blurb
              </span>
              <span className="rounded-full bg-dark-07 px-2 py-0.5 text-[10px] text-white-06 border border-white-02">
                Drop-in paragraph
              </span>
            </div>
            <p className="text-sm text-white-08 whitespace-pre-wrap">
              {cta}
            </p>
          </div>
        </section>

        {/* Contacts + Demo idea + Micro-fix */}
        <section className="rounded-xl bg-black-2 border border-white-02 p-4 flex flex-col gap-3">
          <div className="flex items-center justify-between gap-2">
            <span className="text-[11px] uppercase tracking-[0.16em] text-white-06">
              Contacts, Demo idea & Micro-fix
            </span>
            <span className="text-[10px] text-white-06">
              From scraping
            </span>
          </div>

          <div className="flex flex-col gap-3 text-sm text-white-08 whitespace-pre-wrap">
            {/* Contacts */}
            <div>
              <span className="text-[11px] uppercase tracking-[0.16em] text-white-06 font-semibold">
                Contacts:{' '}
              </span>
              {emailContacts.length > 0 ? (
                <span className="inline-flex flex-wrap gap-1.5">
                  {emailContacts.map((email, index) => (
                    <span key={email} className="inline-flex items-center gap-1.5">
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-dark-07 border border-white-02 px-2 py-0.5 group">
                        <span className="text-[11px] font-mono text-white-08">
                          {email}
                        </span>
                        <button
                          onClick={() => copy('Contact email', email, 'button')}
                          className="opacity-50 group-hover:opacity-100 transition-opacity rounded px-1 py-0.5 hover:bg-black-2 text-[10px] text-white-07 hover:text-white-09"
                          title={`Copy ${email} to clipboard`}
                        >
                          Copy
                        </button>
                      </span>
                      {index < emailContacts.length - 1 && (
                        <span className="text-white-05">,</span>
                      )}
                    </span>
                  ))}
                </span>
              ) : (
                <span className="text-white-06">No valid email addresses detected.</span>
              )}
            </div>

            {/* Demo idea */}
            <div>
              <span className="text-[11px] uppercase tracking-[0.16em] text-white-06 font-semibold">
                Demo idea:{' '}
              </span>
              <span>{demoIdea || '—'}</span>
            </div>

            {/* Micro fix */}
            <div>
              <span className="text-[11px] uppercase tracking-[0.16em] text-white-06 font-semibold">
                Micro-fix:{' '}
              </span>
              <span>{microFix || '—'}</span>
            </div>
          </div>
        </section>

        {/* Insights / Opportunities / Follow-ups */}
        <section className="grid gap-4 md:grid-cols-3">
          {/* Insights */}
          <div className="rounded-xl bg-black-2 border border-white-02 p-4 flex flex-col gap-2">
            <span className="text-[11px] uppercase tracking-[0.16em] text-white-06">
              Insights
            </span>
            {insights.length > 0 ? (
              <ul className="flex flex-col gap-1.5 text-xs text-white-08">
                {insights.map((item, index) => (
                  <li key={index} className="flex gap-2">
                    <span className="mt-[3px] h-1.5 w-1.5 rounded-full bg-primary flex-shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-xs text-white-06">
                No insights generated.
              </p>
            )}
          </div>

          {/* Opportunities */}
          <div className="rounded-xl bg-black-2 border border-white-02 p-4 flex flex-col gap-2">
            <span className="text-[11px] uppercase tracking-[0.16em] text-white-06">
              Opportunities
            </span>
            {opportunities.length > 0 ? (
              <ul className="flex flex-col gap-1.5 text-xs text-white-08">
                {opportunities.map((item, index) => (
                  <li key={index} className="flex gap-2">
                    <span className="mt-[3px] h-1.5 w-1.5 rounded-full bg-select flex-shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-xs text-white-06">
                No opportunities identified yet.
              </p>
            )}
          </div>

          {/* Follow-ups */}
          <div className="rounded-xl bg-black-2 border border-white-02 p-4 flex flex-col gap-2">
            <span className="text-[11px] uppercase tracking-[0.16em] text-white-06">
              Follow-ups
            </span>
            {followUps.length > 0 ? (
              <ul className="flex flex-col gap-1.5 text-xs text-white-08">
                {followUps.map((item, index) => (
                  <li key={index} className="flex gap-2">
                    <span className="mt-[3px] h-1.5 w-1.5 rounded-full bg-standard flex-shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-xs text-white-06">
                No follow-up lines generated.
              </p>
            )}
          </div>
        </section>

        {/* Lead reason */}
        {leadReason && (
          <section className="rounded-xl bg-black-2 border border-white-02 p-4 flex flex-col gap-1.5">
            <div className="flex items-center gap-2">
              <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-plus-01 border border-plus-04 text-[11px] text-plus-08">
                %
              </span>
              <span className="text-[11px] uppercase tracking-[0.16em] text-white-06">
                Why this lead qualifies
              </span>
            </div>
            <p className="text-sm text-white-08 whitespace-pre-wrap">
              {leadReason}
            </p>
          </section>
        )}
      </motion.section>
    );
  },
);

LeadPanel.displayName = 'LeadPanel';
