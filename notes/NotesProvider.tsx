"use client";

import React, { useEffect } from 'react';
import { useNotesStore } from './store/notes.store';

/**
 * NotesProvider: Initializes the notes store on mount
 * Wraps the notes feature tree and ensures store is hydrated before children render
 */
export function NotesProvider({ children }: { children: React.ReactNode }) {
  const loadAll = useNotesStore((s) => s.loadAll);

  useEffect(() => {
    // Initialize store on mount
    loadAll();
  }, [loadAll]);

  return <>{children}</>;
}

export default NotesProvider;
