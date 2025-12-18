// keyboardShortcuts.ts

import type { TGenerateEmailResponse } from './types';
import type { TCopyFn } from './copy-helpers';

export const createKeyboardShortcutHandler = ({
  url,
  result,
  copy,
}: {
  url: string;
  result: TGenerateEmailResponse | null;
  copy: TCopyFn;
}) => {
  const primaryEmail = result?.contactEmails?.[0];

  const handler = (e: KeyboardEvent) => {
    if (!e.metaKey || e.shiftKey) return;
    const key = e.key.toLowerCase();

    if (key === '1') {
      e.preventDefault();
      void copy('URL', result?.normalizedUrl ?? url, '⌘1');
      return;
    }

    if (key === '2') {
      e.preventDefault();
      void copy('Subject', result?.subject, '⌘2');
      return;
    }

    if (key === '3') {
      e.preventDefault();
      void copy('Email body', result?.body, '⌘3');
      return;
    }

    if (key === '4') {
      e.preventDefault();
      void copy('Primary contact email', primaryEmail, '⌘4');
      return;
    }

    if (key === 'c') {
      const active = document.activeElement as HTMLElement | null;
      if (!active) return;

      const target = active.dataset?.copyTarget as
        | 'url'
        | 'subject'
        | 'email'
        | 'body'
        | undefined;

      if (!target) return;

      e.preventDefault();

      if (target === 'url') {
        void copy('URL', result?.normalizedUrl ?? url, '⌘C (focused)');
      } else if (target === 'subject') {
        void copy('Subject', result?.subject, '⌘C (focused)');
      } else if (target === 'email') {
        void copy('Primary contact email', primaryEmail, '⌘C (focused)');
      } else if (target === 'body') {
        void copy('Email body', result?.body, '⌘C (focused)');
      }
    }
  };

  return handler;
};