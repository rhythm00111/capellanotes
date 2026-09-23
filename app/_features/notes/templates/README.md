# Note Templates Module

**Status**: Reserved Namespace  
**Owner**: Templates Team (Future)  
**Timeline**: Phase 5 (Q3 2026)

---

## Purpose

This directory is reserved for user-defined note templates that extend beyond the quick-start templates currently embedded in the editor.

---

## Planned Features

### 1. Template Library
- Pre-built template collection
- Category organization (Meeting, Project, Daily, etc.)
- Template previews
- Template search

### 2. Custom Templates
- User-created templates
- Save current note as template
- Template variables/placeholders
- Template sharing (Phase 7 - collaboration)

### 3. Template Management
- Create/Edit/Delete templates
- Template metadata (name, description, tags)
- Template versioning
- Import/Export templates

### 4. Smart Templates
- Dynamic content (dates, user info)
- Conditional sections
- Template inheritance
- Variable substitution

---

## Architecture

The templates module will integrate with:
- **Editor Domain**: Template application logic
- **Store**: Template storage and state
- **Services**: Template CRUD operations
- **Organization**: Template folders/categorization

---

## Current Quick-Start Templates

Location: `editor/components/EditorCore.tsx`

Hardcoded templates:
- Meeting Notes
- Brain Dump
- Project Plan

These will remain in EditorCore for immediate empty-note UX.

---

## Migration Path

### Phase 5 Implementation Steps

1. **Extract template types** to this module
2. **Create template service** layer
3. **Build template UI** (library, editor, preview)
4. **Implement template storage** in Supabase
5. **Add template picker** to editor
6. **Migrate quick-start templates** to this system

---

## Template Data Model

```typescript
interface NoteTemplate {
  id: string;
  name: string;
  description?: string;
  category: 'meeting' | 'project' | 'daily' | 'custom';
  content: JSONContent; // TipTap content
  variables?: TemplateVariable[];
  tags?: string[];
  isSystem: boolean; // Built-in vs user-created
  createdAt: string;
  updatedAt: string;
  userId?: string; // For user templates
}

interface TemplateVariable {
  key: string;
  label: string;
  type: 'text' | 'date' | 'select';
  defaultValue?: string;
  options?: string[]; // For select type
}
```

---

## Extension Points

Future template features should:
- ✅ Preserve existing quick-start templates
- ✅ Support both system and user templates
- ✅ Allow template import/export (JSON)
- ✅ Integrate with collaboration (Phase 7) for sharing
- ✅ Work offline (cached templates)

---

## What Does NOT Belong Here

- ❌ Quick-start templates → Stay in EditorCore (better UX)
- ❌ AI-generated templates → Use `ai/`
- ❌ Shared team templates → Use `collaboration/` (Phase 7)
- ❌ Block-level snippets → Consider separate feature

---

## Current Implementation

Quick-start templates in:
- `editor/components/EditorCore.tsx` (QUICK_START_TEMPLATES constant)

**Entry Point**: `index.ts` (placeholder barrel export)

---

## Dependencies

Requires:
- Phase 4 completion (Supabase for template storage)
- Consider AI features (Phase 6) for smart template suggestions
