import * as Y from 'yjs';

// User information
export interface User {
  id: string;
  name: string;
  isOnline: boolean;
  isLeader: boolean;
  joinedAt: number;
}

// Individual vote for a round
export interface Vote {
  userId: string;
  value: string | null; // null means no vote yet
  votedAt: number | null;
}

// Round of voting (no story)
export interface Round {
  id: string;
  isActive: boolean;
  votesRevealed: boolean;
  createdAt: number;
  completedAt: number | null;
}

// Room state structure for Y.js (no stories)
export interface RoomState {
  users: Y.Map<User>;
  rounds: Y.Map<Round>;
  votes: Y.Map<Vote>; // Key format: `${roundId}_${userId}`
  currentRoundId: string | null;
  leaderId: string | null;
  roomId: string;
}

// Available voting values
export const VOTING_VALUES = ['0', '1', '2', '3', '5', '8', '13', '21', '34', '55', '89', '?', '☕'];

// Y.js document structure (no stories)
export interface PokerDocument {
  users: Y.Map<User>;
  rounds: Y.Map<Round>;
  votes: Y.Map<Vote>;
  meta: Y.Map<string | null>; // For currentRoundId, leaderId, etc.
}