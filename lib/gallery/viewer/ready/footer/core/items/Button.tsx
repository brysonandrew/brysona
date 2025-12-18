import { type FC } from 'react';
import styled from '@emotion/styled';
import { motion } from 'framer-motion';
import { Link as _Link } from 'react-router-dom';
import { useViewer as useContext } from '@brysonandrew/gallery-viewer';
import { TMediaRecord } from '@brysonandrew/media/config/types';
import { resolveAccessibilityTitles } from '@brysonandrew/utils-attributes/resolveAccessibilityTitles';
import { Background } from '@brysonandrew/interactive/circle/Background';
import { useTo } from '@brysonandrew/gallery-viewer/hooks/nav/useTo';
import { useCurrName } from '@brysonandrew/gallery-viewer/hooks/params/useCurrName';
import { useApp } from '@brysonandrew/app';
import { resolveParentAnimateConfig } from '@brysonandrew/motion-core';
import { Glow } from '@brysonandrew/layout-effects';
import { NAME_KEY } from '@brysonandrew/gallery/config/constants';

const Link = styled(motion.create(_Link))``;

export type TButtonProps = {
  width: number;
  mediaRecord: TMediaRecord;
};
export const Button: FC<TButtonProps> = ({
  width,
  mediaRecord,
}) => {
  const { GLOW_DROP, GLOW_BOX, COLOR, sounds } = useApp();
  const { onMotionBlurStart } = useContext();
  const { name } = mediaRecord;
  const to = useTo({ next: name });
  const currName = useCurrName();
  const isActive = currName === to.split(`${NAME_KEY}=`)[1];

  const handleTap = () => {
    onMotionBlurStart();
    if (sounds?.move) {
      sounds.move();
    }
  };

  return (
    <motion.div
      className="center relative h-16"
      style={{ width, zIndex: isActive ? 1 : 0 }}
      whileHover="hover"
      {...resolveParentAnimateConfig({ isHover: isActive })}
    >
      <Link
        to={to}
        onTap={handleTap}
        className="center relative w-full h-full"
        {...resolveAccessibilityTitles(name)}
      >
        {isActive && (
          <Background layoutId="GALLERY_BUTTON_FILL" />
        )}
        <Glow
          text={isActive ? 1 : 0.4}
          drop={isActive ? 1 : 0.4}
          idle={0.1}
          color={COLOR['secondary']}
          classValue="center fill pointer-events-none"
        >
          <span className="flex relative uppercase text-sm text-center">
            {name}
          </span>
        </Glow>
      </Link>
    </motion.div>
  );
};
