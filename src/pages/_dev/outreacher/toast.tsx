import {
  getToastClasses,
  getToastIcon,
} from '@pages/_dev/outreacher/toast-helpers';
import { TToastState } from '@pages/_dev/outreacher/types';
import { motion } from 'framer-motion';
import type { FC } from 'react';

export const OutreacherToast: FC<{
  toast: NonNullable<TToastState>;
}> = ({ toast }) => {
  return (
    <div>
      <motion.div
        className="fixed bottom-4 right-4 z-50"
        initial={{ opacity: 0, y: 14, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 10, scale: 0.96 }}
        transition={{ duration: 0.18, ease: 'easeOut' }}
      >
        <div
          className={[
            'text-white rounded-xl text-sm px-4 py-2.5 shadow-[0_18px_45px_rgba(0,0,0,0.7)] border backdrop-blur-2xl flex items-center gap-2',
            toast ? getToastClasses(toast.type) : '',
          ].join(' ')}
        >
          <span className="text-lg">
            {getToastIcon(toast.type)}
          </span>
          <span className="text-white-4">
            {toast.message}
          </span>
          {toast.via && (
            <span className="text-xs text-white-3 ml-1">
              — via {toast.via}
            </span>
          )}
        </div>
      </motion.div>
    </div>
  );
};
