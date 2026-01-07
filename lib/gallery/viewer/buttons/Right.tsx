import type { FC } from 'react';
import { TClassValueProps } from '@brysonandrew/config-types/dom/main';
import { Nav } from './Nav';
import { useHover } from '@brysonandrew/motion-cursor/hooks/useHover';
import { ArrowRight } from '@brysonandrew/gallery-viewer/icons/ArrowRight';
import { resolveParentAnimateConfig } from '@brysonandrew/motion-core';
import { useNext } from '../hooks/nav/useNext';
import { BIG_CURSOR_KEY } from '@brysonandrew/motion-cursor/config/constants';

type TProps = TClassValueProps & {
  max: number;
};
export const Right: FC<TProps> = ({ max, ...props }) => {
  const to = useNext(max);
  const title = 'Right';
  const { isHover, handlers } = useHover(
    BIG_CURSOR_KEY,
    title,
  );

  if (!to) return null;

  return (
    <Nav
      to={to}
      title={title}
      {...resolveParentAnimateConfig({ isHover })}
      {...handlers}
      {...props}
    >
      <ArrowRight />
    </Nav>
  );
};
