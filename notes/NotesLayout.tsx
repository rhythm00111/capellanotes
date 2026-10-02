import React from 'react';

// Lightweight feature-level layout wrapper.
// Purpose: provide a stable layout export for external consumers.
export function NotesLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

export default NotesLayout;
