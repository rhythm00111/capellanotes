# Manual Verification Steps for Content Drag Fix

## Issue Fixed
Content drags downward with cursor when clicking and dragging in the Notes main content area.

## Root Cause
SVG elements lacked explicit drag prevention, causing browser's native "ghost drag" behavior.

## Fix Applied
1. Added inline styles to the empty state SVG icon (`notes/widgets/NotesEmptyState.tsx`)
2. Added global CSS rule: `svg { -webkit-user-drag: none; user-select: none; }` (`app/globals.css`)

---

## Manual Verification Checklist

### Empty State (0 notes)

Navigate to: `http://localhost:3001/notes`

1. **Icon drag test:**
   - Click and hold on the document icon
   - Drag mouse downward 100px
   - **Expected:** Icon stays in place, no ghost drag image
   - **Status:** ☐ Pass / ☐ Fail

2. **Heading drag test:**
   - Click and hold on "What should you remember for tomorrow?" text
   - Drag mouse downward 100px
   - **Expected:** Text stays in place, no content shift
   - **Status:** ☐ Pass / ☐ Fail

3. **Button drag test:**
   - Click and hold on "Create your first note" button
   - Drag mouse downward 100px
   - **Expected:** Button stays in place
   - **Status:** ☐ Pass / ☐ Fail

4. **Whitespace drag test:**
   - Click and hold in empty space (right side of screen)
   - Drag mouse downward 100px
   - **Expected:** No visual movement of any content
   - **Status:** ☐ Pass / ☐ Fail

### With Notes Present

Create at least one note, then:

5. **Note card icons (list view):**
   - Click and hold on Star icon in a note card
   - Drag mouse downward
   - **Expected:** Icon doesn't drag, no ghost image
   - **Status:** ☐ Pass / ☐ Fail

6. **Note card icons (grid view):**
   - Switch to grid view
   - Click and hold on MoreHorizontal (three dots) icon
   - Drag mouse downward
   - **Expected:** Icon doesn't drag
   - **Status:** ☐ Pass / ☐ Fail

7. **Header icons:**
   - Click and hold on Search icon in header
   - Drag mouse downward
   - **Expected:** Icon doesn't drag
   - **Status:** ☐ Pass / ☐ Fail

8. **Sidebar icons:**
   - Click and hold on any sidebar icon (Files, Star, Trash, etc.)
   - Drag mouse downward
   - **Expected:** Icon doesn't drag
   - **Status:** ☐ Pass / ☐ Fail

### CSS Verification (Browser DevTools)

9. **Computed styles check:**
   - Open DevTools (F12)
   - Inspect any SVG element
   - Check Computed tab
   - **Expected:** 
     - `user-select: none`
     - `-webkit-user-drag: none`
   - **Status:** ☐ Pass / ☐ Fail

---

## Browsers to Test

- ☐ Chrome/Edge (Chromium)
- ☐ Firefox
- ☐ Safari (if available)

---

## Regression Tests

Ensure these still work:

- ☐ Clicking button opens note editor
- ☐ Clicking icons performs their action (pin, more menu, etc.)
- ☐ Text selection still works on headings/paragraphs
- ☐ Scrolling works normally
- ☐ Note card click opens the note

---

## Notes

Date: _______________
Tester: _______________
Build: Production build from `npm run build`
Browser: _______________
Version: _______________

Additional observations:
