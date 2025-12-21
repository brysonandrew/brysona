import type { FC, PropsWithChildren } from 'react';
import { HelmetProvider } from '@dr.pogodin/react-helmet';

export const HeadHelmetProvider: FC<PropsWithChildren> = ({
  children,
}) => <HelmetProvider>{children}</HelmetProvider>;

