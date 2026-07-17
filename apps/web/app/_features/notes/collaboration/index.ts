// Collaboration contracts for Notes feature (placeholders only).

export interface PresenceInfo {
  userId: string;
  displayName?: string;
}

export interface CollaborationClient {
  connect(): Promise<void>;
  disconnect(): Promise<void>;
  getPresence(): Promise<PresenceInfo[]>;
}

export const NotImplementedCollab: CollaborationClient = {
  async connect() {},
  async disconnect() {},
  async getPresence() { return []; },
};
