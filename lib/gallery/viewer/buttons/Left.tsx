import type { FC } from 'react';
import { ArrowLeft } from '@brysonandrew/gallery-viewer/icons/ArrowLeft';
import { usePrev } from '../hooks/nav/usePrev';
import { TClassValueProps } from '@brysonandrew/config-types/dom/main';
import { Nav } from './Nav';
import { useHover } from '@brysonandrew/motion-cursor';
import { BIG_CURSOR_KEY } from '@brysonandrew/motion-cursor/config/constants';
import { resolveParentAnimateConfig } from '@brysonandrew/motion-core';

type TProps = TClassValueProps & {
  max: number;
};
export const Left: FC<TProps> = ({ max, ...props }) => {
  const to = usePrev(max);
  const title = 'Left';
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
      <ArrowLeft />
    </Nav>
  );
};
