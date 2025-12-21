import type { TEngagement } from './types';

type TProps = {
  engagement: TEngagement;
  variant?: 'compact' | 'full';
};

export const EngagementsCard = ({
  engagement,
  variant = 'full',
}: TProps) => {
  const {
    client,
    location,
    role,
    summary,
    focus,
    impact,
    tags,
    nda,
    year,
  } = engagement;

  const isCompact = variant === 'compact';

  return (
    <article className="rounded-2xl border border-zinc-200/70 bg-white/70 p-5 shadow-sm backdrop-blur dark:border-zinc-800/70 dark:bg-zinc-950/40">
      <header className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
            <h3 className="truncate text-base font-semibold text-zinc-900 dark:text-zinc-50">
              {client}
            </h3>
            {location ? (
              <span className="text-sm text-zinc-500 dark:text-zinc-400">
                ({location})
              </span>
            ) : null}
            <span className="text-sm text-zinc-400 dark:text-zinc-500">
              • {year}
            </span>
          </div>

          <p className="mt-1 text-sm font-medium text-zinc-700 dark:text-zinc-200">
            {role}
          </p>
        </div>

        {nda ? (
          <span className="shrink-0 rounded-full border border-zinc-200 bg-zinc-50 px-2 py-1 text-xs font-medium text-zinc-600 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300">
            🔒 NDA
          </span>
        ) : null}
      </header>

      <p className="mt-3 text-sm leading-relaxed text-zinc-600 dark:text-zinc-300">
        {summary}
      </p>

      {!isCompact ? (
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <section>
            <h4 className="text-xs font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
              Focus
            </h4>
            <ul className="mt-2 space-y-1 text-sm text-zinc-700 dark:text-zinc-200">
              {focus.map((item) => (
                <li key={item} className="flex gap-2">
                  <span className="mt-[6px] h-1.5 w-1.5 shrink-0 rounded-full bg-zinc-400/80 dark:bg-zinc-500/80" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </section>

          <section>
            <h4 className="text-xs font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
              Impact
            </h4>
            <ul className="mt-2 space-y-1 text-sm text-zinc-700 dark:text-zinc-200">
              {impact.map((item) => (
                <li key={item} className="flex gap-2">
                  <span className="mt-[6px] h-1.5 w-1.5 shrink-0 rounded-full bg-zinc-400/80 dark:bg-zinc-500/80" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </section>
        </div>
      ) : null}

      {tags?.length ? (
        <footer className="mt-4 flex flex-wrap gap-2">
          {tags.map((t) => (
            <span
              key={t}
              className="rounded-full border border-zinc-200 bg-white px-2.5 py-1 text-xs text-zinc-600 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-300"
            >
              {t}
            </span>
          ))}
        </footer>
      ) : null}
    </article>
  );
};
