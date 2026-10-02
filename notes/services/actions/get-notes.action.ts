'use server';

import { type Note, type Folder, ALL_NOTES_FOLDER } from '@/notes';
import { USE_MOCK_DATA, getMockNotes, getMockFolders } from '../mock';

export async function getNotesAction(): Promise<Note[]> {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 50));
  
  if (USE_MOCK_DATA) {
    // Development-only warning
    if (process.env.NODE_ENV === 'development') {
      console.warn('[getNotesAction] Using mock data (development mode)');
    }
    return getMockNotes();
  }
  
  // TODO: Implement real backend integration
  return [];
}

export async function getFoldersAction(): Promise<Folder[]> {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 50));
  
  if (USE_MOCK_DATA) {
    // Development-only warning
    if (process.env.NODE_ENV === 'development') {
      console.warn('[getFoldersAction] Using mock data (development mode)');
    }
    return [ALL_NOTES_FOLDER, ...getMockFolders()];
  }
  
  // TODO: Implement real backend integration
  return [ALL_NOTES_FOLDER];
}
