import { Suspense } from 'react';
import { NotesProvider, NotesLoader } from '@/notes';

export default function NotesLayoutRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <NotesProvider>
      <NotesLoader />
      <Suspense fallback={<div className="flex items-center justify-center h-screen">Loading...</div>}>
        {children}
      </Suspense>
    </NotesProvider>
  );
}
