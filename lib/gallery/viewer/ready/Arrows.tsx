import { type FC } from 'react';
import { Left } from '../buttons/Left';
import { Right } from '../buttons/Right';
import { cx } from 'class-variance-authority';
import { Circle } from '@brysonandrew/interactive/circle';

const BASE_NAV_BUTTON_CLASS =
  'bottom-4 translate-y-0 z-20 md:bottom-1/2 md:translate-y-1/2';

type TProps = {
  max: number;
};
export const Arrows: FC<TProps> = (props) => {
  if (props.max < 2) return null;
  return (
    <>
      <Circle
        position="absolute"
        classValue={cx(
          BASE_NAV_BUTTON_CLASS,
          'left-4 md:left-6',
        )}
      >
        <Left {...props} />
      </Circle>
      <Circle
        position="absolute"
        classValue={cx(
          BASE_NAV_BUTTON_CLASS,
          'right-4 md:right-6',
        )}
      >
        <Right {...props} />
      </Circle>
    </>
  );
};
