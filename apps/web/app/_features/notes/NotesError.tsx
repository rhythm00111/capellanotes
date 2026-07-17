import React from 'react';

export function NotesError({ error }: { error: Error | null }) {
  if (!error) return null;
  return (
    <div className="p-4 text-sm text-red-500">{error.message}</div>
  );
}

export default NotesError;
