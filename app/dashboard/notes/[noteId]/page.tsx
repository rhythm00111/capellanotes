import { NoteEditorPage } from '@/_features/notes';

export default async function NoteIdPage({
  params,
}: {
  params: Promise<{ noteId: string }>;
}) {
  const { noteId } = await params;
  return <NoteEditorPage noteId={noteId} />;
}
