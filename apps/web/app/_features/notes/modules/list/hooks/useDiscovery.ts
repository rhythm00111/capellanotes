'use client';

// ─── localStorage visit history ───────────────────────────────────────────────

const VISITED_KEY = 'notes-visited';
const MAX_VISITED = 30;

function readVisited(): string[] {
  try {
    const raw = localStorage.getItem(VISITED_KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as string[]) : [];
  } catch {
    return [];
  }
}

/**
 * recordVisit — call when the user opens a note.
 * Moves the noteId to the front of the visit history and persists it.
 * Safe to call on every navigation; deduplicates automatically.
 */
export function recordVisit(noteId: string): void {
  try {
    const prev = readVisited().filter((id) => id !== noteId);
    localStorage.setItem(
      VISITED_KEY,
      JSON.stringify([noteId, ...prev].slice(0, MAX_VISITED)),
    );
  } catch { /* ignore — private browsing / storage full */ }
}

