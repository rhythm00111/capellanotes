"use client";

import React from 'react';
export { NotesList } from './documents/list/components/NotesList';

// Canonical feature root component.
// This file re-exports the canonical list implementation so consumers can
// import from the feature root without relying on legacy module paths.

export default function NotesRoot() {
  return null;
}
