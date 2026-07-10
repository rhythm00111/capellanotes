'use client';

import { useCallback, useEffect, useState } from 'react';

export const CMD_PALETTE_EVENT = 'capella:cmd-palette:open';

/**
 * Fire-and-forget helper — dispatches the open event from anywhere.
 * Safe to call outside React (e.g. from keyboard handlers).
 */
export function openCommandPalette(): void {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent(CMD_PALETTE_EVENT));
  }
}

/**
 * useCommandPalette — lightweight pub/sub hook.
 *
 * Listens for CMD_PALETTE_EVENT and exposes imperative open/close controls.
 * No UI — ready for a full command palette implementation to subscribe.
 */
export function useCommandPalette() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handle = () => setIsOpen(true);
    window.addEventListener(CMD_PALETTE_EVENT, handle);
    return () => window.removeEventListener(CMD_PALETTE_EVENT, handle);
  }, []);

  const open = useCallback(() => openCommandPalette(), []);
  const close = useCallback(() => setIsOpen(false), []);

  return { isOpen, open, close };
}
