'use client';

import { cn } from '@web/lib/utils';

interface EditorBodyProps {
  isFocusMode: boolean;
  children: React.ReactNode;
}

/**
 * EditorBody — centered writing column with max-width and padding.
 * Narrows to 640px in focus mode, 720px otherwise.
 */
export function EditorBody({ isFocusMode, children }: EditorBodyProps) {
  return (
    <div
      className={cn(
        'w-full mx-auto px-10 pt-20 pb-32 md:pt-24 md:pb-40',
        isFocusMode ? 'max-w-[640px]' : 'max-w-[700px]',
      )}
      style={{ lineHeight: 1.85 }}
    >
      {children}
    </div>
  );
}
