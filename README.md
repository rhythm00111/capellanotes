Capella Notes is a core module of Capella Pro, designed as a focused environment for thinking, writing, and structuring work.

It is built for independent professionals who need clarity, not complexity.

---

# Purpose

Capella Notes is not a traditional note-taking tool.

It is a system for:

* capturing ideas
* organizing thoughts
* executing work with precision

The objective is to reduce cognitive friction and enable users to focus on meaningful output.

---

# System Overview

Capella Notes is structured as a modular frontend system designed for scalability and long-term maintainability.

```
Notes System
├── Editor        → Writing experience
├── List          → Notes navigation
├── Sidebar       → Structure and context
├── Store         → State management (Zustand)
├── Actions       → Backend-ready data contracts
├── Hooks         → Business logic layer
```

---

# Data Flow

```
URL (source of truth)
    ↓
NoteEditorPage
    ↓
NotesEditor
    ↓
Editor Core (TipTap)
    ↓
User Interaction
    ↓
Debounced Save → Store
```

---

# State Architecture

The system uses a layered state model to maintain clarity and predictability.

| Layer         | Responsibility                  |
| ------------- | ------------------------------- |
| URL (Next.js) | Navigation and context          |
| Zustand Store | Notes data and operations       |
| Editor State  | Document content                |
| Local State   | UI behavior (focus mode, title) |

---

# Editor Philosophy

The editor is intentionally minimal and focused.

Design principles:

* No persistent formatting toolbar
* Contextual formatting via bubble menu
* Slash commands for structured insertion
* Clean and distraction-free writing surface

---

# Editor Structure

```
NotesEditor
├── NoteHeader      → Title and actions
├── EditorBody
│   ├── EditorContent (TipTap)
│   ├── BubbleMenu
│   ├── SlashMenu
│   └── Placeholder
```

---

# Key Capabilities

## Writing Experience

* Centered layout with controlled line length
* Optimized typography for readability
* Minimal interface to reduce distractions
* Extended bottom spacing for cursor comfort

---

## Save System

* Automatic and debounced
* Non-blocking
* Provides subtle visual feedback

---

## Performance

* Optimized rendering
* Stable note switching
* Efficient state updates

---

## Interaction Model

| Action         | Method                           |
| -------------- | -------------------------------- |
| Format text    | Bubble menu                      |
| Insert content | Slash commands (`/`)             |
| Create note    | Keyboard shortcut (Cmd/Ctrl + N) |
| Navigation     | URL-driven                       |

---

# Core Engineering Principles

## URL as Source of Truth

Navigation state is derived from the URL to avoid duplication and inconsistency.

---

## Backend-Ready Contracts

All mutations follow structured inputs:

```
updateNote(id, updates)
```

Full object mutations are avoided.

---

## Minimal Cognitive Load

The system prioritizes:

* clarity
* predictability
* simplicity

---

## Separation of Concerns

* UI → components
* Logic → hooks
* Data → store
* Navigation → routing layer

---

# System Stability

The module has undergone a full stabilization and hardening phase.

Key improvements:

* elimination of race conditions
* corrected effect dependencies
* improved type safety
* removal of dead code
* performance optimizations

---

# Current Status

| Area                | Status             |
| ------------------- | ------------------ |
| Architecture        | Production-grade   |
| UI System           | Clean and scalable |
| Performance         | Optimized          |
| Stability           | High               |
| UX Quality          | Improving          |
| Backend Integration | Pending            |

---

# Next Phase

The upcoming phase focuses on experience refinement:

* visual hierarchy improvements
* interaction precision
* micro-level UI polish
* emotional user experience

---

# Project Location

```
apps/web/app/_features/notes/
```

---

# Summary

Capella Notes is designed as a high-quality writing system.

Its goal is not to maximize features, but to maximize clarity.

---