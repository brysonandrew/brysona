import styled from '@emotion/styled';
import { cx } from 'class-variance-authority';
import type { FC } from 'react';
import { Link as _Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { TLinkMotionProps } from '@brysonandrew/config-types/dom/motion';
import { resolveAccessibilityTitles } from '@brysonandrew/utils-attributes/resolveAccessibilityTitles';

const Link = styled(motion.create(_Link))``;

export type TLinkFillCenterProps = TLinkMotionProps;
export const LinkFillCenter: FC<TLinkFillCenterProps> = ({
  to,
  children,
  classValue,
  title,
  ...props
}) => {
  return (
    <Link
      to={to}
      className={cx('fill center cursor-pointer')}
      {...resolveAccessibilityTitles(title)}
      {...props}
    >
      {children}
    </Link>
  );
};
