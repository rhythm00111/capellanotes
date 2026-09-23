import { NotesProvider, NotesLoader } from '@/_features/notes';

export default function NotesLayoutRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <NotesProvider>
      <NotesLoader />
      {children}
    </NotesProvider>
  );
}
