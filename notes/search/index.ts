// Search provider contracts for the Notes feature.

export interface SearchQuery {
  query: string;
  topK?: number;
}

export interface SearchResultItem {
  id: string;
  title: string;
  snippet?: string;
  score?: number;
}

export interface NotesSearchProvider {
  indexDocuments(docs: Array<{ id: string; content: string }>): Promise<void>;
  search(q: SearchQuery): Promise<SearchResultItem[]>;
}

export const NotImplementedSearchProvider: NotesSearchProvider = {
  async indexDocuments() { /* no-op */ },
  async search() { return []; },
};
