import { NoteDetailsClient } from '@/components/note/NoteDetailsClient';

interface PageProps {
  params: {
    id: string;
  };
}

export async function generateStaticParams() {
  // Get all note IDs from the sample data and any stored notes
  const sampleNotes = [
    { id: '1' },
    { id: '2' },
    { id: '3' }
  ];

  // In a real app, you'd fetch this from your database
  // For now, we'll use the sample note IDs plus some common ones
  const noteIds = [
    ...sampleNotes.map(note => ({ id: note.id })),
    // Add some additional IDs that might be created
    { id: '4' },
    { id: '5' },
    { id: '6' },
    { id: '7' },
    { id: '8' },
    { id: '9' },
    { id: '10' }
  ];

  return noteIds;
}

export default async function NotePage({ params }: PageProps) {
  return <NoteDetailsClient noteId={params.id} />;
}