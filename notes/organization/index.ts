/**
 * Organization Domain
 *
 * Owns all organizational responsibilities within the Notes feature:
 * - Folders and folder hierarchy
 * - Collections (pinned, favorites, recent, archive)
 * - Tags and tagging
 * - Sidebar UI and navigation orchestration
 */

// Domain types
export * from './types/organization.types';

// Domain services (folder operations)
export * from './services/folders.service';

// Domain utilities (folder helpers)
export { getFolderNoteCount } from './utils/folder.utils';

// Sidebar UI components (canonical implementation)
export { NotesSidebar } from './sidebar/components/NotesSidebar';
export { SidebarFolderItem } from './sidebar/components/SidebarFolderItem';

// Sidebar orchestration hook (canonical implementation)
export { useSidebar } from './sidebar/hooks/useSidebar';
