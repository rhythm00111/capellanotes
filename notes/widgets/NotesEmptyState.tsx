'use client';

import { useNoteNavigation } from '../hooks/useNoteNavigation';

interface NotesEmptyStateProps {
  context: 'list' | 'editor';
}

// --- Time-of-day contextual prompt -------------------------------------------

function getContextualPrompt(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "What's on your plate today?";
  if (hour < 17) return 'Capture decisions or context.';
  return 'What should you remember for tomorrow?';
}

// --- NotesEmptyState ----------------------------------------------------------

export function NotesEmptyState({ context }: NotesEmptyStateProps) {
  const { createAndNavigate } = useNoteNavigation();

  if (context === 'list') {
    return (
      <div className="flex flex-col items-center justify-center h-full px-6 py-10 text-center">
        {/* Icon */}
        <div className="w-11 h-11 rounded-2xl bg-teal-500/10 border border-teal-500/15 flex items-center justify-center mb-5 shrink-0">
          <svg 
            width="20" 
            height="20" 
            viewBox="0 0 20 20" 
            fill="none" 
            aria-hidden
            style={{ userSelect: 'none', WebkitUserDrag: 'none' } as React.CSSProperties}
          >
            <rect x="4" y="2" width="12" height="16" rx="2.5" stroke="currentColor" strokeWidth="1.3" className="text-teal-400/60" />
            <line x1="7" y1="7" x2="13" y2="7" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" className="text-teal-400/60" />
            <line x1="7" y1="10" x2="13" y2="10" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" className="text-teal-400/50" />
            <line x1="7" y1="13" x2="10.5" y2="13" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" className="text-teal-400/40" />
          </svg>
        </div>

        {/* Contextual prompt — changes by time of day */}
        <p className="text-[14px] font-medium text-white/55 leading-snug mb-1.5">
          {getContextualPrompt()}
        </p>

        <p className="text-[12px] text-white/50 leading-relaxed max-w-[200px] mb-6">
          Create a note to get started.
        </p>

        {/* Primary CTA */}
        <button
          onClick={() => createAndNavigate()}
          className="px-4 py-2 rounded-lg text-[13px] font-medium text-teal-300 bg-teal-500/[0.12] border border-teal-500/25 hover:bg-teal-500/[0.20] hover:border-teal-500/40 transition-all duration-150 shadow-[0_0_20px_rgba(20,184,166,0.12)] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-teal-500/50"
        >
          Create your first note
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center flex-1 gap-2 text-center">
      <p className="text-[13px] text-white/30">Select a note to start writing</p>
    </div>
  );
}
