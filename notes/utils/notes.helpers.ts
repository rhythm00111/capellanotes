import { Note, NotesView, ALL_NOTES_FOLDER_ID } from '../types/notes.types';
import { type JSONContent } from '@tiptap/react';
// --- Import Organization Domain Utilities -------------------------------------
// Organization owns folder-related utilities
export { getFolderNoteCount } from '@/notes/organization/utils/folder.utils';

// --- ID Generation ------------------------------------------------------------

export const generateId = (): string => crypto.randomUUID();

// --- ID Validation ------------------------------------------------------------

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export const isValidNoteId = (id: string | null | undefined): boolean => {
  if (!id || typeof id !== 'string') return false;
  return UUID_REGEX.test(id.trim());
};

// --- Error Utilities ----------------------------------------------------------

/**
 * Safely extract a human-readable message from an unknown thrown value.
 * Avoids `(error as any)` casts at call sites.
 */
export const getErrorMessage = (error: unknown): string =>
  error instanceof Error ? error.message : String(error);

// --- Date Formatting ----------------------------------------------------------

export const formatRelativeDate = (isoString: string): string => {
  if (!isoString) return '';
  const date = new Date(isoString);
  if (isNaN(date.getTime())) return '';
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));

  if (days === 0) {
    const hours = Math.floor(diff / (1000 * 60 * 60));
    if (hours === 0) {
      const mins = Math.floor(diff / (1000 * 60));
      return mins <= 1 ? 'Just now' : `${mins}m ago`;
    }
    return `${hours}h ago`;
  }
  if (days === 1) return 'Yesterday';
  if (days < 7) return `${days}d ago`;
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
};

// --- HTML / Text Utilities ----------------------------------------------------

const stripHtml = (html: string): string => {
  if (typeof window !== 'undefined' && typeof document !== 'undefined') {
    const div = document.createElement('div');
    div.innerHTML = html;
    return div.textContent || div.innerText || '';
  }
  return html.replace(/<[^>]*>/g, '');
};

/**
 * Safely extracts all plain text from a deeply nested Tiptap JSONContent block.
 */
export const extractPlainTextFromJSON = (content?: JSONContent | string | null): string => {
  if (!content) return '';
  if (typeof content === 'string') return stripHtml(content);

  let text = '';
  if (typeof content !== 'object') return '';
  if ('text' in content && content.text) {
    text += content.text;
  }
  if ('content' in content && Array.isArray(content.content)) {
    for (const child of content.content) {
      const childText = extractPlainTextFromJSON(child);
      if (childText) {
        text += (text ? ' ' : '') + childText;
      }
    }
  }
  return text;
};

/**
 * Derives a display title for a note.
 *
 * Rules (in order):
 *  1. Use the stored title if it is non-empty and not the default 'Untitled'.
 *  2. Fall through to content: extract plain text and use the first line
 *     (capped at 60 chars) so the list never shows repetitive "Untitled" rows.
 *  3. If content is also empty, return 'Untitled' as a last resort.
 */
export const generateFallbackTitle = (
  title: string,
  content?: JSONContent | string | null,
): string => {
  const t = title?.trim();
  if (t && t !== 'Untitled') return t;
  const text = extractPlainTextFromJSON(content).trim();
  if (!text) return 'Untitled';
  const firstLine = text.split('\n')[0].trim();
  return firstLine.slice(0, 60) || 'Untitled';
};

/**
 * Scans a TipTap JSONContent tree for any `wikiLinkMark` mark whose
 * `noteId` attribute matches `targetNoteId`.
 *
 * The WikiLink extension inserts text with a `wikiLinkMark` mark containing
 * `attrs.noteId`, NOT the literal `[[title]]` string — so plain-text search
 * would miss every backlink.  This traversal finds them correctly.
 */
