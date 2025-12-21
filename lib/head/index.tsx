import { useHtmlTitle } from '@brysonandrew/head';
import { useApp } from '@brysonandrew/app';
import { Helmet } from '@dr.pogodin/react-helmet';
import {
  defaultTitlesResolver,
  TTitlesResolver,
} from '@brysonandrew/head/config';
import { useTitleLookup } from '@brysonandrew/head/useTitleLookup';
import {
  TBaseColorRecord,
  TBaseColorValue,
} from '@brysonandrew/color-base';
import { TRoute } from '@brysonandrew/routes';

export type THeadProps<T extends string = string> =
  Partial<TBaseColorRecord> & {
    titlesResolver?: TTitlesResolver;
    prefix?: string;
    base?: TBaseColorValue;
    pageValues: TRoute<T>[];
  };
export const Head = <T extends string = string>({
  pageValues,
  titlesResolver = defaultTitlesResolver,
  prefix = '',
  ...props
}: THeadProps<T>) => {
  const { COLOR } = useApp();
  const titleLookup = useTitleLookup<T>({ pageValues });
  const titles = useHtmlTitle<T>({
    lookup: titleLookup,
  });
  const base = props.base ?? COLOR.light;
  const primary = props.primary ?? COLOR['primary'];

  return (
    <Helmet>
      <title>{titlesResolver(titles)}</title>
      <link
        rel='apple-touch-icon'
        sizes='180x180'
        href={`${prefix}/apple-touch-icon.png`}
      />
      <link
        rel='icon'
        type='image/png'
        sizes='32x32'
        href={`${prefix}/favicon-32x32.png`}
      />
      <link
        rel='icon'
        type='image/png'
        sizes='16x16'
        href={`${prefix}/favicon-16x16.png`}
      />
      <link
        rel='manifest'
        href={`${prefix}/site.webmanifest`}
      />
      <link
        rel='mask-icon'
        href={`${prefix}/safari-pinned-tab.svg`}
        color={primary}
      />
      <meta
        name='msapplication-TileColor'
        content={primary}
      />
      <meta name='theme-color' content={base} />
    </Helmet>
  );
};

export * from './HelmetProvider';
export * from './config';
export * from './useHtmlTitle';
export * from './useTitleLookup';
export * from './head';
