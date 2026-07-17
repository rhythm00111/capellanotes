'use server';

import {
  createFolderAction,
  deleteFolderAction,
  renameFolderAction,
} from '@features/notes/services';
import { Folder, CreateFolderInput, UpdateFolderInput } from '../types/organization.types';

/**
 * Organization service for folder operations
 * Owns the contract for folder management
 * Delegates to server actions for persistence
 */

/**
 * Create a new folder
 */
export async function createFolder(input: CreateFolderInput): Promise<Folder> {
  return createFolderAction(input.name);
}

/**
 * Delete a folder by ID
 */
export async function deleteFolder(id: string): Promise<void> {
  return deleteFolderAction(id);
}

/**
 * Rename a folder
 */
export async function renameFolder(id: string, newName: string): Promise<void> {
  return renameFolderAction(id, newName);
}
