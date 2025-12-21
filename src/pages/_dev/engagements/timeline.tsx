import type { TEngagement } from "./types";

type TProps = {
  title?: string;
  subtitle?: string;
  items: TEngagement[];
};

export const EngagementsTimeline = ({
  title = "Engagement Timeline",
  subtitle = "Outcome-driven work summaries designed to be NDA-safe while still concrete.",
  items,
}: TProps) => {
  return (
    <section className="mx-auto max-w-4xl px-4 py-10">
      <header>
        <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50">
          {title}
        </h2>
        <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-300">
          {subtitle}
        </p>
      </header>

      <ol className="relative mt-8 border-l border-zinc-200 pl-6 dark:border-zinc-800">
        {items.map((e) => (
          <li key={e.id} className="mb-10 last:mb-0">
            <span className="absolute -left-[7px] mt-1.5 h-3.5 w-3.5 rounded-full border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950" />

            <div className="rounded-2xl border border-zinc-200/70 bg-white/70 p-5 shadow-sm backdrop-blur dark:border-zinc-800/70 dark:bg-zinc-950/40">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
                  {e.year}
                </span>
                <span className="text-zinc-300 dark:text-zinc-700">•</span>

                <h3 className="text-base font-semibold text-zinc-900 dark:text-zinc-50">
                  {e.client}
                  {e.location ? (
                    <span className="ml-2 font-normal text-zinc-500 dark:text-zinc-400">
                      ({e.location})
                    </span>
                  ) : null}
                </h3>

                {e.nda ? (
                  <span className="ml-auto rounded-full border border-zinc-200 bg-zinc-50 px-2 py-1 text-xs font-medium text-zinc-600 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300">
                    🔒 NDA
                  </span>
                ) : null}
              </div>

              <p className="mt-1 text-sm font-medium text-zinc-700 dark:text-zinc-200">
                {e.role}
              </p>

              <p className="mt-3 text-sm leading-relaxed text-zinc-600 dark:text-zinc-300">
                {e.summary}
              </p>

              <div className="mt-4 space-y-4">
                <section>
                  <h4 className="text-xs font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
                    Focus
                  </h4>
                  <ul className="mt-2 space-y-1 text-sm text-zinc-700 dark:text-zinc-200">
                    {e.focus.map((item) => (
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
                    {e.impact.map((item) => (
                      <li key={item} className="flex gap-2">
                        <span className="mt-[6px] h-1.5 w-1.5 shrink-0 rounded-full bg-zinc-400/80 dark:bg-zinc-500/80" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </section>
              </div>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
};