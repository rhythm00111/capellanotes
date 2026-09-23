// AI contracts and extension points for the Notes feature.
// NOTE: Provider implementations live in `packages/ai/providers/*` per target-arc.

export interface SummarizerOptions {
  maxTokens?: number;
}

export interface SummarizerResult {
  summary: string;
}

export interface NotesAISurface {
  summarize(content: string, opts?: SummarizerOptions): Promise<SummarizerResult>;
  // Additional AI contracts (rewrite, translate, qa) should be added here as interfaces only.
}

// Placeholder export to assert the module exists during migration.
export const NotImplementedAI: NotesAISurface = {
  async summarize() { throw new Error('AI provider not implemented'); }
};
