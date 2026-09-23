'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { EditorContent, Editor, type JSONContent } from '@tiptap/react';
import { BubbleMenu } from '@tiptap/react/menus';
import { Bold, Code, Heading1, Heading2, Italic, Strikethrough, MoreHorizontal, Highlighter, Quote, Tag, Plus } from 'lucide-react';
import { Button } from '@web/components/ui/button';
import { cn } from '@web/lib/utils';
import { BlockMenu } from './BlockMenu';
import { SlashMenu } from './SlashMenu';
import { WikiLinkMenu } from './WikiLinkMenu';
import { type WikiLinkMenuState } from '../extensions/WikiLink';
import { type SlashCommandItem, type SlashMenuState } from '../extensions/SlashCommand';

// ── Quick-start templates ───────────────────────────────────────────────────
const QUICK_START_TEMPLATES = [
  {
    label: 'Meeting Notes',
    content: {
      type: 'doc',
      content: [
        { type: 'heading', attrs: { level: 1 }, content: [{ type: 'text', text: 'Meeting Notes' }] },
        { type: 'heading', attrs: { level: 2 }, content: [{ type: 'text', text: 'Attendees' }] },
        { type: 'bulletList', content: [{ type: 'listItem', content: [{ type: 'paragraph' }] }] },
        { type: 'heading', attrs: { level: 2 }, content: [{ type: 'text', text: 'Agenda' }] },
        { type: 'bulletList', content: [{ type: 'listItem', content: [{ type: 'paragraph' }] }] },
        { type: 'heading', attrs: { level: 2 }, content: [{ type: 'text', text: 'Action Items' }] },
        { type: 'bulletList', content: [{ type: 'listItem', content: [{ type: 'paragraph' }] }] },
      ],
    },
  },
  {
    label: 'Brain Dump',
    content: {
      type: 'doc',
      content: [
        { type: 'heading', attrs: { level: 1 }, content: [{ type: 'text', text: 'Brain Dump' }] },
        { type: 'paragraph' },
        { type: 'paragraph' },
        { type: 'paragraph' },
      ],
    },
  },
  {
    label: 'Project Plan',
    content: {
      type: 'doc',
      content: [
        { type: 'heading', attrs: { level: 1 }, content: [{ type: 'text', text: 'Project Plan' }] },
        { type: 'heading', attrs: { level: 2 }, content: [{ type: 'text', text: 'Overview' }] },
        { type: 'paragraph', content: [{ type: 'text', text: '' }] },
        { type: 'heading', attrs: { level: 2 }, content: [{ type: 'text', text: 'Goals' }] },
        { type: 'bulletList', content: [{ type: 'listItem', content: [{ type: 'paragraph' }] }] },
        { type: 'heading', attrs: { level: 2 }, content: [{ type: 'text', text: 'Timeline' }] },
        { type: 'bulletList', content: [{ type: 'listItem', content: [{ type: 'paragraph' }] }] },
      ],
    },
  },
] as const;

interface EditorCoreProps {
  editor: Editor | null;
  wikiLinkState: WikiLinkMenuState | null;
  wikiLinkKeyDownRef: React.MutableRefObject<((e: KeyboardEvent) => boolean) | null>;
  closeWikiLink: () => void;
  slashMenuState: SlashMenuState | null;
  slashMenuKeyDownRef: React.MutableRefObject<((e: KeyboardEvent) => boolean) | null>;
  closeSlashMenu: () => void;
  /** Called when user selects "Add as Tag" from bubble overflow. */
  onAddTag?: (tag: string) => void;
}

