import { EngagementsCard } from '@pages/_dev/engagements/Card';
import type { TEngagement } from './types';

type TProps = {
  title?: string;
  subtitle?: string;
  items: TEngagement[];
  variant?: 'compact' | 'full';
  cta?: { label: string; href: string };
};

export const EngagementsSection = ({
  title = 'Selected Engagements',
  subtitle = 'High-trust consulting work focused on architecture, performance, and delivery under NDA.',
  items,
  variant = 'compact',
  cta,
}: TProps) => {
  return (
    <section className="mx-auto max-w-5xl px-4 py-10">
      <header className="flex items-end justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50">
            {title}
          </h2>
          <p className="mt-2 max-w-2xl text-sm text-zinc-600 dark:text-zinc-300">
            {subtitle}
          </p>
        </div>

        {cta ? (
          <a
            href={cta.href}
            className="shrink-0 rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm font-medium text-zinc-700 shadow-sm hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-200 dark:hover:bg-zinc-900"
          >
            {cta.label}
          </a>
        ) : null}
      </header>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        {items.map((e) => (
          <EngagementsCard
            key={e.id}
            engagement={e}
            variant={variant}
          />
        ))}
      </div>
    </section>
  );
};