export const hasWikiLinkToNote = (
  content: JSONContent | null | undefined,
  targetNoteId: string,
): boolean => {
  if (!content || !targetNoteId) return false;
  if (typeof content !== 'object') return false;

  // Check marks on this node (text nodes carry the wikiLinkMark)
  if (Array.isArray(content.marks)) {
    for (const mark of content.marks) {
      if (
        (mark as { type?: string; attrs?: Record<string, unknown> }).type === 'wikiLinkMark' &&
        (mark as { type?: string; attrs?: Record<string, unknown> }).attrs?.noteId === targetNoteId
      ) return true;
    }
  }

  // Recurse into child nodes
  if (Array.isArray(content.content)) {
    for (const child of content.content) {
      if (hasWikiLinkToNote(child, targetNoteId)) return true;
    }
  }
  return false;
};

// --- Search text cache --------------------------------------------------------
// Caches the plain-text extraction per JSONContent reference so that repeated
// filter calls (e.g. rapid search keystrokes) never re-traverse the same tree.
const _textCache = new WeakMap<object, string>();

const _getSearchText = (content: JSONContent | null | undefined): string => {
  if (!content || typeof content !== 'object') return '';
  const cached = _textCache.get(content);
  if (cached !== undefined) return cached;
  const text = extractPlainTextFromJSON(content);
  _textCache.set(content, text);
  return text;
};

// --- Note Selectors -----------------------------------------------------------

// Safe timestamp getter — returns 0 for null/undefined/invalid ISO strings
// so that notes with bad dates sort to the end rather than causing NaN
// comparisons (which make Array.sort produce non-deterministic orderings).
const _safeTime = (iso: string | undefined | null): number => {
  if (!iso) return 0;
  const t = new Date(iso).getTime();
  return isNaN(t) ? 0 : t;
};

const sortNotesByRecent = (notes: Note[]): Note[] =>
  [...notes].sort((a, b) => {
    if (a.isPinned && !b.isPinned) return -1;
    if (!a.isPinned && b.isPinned) return 1;
    return _safeTime(b.updatedAt) - _safeTime(a.updatedAt);
  });

export const filterNotes = (
  notes: Note[],
  { view, folderId, searchQuery }: { view: NotesView; folderId: string; searchQuery: string },
): Note[] => {
  // Guard: filter out any null/undefined entries that could theoretically
  // slip in (e.g. a partially-initialised optimistic note) to prevent
  // property access errors further down the chain.
  let result = notes.filter((n): n is Note => n != null);

  if (view === 'trash') {
    result = result.filter((n) => n.isDeleted);
  } else {
    result = result.filter((n) => !n.isDeleted);
  }

  if (view === 'favorites') {
    result = result.filter((n) => n.isPinned);
  }

  if (view === 'today') {
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);
    result = result.filter((n) => new Date(n.updatedAt).getTime() >= startOfToday.getTime());
  } else if (view === 'week') {
    const weekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
    result = result.filter((n) => new Date(n.updatedAt).getTime() >= weekAgo);
  } else if (view === 'inbox') {
    result = result.filter((n) => n.folderId === null);
  }

  if (folderId && folderId !== ALL_NOTES_FOLDER_ID && (view === 'all' || view === 'folder')) {
    result = result.filter((n) => n.folderId === folderId);
  }

  if (searchQuery.trim()) {
    const q = searchQuery.toLowerCase();
    result = result.filter(
      (n) =>
        n.title.toLowerCase().includes(q) ||
        _getSearchText(n.content).toLowerCase().includes(q)
    );
  }

  return sortNotesByRecent(result);
};

/**
 * countWikiLinks — walks the TipTap JSONContent tree and counts the number
 * of unique note IDs referenced via `wikiLinkMark` marks.
 *
 * Returns 0 when content is empty or contains no wiki links.
 */
export const countWikiLinks = (content?: JSONContent | null): number => {
  if (!content || typeof content !== 'object') return 0;
  const ids = new Set<string>();

  const walk = (node: JSONContent): void => {
    if (node && typeof node === 'object') {
      if (node.marks) {
        for (const mark of node.marks) {
          if (mark.type === 'wikiLinkMark' && mark.attrs?.noteId) {
            ids.add(String(mark.attrs.noteId));
          }
        }
      }
      if (node.content) {
        for (const child of node.content) walk(child);
      }
    }
  };

  walk(content);
  return ids.size;
};