export function EditorCore({
  editor,
  wikiLinkState,
  wikiLinkKeyDownRef,
  closeWikiLink,
  slashMenuState,
  slashMenuKeyDownRef,
  closeSlashMenu,
  onAddTag,
}: EditorCoreProps) {
  const [overflowOpen, setOverflowOpen] = useState(false);
  // Store the bounding rect of the overflow trigger button so the dropdown can
  // be positioned with fixed coordinates (BubbleMenu lives in a portal and may
  // have overflow:hidden ancestors).
  const [overflowRect, setOverflowRect] = useState<DOMRect | null>(null);
  const overflowBtnRef = useRef<HTMLButtonElement>(null);
  const overflowMenuRef = useRef<HTMLDivElement>(null);

  // Close overflow dropdown when clicking outside
  useEffect(() => {
    if (!overflowOpen) return;
    const handler = (e: MouseEvent) => {
      if (overflowMenuRef.current && !overflowMenuRef.current.contains(e.target as Node)) {
        setOverflowOpen(false);
      }
    };
    const onResize = () => setOverflowOpen(false);
    document.addEventListener('mousedown', handler);
    window.addEventListener('resize', onResize);
    window.addEventListener('scroll', onResize, true);
    return () => {
      document.removeEventListener('mousedown', handler);
      window.removeEventListener('resize', onResize);
      window.removeEventListener('scroll', onResize, true);
    };
  }, [overflowOpen]);

  const handleOverflowToggle = useCallback(() => {
    if (!overflowOpen && overflowBtnRef.current) {
      setOverflowRect(overflowBtnRef.current.getBoundingClientRect());
    }
    setOverflowOpen((v) => !v);
  }, [overflowOpen]);

  

  const handleAddAsTag = useCallback(() => {
    if (!editor || !onAddTag) return;
    const { from, to } = editor.state.selection;
    const text = editor.state.doc.textBetween(from, to, ' ').trim().toLowerCase();
    if (text) onAddTag(text);
    setOverflowOpen(false);
  }, [editor, onAddTag]);

  // ── Empty-state detection ─────────────────────────────────────────────────
  // Start as false to prevent a flash of template chips on non-empty notes
  // (editor is null on the initial synchronous render; the effect below fires
  // after TipTap initialises and sets the correct value).
  const [isEditorEmpty, setIsEditorEmpty] = useState(false);

  useEffect(() => {
    if (!editor) return;
    // Use TipTap's built-in isEmpty getter — more reliable than manual doc inspection.
    const checkEmpty = () => setIsEditorEmpty(editor.isEmpty);
    // Evaluate immediately once the editor instance is available.
    checkEmpty();
    editor.on('update', checkEmpty);
    return () => { editor.off('update', checkEmpty); };
  }, [editor]);

  const applyTemplate = useCallback((template: (typeof QUICK_START_TEMPLATES)[number]) => {
    if (!editor) return;
    // Single transaction: set content then move cursor to end.
    // TipTap types may disagree about the exact JSON shape here; cast to any.
    editor.commands.setContent(template.content as unknown as JSONContent);
    editor.commands.focus('end');
  }, [editor]);

  // ── Block Insert ("+" button + BlockMenu) ────────────────────────────────
  const [blockBtn, setBlockBtn] = useState<{ top: number; left: number } | null>(null);
  // Stores the viewport position to anchor the BlockMenu (captured at click time)
  const [blockMenuPos, setBlockMenuPos] = useState<{ x: number; y: number } | null>(null);
  // Stores ProseMirror doc positions captured when "+" is clicked
  const insertionCtxRef = useRef<{ isEmpty: boolean; blockStartPos: number; afterPos: number } | null>(null);
  const blockBtnRef = useRef<HTMLButtonElement>(null);
  const editorWrapperRef = useRef<HTMLDivElement>(null);
  const hoveredBlockRef = useRef<Element | null>(null);
  const hideTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // When the page scrolls, block rects become stale — hide immediately
  useEffect(() => {
    const onScroll = () => {
      if (hideTimeoutRef.current) clearTimeout(hideTimeoutRef.current);
      setBlockBtn(null);
      hoveredBlockRef.current = null;
    };
    window.addEventListener('scroll', onScroll, true);
    return () => window.removeEventListener('scroll', onScroll, true);
  }, []);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => { if (hideTimeoutRef.current) clearTimeout(hideTimeoutRef.current); };
  }, []);

  // ── Document-level mousemove: stable hover detection for the "+" button ─────
  // The old onMouseMove/onMouseLeave approach fired onMouseLeave as soon as the
  // mouse crossed the wrapper's bounding box on its way to the "+" button
  // (which sits 36px to the left, outside the wrapper). The 150ms timeout
  // sometimes expired before onMouseEnter on the button fired, making the
  // button vanish. The document-level listener extends the hit area 40px to
  // the left, so moving from content → "+" button never triggers a hide.
  useEffect(() => {
    if (!editor) return;
    const onDocMouseMove = (e: MouseEvent) => {
      const wrapperEl = editorWrapperRef.current;
      const proseMirror = wrapperEl?.querySelector('.ProseMirror') as HTMLElement | null;
      if (!wrapperEl || !proseMirror) return;

      const wrapperRect = wrapperEl.getBoundingClientRect();
      // Extend 40px left to include the fixed-position "+" button zone
      const inArea =
        e.clientX >= wrapperRect.left - 40 &&
        e.clientX <= wrapperRect.right &&
        e.clientY >= wrapperRect.top &&
        e.clientY <= wrapperRect.bottom;

      if (!inArea) {
        // Mouse left the editor + button area — start hide
        if (hoveredBlockRef.current !== null) {
          hoveredBlockRef.current = null;
          if (hideTimeoutRef.current) clearTimeout(hideTimeoutRef.current);
          hideTimeoutRef.current = setTimeout(() => setBlockBtn(null), 150);
        }
        return;
      }

      // Mouse is in the "+" button zone (left of the wrapper) — keep visible
      if (e.clientX < wrapperRect.left) {
        if (hideTimeoutRef.current) { clearTimeout(hideTimeoutRef.current); hideTimeoutRef.current = null; }
        return;
      }

      // Guard: for indented blocks (list items, blockquotes) Tailwind prose shifts
      // the block's left edge right of wrapperRect.left, so the "+" button can
      // overlap the wrapper's x-range. Check the button's own bounding rect so
      // moving onto it never triggers a hide regardless of indentation level.
      if (blockBtnRef.current) {
        const btnRect = blockBtnRef.current.getBoundingClientRect();
        if (
          e.clientX >= btnRect.left && e.clientX <= btnRect.right &&
          e.clientY >= btnRect.top  && e.clientY <= btnRect.bottom
        ) {
          if (hideTimeoutRef.current) { clearTimeout(hideTimeoutRef.current); hideTimeoutRef.current = null; }
          return;
        }
      }

      // Mouse is over editor content — detect which top-level block
      if (hideTimeoutRef.current) { clearTimeout(hideTimeoutRef.current); hideTimeoutRef.current = null; }

      const target = document.elementFromPoint(e.clientX, e.clientY);
      if (!target) return;

      let block: Element | null = null;
      for (const child of Array.from(proseMirror.children)) {
        if (child === target || child.contains(target)) { block = child; break; }
      }

      if (!block) {
        if (hoveredBlockRef.current !== null) {
          hoveredBlockRef.current = null;
          if (hideTimeoutRef.current) clearTimeout(hideTimeoutRef.current);
          hideTimeoutRef.current = setTimeout(() => setBlockBtn(null), 120);
        }
        return;
      }

      if (block === hoveredBlockRef.current) return;

      hoveredBlockRef.current = block;
      const rect = block.getBoundingClientRect();
      const btnY = rect.top + Math.min(rect.height, 32) / 2 - 12;
      setBlockBtn({ top: btnY, left: Math.max(4, rect.left - 36) });
    };

    document.addEventListener('mousemove', onDocMouseMove);
    return () => document.removeEventListener('mousemove', onDocMouseMove);
  }, [editor]);

  const handleBlockInsert = useCallback(() => {
    if (!editor || !hoveredBlockRef.current) return;

    const block = hoveredBlockRef.current as HTMLElement;
    const rect = block.getBoundingClientRect();

    const coordsResult = editor.view.posAtCoords({ left: rect.left + 4, top: rect.top + 4 });
    if (!coordsResult) return;

    const { state } = editor;
    const $pos = state.doc.resolve(coordsResult.pos);
    if ($pos.depth < 1) return;

    const blockNode = $pos.node(1);
    const isEmpty = blockNode.content.size === 0;
    const blockStartPos = $pos.start(1);
    const afterPos = $pos.after(1);

    // Store insertion context so executeBlockCommand can use the right position
    // even after the editor refocuses and the selection changes.
    insertionCtxRef.current = { isEmpty, blockStartPos, afterPos };

    // Place cursor inside the target block so the editor is focused and ready.
    editor.chain().focus().setTextSelection(blockStartPos).run();

    // Open the block menu anchored to the "+" button
    if (blockBtnRef.current) {
      const btnRect = blockBtnRef.current.getBoundingClientRect();
      setBlockMenuPos({ x: btnRect.left, y: btnRect.bottom });
    } else {
      setBlockMenuPos({ x: Math.max(4, rect.left - 36), y: rect.top });
    }
  }, [editor]);

  const executeBlockCommand = useCallback((item: SlashCommandItem) => {
    if (!editor || !insertionCtxRef.current) return;
    const { isEmpty, blockStartPos, afterPos } = insertionCtxRef.current;
    insertionCtxRef.current = null;

    if (isEmpty) {
      // Transform the empty block in place
      editor.chain().focus().setTextSelection(blockStartPos).run();
      item.command(editor);
    } else {
      // Insert a fresh paragraph below the current block, then transform it
      editor
        .chain()
        .focus()
        .insertContentAt(afterPos, [{ type: 'paragraph' }])
        .setTextSelection(afterPos + 1)
        .run();
      item.command(editor);
    }
  }, [editor]);

  const closeBlockMenu = useCallback(() => {
    setBlockMenuPos(null);
    // Reset hover state so stale DOM refs (e.g. <p> that became <h1>) don't
    // cause a 120ms flicker when the user next moves their mouse.
    setBlockBtn(null);
    hoveredBlockRef.current = null;
    insertionCtxRef.current = null;
    // Return focus to editor so typing can resume immediately
    editor?.commands.focus();
  }, [editor]);

  // Global Escape handler: closes any open editor menus
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (overflowOpen) setOverflowOpen(false);
        if (blockMenuPos) closeBlockMenu();
        if (wikiLinkState) closeWikiLink();
        if (slashMenuState) closeSlashMenu();
      }
    };
    if (overflowOpen || blockMenuPos || wikiLinkState || slashMenuState) {
      document.addEventListener('keydown', handler);
    }
    return () => document.removeEventListener('keydown', handler);
  }, [overflowOpen, blockMenuPos, wikiLinkState, slashMenuState, closeBlockMenu, closeWikiLink, closeSlashMenu]);

  if (!editor) return null;

  return (
    <div
      ref={editorWrapperRef}
      className="relative flex-1 w-full"
    >
      {/* Bubble menu — 6 core actions + ··· overflow */}
      <BubbleMenu
        editor={editor}
        className="flex items-center gap-0.5 px-1 py-1 rounded-lg border border-white/[0.08] bg-[#0f0f0f] shadow-xl animate-in fade-in-0 zoom-in-95 duration-150"
      >
        <Button variant="ghost" size="icon-sm" className={cn("rounded-sm h-8 w-8 text-white/50 hover:text-white/90 hover:bg-white/[0.06] transition-colors duration-100", editor.isActive('bold') && "bg-white/[0.10] text-white")} onClick={() => editor.chain().focus().toggleBold().run()}>
          <Bold className="h-3.5 w-3.5" />
        </Button>
        <Button variant="ghost" size="icon-sm" className={cn("rounded-sm h-8 w-8 text-white/50 hover:text-white/90 hover:bg-white/[0.06] transition-colors duration-100", editor.isActive('italic') && "bg-white/[0.10] text-white")} onClick={() => editor.chain().focus().toggleItalic().run()}>
          <Italic className="h-3.5 w-3.5" />
        </Button>
        <Button variant="ghost" size="icon-sm" className={cn("rounded-sm h-8 w-8 text-white/50 hover:text-white/90 hover:bg-white/[0.06] transition-colors duration-100", editor.isActive('strike') && "bg-white/[0.10] text-white")} onClick={() => editor.chain().focus().toggleStrike().run()}>
          <Strikethrough className="h-3.5 w-3.5" />
        </Button>
        <Button variant="ghost" size="icon-sm" className={cn("rounded-sm h-8 w-8 text-white/50 hover:text-white/90 hover:bg-white/[0.06] transition-colors duration-100", editor.isActive('code') && "bg-white/[0.10] text-white")} onClick={() => editor.chain().focus().toggleCode().run()}>
          <Code className="h-3.5 w-3.5" />
        </Button>
        <div className="w-px h-4 bg-white/[0.08] mx-0.5 shrink-0 self-center" />
        <Button variant="ghost" size="icon-sm" className={cn("rounded-sm h-8 w-8 text-white/50 hover:text-white/90 hover:bg-white/[0.06] transition-colors duration-100", editor.isActive('heading', { level: 1 }) && "bg-white/[0.10] text-white")} onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}>
          <Heading1 className="h-3.5 w-3.5" />
        </Button>
        <Button variant="ghost" size="icon-sm" className={cn("rounded-sm h-8 w-8 text-white/50 hover:text-white/90 hover:bg-white/[0.06] transition-colors duration-100", editor.isActive('heading', { level: 2 }) && "bg-white/[0.10] text-white")} onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}>
          <Heading2 className="h-3.5 w-3.5" />
        </Button>
        {/* ··· overflow — exposes: Highlight, Quote, Add as Tag */}
        <div className="w-px h-4 bg-white/[0.08] mx-0.5 shrink-0 self-center" />
        <button
          ref={overflowBtnRef}
          onClick={handleOverflowToggle}
          className={cn(
            'rounded-sm h-8 w-8 flex items-center justify-center text-white/50 hover:text-white/90 hover:bg-white/[0.06] transition-colors duration-100',
            overflowOpen && 'bg-white/[0.08] text-white/70',
          )}
          title="More formatting"
        >
          <MoreHorizontal className="h-3.5 w-3.5" />
        </button>
      </BubbleMenu>

      {/* Overflow dropdown — portalled via fixed positioning */}
      {overflowOpen && overflowRect && (
        <div
          ref={overflowMenuRef}
          style={{
            position: 'fixed',
            top: overflowRect.bottom + 6,
            left: Math.max(8, Math.min(overflowRect.left, window.innerWidth - 176)),
            zIndex: 300,
          }}
          className="w-40 rounded-xl border border-white/[0.08] bg-[#0f0f0f] shadow-2xl p-1 animate-in fade-in-0 zoom-in-95 duration-150"
        >
          {/* T14: Highlight selection */}
          <button
            onClick={() => { editor.chain().focus().toggleHighlight().run(); setOverflowOpen(false); }}
            className={cn(
              'flex items-center gap-2 w-full px-2.5 py-1.5 rounded-lg text-[13px] text-left transition-colors duration-100',
              editor.isActive('highlight')
                ? 'bg-amber-500/10 text-amber-400'
                : 'text-white/60 hover:bg-white/[0.05] hover:text-white/85',
            )}
          >
            <Highlighter className="h-3.5 w-3.5 shrink-0" />
            Highlight
          </button>

          {/* T6/T14: Quote selection */}
          <button
            onClick={() => { editor.chain().focus().toggleBlockquote().run(); setOverflowOpen(false); }}
            className={cn(
              'flex items-center gap-2 w-full px-2.5 py-1.5 rounded-lg text-[13px] text-left transition-colors duration-100',
              editor.isActive('blockquote')
                ? 'bg-white/[0.08] text-white'
                : 'text-white/60 hover:bg-white/[0.05] hover:text-white/85',
            )}
          >
            <Quote className="h-3.5 w-3.5 shrink-0" />
            Quote
          </button>

          {/* T14: Add selected text as note tag */}
          {onAddTag && (
            <>
              <div className="h-px bg-white/[0.05] my-1 mx-1" />
              <button
                onClick={handleAddAsTag}
                className="flex items-center gap-2 w-full px-2.5 py-1.5 rounded-lg text-[13px] text-left text-white/60 hover:bg-white/[0.05] hover:text-white/85 transition-colors duration-100"
              >
                <Tag className="h-3.5 w-3.5 shrink-0" />
                Add as Tag
              </button>
            </>
          )}
        </div>
      )}

      {/* Block Insert "+" button — hidden while any command menu is open */}
      {blockBtn && !blockMenuPos && !wikiLinkState && !slashMenuState && !overflowOpen && (
        <button
          ref={blockBtnRef}
          onMouseDown={(e) => { e.preventDefault(); handleBlockInsert(); }}
          style={{ position: 'fixed', top: blockBtn.top, left: blockBtn.left, zIndex: 50 }}
          className="h-6 w-6 flex items-center justify-center rounded-full text-white/25 hover:text-white/65 hover:bg-white/[0.07] border border-transparent hover:border-white/[0.10] transition-all duration-150 select-none cursor-pointer"
          title="Insert block"
          aria-label="Insert block"
          data-testid="plus-button"
        >
          <Plus className="h-3 w-3" />
        </button>
      )}

      {/* Block command menu — triggered by "+" button */}
      {blockMenuPos && (
        <BlockMenu
          pos={blockMenuPos}
          onSelect={executeBlockCommand}
          onClose={closeBlockMenu}
        />
      )}

      {/* T10: Wiki-link suggestion dropdown */}
      {wikiLinkState && (
        <WikiLinkMenu state={wikiLinkState} keyDownRef={wikiLinkKeyDownRef} onClose={closeWikiLink} />
      )}

      {/* Slash command menu — triggered by "/" */}
      {slashMenuState && (
        <SlashMenu state={slashMenuState} keyDownRef={slashMenuKeyDownRef} onClose={closeSlashMenu} />
      )}

      {/* Quick-start templates — absolutely positioned so they never push EditorContent
          down and cause a layout jump when the editor gains its first character. */}
      {isEditorEmpty && (
        <div
          className="absolute top-16 left-0 flex flex-wrap gap-2 z-10 animate-in fade-in-0 duration-200 px-10"
          data-testid="quick-start-templates"
        >
          {QUICK_START_TEMPLATES.map((tmpl) => (
            <button
              key={tmpl.label}
              onMouseDown={(e) => { e.preventDefault(); applyTemplate(tmpl); }}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[12px] text-white/35 bg-transparent border border-white/[0.08] hover:text-white/70 hover:border-teal-500/30 hover:bg-teal-500/[0.05] transition-all duration-150 select-none focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-teal-500/50"
            >
              {tmpl.label}
            </button>
          ))}
        </div>
      )}

      <EditorContent editor={editor} className="prose prose-invert max-w-none w-full outline-none [&_.ProseMirror]:outline-none [&_.ProseMirror]:min-h-[480px] [&_.ProseMirror]:text-[16px] [&_.ProseMirror]:text-white/85 [&_.ProseMirror]:leading-[1.85] [&_.ProseMirror]:font-normal [&_.ProseMirror]:px-0" />
    </div>
  );
}

