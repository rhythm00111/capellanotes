Notes Architecture

The Notes feature manages all knowledge inside Capella Pro.

It understands:

Documents
Markdown
Rich Text
Knowledge
Tags
Collections
Notes Structure
notes/
│
├── index.ts
│
├── Notes.tsx
├── NotesLayout.tsx
├── NotesProvider.tsx
├── NotesLoader.tsx
├── NotesError.tsx
│
├── editor/
│
├── notes/
│
├── organization/
│
├── widgets/
│
├── ai/
│   ├── NotesAI.ts
│   ├── NotesContext.ts
│   ├── NotesPrompts.ts
│   ├── Summarizer.ts
│   ├── Rewriter.ts
│   ├── GrammarAssistant.ts
│   ├── Translator.ts
│   ├── SmartTags.ts
│   ├── KnowledgeExtraction.ts
│   ├── SemanticSearch.ts
│   ├── ActionItemGenerator.ts
│   ├── DocumentInsights.ts
│   ├── NoteQA.ts
│   └── WritingAssistant.ts
│
├── collaboration/
├── templates/
├── search/
├── services/
├── providers/
├── hooks/
├── config/
├── constants/
├── types/
├── utils/
└── styles/
Notes AI Responsibilities

Notes AI understands knowledge.

Examples:

Summarize notes
Rewrite notes
Grammar correction
Translation
Smart tagging
Semantic search
Knowledge extraction
Generate documentation
Generate project briefs
Generate blog posts
Generate action items
Question answering

Notes AI never contains provider-specific code.

Instead:

Notes AI

↓

packages/ai

↓

AI Router

↓

Provider
AI Architecture

The AI infrastructure exists only once.

packages/

ai/
│
├── providers/
│   ├── openai/
│   ├── anthropic/
│   ├── gemini/
│   ├── groq/
│   ├── xai/
│   ├── openrouter/
│   └── local/
│
├── gateway/
│   ├── AIRouter.ts
│   ├── ProviderManager.ts
│   ├── ModelSelector.ts
│   ├── ContextManager.ts
│   ├── CostOptimizer.ts
│   └── FallbackManager.ts
│
├── prompts/
├── memory/
├── streaming/
├── embeddings/
├── tools/
├── telemetry/
├── safety/
└── index.ts
Feature Communication

Features never communicate directly.

Notes

↓

Event Bus

↓

Calendar

↓

Dashboard

Loose coupling keeps the architecture scalable.

Dashboard Integration

Every feature registers:

Widget
Commands
Search Provider
Permissions
Events
Quick Actions

Dashboard automatically discovers them.