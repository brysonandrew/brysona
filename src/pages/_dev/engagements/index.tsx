import { ENGAGEMENTS_2025 } from '@pages/_dev/engagements/constants';
import { EngagementsSection } from '@pages/_dev/engagements/section';
import { FC } from 'react';

export const Engagements: FC = () => {
  return (
    <main className='bg-black'>
      {/* Optional: a concise summary grid near the top */}
      <EngagementsSection
        title="Selected Engagements (2025)"
        subtitle="Quiet, outcome-driven summaries. Detailed work available via references on request."
        items={ENGAGEMENTS_2025}
        variant="compact"
      />

      {/* Full story layout */}
      <EngagementsSection
        title="Engagement Timeline"
        subtitle="A transparent look at responsibilities and outcomes — without crossing NDA boundaries."
        items={ENGAGEMENTS_2025}
      />

      {/* NDA footer */}
      <section className="mx-auto max-w-4xl px-4 pb-12">
        <div className="rounded-2xl border border-zinc-200/70 bg-white/70 p-5 text-sm text-zinc-600 shadow-sm backdrop-blur dark:border-zinc-800/70 dark:bg-zinc-950/40 dark:text-zinc-300">
          <p className="font-medium text-zinc-800 dark:text-zinc-100">
            🔒 Private Work (NDA-Protected)
          </p>
          <p className="mt-2">
            Additional production work delivered under NDA
            across AI tooling, internal dashboards, and
            agency client builds. References available on
            request.
          </p>
        </div>
      </section>
    </main>
  );
};
