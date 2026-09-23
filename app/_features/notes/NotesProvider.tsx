"use client";

import React from 'react';

// Minimal NotesProvider placeholder.
// During P1 we keep this lightweight and non-invasive — it should be
// expanded later to initialize stores, providers and side-effects.
export function NotesProvider({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

export default NotesProvider;
