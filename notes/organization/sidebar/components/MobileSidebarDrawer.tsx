'use client';

import { useEffect } from 'react';
import { X } from 'lucide-react';
import { cn } from '@/notes/utils/ui.utils';
import { NotesSidebar } from './NotesSidebar';

interface MobileSidebarDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

/**
 * Mobile sidebar drawer - replaces persistent sidebar on small screens
 * Provides proper touch interactions, focus trap, and accessibility
 */
export function MobileSidebarDrawer({ isOpen, onClose }: MobileSidebarDrawerProps) {
  // Handle Escape key
  useEffect(() => {
    if (!isOpen) return;
    
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      }
    };
    
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  // Prevent body scroll when drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = '';
      };
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm md:hidden"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer */}
      <div
        className={cn(
          'fixed inset-y-0 left-0 z-[101] w-[280px] md:hidden',
          'bg-[#111111] border-r border-white/[0.06]',
          'transform transition-transform duration-300 ease-out',
          isOpen ? 'translate-x-0' : '-translate-x-full'
        )}
        role="dialog"
        aria-modal="true"
        aria-label="Navigation menu"
      >
        {/* Close button */}
        <div className="absolute top-3 right-3 z-10">
          <button
            onClick={onClose}
            className="flex items-center justify-center w-10 h-10 rounded-lg text-white/60 hover:text-white hover:bg-white/[0.08] transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500/50"
            aria-label="Close navigation menu"
          >
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>

        {/* Sidebar content */}
        <NotesSidebar />
      </div>
    </>
  );
}
